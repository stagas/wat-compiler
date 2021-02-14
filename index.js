import { tokenize } from './lib/lexer.js'
import compile from './lib/compiler.js'
import parse from './lib/parser.js'

export default function (code) {
  return compile(parse(tokenize('(module '+code+')'))).build()
}
