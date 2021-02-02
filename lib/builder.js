import { header, section } from './binary.js'

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
  imports = []
  tables = []
  memories = []
  globals = []
  exports = []
  starts = ''
  elements = []
  codes = []
  datas = []

  get funcs () { return this.codes.filter(func => !!func.body) }

  ensureType (params, results) {
    const type_sig = [params.join(' '), results.join(' ')].join()
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

  getType (name) {
    return this.types[name]
  }

  type (name, params, results) {
    console.log(name, params, results)
    this.types[name] = this.ensureType(params, results)
    return this
  }

  import (type, name, mod, field, params, results) {
    if (type === 'func') {
      const func = this._func(name, params, results)
      this.imports.push({ mod, field, type, desc: [func.type_idx] })
    }
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

  global (name, mut, valtype, expr) {
    const global_idx = this.globals.length
    this.globals.push({ idx: global_idx, name, valtype, mut, expr })
    return this
  }

  export (type, name, export_name) {
    if (type === 'func') {
      this.exports.push({ type, name, export_name })
    }
    return this
  }

  start (name) {
    this.starts = name
    return this
  }

  elem (offset_idx_expr, codes) {
    this.elements.push({ offset_idx_expr, codes })
    return this
  }

  _func (name, params, results, locals, body, exported = false) {
    const type_idx = this.ensureType(params, results)
    const func_idx = this.codes.length
    const func = { idx: func_idx, name, type_idx, locals, body }
    this.codes.push(func)
    if (exported) {
      this.export('func', name, name)
    }
    return func
  }

  func (...args) {
    this._func(...args)
    return this
  }

  data (offset_idx_expr, bytes) {
    this.datas.push({ offset_idx_expr, bytes })
    return this
  }

  build () {
    console.time('module build')
    const bytes = new ByteArray()

    // ------------
    //
    // header

    bytes.write(header())

    // type

    bytes.write(section.type(
      this.types.map(type =>
        type.split(',').map(x => x.split(' ').filter(Boolean))
      )))

    // import

    if (this.imports.length) { bytes.write(section.import(
      this.imports.map(imp =>
        [ imp.mod, imp.field, imp.type, imp.desc ]
      ))) }

    // function

    bytes.write(section.function(
      this.funcs.map(func =>
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
      this.globals.map(glob =>
        [ glob.mut, glob.valtype, glob.expr ]
      ))) }

    // export

    if (this.exports.length) { bytes.write(section.export(
      this.exports.map(exp =>
        [ exp.export_name, exp.type, this.getFunc(exp.name).idx ]
      ))) }

    // start

    if (this.starts.length) { bytes.write(section.start(
      this.getFunc(this.starts).idx
      )) }

    // element

    if (this.elements.length) { bytes.write(section.element(
      this.elements.map(elem => [
        0, // table_idx is always 0 (one table per module is allowed currently)
        elem.offset_idx_expr,
        elem.codes.map(name => this.getFunc(name).idx)
      ]))) }

    // code

    bytes.write(section.code(
      this.funcs.map(func =>
        [ func.locals, func.body ]
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
