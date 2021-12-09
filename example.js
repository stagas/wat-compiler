import compile from './index.js'
const buffer = compile('(func (export "answer") (result i32) (i32.const 42))')
const mod = new WebAssembly.Module(buffer)
const instance = new WebAssembly.Instance(mod)
console.log(instance.exports.answer()) // => 42
