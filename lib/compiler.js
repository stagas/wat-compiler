import ModuleBuilder from './builder.js'
import { int, uint, bigint } from './leb128.js'
import { INSTR } from './const.js'

// eslint-disable-next-line no-unused-vars
const print = x => console.log(JSON.stringify(x, null, 2))

class GlobalContext {
  globals = []
  types = []
  funcs = []

  lookup (name) {
    let index = this.funcs.map(x => x.name).lastIndexOf(name)
    if (!~index) index = this.globals.map(x => x.name).lastIndexOf(name)
    if (!~index) index = this.types.map(x => x.name).lastIndexOf(name)
    return index
  }
}

export default function compile (node) {
  const m = new ModuleBuilder()
  const g = new GlobalContext()

  function cast (param, context) {
    switch (param.kind) {
      case 'number': return param.value === 'inf' ? Infinity : param.value === 'nan' ? NaN : parseFloat(param.value)
      case 'hex': return param.value.length > 10 ? BigInt(param.value) : parseInt(param.value)
      case 'label': return context.lookup(param.value)
      default: return param.value
    }
  }

  class FunctionContext {
    locals = []
    depth = []

    lookup (name) {
      let index = this.locals.lastIndexOf(name)
      if (!~index) {
        index = this.depth.lastIndexOf(name)
        if (~index) index = this.depth.length - 1 - index
      }
      if (!~index) index = g.lookup(name)
      return index
    }
  }

  function bytes (instr, args, expr) {
    if (!(instr in INSTR) || (typeof INSTR[instr] !== 'function')) {
      throw new Error('Unknown instruction: ' + instr)
    }
    return [...INSTR[instr](args, expr)]
  }

  function evaluate (node, context = g) {
    const address = { offset: 0, align: 0 }
    const instr = node.instr.value
    switch (instr) {
      case 'type': {
        return m.getType(node.name.value)
      }

      case 'call_indirect': {
        const args = [evaluate(node.children.shift(), context), 0] // 0 is implicit table index 0
        const expr = node.children.flatMap(x => evaluate(x, context))
        return bytes(instr, args, expr)
      }

      case 'memory.grow': {
        const args = [0] // TODO: this bit is reserved?
        const expr = node.children.flatMap(x => evaluate(x, context))
        return bytes(instr, args, expr)
      }

      // TODO: revisit default alignments
      case 'f32.store':
        if (instr === 'f32.store') address.align = 4
      case 'i64.store':
        if (instr === 'i64.store') address.align = 4
      case 'i32.store':
        if (instr === 'i32.store') address.align = 4
      case 'i32.store8':
        if (instr === 'i32.store8') address.align = 0
      case 'i32.store16':
        if (instr === 'i32.store16') address.align = 2

      case 'f32.load':
        if (instr === 'f32.load') address.align = 4
      case 'i32.load':
        if (instr === 'i32.load') address.align = 4
      case 'i32.load16_s':
        if (instr === 'i32.load16_s') address.align = 2
      case 'i32.load16_u':
        if (instr === 'i32.load16_u') address.align = 2
      case 'i32.load8_s':
        if (instr === 'i32.load8_s') address.align = 0
      case 'i32.load8_u': {
        if (instr === 'i32.load8_u') address.align = 0
        for (const p of node.params) {
          address[p.param.value] = cast(p.value)
        }
        const args = [address.align/2, address.offset].map(x => {
          if (typeof x === 'number') return uint(x)
          else if (typeof x === 'bigint') return bigint(x)
        })
        const expr = node.children.flatMap(x => evaluate(x, context))
        return bytes(instr, args, expr)
      }

      case 'func': {
        const func = {
          name: node.name?.value ?? g.funcs.length,
          params: [],
          results: [],
        }

        g.funcs.push(func)

        for (const c of node.children) {
          switch (c.instr.value) {
            case 'param': {
              func.params.push(...c.children.map(x => x.instr.value))
            }
            break

            case 'result': {
              func.results.push(...c.children.map(x => x.instr.value))
            }
            break
          }
        }

        return [func.name, func.params, func.results]
      }

      case 'result': {
        return node.children.flatMap(x => INSTR.type[x.instr.value]())
      }

      case 'else':
      case 'then': {
        return node.children.flatMap(x => evaluate(x, context))
      }

      case 'if': {
        const name = node.name?.value ?? context.depth.length
        const results = []
        const branches = []
        let cond

        context.depth.push(name)

        for (const c of node.children) {
          switch (c.instr.value) {
            case 'result': {
              results.push(evaluate(c, context))
            }
            break

            case 'else':
              branches.push(...INSTR.else())
            case 'then': {
              branches.push(evaluate(c, context))
            }
            break

            default: {
              cond = evaluate(c, context)
            }
          }
        }

        context.depth.pop()

        if (!results.length) {
          results.push(INSTR.type.void())
        }

        // TODO: m.if(['i32'], cond, then, else)
        return [
          ...INSTR.if(results.flat(), cond),
          ...branches.flat(),
          ...INSTR.end()
        ]
      }

      case 'loop':
      case 'block': {
        const name = node.name?.value ?? context.depth.length
        const results = []
        const body = []

        context.depth.push(name)

        for (const c of node.children) {
          switch (c.instr.value) {
            case 'result': {
              results.push(evaluate(c, context))
            }
            break

            default: {
              body.push(evaluate(c, context))
            }
          }
        }

        context.depth.pop()

        if (!results.length) {
          results.push(INSTR.type.void())
        }

        // TODO: m.block(name, ['i32'], body)
        return [
          ...INSTR[instr](),
          ...results.flat().map(x => [...x]),
          ...body.flat(),
          ...INSTR.end()
        ]
      }

      case 'br_table': {
        if (node.name) {
          node.params.unshift({
            param: {
              value: context.lookup(node.name.value)
            }
          })
        }
        const args = node.params.map(x => cast(x.param, context))
        const expr = node.children.flatMap(x => evaluate(x, context))
        return bytes(instr, [args.length-1, ...args], expr)
      }

      default: {
        if (node.name) {
          node.params.unshift({
            param: {
              value: context.lookup(node.name.value)
            }
          })
        }
        const args = node.params.map(x => cast(x.param))
        const expr = node.children.flatMap(x => evaluate(x, context))
        return bytes(instr, args, expr)
      }
    }
  }

  function build (node) {
    switch (node.instr.value) {
      case 'module': {
        node.children.forEach(x => build(x))
      }
      break

      case 'memory': {
        const name = node.name?.value ?? m.memories.length
        const args = node.params.map(x => cast(x.param)).flat()
        m.memory(name, ...args)
      }
      break

      case 'data': {
        const expr = node.children.shift()
        const data = node.children.shift().data
        m.data(evaluate(expr), data)
      }
      break

      case 'start': {
        m.start(node.name.value)
      }
      break

      case 'table': {
        const args = node.params.map(x => cast(x.param))
        args.unshift(args.pop())
        m.table(...args)
      }
      break

      case 'elem': {
        const expr = node.children.shift()
        const refs = node.children.map(x => x.ref.value)
        m.elem(evaluate(expr), refs)
      }
      break

      case 'import': {
        const args = node.params.map(x => cast(x.param))
        const func = evaluate(node.children[0])
        const name = func.shift()
        m.import('func', name, ...args, ...func)
      }
      break

      case 'global': {
        const glob = {
          name: node.name?.value ?? m.globals.length,
          vartype: 'const',
          type: node.children[0].instr.value
        }

        g.globals.push(glob)

        if (glob.type === 'mut') {
          glob.vartype = 'var'
          glob.type = node.children[0].children[0].instr.value
        }

        const expr = node.children[1]

        m.global(
          glob.name,
          glob.vartype,
          glob.type,
          evaluate(expr)
        )
      }
      break

      case 'type': {
        const type = {
          name: node.name?.value ?? m.types.length,
          params: [],
          results: []
        }

        g.types.push(type)

        for (const c of node.children[0].children) {
          switch (c.instr.value) {
            case 'param': {
              type.params.push(...c.children.map(x => x.instr.value))
            }
            break

            case 'result': {
              type.results.push(...c.children.map(x => x.instr.value))
            }
            break
          }
        }

        m.type(
          type.name,
          type.params,
          type.results
        )
      }
      break

      case 'export': {
        const exp = {
          name: node.params[0].param.value
        }
        exp.type = node.children[0].instr.value
        exp.internal_name = node.children[0].name.value
        m.export(
          exp.type,
          exp.internal_name,
          exp.name
        )
      }
      break

      case 'func': {
        const func = {
          name: node.name?.value ?? g.funcs.length,
          context: new FunctionContext(),
          params: [],
          results: [],
          locals: [],
          body: []
        }

        g.funcs.push(func)

        for (const c of node.children) {
          switch (c.instr.value) {
            case 'export': {
              const export_name = c.params[0].param.value
              m.export('func', func.name, export_name)
            }
            break

            case 'local': {
              func.locals.push(...c.children.map(x => x.instr.value))
              func.context.locals.push(...c.children.map(() => c.name?.value))
            }
            break

            case 'param': {
              func.params.push(...c.children.map(x => x.instr.value))
              func.context.locals.push(...c.children.map(() => c.name?.value))
            }
            break

            case 'result': {
              func.results.push(...c.children.map(x => x.instr.value))
            }
            break

            default: {
              func.body.push(c)
            }
          }
        }

        // print(func.context)
        m.func(
          func.name,
          func.params,
          func.results,
          func.locals,
          [...func.body.flatMap(x => evaluate(x, func.context))]
        )
      }
      break

    }
  }

  build(node)

  return m.build()
}
