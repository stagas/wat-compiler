export declare interface Options {
  metrics: boolean
}

export declare interface GlobalContext {
  globals: ({ name: string, vartype: string, type: string })[]
}

export declare interface Context {
  module: ModuleBuilder
  global: GlobalContext
}

declare const make: {
  (string: string, options?: Options, context?: Context): Uint8Array
}

declare type ModuleBuilder = any

declare const compile: {
  (node: Node): Context
}

declare type Node = any

declare const parse: {
  (s: any): Node
}

declare const tokenize: {
  (s: string): any
}

export {
  GlobalContext,
  ModuleBuilder,
  tokenize,
  parse,
  compile,
  make as default
}
