import { tokenize } from '../lib/lexer.js'
import parse from '../lib/parser.js'

// the following two utilities are used when developing
// test cases to validate the code and to print the
// json tree for inspection and copied for assertion
//
// eslint-disable-next-line no-unused-vars
import wat from './util/wat.js'
// eslint-disable-next-line no-unused-vars
const print = tree => console.log(JSON.stringify(tree, null, 2))

describe('parser', () => {
  it('s-expr', () => {
    const tree = parse(tokenize('(module)'))
    expect(tree).to.deep.equal({
      "instr": {
        "value": "module",
        "kind": "instr",
        "index": 1
      },
      "name": null,
      "params": [],
      "children": []
    })
  })

  it('s-expr no instruction (throws)', () => {
    try {
      parse(tokenize('()'))
    } catch (error) {
      expect(error.message).to.include('expected: instr')
    }
  })

  it('s-expr named', () => {
    const tree = parse(tokenize('(module $hello)'))
    expect(tree).to.deep.equal({
      "instr": {
        "value": "module",
        "kind": "instr",
        "index": 1
      },
      "name": {
        "value": "hello",
        "kind": "label",
        "index": 8
      },
      "params": [],
      "children": []
    })
  })

  it('s-expr number params', () => {
    const tree = parse(tokenize('(memory 1 2)'))
    expect(tree).to.deep.equal({
      "instr": {
        "value": "memory",
        "kind": "instr",
        "index": 1
      },
      "name": null,
      "params": [
        {
          "param": {
            "value": "1",
            "kind": "number",
            "index": 8
          }
        },
        {
          "param": {
            "value": "2",
            "kind": "number",
            "index": 10
          }
        }
      ],
      "children": []
    })
  })

  it('s-expr number params + named params', () => {
    const tree = parse(tokenize('(memory 1 2 shared)'))
    expect(tree).to.deep.equal({
      "instr": {
        "value": "memory",
        "kind": "instr",
        "index": 1
      },
      "name": null,
      "params": [
        {
          "param": {
            "value": "1",
            "kind": "number",
            "index": 8
          }
        },
        {
          "param": {
            "value": "2",
            "kind": "number",
            "index": 10
          }
        },
        {
          "param": {
            "value": "shared",
            "kind": "param",
            "index": 12
          }
        }
      ],
      "children": []
    })
  })

  it('s-expr named params with = value', () => {
    const tree = parse(tokenize('(i32.load offset=0 align=4)'))
    expect(tree).to.deep.equal({
      "instr": {
        "value": "i32.load",
        "kind": "instr",
        "index": 1
      },
      "name": null,
      "params": [
        {
          "param": {
            "value": "offset",
            "kind": "param",
            "index": 10
          },
          "value": {
            "value": "0",
            "kind": "number",
            "index": 17
          }
        },
        {
          "param": {
            "value": "align",
            "kind": "param",
            "index": 19
          },
          "value": {
            "value": "4",
            "kind": "number",
            "index": 25
          }
        }
      ],
      "children": []
    })
  })

  it('stack instruction', () => {
    const code = '(func i32.const 42)'
    const tree = parse(tokenize(code))
    expect(tree).to.deep.equal({
      "instr": {
        "value": "func",
        "kind": "instr",
        "index": 1
      },
      "name": null,
      "params": [],
      "children": [
        {
          "instr": {
            "value": "i32.const",
            "kind": "instr",
            "index": 6
          },
          "name": null,
          "params": [
            {
              "param": {
                "value": "42",
                "kind": "number",
                "index": 16
              }
            }
          ],
          "children": []
        }
      ]
    })
  })

  it('many stack instructions', () => {
    const code = '(func i32.const 22 i32.const 20 i32.add)'
    const tree = parse(tokenize(code))
    expect(tree).to.deep.equal({
      "instr": {
        "value": "func",
        "kind": "instr",
        "index": 1
      },
      "name": null,
      "params": [],
      "children": [
        {
          "instr": {
            "value": "i32.const",
            "kind": "instr",
            "index": 6
          },
          "name": null,
          "params": [
            {
              "param": {
                "value": "22",
                "kind": "number",
                "index": 16
              }
            }
          ],
          "children": []
        },
        {
          "instr": {
            "value": "i32.const",
            "kind": "instr",
            "index": 19
          },
          "name": null,
          "params": [
            {
              "param": {
                "value": "20",
                "kind": "number",
                "index": 29
              }
            }
          ],
          "children": []
        },
        {
          "instr": {
            "value": "i32.add",
            "kind": "instr",
            "index": 32
          },
          "name": null,
          "params": [],
          "children": []
        }
      ]
    })
  })

  it('children', () => {
    const code = '(func $answer (result i32) (i32.add (i32.const 20) (i32.const 22)))'
    const tree = parse(tokenize(code))
    expect(tree).to.deep.equal({
      "instr": {
        "value": "func",
        "kind": "instr",
        "index": 1
      },
      "name": {
        "value": "answer",
        "kind": "label",
        "index": 6
      },
      "params": [],
      "children": [
        {
          "instr": {
            "value": "result",
            "kind": "instr",
            "index": 15
          },
          "name": null,
          "params": [],
          "children": [
            {
              "instr": {
                "value": "i32",
                "kind": "instr",
                "index": 22
              },
              "name": null,
              "params": [],
              "children": []
            }
          ]
        },
        {
          "instr": {
            "value": "i32.add",
            "kind": "instr",
            "index": 28
          },
          "name": null,
          "params": [],
          "children": [
            {
              "instr": {
                "value": "i32.const",
                "kind": "instr",
                "index": 37
              },
              "name": null,
              "params": [
                {
                  "param": {
                    "value": "20",
                    "kind": "number",
                    "index": 47
                  }
                }
              ],
              "children": []
            },
            {
              "instr": {
                "value": "i32.const",
                "kind": "instr",
                "index": 52
              },
              "name": null,
              "params": [
                {
                  "param": {
                    "value": "22",
                    "kind": "number",
                    "index": 62
                  }
                }
              ],
              "children": []
            }
          ]
        }
      ]
    })
  })

  it('minimal export function', () => {
    const code = '(func (export "answer") (result i32) (i32.const 42))'
    const tree = parse(tokenize(code))
    expect(tree).to.deep.equal({
      "instr": {
        "value": "func",
        "kind": "instr",
        "index": 1
      },
      "name": null,
      "params": [],
      "children": [
        {
          "instr": {
            "value": "export",
            "kind": "instr",
            "index": 7
          },
          "name": null,
          "params": [
            {
              "param": {
                "value": "answer",
                "kind": "string",
                "index": 14
              }
            }
          ],
          "children": []
        },
        {
          "instr": {
            "value": "result",
            "kind": "instr",
            "index": 25
          },
          "name": null,
          "params": [],
          "children": [
            {
              "instr": {
                "value": "i32",
                "kind": "instr",
                "index": 32
              },
              "name": null,
              "params": [],
              "children": []
            }
          ]
        },
        {
          "instr": {
            "value": "i32.const",
            "kind": "instr",
            "index": 38
          },
          "name": null,
          "params": [
            {
              "param": {
                "value": "42",
                "kind": "number",
                "index": 48
              }
            }
          ],
          "children": []
        }
      ]
    })
  })
})
