export default function parse ({ start, peek, accept, expect }) {
  // function error (token, message) {
  //   return new TypeError(message
  //     + ': ' + token.value
  //     + '\n  at position: ' + token.index)
  // }

  function* params () {
    let param
    while (1) {
      if (param = accept('number')) {
        yield { param }
        continue
      }
      if (param = accept('string')) {
        yield { param }
        continue
      }
      if (param = accept('param')) {
        let value
        if (value = accept('number')) {
          yield { param, value }
          continue
        }
        else {
          yield { param }
          continue
        }
      }
      break
    }
  }

  function expr () {
    const sexpr = accept('lparen')

    let instr
    if (sexpr) {
      instr = expect('instr')
    }
    else {
      instr = accept('instr')
      if (!instr) return
    }

    const node = {
      instr,
      name: accept('label'),
      params: [...params()],
      children: []
    }

    if (sexpr) {
      let child

      while (!peek('eof') && (child = expr())) {
        node.children.push(child)
      }

      expect('rparen')
    }

    return node
  }

  start()

  return expr()
}
