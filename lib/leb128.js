export function* int (value) {
  let byte = 0x00
  const size = Math.ceil(Math.log2(Math.abs(value)))
  const negative = value < 0
  let more = true

  while (more) {
    byte = value & 127
    value = value >> 7

    if (negative) {
      value = value | (- (1 << (size - 7)))
    }

    if (
      (value == 0 && ((byte & 0x40) == 0)) ||
      (value == -1 && ((byte & 0x40) == 0x40))
    ) {
      more = false
    }

    else {
      byte = byte | 128
    }

    yield byte
  }
}

export function* uint (value, pad = 0) {
  let byte = 0x00

  do {
    byte = value & 0x7F
    value = value >> 0x07

    if (value != 0 || pad > 0) {
      byte = byte | 0x80
    }

    yield byte

    pad--
  } while (value != 0 || pad > -1)
}
