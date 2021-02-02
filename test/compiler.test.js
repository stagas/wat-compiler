import { tokenize } from '../lib/lexer.js'
import parse from '../lib/parser.js'
import compile from '../lib/compiler.js'
import { hexAssertEqual } from './util/hex.js'
import wat from './util/wat.js'

async function wasm (binary, imports = {}) {
  const mod = await WebAssembly.instantiate(binary.buffer, imports)
  return mod.instance.exports
}

async function buffers (code) {
  const expected = await wat(code)
  console.log(expected.log)
  const actual = compile(parse(tokenize(code)))
  return [expected.buffer, actual.buffer]
}

describe('compile', () => {
  //
  it('minimal function', () => buffers(`
    (func (export "answer") (result i32) (i32.const 42))
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).answer()).to.equal(42)
    expect((await wasm(act)).answer()).to.equal(42)
  }))

  //
  it('function with 1 param', () => buffers(`
    (func (export "answer") (param i32) (result i32) (local.get 0))
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).answer(42)).to.equal(42)
    expect((await wasm(act)).answer(42)).to.equal(42)
  }))

  //
  it('function with 2 params', () => buffers(`
    (func (export "answer") (param i32 i32) (result i32)
      (local.get 0)
      (local.get 1)
      (i32.add)
      )
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).answer(20,22)).to.equal(42)
    expect((await wasm(act)).answer(20,22)).to.equal(42)
  }))

  //
  it('function with 2 params 2 results', () => buffers(`
    (func (export "answer") (param i32 i32) (result i32 i32)
      (local.get 0)
      (local.get 1)
      (i32.add)
      (i32.const 666)
      )
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).answer(20,22)).to.deep.equal([42,666])
    expect((await wasm(act)).answer(20,22)).to.deep.equal([42,666])
  }))

  //
  it('named function named param', () => buffers(`
    (func $dbl (export "dbl") (param $a i32) (result i32)
      (i32.add (local.get $a) (local.get $a))
    )
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).dbl(21)).to.equal(42)
    expect((await wasm(act)).dbl(21)).to.equal(42)
  }))

  //
  it('call function direct', () => buffers(`
    (module
      (func $dbl (param $a i32) (result i32)
        (i32.add (local.get $a) (local.get $a))
      )

      (func (export "call_function_direct") (param $a i32) (result i32)
        (call $dbl (local.get $a))
      )
    )
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).call_function_direct(333)).to.equal(666)
    expect((await wasm(act)).call_function_direct(333)).to.equal(666)
  }))

  //
  it('function param + local', () => buffers(`
    (func (export "add") (param $a i32) (result i32)
      (local $b i32)
      (local.tee $b (i32.const 20))
      (i32.add (local.get $a))
    )
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).add(22)).to.equal(42)
    expect((await wasm(act)).add(22)).to.equal(42)
  }))
})
