declare interface Options {
  metrics: boolean
}

declare const compile: {
  (string: string, options?: Options): Uint8Array
}

export = compile
