const regexp = /(?<comment>;;.*|\(;.*?;\))|(?<instr>[a-z_\.]+)|\$(?<label>[a-z_]+)|\"(?<string>.*?)\"|(?<hex>[+\-]?0x[0-9a-f\.p+\-]+)|(?<number>[+\-]?\d[\d\.e_+\-]+)|(?<lparen>\()|(?<rparen>\))|(?<nul>[ \t\n]+)|(?<error>.)/gi

export function tokenizer (input) {
  let last = {}
  let curr = {}

  const matches = input.matchAll(regexp)

  function next () {
    const match = matches.next()
    if (match.done) return { value: { value: null, kind: 'eof', index: input.length }, done: true } //match

    const [kind, value] = Object.entries(match.value.groups).filter(e => e[1])[0]
    return { value: { value, kind, index: match.value.index }, done: false }
  }

  function advance () {
    last = curr
    do {
      curr = next().value
    } while (curr.kind === 'nul')
    return last
  }

  function peek () {
    return curr
  }

  function accept (kind) {
    if (kind === curr.kind) {
      return advance()
    }
    return false
  }

  function expect (kind) {
    if (kind !== curr.kind) {
      throw new SyntaxError(
          'Unexpected token: ' + curr.value
        + '\n      expected: ' + kind
        + '\n  but received: ' + curr.kind
        + '\n   at position: ' + curr.index)
    }
    return advance()
  }

  function literal (value) {
    if (value !== curr.value) {
      throw new SyntaxError(
          'Unexpected value: ' + curr.value
        + '\n      expected: ' + value
        + '\n   at position: ' + curr.index)
    }
    return advance()
  }

  const iterator = {
    [Symbol.iterator] () { return this },
    next,
    advance,
    peek,
    accept,
    expect,
    literal,
    start: advance,
  }

  return iterator
}

export default input => [...tokenizer(input)]
