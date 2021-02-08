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
  // console.log(expected.log)
  const actual = compile(parse(tokenize('(module '+code+')')))
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
    (func $dbl (param $a i32) (result i32)
      (i32.add (local.get $a) (local.get $a))
    )

    (func (export "call_function_direct") (param $a i32) (result i32)
      (call $dbl (local.get $a))
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

  //
  it('call function indirect (table)', () => buffers(`
    (type $return_i32 (func (result i32)))

    (table 2 funcref)
      (elem (i32.const 0) $f1 $f2)
      (func $f1 (result i32)
        i32.const 42)
      (func $f2 (result i32)
        i32.const 13)

    (func (export "call_function_indirect") (param $a i32) (result i32)
      (call_indirect (type $return_i32) (local.get $a))
    )
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).call_function_indirect(0)).to.equal(42)
    expect((await wasm(exp)).call_function_indirect(1)).to.equal(13)
    expect((await wasm(act)).call_function_indirect(0)).to.equal(42)
    expect((await wasm(act)).call_function_indirect(1)).to.equal(13)
  }))

  //
  it('call function indirect (table) non zero indexed ref types', () => buffers(`
    (type $return_i64 (func (result i64)))
    (type $return_i32 (func (result i32)))

    (table 2 funcref)
      (elem (i32.const 0) $f1 $f2)
      (func $xx (result i64)
        i64.const 42)
      (func $f1 (result i32)
        i32.const 42)
      (func $f2 (result i32)
        i32.const 13)

    (func (export "call_function_indirect") (param $a i32) (result i32)
      (call_indirect (type $return_i32) (local.get $a))
    )
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).call_function_indirect(0)).to.equal(42)
    expect((await wasm(exp)).call_function_indirect(1)).to.equal(13)
    expect((await wasm(act)).call_function_indirect(0)).to.equal(42)
    expect((await wasm(act)).call_function_indirect(1)).to.equal(13)
  }))

  //
  it('1 global const (immutable)', () => buffers(`
    (global $answer i32 (i32.const 42))

    (func (export "get") (result i32)
      (global.get $answer)
    )
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).get()).to.equal(42)
    expect((await wasm(act)).get()).to.equal(42)
  }))

  //
  it('1 global var (mut)', () => buffers(`

    (global $answer (mut i32) (i32.const 42))

    (func (export "get") (result i32)
      (global.get $answer)
    )
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).get()).to.equal(42)
    expect((await wasm(act)).get()).to.equal(42)
  }))

  //
  it('1 global var (mut) + mutate', () => buffers(`
    (global $answer (mut i32) (i32.const 42))

    (func (export "get") (result i32)
      (global.set $answer (i32.const 666))
      (global.get $answer)
    )
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).get()).to.equal(666)
    expect((await wasm(act)).get()).to.equal(666)
  }))

  //
  it('local memory page min 1 - data 1 offset 0 i32', () => buffers(String.raw`

    (memory 1)

    (data (i32.const 0) "\2a")

    (func (export "get") (result i32)
      (i32.load (i32.const 0))
    )
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).get()).to.equal(42)
    expect((await wasm(act)).get()).to.equal(42)
  }))

  //
  it('local memory page min 1 max 2 - data 1 offset 0 i32', () => buffers(String.raw`
    (memory 1 2)

    (data (i32.const 0) "\2a")

    (func (export "get") (result i32)
      i32.const 1
      i32.const 2
      drop
      drop
      i32.const 0
      i32.load offset=0 align=4
    )
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).get()).to.equal(42)
    expect((await wasm(act)).get()).to.equal(42)
  }))

  //
  it('import function', () => buffers(`
    (import "math" "add" (func $add (param i32 i32) (result i32)))

    (func (export "call_imported_function") (result i32)
      (call $add (i32.const 20) (i32.const 22))
    )
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    const math = { add: (a, b) => a + b }
    expect((await wasm(exp, { math })).call_imported_function()).to.equal(42)
    expect((await wasm(act, { math })).call_imported_function()).to.equal(42)
  }))

  //
  it('set a start function', () => buffers(`
    (global $answer (mut i32) (i32.const 42))

    (start $main)

    (func $main
      (global.set $answer (i32.const 666))
    )

    (func (export "get") (result i32)
      (global.get $answer)
    )
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).get()).to.equal(666)
    expect((await wasm(act)).get()).to.equal(666)
  }))

  //
  it('if else', () => buffers(`
    (func $dummy)

    (func (export "foo") (param i32) (result i32)
      (if (result i32) (local.get 0)
        (then (call $dummy) (i32.const 1))
        (else (call $dummy) (i32.const 0))
      )
    )
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).foo(0)).to.equal(0)
    expect((await wasm(exp)).foo(1)).to.equal(1)
    expect((await wasm(act)).foo(0)).to.equal(0)
    expect((await wasm(act)).foo(1)).to.equal(1)
  }))

  //
  it('block', () => buffers(`
    (func (export "answer") (result i32)
      (block (nop))
      (block (result i32) (i32.const 42))
    )
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).answer()).to.equal(42)
    expect((await wasm(act)).answer()).to.equal(42)
  }))

})
