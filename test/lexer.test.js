import lexer from '../lib/lexer.js'

describe('lexer', () => {
  it('instr', () => {
    const tokens = lexer('hello')
    expect(tokens).to.deep.equal([
      { value: 'hello', kind: 'instr', index: 0 }
    ])
  })

  it('param', () => {
    const tokens = lexer('align=4')
    expect(tokens).to.deep.equal([
      { value: 'align', kind: 'param', index: 0 },
      { value: '4', kind: 'number', index: 6 }
    ])
  })

  it('label', () => {
    const tokens = lexer('$hello $$hi')
    expect(tokens).to.deep.equal([
      { value: 'hello', kind: 'label', index: 0 },
      { value: ' ', kind: 'nul', index: 6 },
      { value: '$hi', kind: 'label', index: 7 }
    ])
  })

  it('string', () => {
    const r = String.raw
    const tokens = lexer(r`"hello""ano\"t\n\ther""more"`)
    expect(tokens).to.deep.equal([
      { value: 'hello', kind: 'string', index: 0 },
      { value: r`ano\"t\n\ther`, kind: 'string', index: 7 },
      { value: 'more', kind: 'string', index: 22 }
    ])
  })

  it('number', () => {
    const tokens = lexer('123')
    expect(tokens).to.deep.equal([
      { value: '123', kind: 'number', index: 0 }
    ])
  })

  it('hex', () => {
    const tokens = lexer('0xf2')
    expect(tokens).to.deep.equal([
      { value: '0xf2', kind: 'hex', index: 0 }
    ])
  })

  it('parens', () => {
    const tokens = lexer('()')
    expect(tokens).to.deep.equal([
      { value: '(', kind: 'lparen', index: 0 },
      { value: ')', kind: 'rparen', index: 1 }
    ])
  })

  it('comments', () => {
    const tokens = lexer('an (; inline ;) comment\n;; line comment')
    expect(tokens).to.deep.equal([
      { value: 'an', kind: 'instr', index: 0 },
      { value: ' ', kind: 'nul', index: 2 },
      { value: '(; inline ;)', kind: 'comment', index: 3 },
      { value: ' ', kind: 'nul', index: 15 },
      { value: 'comment', kind: 'instr', index: 16 },
      { value: '\n', kind: 'nul', index: 23 },
      { value: ';; line comment', kind: 'comment', index: 24 }
    ])
  })

  it('nul', () => {
    const tokens = lexer(' \n\t')
    expect(tokens).to.deep.equal([
      { value: ' \n\t', kind: 'nul', index: 0 },
    ])
  })

  it('error', () => {
    const tokens = lexer('§what')
    expect(tokens).to.deep.equal([
      { value: '§', kind: 'error', index: 0 },
      { value: 'what', kind: 'instr', index: 1 },
    ])
  })
})

describe('number', () => {
  ;[
    '12',
    '12.3',
    '-12.3',
    '+12.3',
    '1e5',
    '1.23e5',
    '1.23e-5',
    '1.23e+5',
    'nan',
    'inf',
    '+inf',
    '-inf',
  ].forEach(n => it(n, () => {
    const tokens = lexer(n)
    expect(tokens).to.deep.equal([
      { value: n, kind: 'number', index: 0 }
    ])
  }))

  ;[
    '-0xf2',
    '+0xf2',
    '0xf2.ef',
    '0xf2.ePf',
    '0xf2.P-f',
    'nan:0xff',
  ].forEach(n => it(n, () => {
    const tokens = lexer(n)
    expect(tokens).to.deep.equal([
      { value: n, kind: 'hex', index: 0 }
    ])
  }))
})

describe('complex', () => {
  it('complex case 1', () => {
    const tokens = lexer(`
(hello $hi
  "world")
;; (should) be a comment
and (; another ;) line 0x312 43.23
`)
    // console.log(JSON.stringify(tokens, null, 2))
    expect(tokens).to.deep.equal([
      {
        "value": "\n",
        "kind": "nul",
        "index": 0
      },
      {
        "value": "(",
        "kind": "lparen",
        "index": 1
      },
      {
        "value": "hello",
        "kind": "instr",
        "index": 2
      },
      {
        "value": " ",
        "kind": "nul",
        "index": 7
      },
      {
        "value": "hi",
        "kind": "label",
        "index": 8
      },
      {
        "value": "\n  ",
        "kind": "nul",
        "index": 11
      },
      {
        "value": "world",
        "kind": "string",
        "index": 14
      },
      {
        "value": ")",
        "kind": "rparen",
        "index": 21
      },
      {
        "value": "\n",
        "kind": "nul",
        "index": 22
      },
      {
        "value": ";; (should) be a comment",
        "kind": "comment",
        "index": 23
      },
      {
        "value": "\n",
        "kind": "nul",
        "index": 47
      },
      {
        "value": "and",
        "kind": "instr",
        "index": 48
      },
      {
        "value": " ",
        "kind": "nul",
        "index": 51
      },
      {
        "value": "(; another ;)",
        "kind": "comment",
        "index": 52
      },
      {
        "value": " ",
        "kind": "nul",
        "index": 65
      },
      {
        "value": "line",
        "kind": "instr",
        "index": 66
      },
      {
        "value": " ",
        "kind": "nul",
        "index": 70
      },
      {
        "value": "0x312",
        "kind": "hex",
        "index": 71
      },
      {
        "value": " ",
        "kind": "nul",
        "index": 76
      },
      {
        "value": "43.23",
        "kind": "number",
        "index": 77
      },
      {
        "value": "\n",
        "kind": "nul",
        "index": 82
      }
    ])
  })
})
