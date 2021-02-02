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
      node?.children?.map(x => build(x, context))
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

  function build (node, context = []) {
    switch (node.instr.value) {
      case 'module': {
        node.children.forEach(x => build(x, context))
        break
      }

      case 'type': {
        const name = node.name?.value ?? m.types.length
        if (node.children.length) {
          m.type(
            name,
            props(instr(consume(node.children[0], 'param'), 'param'), 'value'),
            props(instr(consume(node.children[0], 'result'), 'result'), 'value'),
          )
        }
        else {
          return [m.getType(name), 0]
        }
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

      case 'func': {
        const name = node.name?.value ?? m.codes.length
        context.push({ prop: 'func', name })
        const export_name = first(first(params(first(consume(node, 'export')))))
        if (export_name) m.export('func', name, export_name)
        m.func(
          name,
          props(merge(context, instr(consume(node, 'param'), 'param')), 'value'),
          props(instr(consume(node, 'result'), 'result'), 'value'),
          props(append(last(context), instr(consume(node, 'local'), 'local')), 'value'),
          node.children.flatMap(x => build(x, context))
        )

        break
      }

      default: {
        if (first(node.children)?.instr.value === 'type') {
          const args = build(node.children.shift(), context)
          const expr = [...params(node, context)].pop()
          return [...INSTR[node.instr.value](args, expr)]
        }
        return [...INSTR[node.instr.value](...params(node, context))]
      }
    }
  }

  build(node)

  return m.build()
}
