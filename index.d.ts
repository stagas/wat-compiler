declare interface Options {
  metrics: boolean
}

declare interface Context {
  module: ModuleBuilder
  context: any
}

declare const make: {
  (string: string, options?: Options, context?: Context): Uint8Array
}

declare type ModuleBuilder = any

declare const compile: {
  (node: Node): ModuleBuilder
}

declare type Node = any

declare const parse: {
  (s: any): Node
}

declare const tokenize: {
  (s: string): any
}

export {
  tokenize,
  parse,
  compile,
  make as default
}
