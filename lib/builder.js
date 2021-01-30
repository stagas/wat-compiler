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
  elems = []
  funcs = []

  get exported () { return this.funcs.filter(func => func.exported) }

  getFunc (name) {
    return this.funcs.find(func => func.name === name)
  }

  getTypeSignatureIndex (params, returns) {
    const type_sig = [params.join(' '), returns.join(' ')].join()
    const idx = this.types.indexOf(type_sig)
    if (idx >= 0) return idx
    return this.types.push(type_sig) - 1
  }

  elem (offset_idx, funcs) {
    this.elems.push({ offset_idx, funcs })
    return this
  }

  func (name, params, returns, locals, body, exported = false) {
    const type_idx = this.getTypeSignatureIndex(params, returns)
    const func_idx = this.funcs.length
    this.funcs.push({ idx: func_idx, name, type_idx, locals, body, exported })
    return this
  }

  build () {
    console.time('module build')
    const bytes = new ByteArray()

    // header

    bytes
      .write(utf8('\0asm'), 'wasm binary magic')
      .write([1,0,0,0],     'wasm version')

    // type

    bytes.write(section.type(
      this.types.map(type =>
        type.split(',').map(x => x.split(' ').filter(Boolean)))))

    // function

    bytes.write(section.function(
      this.funcs.map(func => func.type_idx)))

    // table

    if (this.elems.length) { bytes.write(section.table(
      [[ 'funcref', this.elems.reduce((p,n) => // one table funcref for now
        Math.max(p, n.offset_idx + n.funcs.length), 0) ]] )) }

    // export

    if (this.exported.length) { bytes.write(section.export(
      this.exported.map(func =>
        [ 'func', func.idx, func.name ]))) }

    // element

    if (this.elems.length) { bytes.write(section.element(
      this.elems.map(elem => [
        0, // table_idx is always 0 (one table per module is allowed currently)
        elem.offset_idx,
        elem.funcs.map(name => this.getFunc(name).idx)
      ]))) }

    // code

    bytes.write(section.code(
      this.funcs.map(func =>
        [ ...vector(locals(func.locals)),
          ...func.body ])))

    console.timeEnd('module build')
    return bytes
  }
}
