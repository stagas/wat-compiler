/**
 * [modified]: modifications belong in the public domain.
 *
 * Original source: https://github.com/surma/bfwasm
 * Original license:
 * Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { BYTE } from './const.js'

export function wrap_instr (code) {
  return function (args, exprs) {
    return instr(
      code,
       args != null && !Array.isArray(args)  ? [args]  : args,
      exprs != null && !Array.isArray(exprs) ? [exprs] : exprs,
    )
  }
}

export function* instr(code, args=[], exprs=[]) {
  for (let expr of exprs) {
    yield* expr
  }
  yield BYTE[code]
  for (let arg of args) {
    yield* byte(arg)
  }
}

export function* byte(v) {
  while (v > 127) {
    yield (1 << 7) | (v & 0xff)
    v = Math.floor(v >> 7)
  }
  yield v
}

const encoder = new TextEncoder('utf-8')
export function utf8(s) {
  return [...encoder.encode(s)]
}

export function section (type, data) {
  return [BYTE.section[type], ...byte(data.length), ...data]
}

export function vector (items) {
  return [...byte(items.length), ...items.flat()]
}

export function locals (items) {
  const out = []
  let curr = []
  let prev

  for (const type of items) {
    if (type !== prev && curr.length) {
      out.push([...byte(curr.length), BYTE.type[curr[0]]])
      curr = []
    }
    curr.push(type)
    prev = type
  }

  if (curr.length)
    out.push([...byte(curr.length), BYTE.type[curr[0]]])

  return out
}

section.type = function (types) {
  return section('type',
    vector(types.map(([params, returns]) => [
      BYTE.type.func,
      ...vector(  params.map(x => BYTE.type[x] )),
      ...vector( returns.map(x => BYTE.type[x] )),
    ])))
}

section.function = function (matches) {
  return section('function',
    vector(matches.map(m => [...byte(m)])))
}

section.export = function (exported) {
  return section('export',
    vector(exported.map(([type, idx, name]) =>
      [...vector(utf8(name)), BYTE.export[type], ...byte(idx)]
    ))
  )
}

section.code = function (funcs) {
  return section('code', [
    ...byte(funcs.length),
    ...funcs.flatMap(f => vector([...f, BYTE.end]))
  ])
}
