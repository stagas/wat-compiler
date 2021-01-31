import ModuleBuilder from './builder.js'
import { INSTR } from './const.js'

export default function compile (node) {
  const m = new ModuleBuilder()

  function first (iterable) {
    return [...iterable][0]
  }

  function values (nodes) {
    return [...nodes].flatMap(n =>
      n.children.map(n => n.instr.value))
  }

  function literal (token) {
    return token.kind === 'number'
      ? parseFloat(token.value)
      : token.value
  }

  function params (node) {
    return node?.params?.map(n => literal(n.param)) ?? []
  }

  function* consume (node, kind) {
    do {
      if (first(node.children).instr.value !== kind) break
      yield node.children.shift()
    } while (1)
  }

  function build (node) {
    switch (node.instr.value) {
      case 'func': {
        const name = node.name?.value ?? m.codes.length.toString()

        const export_name = first(params(first(consume(node, 'export'))))
        if (export_name) m.export('func', name, export_name)

        m.func(
          name,
          values(consume(node, 'param')),
          values(consume(node, 'result')),
          values(consume(node, 'local')),
          ...node.children.map(build))

        break
      }

      default: {
        return INSTR[node.instr.value](params(node))
      }
    }
  }

  build(node)

  return m.build()
}
