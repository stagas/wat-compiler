import { tokenizer } from '../lib/lexer.js'

describe('tokenizer', () => {
  it('start + accept', () => {
    const { start, accept } = tokenizer('hello')
    start()
    expect(accept('instr')).to.deep.equal(
      { value: 'hello', kind: 'instr', index: 0 }
    )
    expect(accept('instr')).to.equal(false)
  })

  it('expect', () => {
    const { start, expect: _expect } = tokenizer('hello 123 $world')
    start()
    expect(_expect('instr')).to.deep.equal(
      { value: 'hello', kind: 'instr', index: 0 }
    )
    try { _expect('instr') } catch (error) {
      expect(error.message).to.include('Unexpected token')
      expect(error.message).to.include('expected: instr')
      expect(error.message).to.include('received: number')
      expect(error.message).to.include('position: 6')
    }
    expect(_expect('number')).to.deep.equal(
      { value: '123', kind: 'number', index: 6 }
    )
    expect(_expect('label')).to.deep.equal(
      { value: 'world', kind: 'label', index: 10 }
    )
  })

  it('literal', () => {
    const { start, literal } = tokenizer('hello 123 $world')
    start()
    expect(literal('hello')).to.deep.equal(
      { value: 'hello', kind: 'instr', index: 0 }
    )
    try { literal('foo') } catch (error) {
      expect(error.message).to.include('Unexpected value: 123')
      expect(error.message).to.include('expected: foo')
      expect(error.message).to.include('position: 6')
    }
  })

  it('peek + advance', () => {
    const { start, peek, advance } = tokenizer('hello 123 $world')
    start()
    expect(peek()).to.deep.equal(
      { value: 'hello', kind: 'instr', index: 0 }
    )
    expect(peek()).to.deep.equal(
      { value: 'hello', kind: 'instr', index: 0 }
    )
    expect(advance()).to.deep.equal(
      { value: 'hello', kind: 'instr', index: 0 }
    )
    expect(peek()).to.deep.equal(
      { value: '123', kind: 'number', index: 6 }
    )
  })

  it('should act as an iterator (simple lexer incl. nul)', () => {
    const tokens = [...tokenizer('hello 123 $world')]
    expect(tokens).to.deep.equal([
      { value: 'hello', kind: 'instr', index: 0 },
      { value: ' ', kind: 'nul', index: 5 },
      { value: '123', kind: 'number', index: 6 },
      { value: ' ', kind: 'nul', index: 9 },
      { value: 'world', kind: 'label', index: 10 },
    ])
  })
})
