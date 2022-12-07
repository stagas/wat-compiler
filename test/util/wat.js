import Wabt from 'wabt'

let wabt
export default async function compile(code) {
  if (!wabt) {
    wabt = await Wabt()
  }

  const parsed = await wabt.parseWat('inline', new TextEncoder('utf-8').encode(code), {
    /** Import/export mutable globals. */
    mutable_globals: true,
    /** Saturating float-to-int operators. */
    sat_float_to_int: true,
    /** Sign-extension operators. */
    sign_extension: true,
    bulk_memory: true,
  })
  console.time('wat build')
  const binary = parsed.toBinary({
    log: true,
    canonicalize_lebs: true,
    relocatable: false,
    write_debug_names: false,
  })
  parsed.destroy()
  console.timeEnd('wat build')

  return binary
}
