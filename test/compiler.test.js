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
    (type $return_i32 (func (result i32)))
    (type $return_i64 (func (result i64)))

    (table 2 funcref)
      (elem (i32.const 0) $f1 $f2)
      (func $xx (result i32)
        i32.const 42)
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
  it('memory.grow', () => buffers(String.raw`
    (memory 1)

    (func (export "main") (result i32)
      (memory.grow (i32.const 2))
    )
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act)))

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

  //
  it('block multi', () => buffers(`
    (func $dummy)

    (func (export "multi") (result i32)
      (block (call $dummy) (call $dummy) (call $dummy) (call $dummy))
      (block (result i32) (call $dummy) (call $dummy) (call $dummy) (i32.const 8))
    )
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).multi()).to.equal(8)
    expect((await wasm(act)).multi()).to.equal(8)
  }))

  //
  it('br', () => buffers(`
    (global $answer (mut i32) (i32.const 42))

    (func $set
      (global.set $answer (i32.const 666))
    )

    (func (export "main") (result i32)
      (block (br 0) (call $set))
      (global.get $answer)
    )
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).main()).to.equal(42)
    expect((await wasm(act)).main()).to.equal(42)
  }))

  //
  it('br mid', () => buffers(`
    (global $answer (mut i32) (i32.const 42))

    (func $set
      (global.set $answer (i32.const 666))
    )

    (func (export "main") (result i32)
      (block (call $set) (br 0) (global.set $answer (i32.const 0)))
      (global.get $answer)
    )
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).main()).to.equal(666)
    expect((await wasm(act)).main()).to.equal(666)
  }))

  //
  it('block named + br', () => buffers(`
    (global $answer (mut i32) (i32.const 42))

    (func $set
      (global.set $answer (i32.const 666))
    )

    (func (export "main") (result i32)
      (block $outer
        (block $inner
          (call $set)
          (br $inner)
        )
        (global.set $answer (i32.const 0))
      )
      (global.get $answer)
    )
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).main()).to.equal(0)
    expect((await wasm(act)).main()).to.equal(0)
  }))

  //
  it('block named 2 + br', () => buffers(`
    (global $answer (mut i32) (i32.const 42))

    (func $set
      (global.set $answer (i32.const 666))
    )

    (func (export "main") (result i32)
      (block $outer
        (block $inner
          (call $set)
          (br $inner)
        )
        (block $inner2
          (global.set $answer (i32.const 444))
          (br $inner2)
        )
        (global.set $answer (i32.const 0))
      )
      (global.get $answer)
    )
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).main()).to.equal(0)
    expect((await wasm(act)).main()).to.equal(0)
  }))

  //
  it('br_table', () => buffers(`
    (func (export "main") (param i32) (result i32)
      (block
        (block
          (br_table 1 0 (local.get 0))
          (return (i32.const 21))
        )
        (return (i32.const 20))
      )
      (i32.const 22)
    )
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).main(0)).to.equal(22)
    expect((await wasm(exp)).main(1)).to.equal(20)
    expect((await wasm(act)).main(0)).to.equal(22)
    expect((await wasm(act)).main(1)).to.equal(20)
  }))

  //
  it('br_table multiple', () => buffers(`
    (func (export "main") (param i32) (result i32)
      (block
        (block
          (block
            (block
              (block
                (br_table 3 2 1 0 4 (local.get 0))
                (return (i32.const 99))
              )
              (return (i32.const 100))
            )
            (return (i32.const 101))
          )
          (return (i32.const 102))
        )
        (return (i32.const 103))
      )
      (i32.const 104)
    )
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).main(0)).to.equal(103)
    expect((await wasm(exp)).main(1)).to.equal(102)
    expect((await wasm(exp)).main(2)).to.equal(101)
    expect((await wasm(exp)).main(3)).to.equal(100)
    expect((await wasm(exp)).main(4)).to.equal(104)
    expect((await wasm(act)).main(0)).to.equal(103)
    expect((await wasm(act)).main(1)).to.equal(102)
    expect((await wasm(act)).main(2)).to.equal(101)
    expect((await wasm(act)).main(3)).to.equal(100)
    expect((await wasm(act)).main(4)).to.equal(104)
  }))

  //
  it('loop', () => buffers(`
    (func (export "main") (result i32)
      (loop (nop))
      (loop (result i32) (i32.const 42))
    )
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).main()).to.equal(42)
    expect((await wasm(act)).main()).to.equal(42)
  }))

  //
  it('break-value', () => buffers(`
    (func (export "main") (result i32)
      (block (result i32)
        (loop (result i32) (br 1 (i32.const 18)) (br 0) (i32.const 19))
      )
    )
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).main()).to.equal(18)
    expect((await wasm(act)).main()).to.equal(18)
  }))

  //
  it('br_if', () => buffers(`
    (func (export "main") (result i32)
      (block (result i32)
        (loop (result i32)
          (br 1 (i32.const 18))
          (br 1 (i32.const 19))
          (drop (br_if 1 (i32.const 20) (i32.const 0)))
          (drop (br_if 1 (i32.const 20) (i32.const 1)))
          (br 1 (i32.const 21))
          (br_table 1 (i32.const 22) (i32.const 0))
          (br_table 1 1 1 (i32.const 23) (i32.const 1))
          (i32.const 21)
        )
      )
    )

  `)
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).main()).to.equal(18)
    expect((await wasm(act)).main()).to.equal(18)
  }))

  //
  it('while', () => buffers(`
    (func (export "main") (param i32) (result i32)
      (local i32)
      (local.set 1 (i32.const 1))
      (block
        (loop
          (br_if 1 (i32.eqz (local.get 0)))
          (local.set 1 (i32.mul (local.get 0) (local.get 1)))
          (local.set 0 (i32.sub (local.get 0) (i32.const 1)))
          (br 0)
        )
      )
      (local.get 1)
    )
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).main()).to.equal(1)
    expect((await wasm(act)).main()).to.equal(1)
  }))

  //
  it('select', () => buffers(`
    (func (export "main") (result i32)
      (select (loop (result i32) (i32.const 1)) (i32.const 2) (i32.const 3))
    )
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).main()).to.equal(1)
    expect((await wasm(act)).main()).to.equal(1)
  }))

  //
  it('select mid', () => buffers(`
    (func (export "main") (result i32)
      (select (i32.const 2) (loop (result i32) (i32.const 1)) (i32.const 3))
    )
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).main()).to.equal(2)
    expect((await wasm(act)).main()).to.equal(2)
  }))

  //
  it('block labels', () => buffers(`
    (func (export "main") (result i32)
      (block $exit (result i32)
        (br $exit (i32.const 1))
        (i32.const 0)
      )
    )
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).main()).to.equal(1)
    expect((await wasm(act)).main()).to.equal(1)
  }))

  //
  it('loop labels', () => buffers(`
    (func (export "main") (result i32)
      (local $i i32)
      (local.set $i (i32.const 0))
      (block $exit (result i32)
        (loop $cont (result i32)
          (local.set $i (i32.add (local.get $i) (i32.const 1)))
          (if (i32.eq (local.get $i) (i32.const 5))
            (then (br $exit (local.get $i)))
          )
          (br $cont)
        )
      )
    )
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).main()).to.equal(5)
    expect((await wasm(act)).main()).to.equal(5)
  }))

  //
  it('loop labels 2', () => buffers(`
    (func (export "main") (result i32)
      (local $i i32)
      (local.set $i (i32.const 0))
      (block $exit (result i32)
        (loop $cont (result i32)
          (local.set $i (i32.add (local.get $i) (i32.const 1)))
          (if (i32.eq (local.get $i) (i32.const 5))
            (then (br $cont))
          )
          (if (i32.eq (local.get $i) (i32.const 8))
            (then (br $exit (local.get $i)))
          )
          (local.set $i (i32.add (local.get $i) (i32.const 1)))
          (br $cont)
        )
      )
    )
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).main()).to.equal(8)
    expect((await wasm(act)).main()).to.equal(8)
  }))

  //
  it('switch', () => buffers(`
    (func (export "main") (param i32) (result i32)
      (block $ret (result i32)
        (i32.mul (i32.const 10)
          (block $exit (result i32)
            (block $0
              (block $default
                (block $3
                  (block $2
                    (block $1
                      (br_table $0 $1 $2 $3 $default (local.get 0))
                    ) ;; 1
                  ) ;; 2
                  (br $exit (i32.const 2))
                ) ;; 3
                (br $ret (i32.const 3))
              ) ;; default
            ) ;; 0
            (i32.const 5)
          )
        )
      )
    )
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).main(0)).to.equal(50)
    expect((await wasm(exp)).main(1)).to.equal(20)
    expect((await wasm(exp)).main(3)).to.equal(3)
    expect((await wasm(act)).main(0)).to.equal(50)
    expect((await wasm(act)).main(1)).to.equal(20)
    expect((await wasm(act)).main(3)).to.equal(3)
  }))

  //
  it('label redefinition', () => buffers(`
    (func (export "main") (result i32)
      (block $l1 (result i32)
        (i32.add
          (block $l1 (result i32) (i32.const 2))
          (block $l1 (result i32) (br $l1 (i32.const 3)))
        )
      )
    )
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).main()).to.equal(5)
    expect((await wasm(act)).main()).to.equal(5)
  }))

  //
  it('address', () => buffers(`
    (memory 1)
    (data (i32.const 0) "abcdefghijklmnopqrstuvwxyz")

    (func (export "a") (param $i i32) (result i32)
      (i32.load8_u offset=0 (local.get $i))                   ;; 97 'a'
    )

    (func (export "b") (param $i i32) (result i32)
      (i32.load8_u offset=1 align=1 (local.get $i))           ;; 98 'b'
    )

    (func (export "ab") (param $i i32) (result i32)
      (i32.load16_s offset=0 (local.get $i))                  ;; 25185 'ab'
    )

    (func (export "cd") (param $i i32) (result i32)
      (i32.load16_u offset=2 align=2 (local.get $i))          ;; 25699 'cd'
    )

    (func (export "z") (param $i i32) (result i32)
      (i32.load8_s offset=25 align=1 (local.get $i))          ;; 122 'z'
    )
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).a()).to.equal(97)
    expect((await wasm(exp)).b()).to.equal(98)
    expect((await wasm(exp)).ab()).to.equal(25185)
    expect((await wasm(exp)).cd()).to.equal(25699)
    expect((await wasm(exp)).z()).to.equal(122)

    expect((await wasm(act)).a()).to.equal(97)
    expect((await wasm(act)).b()).to.equal(98)
    expect((await wasm(act)).ab()).to.equal(25185)
    expect((await wasm(act)).cd()).to.equal(25699)
    expect((await wasm(act)).z()).to.equal(122)
  }))

  // e2e
  const e2e = [
    'malloc',
    'quine',
    'fire',
    'metaball',
    'raytrace',
    'snake',
    'maze',
  ]

  e2e.forEach(name => {
    it('e2e: '+name, () =>
      fetch('/test/fixtures/e2e/'+name+'.wat')
      .then(res => res.text())
      .then(text => buffers(text))
      .then(([exp,act]) => hexAssertEqual(exp,act)))
  })

})
