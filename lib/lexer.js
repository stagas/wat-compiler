const regexp = /(?<comment>;;.*|\(;.*?;\))|(?<instr>[a-z_\.]+)|\$(?<label>[a-z_]+)|\"(?<string>.*?)\"|(?<hex>0x[0-9a-f]+)|(?<number>-?\d[\d\.e]+)|(?<lparen>\()|(?<rparen>\))|(?<nul>[ \t\n]+)|(?<error>.)/gi

export default input => [...input.matchAll(regexp)].map(e => {
  const [kind, value] = Object.entries(e.groups).filter(e => e[1])[0]
  return { value, kind, index: e.index }
})
