import { tokenize } from './lib/lexer.js'
import parse from './lib/parser.js'
import compile from './lib/compiler.js'

export { tokenize }
export { parse }
export { compile }

/**
 * Compiles a WAT source string to a buffer.
 *
 * ```js
 * import compile from 'wat-compiler'
 * const buffer = compile('(func (export "answer") (result i32) (i32.const 42))')
 * const mod = new WebAssembly.Module(buffer)
 * const instance = new WebAssembly.Instance(mod)
 * console.log(instance.exports.answer()) // => 42
 * ```
 *
 * @param {string} code The WAT code to compile
 * @param {Options} options An options object
 * @param {boolean} options.metrics Enable metrics with console.time
 * @returns {Uint8Array} The buffer to be passed on to WebAssembly
 */
export default function make(code, options, context = {}) {
  return compile(parse(tokenize('(module '+code+')')), context.module, context.global).module.build(options).buffer
}
