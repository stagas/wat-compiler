import { byte, utf8, section, vector, locals } from './binary.js'

class ByteArray extends Array {
  log = []

  write (array, annotation) {
    this.log.push(array, annotation)
    this.push(...array)
    return this
  }
  get buffer () {
    return new Uint8Array(this)
  }
}

export default class ModuleBuilder {
  types = []
  funcs = []

  get exported () { return this.funcs.filter(func => func.exported) }

  getTypeSignatureIndex (params, returns) {
    const type_sig = [params.join(' '), returns.join(' ')].join()
    const idx = this.types.indexOf(type_sig)
    if (idx >= 0) return idx
    return this.types.push(type_sig) - 1
  }

  func (name, params, returns, locals, body, exported = false) {
    const type_idx = this.getTypeSignatureIndex(params, returns)
    this.funcs.push({ idx: this.funcs.length, name, type_idx, locals, body, exported })
    return this
  }

  build () {
    console.time('module build')
    const bytes = new ByteArray()

    bytes
      .write(utf8('\0asm'), 'wasm binary magic')
      .write([1,0,0,0],     'wasm version')

    bytes.write(section.type(
      this.types.map(type =>
        type.split(',').map(x => x.split(' ').filter(Boolean)))))

    bytes.write(section.function(
      this.funcs.map(func => func.type_idx)))

    if (this.exported.length) bytes.write(section.export(
      this.exported.map(func =>
        [ 'func', func.idx, func.name ])))

    bytes.write(section.code(
      this.funcs.map(func =>
        [ ...vector(locals(func.locals)),
          ...func.body ])))

    console.timeEnd('module build')
    return bytes
  }
}
