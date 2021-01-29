export function hex (buffer) {
  return [...new Uint8Array(buffer)]
    .map(v => v.toString(16).padStart(2, '0'))
}

export function hexCompare (a, b) {
  const ha = hex(a)
  const hb = hex(b)
  const len = Math.max(ha.length, hb.length)
  let out = []
  let i
  for (i = 0; i < len; i++) {
    out.push((ha[i] != hb[i] ? '\x1b[31m' : '\x1b[32m') + (hb[i] ?? '--') + '\x1b[39m')
    if (out.length === 16) {
      console.log(ha.slice(i - 15, i+1).join(' '))
      console.log(out.join(' '))
      out = []
    }
  }
  console.log(ha.slice(i - out.length, i).join(' '))
  console.log(out.join(' '))
}

export function hexAssertEqual (a, b) {
  const len = Math.max(a.length, b.length)
  for (let i = 0; i < len; i++) {
    if (a[i] !== b[i]) {
      hexCompare(a, b)
      throw new Error('Not equal')
    }
  }
  return [a,b]
}
