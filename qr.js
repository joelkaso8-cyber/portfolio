// Small QR code maker for the site viewer: text in, SVG out. No library.
// Byte mode, error correction M, versions 1 to 6 (up to 106 characters, enough for the site links).
// shortcut: longer text returns '' instead of a code; add the version 7+ tables if links ever grow past 106 characters.
;(function (root) {
  'use strict'
  // per version: [error correction bytes per block, number of blocks, data bytes per block]
  var VERS = [null, [10, 1, 16], [16, 1, 28], [26, 1, 44], [18, 2, 32], [24, 2, 43], [16, 4, 27]]

  function mul(x, y) { var z = 0; for (var i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11D); z ^= ((y >>> i) & 1) * x } return z }
  function divisor(deg) {
    var r = [], rootv = 1, i, j
    for (i = 0; i < deg; i++) r.push(0)
    r[deg - 1] = 1
    for (i = 0; i < deg; i++) {
      for (j = 0; j < deg; j++) { r[j] = mul(r[j], rootv); if (j + 1 < deg) r[j] ^= r[j + 1] }
      rootv = mul(rootv, 2)
    }
    return r
  }
  function remainder(data, div) {
    var r = div.map(function () { return 0 })
    data.forEach(function (b) {
      var f = b ^ r.shift(); r.push(0)
      div.forEach(function (c, i) { r[i] ^= mul(c, f) })
    })
    return r
  }
  function utf8(s) { var e = unescape(encodeURIComponent(s)), o = []; for (var i = 0; i < e.length; i++) o.push(e.charCodeAt(i)); return o }

  // Returns { size, dark(row, col) } or null when the text is too long.
  function matrix(text, forceMask) {
    var bytes = utf8(text), v = 0, k
    for (k = 1; k < VERS.length; k++) if (bytes.length <= VERS[k][1] * VERS[k][2] - 2) { v = k; break }
    if (!v) return null
    var ec = VERS[v][0], blocks = VERS[v][1], per = VERS[v][2], cap = blocks * per, size = 17 + 4 * v

    // 1. data bits: mode, length, bytes, terminator, padding
    var bits = []
    function put(val, n) { for (var i = n - 1; i >= 0; i--) bits.push((val >>> i) & 1) }
    put(4, 4); put(bytes.length, 8); bytes.forEach(function (b) { put(b, 8) })
    put(0, Math.min(4, cap * 8 - bits.length))
    while (bits.length % 8) bits.push(0)
    var data = []
    for (k = 0; k < bits.length; k += 8) data.push(parseInt(bits.slice(k, k + 8).join(''), 2))
    for (var pad = 0xEC; data.length < cap; pad ^= 0xEC ^ 0x11) data.push(pad)

    // 2. split into blocks, add error correction, interleave
    var div = divisor(ec), parts = [], out = []
    for (k = 0; k < blocks; k++) { var d = data.slice(k * per, (k + 1) * per); parts.push([d, remainder(d, div)]) }
    for (k = 0; k < per; k++) parts.forEach(function (p) { out.push(p[0][k]) })
    for (k = 0; k < ec; k++) parts.forEach(function (p) { out.push(p[1][k]) })

    // 3. fixed patterns
    var m = [], fn = [], r, c
    for (r = 0; r < size; r++) { m.push([]); fn.push([]); for (c = 0; c < size; c++) { m[r].push(false); fn[r].push(false) } }
    function set(x, y, on) { m[y][x] = on; fn[y][x] = true }
    for (k = 0; k < size; k++) { set(6, k, k % 2 === 0); set(k, 6, k % 2 === 0) }
    ;[[3, 3], [size - 4, 3], [3, size - 4]].forEach(function (p) {
      for (var dy = -4; dy <= 4; dy++) for (var dx = -4; dx <= 4; dx++) {
        var x = p[0] + dx, y = p[1] + dy, dist = Math.max(Math.abs(dx), Math.abs(dy))
        if (x >= 0 && x < size && y >= 0 && y < size) set(x, y, dist !== 2 && dist !== 4)
      }
    })
    if (v >= 2) for (var ay = -2; ay <= 2; ay++) for (var ax = -2; ax <= 2; ax++) set(size - 7 + ax, size - 7 + ay, Math.max(Math.abs(ax), Math.abs(ay)) !== 1)
    function format(mask) {
      var dat = mask, rem = dat // error correction level M is 00
      for (var i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537)
      var fb = ((dat << 10) | rem) ^ 0x5412
      function bit(i) { return ((fb >>> i) & 1) !== 0 }
      for (i = 0; i <= 5; i++) set(8, i, bit(i))
      set(8, 7, bit(6)); set(8, 8, bit(7)); set(7, 8, bit(8))
      for (i = 9; i < 15; i++) set(14 - i, 8, bit(i))
      for (i = 0; i < 8; i++) set(size - 1 - i, 8, bit(i))
      for (i = 8; i < 15; i++) set(8, size - 15 + i, bit(i))
      set(8, size - 8, true)
    }
    format(0)

    // 4. data in the zigzag
    var idx = 0
    for (var right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5
      for (var vert = 0; vert < size; vert++) for (var j = 0; j < 2; j++) {
        var x = right - j, up = ((right + 1) & 2) === 0, y = up ? size - 1 - vert : vert
        if (!fn[y][x] && idx < out.length * 8) { m[y][x] = ((out[idx >>> 3] >>> (7 - (idx & 7))) & 1) !== 0; idx++ }
      }
    }

    // 5. mask: try all eight, keep the calmest pattern
    function flip(mask) {
      for (var y = 0; y < size; y++) for (var x = 0; x < size; x++) {
        if (fn[y][x]) continue
        var inv = mask === 0 ? (x + y) % 2 === 0 : mask === 1 ? y % 2 === 0 : mask === 2 ? x % 3 === 0 : mask === 3 ? (x + y) % 3 === 0
          : mask === 4 ? (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0 : mask === 5 ? (x * y) % 2 + (x * y) % 3 === 0
          : mask === 6 ? ((x * y) % 2 + (x * y) % 3) % 2 === 0 : ((x + y) % 2 + (x * y) % 3) % 2 === 0
        if (inv) m[y][x] = !m[y][x]
      }
    }
    function penalty() {
      var p = 0, dark = 0, x, y, run, i
      for (y = 0; y < size; y++) for (i = 0; i < 2; i++) { // rows, then columns
        run = 1
        for (x = 1; x < size; x++) {
          var a = i ? m[x][y] : m[y][x], b = i ? m[x - 1][y] : m[y][x - 1]
          if (a === b) { run++; if (run === 5) p += 3; else if (run > 5) p++ } else run = 1
        }
      }
      for (y = 0; y < size; y++) for (x = 0; x < size; x++) {
        if (m[y][x]) dark++
        if (x < size - 1 && y < size - 1 && m[y][x] === m[y][x + 1] && m[y][x] === m[y + 1][x] && m[y][x] === m[y + 1][x + 1]) p += 3
      }
      return p + Math.floor(Math.abs(dark * 20 / (size * size) - 10)) * 10
    }
    var best = forceMask
    if (best === undefined) {
      var low = Infinity
      for (k = 0; k < 8; k++) { flip(k); format(k); var sc = penalty(); if (sc < low) { low = sc; best = k } flip(k) }
    }
    flip(best); format(best)
    return { size: size, mask: best, dark: function (row, col) { return m[row][col] } }
  }

  // An SVG string with a 4-module quiet border. Dark modules use currentColor.
  function svg(text) {
    var q = matrix(text)
    if (!q) return ''
    var n = q.size + 8, d = ''
    for (var r = 0; r < q.size; r++) for (var c = 0; c < q.size; c++) if (q.dark(r, c)) d += 'M' + (c + 4) + ' ' + (r + 4) + 'h1v1h-1z'
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + n + ' ' + n + '" role="img" aria-label="QR code" shape-rendering="crispEdges"><rect width="' + n + '" height="' + n + '" fill="#fff"/><path fill="#000" d="' + d + '"/></svg>'
  }

  root.JKQR = { svg: svg, matrix: matrix }
})(typeof window !== 'undefined' ? window : globalThis)
