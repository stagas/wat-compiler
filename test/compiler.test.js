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

  // credits: https://github.com/LingDong-/wasm-fun/blob/master/wat/malloc.wat
  it('big file', () => buffers(`
;;========================================================;;
;;     BASELINE MALLOC WITH HANDWRITTEN WEBASSEMBLY       ;;
;; \`malloc.wat\`    Lingdong Huang 2020    Public Domain   ;;
;;========================================================;;
;; 32-bit implicit-free-list first-fit baseline malloc    ;;
;;--------------------------------------------------------;;

(module

  ;; IMPLICIT FREE LIST:
  ;; Worse utilization and throughput than explicit/segregated, but easier
  ;; to implement :P
  ;;
  ;; HEAP LO                                                         HEAP HI
  ;; +---------------------+---------------------+...+---------------------+
  ;; | HDR | PAYLOAD | FTR | HDR | PAYLOAD | FTR |...+ HDR | PAYLOAD | FTR |
  ;; +----------^----------+---------------------+...+---------------------+
  ;;            |_ i.e. user data
  ;;
  ;; LAYOUT OF A BLOCK:
  ;; Since memory is aligned to multiple of 4 bytes, the last two bits of
  ;; payload_size is redundant. Therefore the last bit of header is used to
  ;; store the is_free flag.
  ;;
  ;; |---- HEADER (4b)----
  ;; |    ,--payload size (x4)--.     ,-is free?
  ;; | 0b . . . . . . . . . . . . 0  0
  ;; |------ PAYLOAD -----
  ;; |
  ;; |  user data (N x 4b)
  ;; |
  ;; |---- FOOTER (4b)---- (duplicate of header)
  ;; |    ,--payload size (x4)--.     ,-is free?
  ;; | 0b . . . . . . . . . . . . 0  0
  ;; |--------------------
  ;;
  ;; FORMULAS:
  ;; (these formulas are used throughout the code, so they're listed here
  ;; instead of explained each time encountered)
  ;;
  ;; payload_size = block_size - (header_size + footer_size) = block_size - 8
  ;;
  ;; payload_pointer = header_pointer + header_size = header_pointer + 4
  ;;
  ;; footer_pointer = header_pointer + header_size + payload_size
  ;;                = (header_pointer + payload_size) + 4
  ;;
  ;; next_header_pointer = footer_pointer + footer_size = footer_pointer + 4
  ;;
  ;; prev_footer_pointer = header_pointer - footer_size = header_pointer - 4

  (memory $mem 1)                                ;; start with 1 page (64K)
  (global $max_addr (mut i32) (i32.const 65536)) ;; initial heap size (64K)
  (global $did_init (mut i32) (i32.const 0))     ;; init() called?

  ;; helpers to pack/unpack payload_size/is_free from header/footer
  ;; by masking out bits

  ;; read payload_size from header/footer given pointer to header/footer
  (func $hdr_get_size (param $ptr i32) (result i32)
    (i32.and (i32.load (local.get $ptr)) (i32.const 0xFFFFFFFC))
  )
  ;; read is_free from header/footer
  (func $hdr_get_free (param $ptr i32) (result i32)
    (i32.and (i32.load (local.get $ptr)) (i32.const 0x00000001))
  )
  ;; write payload_size to header/footer
  (func $hdr_set_size (param $ptr i32) (param $n i32)
    (i32.store (local.get $ptr) (i32.or
      (i32.and (i32.load (local.get $ptr)) (i32.const 0x00000003))
      (local.get $n)
    ))
  )
  ;; write is_free to header/footer
  (func $hdr_set_free (param $ptr i32) (param $n i32)
    (i32.store (local.get $ptr) (i32.or
      (i32.and (i32.load (local.get $ptr)) (i32.const 0xFFFFFFFE))
      (local.get $n)
    ))
  )
  ;; align memory by 4 bytes
  (func $align4 (param $x i32) (result i32)
    (i32.and
      (i32.add (local.get $x) (i32.const 3))
      (i32.const -4)
    )
  )

  ;; initialize heap
  ;; make the whole heap a big free block
  ;; - automatically invoked by first malloc() call
  ;; - can be manually called to nuke the whole heap
  (func $init
    ;; write payload_size to header and footer
    (call $hdr_set_size (i32.const 0) (i32.sub (global.get $max_addr) (i32.const 8)))
    (call $hdr_set_size (i32.sub (global.get $max_addr) (i32.const 4))
      (i32.sub (global.get $max_addr) (i32.const 8))
    )
    ;; write is_free to header and footer
    (call $hdr_set_free (i32.const 0) (i32.const 1))
    (call $hdr_set_free (i32.sub (global.get $max_addr) (i32.const 4)) (i32.const 1))

    ;; set flag to tell malloc() that we've already called init()
    (global.set $did_init (i32.const 1))
  )

  ;; extend (grow) the heap (to accomodate more blocks)
  ;; parameter: number of pages (64K) to grow
  ;; - automatically invoked by malloc() when current heap has insufficient free space
  ;; - can be manually called to get more space in advance
  (func $extend (param $n_pages i32)
    (local $n_bytes i32)
    (local $ftr i32)
    (local $prev_ftr i32)
    (local $prev_hdr i32)
    (local $prev_size i32)

    (local.set $prev_ftr (i32.sub (global.get $max_addr) (i32.const 4)) )

    ;; compute number of bytes from page count (1page = 64K = 65536bytes)
    (local.set $n_bytes (i32.mul (local.get $n_pages) (i32.const 65536)))

    ;; system call to grow memory (\`drop\` discards the (useless) return value of memory.grow)
    (drop (memory.grow (local.get $n_pages) ))

    ;; make the newly acquired memory a big free block
    (call $hdr_set_size (global.get $max_addr) (i32.sub (local.get $n_bytes) (i32.const 8)))
    (call $hdr_set_free (global.get $max_addr) (i32.const 1))

    (global.set $max_addr (i32.add (global.get $max_addr) (local.get $n_bytes) ))
    (local.set $ftr (i32.sub (global.get $max_addr) (i32.const 4)))

    (call $hdr_set_size (local.get $ftr)
      (i32.sub (local.get $n_bytes) (i32.const 8))
    )
    (call $hdr_set_free (local.get $ftr) (i32.const 1))

    ;; see if we can join the new block with the last block of the old heap
    (if (i32.eqz (call $hdr_get_free (local.get $prev_ftr)))(then)(else

      ;; the last block is free, join it.
      (local.set $prev_size (call $hdr_get_size (local.get $prev_ftr)))
      (local.set $prev_hdr
        (i32.sub (i32.sub (local.get $prev_ftr) (local.get $prev_size)) (i32.const 4))
      )
      (call $hdr_set_size (local.get $prev_hdr)
        (i32.add (local.get $prev_size) (local.get $n_bytes) )
      )
      (call $hdr_set_size (local.get $ftr)
        (i32.add (local.get $prev_size) (local.get $n_bytes) )
      )
    ))

  )

  ;; find a free block that fit the request number of bytes
  ;; modifies the heap once a candidate is found
  ;; first-fit: not the best policy, but the simplest
  (func $find (param $n_bytes i32) (result i32)
    (local $ptr i32)
    (local $size i32)
    (local $is_free i32)
    (local $pay_ptr i32)
    (local $rest i32)

    ;; loop through all blocks
    (local.set $ptr (i32.const 0))
    loop $search
      ;; we reached the end of heap and haven't found anything, return NULL
      (if (i32.lt_u (local.get $ptr) (global.get $max_addr))(then)(else
        (i32.const 0)
        return
      ))

      ;; read info about current block
      (local.set $size    (call $hdr_get_size (local.get $ptr)))
      (local.set $is_free (call $hdr_get_free (local.get $ptr)))
      (local.set $pay_ptr (i32.add (local.get $ptr) (i32.const 4) ))

      ;; check if the current block is free
      (if (i32.eq (local.get $is_free) (i32.const 1))(then

        ;; it's free, but too small, move on
        (if (i32.gt_u (local.get $n_bytes) (local.get $size))(then
          (local.set $ptr (i32.add (local.get $ptr) (i32.add (local.get $size) (i32.const 8))))
          (br $search)

        ;; it's free, and large enough to be split into two blocks
        )(else(if (i32.lt_u (local.get $n_bytes) (i32.sub (local.get $size) (i32.const 8)))(then
          ;; OLD HEAP
          ;; ...+-------------------------------------------+...
          ;; ...| HDR |              FREE             | FTR |...
          ;; ...+-------------------------------------------+...
          ;; NEW HEAP
          ;; ...+---------------------+---------------------+...
          ;; ...| HDR | ALLOC   | FTR | HDR |  FREE   | FTR |...
          ;; ...+---------------------+---------------------+...

          ;; size of the remaining half
          (local.set $rest (i32.sub (i32.sub (local.get $size) (local.get $n_bytes) ) (i32.const 8)))

          ;; update headers and footers to reflect the change (see FORMULAS)

          (call $hdr_set_size (local.get $ptr) (local.get $n_bytes))
          (call $hdr_set_free (local.get $ptr) (i32.const 0))

          (call $hdr_set_size (i32.add (i32.add (local.get $ptr) (local.get $n_bytes)) (i32.const 4))
            (local.get $n_bytes)
          )
          (call $hdr_set_free (i32.add (i32.add (local.get $ptr) (local.get $n_bytes)) (i32.const 4))
            (i32.const 0)
          )
          (call $hdr_set_size (i32.add (i32.add (local.get $ptr) (local.get $n_bytes)) (i32.const 8))
            (local.get $rest)
          )
          (call $hdr_set_free (i32.add (i32.add (local.get $ptr) (local.get $n_bytes)) (i32.const 8))
            (i32.const 1)
          )
          (call $hdr_set_size (i32.add (i32.add (local.get $ptr) (local.get $size)) (i32.const 4))
            (local.get $rest)
          )

          (local.get $pay_ptr)
          return

        )(else
          ;; the block is free, but not large enough to be split into two blocks
          ;; we return the whole block as one
          (call $hdr_set_free (local.get $ptr) (i32.const 0))
          (call $hdr_set_free (i32.add (i32.add (local.get $ptr) (local.get $size)) (i32.const 4))
            (i32.const 0)
          )
          (local.get $pay_ptr)
          return
        ))))
      )(else
        ;; the block is not free, we move on to the next block
        (local.set $ptr (i32.add (local.get $ptr) (i32.add (local.get $size) (i32.const 8))))
        (br $search)
      ))
    end

    ;; theoratically we will not reach here
    ;; return NULL
    (i32.const 0)
  )


  ;; malloc - allocate the requested number of bytes on the heap
  ;; returns a pointer to the block of memory allocated
  ;; returns NULL (0) when OOM
  ;; if heap is not large enough, grows it via extend()
  (func $malloc (param $n_bytes i32) (result i32)
    (local $ptr i32)
    (local $n_pages i32)

    ;; call init() if we haven't done so yet
    (if (i32.eqz (global.get $did_init)) (then
      (call $init)
    ))

    ;; payload size is aligned to multiple of 4
    (local.set $n_bytes (call $align4 (local.get $n_bytes)))

    ;; attempt allocation
    (local.set $ptr (call $find (local.get $n_bytes)) )

    ;; NULL -> OOM -> extend heap
    (if (i32.eqz (local.get $ptr))(then
      ;; compute # of pages from # of bytes, rounding up
      (local.set $n_pages
        (i32.div_u
          (i32.add (local.get $n_bytes) (i32.const 65527) )
          (i32.const 65528)
        )
      )
      (call $extend (local.get $n_pages))

      ;; try again
      (local.set $ptr (call $find (local.get $n_bytes)) )
    ))
    (local.get $ptr)
  )

  ;; free - free an allocated block given a pointer to it
  (func $free (param $ptr i32)
    (local $hdr i32)
    (local $ftr i32)
    (local $size i32)
    (local $prev_hdr i32)
    (local $prev_ftr i32)
    (local $prev_size i32)
    (local $prev_free i32)
    (local $next_hdr i32)
    (local $next_ftr i32)
    (local $next_size i32)
    (local $next_free i32)

    ;; step I: mark the block as free

    (local.set $hdr (i32.sub (local.get $ptr) (i32.const 4)))
    (local.set $size (call $hdr_get_size (local.get $hdr)))
    (local.set $ftr (i32.add (i32.add (local.get $hdr) (local.get $size)) (i32.const 4)))

    (call $hdr_set_free (local.get $hdr) (i32.const 1))
    (call $hdr_set_free (local.get $ftr) (i32.const 1))

    ;; step II: try coalasce

    ;; coalasce with previous block

    ;; check that we're not already the first block
    (if (i32.eqz (local.get $hdr)) (then)(else

      ;; read info about previous block
      (local.set $prev_ftr (i32.sub (local.get $hdr) (i32.const 4)))
      (local.set $prev_size (call $hdr_get_size (local.get $prev_ftr)))
      (local.set $prev_hdr
        (i32.sub (i32.sub (local.get $prev_ftr) (local.get $prev_size)) (i32.const 4))
      )

      ;; check if previous block is free -> merge them
      (if (i32.eqz (call $hdr_get_free (local.get $prev_ftr))) (then) (else
        (local.set $size (i32.add (i32.add (local.get $size) (local.get $prev_size)) (i32.const 8)))
        (call $hdr_set_size (local.get $prev_hdr) (local.get $size))
        (call $hdr_set_size (local.get $ftr) (local.get $size))

        ;; set current header pointer to previous header
        (local.set $hdr (local.get $prev_hdr))
      ))
    ))

    ;; coalasce with next block

    (local.set $next_hdr (i32.add (local.get $ftr) (i32.const 4)))

    ;; check that we're not already the last block
    (if (i32.eq (local.get $next_hdr) (global.get $max_addr)) (then)(else

      ;; read info about next block
      (local.set $next_size (call $hdr_get_size (local.get $next_hdr)))
      (local.set $next_ftr
        (i32.add (i32.add (local.get $next_hdr) (local.get $next_size)) (i32.const 4))
      )

      ;; check if next block is free -> merge them
      (if (i32.eqz (call $hdr_get_free (local.get $next_hdr))) (then) (else
        (local.set $size (i32.add (i32.add (local.get $size) (local.get $next_size)) (i32.const 8)))
        (call $hdr_set_size (local.get $hdr) (local.get $size))
        (call $hdr_set_size (local.get $next_ftr) (local.get $size))
      ))

    ))

  )
  ;; copy a block of memory over, from src pointer to dst pointer
  ;; WebAssembly seems to be planning to support memory.copy
  ;; until then, this function uses a loop and i32.store8/load8
  (func $memcpy (param $dst i32) (param $src i32) (param $n_bytes i32)
    (local $ptr i32)
    (local $offset i32)
    (local $data i32)
    (local.set $offset (i32.const 0))

    loop $cpy
      (local.set $data (i32.load8_u (i32.add (local.get $src) (local.get $offset))))
      (i32.store8 (i32.add (local.get $dst) (local.get $offset)) (local.get $data))

      (local.set $offset (i32.add (local.get $offset) (i32.const 1)))
      (br_if $cpy (i32.lt_u (local.get $offset) (local.get $n_bytes)))
    end
  )

  ;; reallocate memory to new size
  ;; currently does not support contraction
  ;; nothing will happen if n_bytes is smaller than current payload size
  (func $realloc (param $ptr i32) (param $n_bytes i32) (result i32)
    (local $hdr i32)
    (local $next_hdr i32)
    (local $next_ftr i32)
    (local $next_size i32)
    (local $ftr i32)
    (local $size i32)
    (local $rest_hdr i32)
    (local $rest_size i32)
    (local $new_ptr i32)

    (local.set $hdr (i32.sub (local.get $ptr) (i32.const 4)))
    (local.set $size (call $hdr_get_size (local.get $hdr)))

    (if (i32.gt_u (local.get $n_bytes) (local.get $size)) (then) (else
      (local.get $ptr)
      return
    ))

    ;; payload size is aligned to multiple of 4
    (local.set $n_bytes (call $align4 (local.get $n_bytes)))

    (local.set $next_hdr (i32.add (i32.add (local.get $hdr) (local.get $size)) (i32.const 8)))

    ;; Method I: try to expand the current block

    ;; check that we're not already the last block
    (if (i32.lt_u (local.get $next_hdr) (global.get $max_addr) )(then
      (if (call $hdr_get_free (local.get $next_hdr)) (then

        (local.set $next_size (call $hdr_get_size (local.get $next_hdr)))
        (local.set $rest_size (i32.sub
          (local.get $next_size)
          (i32.sub (local.get $n_bytes) (local.get $size))
        ))
        (local.set $next_ftr (i32.add (i32.add (local.get $next_hdr) (local.get $next_size)) (i32.const 4)))

        ;; next block is big enough to be split into two
        (if (i32.gt_s (local.get $rest_size) (i32.const 0) ) (then

          (call $hdr_set_size (local.get $hdr) (local.get $n_bytes))

          (local.set $ftr (i32.add (i32.add (local.get $hdr) (local.get $n_bytes) ) (i32.const 4)))
          (call $hdr_set_size (local.get $ftr) (local.get $n_bytes))
          (call $hdr_set_free (local.get $ftr) (i32.const 0))

          (local.set $rest_hdr (i32.add (local.get $ftr) (i32.const 4) ))
          (call $hdr_set_size (local.get $rest_hdr) (local.get $rest_size))
          (call $hdr_set_free (local.get $rest_hdr) (i32.const 1))

          (call $hdr_set_size (local.get $next_ftr) (local.get $rest_size))
          (call $hdr_set_free (local.get $next_ftr) (i32.const 1))

          (local.get $ptr)
          return

        ;; next block is not big enough to be split, but is
        ;; big enough to merge with the current one into one
        )(else (if (i32.gt_s (local.get $rest_size) (i32.const -9) ) (then

          (local.set $size (i32.add (i32.add (local.get $size) (i32.const 8) ) (local.get $next_size)))
          (call $hdr_set_size (local.get $hdr) (local.get $size))
          (call $hdr_set_size (local.get $next_ftr) (local.get $size))
          (call $hdr_set_free (local.get $next_ftr) (i32.const 0))

          (local.get $ptr)
          return
        ))))

      ))
    ))

    ;; Method II: allocate a new block and copy over

    (local.set $new_ptr (call $malloc (local.get $n_bytes)))
    (call $memcpy (local.get $new_ptr) (local.get $ptr) (local.get $n_bytes))
    (call $free (local.get $ptr))
    (local.get $new_ptr)

  )

  ;; exported API's
  (export "init"    (func   $init   ))
  (export "extend"  (func   $extend ))
  (export "malloc"  (func   $malloc ))
  (export "free"    (func   $free   ))
  (export "memcpy"  (func   $memcpy ))
  (export "realloc" (func   $realloc))
  (export "mem"     (memory $mem    ))
)
  `)
  .then(([exp,act]) => hexAssertEqual(exp,act)))

})
