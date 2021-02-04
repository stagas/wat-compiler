import ModuleBuilder from './builder.js'
import { INSTR } from './const.js'

// eslint-disable-next-line no-unused-vars
const print = x => console.log(JSON.stringify(x, null, 2))

export default function compile (node) {
  const m = new ModuleBuilder()

  function first (iterable) {
    return [...iterable][0]
  }

  function last (iterable) {
    const arr = [...iterable]
    return arr[arr.length - 1]
  }

  function instr (nodes, prop) {
    return [...nodes].flatMap(p => {
      return p.children.map(n => {
        return ({ prop, name: p.name?.value, value: n.instr.value })
      })
    })
  }

  function props (elements, prop, filter) {
    return elements.filter(x => filter
      ? x.prop === filter
      : !Array.isArray(x)).map((el, i) => el[prop] || i)
  }

  function literal (token) {
    return token.kind === 'number'
      ? parseFloat(token.value)
      : token.value
  }

  function lookup (context, prop, value) {
    let index = props(context, prop).indexOf(value)
    if (~index) return index
    for (const c of context.filter(x => Array.isArray(x))) {
      let index = lookup(c, prop, value)
      if (~index) return index
    }
    return -1
  }

  function params (node, context) {
    return [
      node?.params?.length // if there are params
        ? node?.params?.map(n => literal(n.param)) ?? []
        : node?.name?.value // if there is a reference
          ? [lookup(context, 'name', node.name.value)]
          : [],
      node?.children?.map(x => build(x, context, true))
    ]
  }

  function* consume (node, kind) {
    do {
      if (!node.children.length || first(node.children).instr.value !== kind) break
      yield node.children.shift()
    } while (1)
  }

  function append (a, b) {
    a.push(...b)
    return b
  }

  function merge (a, b) {
    a.push(b)
    return b
  }

  const rootContext = [
    [], // funcs
    [], // globals
    [], // types
  ]

  const FUNC = 1
  const GLOBAL = 2
  // const TYPE = 3

  // TODO: withReturn is weird, perhaps
  // we need a separate function for top-level/deep ops
  function build (node, context, withReturn) {
    switch (node.instr.value) {
      case 'module': {
        node.children.forEach(x => build(x, context))
        break
      }

      case 'memory': {
        const p = [...params(node)].flat()
        m.memory(...p)
        break
      }

      case 'type': {
        const name = node.name?.value ?? m.types.length

        // is type definition
        if (node.children.length) {
          m.type(
            name,
            props(instr(consume(node.children[0], 'param'), 'param'), 'value'),
            props(instr(consume(node.children[0], 'result'), 'result'), 'value'),
          )
        }
        else { // is type reference
          return [m.getType(name), 0]
        }
        break
      }

      case 'global': {
        const name = node.name?.value ?? m.globals.length
        context[GLOBAL].push({ prop: 'global', name })

        let vartype = 'const'
        let type = node.children[0].instr.value
        if (type === 'mut') {
          vartype = 'var'
          type = node.children[0].children[0].instr.value
        }
        const expr = node.children[1]

        m.global(name, vartype, type, build(expr, context))

        break
      }

      case 'import': {
        const p = [...params(node, context)]
        const func = p.pop().flat()
        const name = func.shift()
        m.import('func', name, ...p.flat(), ...func)
        break
      }

      case 'data': {
        const expr = node.children.shift()
        const data = node.children.shift().data
        m.data(build(expr, context), data)
        break
      }

      case 'elem': {
        const expr = node.children.shift()
        const refs = node.children.map(x => x.ref.value)
        m.elem(build(expr, context), refs)
        break
      }

      case 'table': {
        const p = [...params(node)]
        p[0].unshift(p[0].pop())
        m.table(...p[0])
        break
      }

      case 'start': {
        m.start(node.name.value)
        break
      }

      case 'func': {
        const name = node.name?.value ?? m.codes.length
        context[FUNC].push({ prop: 'func', name })
        const export_name = first(first(params(first(consume(node, 'export')))))
        if (export_name) m.export('func', name, export_name)
        // TODO: these context locals will probably break
        // when there are multiple functions
        // we probably need a local context object
        // to take precedence (probably these are not
        // nested as i thought)
        const _params = props(merge(context, instr(consume(node, 'param'), 'param')), 'value')
        const _results = props(instr(consume(node, 'result'), 'result'), 'value')
        if (!node.children.length && withReturn) { // is an import
          return [name, _params, _results]
        }

        const _locals = props(append(last(context), instr(consume(node, 'local'), 'local')), 'value')

        m.func(
          name,
          _params,
          _results,
          _locals,
          node.children.flatMap(x => build(x, context))
        )

        break
      }

      case 'if': {
        const res = []

        const result = props(instr(consume(node, 'result'), 'result'), 'value')
        const cond = node.children.shift()
        res.push(...INSTR.if([...INSTR.type[result[0]]()], [INSTR[cond.instr.value](...params(cond, context))]))
        let child
        while (child = node.children[0].children.shift()) {
          res.push(...build(child, context, true))
        }
        res.push(...INSTR.else())
        while (child = node.children[1].children.shift()) {
          res.push(...build(child, context, true))
        }
        res.push(...INSTR.end())
        return res
      }

      default: {
        if (first(node.children)?.instr.value === 'type') {
          const args = build(node.children.shift(), context)
          const expr = [...params(node, context)].pop()
          return [...INSTR[node.instr.value](args, expr)]
        }
        if (node.instr.value === 'i32.load') {
          return [...INSTR[node.instr.value]([2,0], [...params(node, context)].pop())]
        }
        if (node.instr.value === 'i32.store') {
          return [...INSTR[node.instr.value]([2,0], [...params(node, context)].pop())]
        }
        if (node.instr.value === 'result') {
          return props(instr([node], 'result'), 'value')
        }
        if (node.instr.value === 'then') {
          return [...node.children.flatMap(x => build(x, context))]
        }
        if (node.instr.value === 'if') {
          print(node)
        }
        const fn = INSTR[node.instr.value]
        return [...fn(...params(node, context))]
      }
    }
  }

  build(node, rootContext)

  return m.build()
}
