import ModuleBuilder from '../lib/builder.js'
import { INSTR } from '../lib/const.js'
import { hexAssertEqual } from './util/hex.js'
import wat from './util/wat.js'

const { i32, i64, local } = INSTR

async function wasm (binary, imports = {}) {
  const mod = await WebAssembly.instantiate(binary.buffer, imports)
  return mod.instance.exports
}

async function buffers (code, fn) {
  const expected = await wat(code)
  // console.log(expected.log)
  const actual = fn(new ModuleBuilder()).build()
  return [expected.buffer, actual.buffer]
}

//
//
//

describe('(module)', () => {
  //
  it(`(module)`, () => buffers(`

  (module)

  `, mod => mod

  ).then(([exp,act]) => hexAssertEqual(exp,act)))
})

describe('function declaration', () => {
  //
  it(`1 function
        0 params, 1 results [i32]
        0 locals
        exported`, () => buffers(`

    (func (export "value") (result i32)
      (i32.const 42)
    )

  `, mod => mod

    .func('value', [], ['i32'],
      [],
      [...i32.const(42)],
      true)

  ).then(([exp,act]) => hexAssertEqual(exp,act)))

  //
  it(`1 function
        0 params, 1 results [i32]
        0 locals
        not exported`, () => buffers(`

    (func (result i32)
      (i32.const 42)
    )

  `, mod => mod

    .func('value', [], ['i32'],
      [],
      [...i32.const(42)],
      )

  ).then(([exp,act]) => hexAssertEqual(exp,act)))

  //
  it(`2 functions
        a, b: 0 params, 1 results [i32]
        a, b: 0 locals
        a, b: exported`, () => buffers(`

    (func (export "value") (result i32)
      (i32.const 42)
    )
    (func (export "another") (result i32)
      (i32.const 666)
    )

  `, mod => mod

    .func('value', [], ['i32'],
      [],
      [...i32.const(42)],
      true)
    .func('another', [], ['i32'],
      [],
      [...i32.const(666)],
      true)

  ).then(([exp,act]) => hexAssertEqual(exp,act)))

  //
  it(`2 functions
        a, b: 0 params, 1 results [i32]
        a, b: 0 locals
        a: exported
        b: not exported`, () => buffers(`

    (func (export "value") (result i32)
      (i32.const 42)
    )
    (func (result i32)
      (i32.const 666)
    )

  `, mod => mod

    .func('value', [], ['i32'],
      [],
      [...i32.const(42)],
      true)
    .func('another', [], ['i32'],
      [],
      [...i32.const(666)],
      )

  ).then(([exp,act]) => hexAssertEqual(exp,act)))

  //
  it(`2 functions
           a: 0 params, 1 results [i32],
           b: 1 params [i32], 1 results [i32]
        a, b: 0 locals
        a, b: exported`, () => buffers(`

    (func (export "value") (result i32)
      (i32.const 42)
    )
    (func (export "another") (param i32) (result i32)
      (i32.const 666)
    )

  `, mod => mod

    .func('value', [], ['i32'],
      [],
      [...i32.const(42)],
      true)
    .func('another', ['i32'], ['i32'],
      [],
      [...i32.const(666)],
      true)

  ).then(([exp,act]) => hexAssertEqual(exp,act)))

})

//
//
//

describe('function locals', () => {
  //
  it(`1 function
        0 params, 1 results [i32]
        1 locals [i32]
        exported`, () => buffers(`

    (func (export "value") (result i32)
      (local i32)
      (i32.const 42)
    )

  `, mod => mod

    .func('value', [], ['i32'],
      ['i32'],
      [...i32.const(42)],
      true)

  ).then(([exp,act]) => hexAssertEqual(exp,act)))

  //
  it(`1 function
        0 params, 1 results [i32]
        2 locals [i32, i64] (different)
        exported`, () => buffers(`

    (func (export "value") (result i32)
      (local i32)
      (local i64)
      (i32.const 42)
    )

  `, mod => mod

    .func('value', [], ['i32'],
      ['i32','i64'],
      [...i32.const(42)],
      true)

  ).then(([exp,act]) => hexAssertEqual(exp,act)))

  //
  it(`1 function
        0 params, 1 results [i32]
        3 locals [i32, i64, i32] (disjointed)
        exported`, () => buffers(`

    (func (export "value") (result i32)
      (local i32)
      (local i64)
      (local i32)
      (i32.const 42)
    )

  `, mod => mod

    .func('value', [], ['i32'],
      ['i32','i64','i32'],
      [...i32.const(42)],
      true)

  ).then(([exp,act]) => hexAssertEqual(exp,act)))

  //
  it(`1 function
        0 params, 1 results [i32]
        3 locals [i32, i32, i64] (joined)
        exported`, () => buffers(`

    (func (export "value") (result i32)
      (local i32)
      (local i32)
      (local i64)
      (i32.const 42)
    )

  `, mod => mod

    .func('value', [], ['i32'],
      ['i32','i32','i64'],
      [...i32.const(42)],
      true)

  ).then(([exp,act]) => hexAssertEqual(exp,act)))

})

//
//
//

describe('function body', () => {
  //
  it(`1 function - add 2 numbers (s-expression)
        2 params, 1 results [i32]
        0 locals
        exported`, () => buffers(`

    (func (export "add") (param $a i32) (param $b i32) (result i32)
      (i32.add (local.get $a) (local.get $b))
    )

  `, mod => mod

    .func('add', ['i32','i32'], ['i32'],
      [],
      [
        ...i32.add([], [local.get(0), local.get(1)]),
      ],
      true)

  )
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).add(20,22)).to.equal(42)
    expect((await wasm(act)).add(20,22)).to.equal(42)
  }))

  //
  it(`1 function - add 2 numbers (stack)
        2 params, 1 results [i32]
        0 locals
        exported`, () => buffers(`

    (func (export "add") (param $a i32) (param $b i32) (result i32)
      local.get $a
      local.get $b
      i32.add
    )

  `, mod => mod

    .func('add', ['i32','i32'], ['i32'],
      [],
      [
        ...local.get(0),
        ...local.get(1),
        ...i32.add(),
      ],
      true)

  )
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).add(20,22)).to.equal(42)
    expect((await wasm(act)).add(20,22)).to.equal(42)
  }))

  //
  it(`1 function - add 2 numbers (tee + s-expression)
        1 params, 1 results [i32]
        1 locals
        exported`, () => buffers(`

    (func (export "add") (param $a i32) (result i32)
      (local $b i32)
      (local.tee $b (i32.const 20))
      (i32.add (local.get $a))
    )

  `, mod => mod

    .func('add', ['i32'], ['i32'],
      ['i32'],
      [
        ...local.tee(1, [i32.const(20)]),
        ...i32.add([], [local.get(0)]),
      ],
      true)

  )
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).add(22)).to.equal(42)
    expect((await wasm(act)).add(22)).to.equal(42)
  }))

  //
  it(`1 function - add 2 numbers (tee + s-expression)
        2 params, 1 results [i32]
        0 locals
        exported`, () => buffers(`

    (func (export "add") (param i32 i32) (result i32)
      (local.get 0)
      (local.get 1)
      (i32.add)
    )

  `, mod => mod

    .func('add', ['i32','i32'], ['i32'],
      [],
      [
        ...local.get(0),
        ...local.get(1),
        ...i32.add()
      ],
      true)

  )
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).add(20, 22)).to.equal(42)
    expect((await wasm(act)).add(20, 22)).to.equal(42)
  }))

})

//
//
//

describe('function call', () => {
  //
  it('call function direct', () => buffers(`

    (func $dbl (param $a i32) (result i32)
      (i32.add (local.get $a) (local.get $a))
    )

    (func (export "call_function_direct") (param $a i32) (result i32)
      (call $dbl (local.get $a))
    )

  `, mod => mod

    .func('dbl', ['i32'], ['i32'],
      [],
      [
        ...i32.add([], [local.get(0), local.get(0)]),
      ]
      )

    .func('call_function_direct', ['i32'], ['i32'],
      [],
      [
        ...INSTR.call(mod.getFunc('dbl').idx, [local.get(0)])
      ],
      true)

  )
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).call_function_direct(333)).to.equal(666)
    expect((await wasm(act)).call_function_direct(333)).to.equal(666)
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

  `, mod => mod

      .type('return_i32', [], ['i32'])

      .table('funcref', 2)

      .elem([...i32.const(0)], ['f1','f2'])

      .func('f1', [], ['i32'],
        [],
        [...i32.const(42)])

      .func('f2', [], ['i32'],
        [],
        [...i32.const(13)])

    .func('call_function_indirect', ['i32'], ['i32'],
      [],
      [
        ...INSTR.call_indirect(
          [mod.getType('return_i32'), 0],
          [local.get(0)])
      ],
      true)

  )
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

  `, mod => mod

      .table('funcref', 2)

      .elem([...i32.const(0)], ['f1','f2'])

      .func('xx', [], ['i64'],
        [],
        [...i64.const(42)])

      .func('f1', [], ['i32'],
        [],
        [...i32.const(42)])

      .func('f2', [], ['i32'],
        [],
        [...i32.const(13)])

    .func('call_function_indirect', ['i32'], ['i32'],
      [],
      [
        ...INSTR.call_indirect(
          // call_indirect takes 2 arguments: typeidx, tableidx
          [mod.getFunc('f1').type_idx, 0],
          // and a reference table element index from the stack
          [local.get(0)])
      ],
      true)

  )
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).call_function_indirect(0)).to.equal(42)
    expect((await wasm(exp)).call_function_indirect(1)).to.equal(13)
    expect((await wasm(act)).call_function_indirect(0)).to.equal(42)
    expect((await wasm(act)).call_function_indirect(1)).to.equal(13)
  }))

})

//
//
//

describe('globals', () => {
  //
  it('1 global const (immutable)', () => buffers(`

    (global $answer i32 (i32.const 42))

    (func (export "get") (result i32)
      (global.get $answer)
    )

  `, mod => mod

    .global('answer', 'const', 'i32', [...i32.const(42)])

    .func('get', [], ['i32'],
      [],
      [
        ...INSTR.global.get(mod.getGlobalIndexOf('answer'))
      ],
      true)

  )
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

  `, mod => mod

    .global('answer', 'var', 'i32', [...i32.const(42)])

    .func('get', [], ['i32'],
      [],
      [
        ...INSTR.global.get(mod.getGlobalIndexOf('answer'))
      ],
      true)

  )
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

  `, mod => mod

    .global('answer', 'var', 'i32', [...i32.const(42)])

    .func('get', [], ['i32'],
      [],
      [
        ...INSTR.global.set(mod.getGlobalIndexOf('answer'), [i32.const(666)]),
        ...INSTR.global.get(mod.getGlobalIndexOf('answer'))
      ],
      true)

  )
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).get()).to.equal(666)
    expect((await wasm(act)).get()).to.equal(666)
  }))
})

//
//
//

describe('memory + data', () => {
  //
  it('local memory page min 1 - data 1 offset 0 i32', () => buffers(String.raw`

    (memory 1)

    (data (i32.const 0) "\2a")

    (func (export "get") (result i32)
      (i32.load (i32.const 0))
    )

  `, mod => mod

    .memory(null, 1)

    .data([...i32.const(0)], [0x2a])

    .func('get', [], ['i32'],
      [],
      [
        ...i32.load([2,0], i32.const(0))
      ],
      true)

  )
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

  `, mod => mod

    .memory(null, 1, 2)

    .data([...i32.const(0)], [0x2a])

    .func('get', [], ['i32'],
      [],
      [
        ...i32.const(1),
        ...i32.const(2),
        ...INSTR.drop(),
        ...INSTR.drop(),
        ...i32.const(0),
        ...i32.load([2,0])
      ],
      true)

  )
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).get()).to.equal(42)
    expect((await wasm(act)).get()).to.equal(42)
  }))
})

//
//
//

describe('imports', () => {
  //
  it('import function', () => buffers(`

    (import "math" "add" (func $add (param i32 i32) (result i32)))

    (func (export "call_imported_function") (result i32)
      (call $add (i32.const 20) (i32.const 22))
    )

  `, mod => mod

    .import('func', 'math.add', 'math', 'add', ['i32','i32'], ['i32'])

    .func('call_imported_function', [], ['i32'],
      [],
      [
        ...INSTR.call(mod.getFunc('math.add').idx, [i32.const(20), i32.const(22)])
      ],
      true)

  )
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    const math = { add: (a, b) => a + b }
    expect((await wasm(exp, { math })).call_imported_function()).to.equal(42)
    expect((await wasm(act, { math })).call_imported_function()).to.equal(42)
  }))

  //
  it('import memory min 1 max 2', () => buffers(`

    (import "env" "mem" (memory 1 2))

  `, mod => mod

    .import('memory', 'env.mem', 'env', 'mem', [1,2])

  )
  .then(([exp,act]) => hexAssertEqual(exp,act)))

  //
  it('import memory min 1 max 2', () => buffers(`

    (import "env" "mem" (memory 1 2 shared))

  `, mod => mod

    .import('memory', 'env.mem', 'env', 'mem', [1,2,true])

  )
  .then(([exp,act]) => hexAssertEqual(exp,act)))

  //
  it('import memory min 3', () => buffers(`

    (import "env" "mem" (memory 3))

  `, mod => mod

    .import('memory', 'env.mem', 'env', 'mem', [3])

  )
  .then(([exp,act]) => hexAssertEqual(exp,act)))

  //
  it('import memory min 3 max 3', () => buffers(`

    (import "env" "mem" (memory 3 3))

  `, mod => mod

    .import('memory', 'env.mem', 'env', 'mem', [3,3])

  )
  .then(([exp,act]) => hexAssertEqual(exp,act)))
})

//
//
//

describe('start', () => {
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

  `, mod => mod

    .global('answer', 'var', 'i32', [...i32.const(42)])

    .start('main')

    .func('main', [], [],
      [],
      [
        ...INSTR.global.set(mod.getGlobalIndexOf('answer'), [i32.const(666)]),
      ],
      )

    .func('get', [], ['i32'],
      [],
      [
        ...INSTR.global.get(mod.getGlobalIndexOf('answer'))
      ],
      true)

  )
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).get()).to.equal(666)
    expect((await wasm(act)).get()).to.equal(666)
  }))
})

//
//
//

describe('if', () => {
  //
  it('dummy function', () => buffers(`
    (memory 1)

    (func $dummy)

    (func (export "store") (param i32)
      (if (result i32) (local.get 0)
        (then (call $dummy) (i32.const 1))
        (else (call $dummy) (i32.const 0))
      )
      (i32.const 2)
      (i32.store)
    )
  `, mod => mod

    .memory(null, 1)

    .func('dummy')

    .func('store', ['i32'], [],
      [],
      [
        ...INSTR.if([INSTR.type.i32()], [local.get(0)]),
          ...INSTR.call(mod.getFunc('dummy').idx),
          ...i32.const(1),
        ...INSTR.else(),
          ...INSTR.call(mod.getFunc('dummy').idx),
          ...i32.const(0),
        ...INSTR.end(),

        ...i32.const(2),
        ...i32.store([2,0]),
      ]
      , true)

  )
  .then(([exp,act]) => hexAssertEqual(exp,act))
  .then(async ([exp,act]) => {
    expect((await wasm(exp)).store()).to.equal(undefined)
    expect((await wasm(act)).store()).to.equal(undefined)
  }))
})
