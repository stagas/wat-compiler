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
  tables = []
  memories = []
  globals = []
  elements = []
  codes = []
  datas = []

  get exported () { return this.codes.filter(func => func.exported) }

  getTypeIndexOf (params, returns) {
    const type_sig = [params.join(' '), returns.join(' ')].join()
    const idx = this.types.indexOf(type_sig)
    if (idx >= 0) return idx
    return this.types.push(type_sig) - 1
  }

  getGlobalIndexOf (name) {
    return this.globals.find(glob => glob.name === name).idx
  }

  getFunc (name) {
    return this.codes.find(func => func.name === name)
  }

  global (name, mut, valtype, expr) {
    const global_idx = this.globals.length
    this.globals.push({ idx: global_idx, name, valtype, mut, expr })
    return this
  }

  table (type, min, max) {
    this.tables.push({ type, min, max })
    return this
  }

  memory (min, max) {
    this.memories.push({ min, max })
    return this
  }

  data (offset_idx_expr, bytes) {
    this.datas.push({ offset_idx_expr, bytes })
    return this
  }

  elem (offset_idx_expr, codes) {
    this.elements.push({ offset_idx_expr, codes })
    return this
  }

  func (name, params, returns, locals, body, exported = false) {
    const type_idx = this.getTypeIndexOf(params, returns)
    const func_idx = this.codes.length
    this.codes.push({ idx: func_idx, name, type_idx, locals, body, exported })
    return this
  }

  build () {
    console.time('module build')
    const bytes = new ByteArray()

    // ------------
    //
    // header

    bytes
      .write(utf8('\0asm'), 'wasm binary magic')
      .write([1,0,0,0],     'wasm version')

    // type

    bytes.write(section.type(
      this.types.map(type =>
        type.split(',').map(x => x.split(' ').filter(Boolean))
      )))

    // function

    bytes.write(section.function(
      this.codes.map(func =>
        func.type_idx
      )))

    // table

    if (this.elements.length) { bytes.write(section.table(
      this.tables.map(table =>
        [ table.type, table.min, table.max ]
      ))) }

    // memory

    if (this.memories.length) { bytes.write(section.memory(
      this.memories.map(mem =>
        [ mem.min, mem.max ]
      ))) }

    // global

    if (this.globals.length) { bytes.write(section.global(
      this.globals.map(glob => [glob.mut, glob.valtype, glob.expr]))) }

    // export

    if (this.exported.length) { bytes.write(section.export(
      this.exported.map(func =>
        [ 'func', func.idx, func.name ]
      ))) }

    // element

    if (this.elements.length) { bytes.write(section.element(
      this.elements.map(elem => [
        0, // table_idx is always 0 (one table per module is allowed currently)
        elem.offset_idx_expr,
        elem.codes.map(name => this.getFunc(name).idx)
      ]))) }

    // code

    bytes.write(section.code(
      this.codes.map(func =>
        [ ...vector(locals(func.locals)), ...func.body ]
      )))

    // data

    if (this.datas.length) { bytes.write(section.data(
      this.datas.map(data => [
        0, // memory idx is always 0 (?)
        data.offset_idx_expr,
        data.bytes // verbatim data
      ]))) }

    // end
    //
    // ------------

    console.timeEnd('module build')
    return bytes
  }
}
