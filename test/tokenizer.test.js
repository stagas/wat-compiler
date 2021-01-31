import { tokenize } from '../lib/lexer.js'

describe('tokenize', () => {
  it('start + accept', () => {
    const { start, accept } = tokenize('hello')
    start()
    expect(accept('instr')).to.deep.equal(
      { value: 'hello', kind: 'instr', index: 0 }
    )
    expect(accept('instr')).to.equal(null)
  })

  it('accept with value', () => {
    const { start, accept } = tokenize('hello')
    start()
    expect(accept('instr', 'world')).to.equal(null)
    expect(accept('instr', 'hello')).to.deep.equal(
      { value: 'hello', kind: 'instr', index: 0 }
    )
    expect(accept('instr')).to.equal(null)
  })

  it('expect', () => {
    const { start, expect: _expect } = tokenize('hello 123 $world')
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

  it('expect with value', () => {
    const { start, expect: _expect } = tokenize('hello 123 $world')
    start()
    expect(_expect('instr', 'hello')).to.deep.equal(
      { value: 'hello', kind: 'instr', index: 0 }
    )
    try { _expect('number', '546') } catch (error) {
      expect(error.message).to.include('Unexpected token: 123')
      expect(error.message).to.include('expected: number "546"')
      expect(error.message).to.include('position: 6')
    }
  })

  it('peek + advance', () => {
    const { start, peek, advance } = tokenize('hello 123 $world')
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
    const tokens = [...tokenize('hello 123 $world')]
    expect(tokens).to.deep.equal([
      { value: 'hello', kind: 'instr', index: 0 },
      { value: ' ', kind: 'nul', index: 5 },
      { value: '123', kind: 'number', index: 6 },
      { value: ' ', kind: 'nul', index: 9 },
      { value: 'world', kind: 'label', index: 10 },
    ])
  })
})
