/* Ride it: the 8.7 km Vjosa run as a river the raft floats down as you scroll, from the put-in near Përmet to the take-out.
   Everything shown comes from the page: two Class II rapids, Cliff Jump Rock, the Pebble Beach swim stop,
   2.5 to 3 hours on the water, and the €30 morning, afternoon and custom tours. */
(function () {
  'use strict'
  var root = document.getElementById('ride')
  if (!root || root.dataset.ready) return
  root.dataset.ready = '1'

  function $(id) { return document.getElementById(id) }
  var stage = $('rr-stage'), cv = $('rr-canvas'), ctx = cv.getContext('2d')
  var knob = $('rr-knob'), fillEl = $('rr-fill')
  var elStop = $('rr-stop'), elCls = $('rr-cls'), elText = $('rr-text'), elKm = $('rr-km'), elTime = $('rr-time'), elNext = $('rr-next'), elCall = $('rr-call')
  var elLight = $('rr-light'), btnBook = $('rr-book')
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  var MONO = "'Martian Mono', ui-monospace, Consolas, monospace"

  // ---- The run. 1800 model metres stand for the 8.7 km; stops sit where the route map puts them. ----
  var L = 1800, KM = 8.7, CLIFF = 1080, BEACH = 1440
  var STOPS = [
    { f: 0, side: 1, name: 'Put-in near Përmet', tag: 'Put-in', cls: 'Start', text: 'Helmet, life jacket and wetsuit on after the 15-minute briefing. One certified guide in every raft.' },
    { f: 0.2, side: 1, name: 'Canyon Entrance', tag: 'Canyon Entrance · II', cls: 'Class II rapid', rapid: 1, text: 'The limestone walls close in and the first rapid starts. Your guide calls the line, you paddle.' },
    { f: 0.4, side: -1, name: 'Blue Wave', tag: 'Blue Wave · II', cls: 'Class II rapid', rapid: 1, text: 'A train of standing waves in clear blue water. Paddle forward and ride it through.' },
    { f: 0.6, side: 1, name: 'Cliff Jump Rock', tag: 'Cliff Jump Rock', cls: 'Optional', text: "Jump with your guide's green light, or stay in the raft and watch." },
    { f: 0.8, side: -1, name: 'Pebble Beach', tag: 'Pebble Beach · swim', cls: 'Swim stop', text: 'A calm canyon pool for a swim. Your life jacket keeps you floating face up.' },
    { f: 1, side: 1, name: 'Take-out', tag: 'Take-out', cls: 'Finish', text: 'Out of the water, then a comfortable transfer back to central Përmet. Free photos and videos go straight to your phone.' }
  ]
  STOPS.forEach(function (st) { st.s = st.f * L })

  // Rapids: the guide's line (u = share of the half width, + is river right) and the rocks either side of it.
  var RAPIDS = [
    { a: 360, len: 108, line: [[0, 0.2], [38, -0.1], [78, 0.15], [108, 0]],
      rocks: [[8, -0.55, 2.2], [14, 0.75, 1.8], [30, 0.45, 2.4], [36, -0.7, 1.6], [53, -0.5, 2], [60, 0.55, 1.7], [76, -0.35, 1.9], [83, 0.75, 2.2], [98, -0.6, 1.5]] },
    { a: 720, len: 108, blue: true, line: [[0, -0.1], [38, 0.05], [78, 0], [108, -0.05]],
      rocks: [[6, 0.6, 2], [12, -0.6, 2.2], [33, 0.55, 1.6], [46, -0.55, 1.9], [68, 0.6, 2.1], [88, -0.6, 1.7], [98, 0.65, 1.5]] }
  ]
  RAPIDS.forEach(function (r) {
    r.b = r.a + r.len
    r.line = r.line.map(function (p) { return [r.a + p[0], p[1]] })
    r.rocks = r.rocks.map(function (k) { return { s: r.a + k[0], u: k[1], r: k[2], hit: false, flash: 0 } })
  })

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v }
  function sstep(a, b, x) { var t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t) }
  function bump(x, c, h) { var d = (x - c) / h; return Math.exp(-d * d) }
  function hash(n) { var x = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x) }
  function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t] }
  function rgba(c, a) { return 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + (a === undefined ? 1 : +a.toFixed(3)) + ')' }

  function cen(s) { return 9 * Math.sin(s / 97) + 6 * Math.sin(s / 43 + 1.3) + 3.5 * Math.sin(s / 21 + 0.4) }
  function dcen(s) { return 9 / 97 * Math.cos(s / 97) + 6 / 43 * Math.cos(s / 43 + 1.3) + 3.5 / 21 * Math.cos(s / 21 + 0.4) }
  function canyon(s) { var f = s / L; return sstep(0.15, 0.19, f) * (1 - sstep(0.64, 0.7, f)) }
  function rapidK(s) {
    var k = 0
    for (var i = 0; i < RAPIDS.length; i++) { var r = RAPIDS[i]; k = Math.max(k, sstep(r.a - 14, r.a + 6, s) * (1 - sstep(r.b - 6, r.b + 16, s))) }
    return k
  }
  function wid(s) {
    return 40 - 12 * canyon(s) - 4 * rapidK(s) + 5 * bump(s, BEACH, 50) + 4 * bump(s, 0, 40) + 4 * bump(s, L, 40) + 0.9 * Math.sin(s * 0.31) + 0.6 * Math.sin(s * 0.77)
  }
  function band(s, side) {
    var b = 3 + 9 * canyon(s) + 1.1 * Math.sin(s * 0.9 + side) + 0.7 * Math.sin(s * 2.3 + side * 2)
    if (side < 0) b += 20 * bump(s, BEACH, 42)
    else b += 9 * bump(s, 0, 25) + 9 * bump(s, L, 25)
    return Math.max(1.5, b)
  }
  function flowV(s) { return Math.max(4, 18 + 9 * rapidK(s) - 9 * bump(s, CLIFF, 40) - 10 * bump(s, BEACH, 45) - 10 * sstep(L - 60, L, s)) }
  function lineAt(r, s) {
    var p = r.line
    if (s <= p[0][0]) return p[0][1]
    for (var i = 1; i < p.length; i++) if (s <= p[i][0]) { var t = (s - p[i - 1][0]) / (p[i][0] - p[i - 1][0]); return p[i - 1][1] + (p[i][1] - p[i - 1][1]) * t }
    return p[p.length - 1][1]
  }
  // Where the guide steers: the line through each rapid, in to the rock, over to the beach.
  function autoLat(s) {
    var u = 0
    RAPIDS.forEach(function (r) {
      var pre = r.a - 70, post = r.b + 30
      if (s >= pre && s <= post) u = lineAt(r, clamp(s, r.a, r.b)) * sstep(pre, r.a - 10, s) * (1 - sstep(r.b, post, s))
    })
    u += 0.5 * bump(s, CLIFF, 45) - 0.45 * bump(s, BEACH, 50)
    return u * wid(s) / 2
  }

  // ---- Scenery, seeded so the river looks the same on every visit ----
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 } }
  var R = rng(87)
  var TREES = [], BOULDERS = [], PEBBLES = []
  for (var ds = -160; ds < L + 160; ds += 1.6) {
    for (var sd = -1; sd <= 1; sd += 2) {
      if (R() < 0.68) {
        var ts = ds + R() * 1.6, k0 = canyon(ts), tone = R()
        if (k0 > 0.5 && tone > 0.4) continue
        var col = mix(mix([34, 56, 39], [64, 94, 61], tone), [92, 98, 70], k0 * 0.7)
        TREES.push({ s: ts, side: sd, d: 1 + R() * 26, r: (1.3 + R() * 2.4) * (1 - 0.45 * k0), fill: rgba(col), hi: rgba(mix(col, [150, 170, 120], 0.35), 0.5) })
      }
      if (R() < 0.2) BOULDERS.push({ s: ds + R() * 1.6, side: sd, d: R(), r: 0.5 + R() * 1.1, tone: R() })
    }
  }
  for (var pi = 0; pi < 170; pi++) PEBBLES.push({ s: BEACH - 50 + R() * 100, d: R(), r: 0.18 + R() * 0.4, tone: R() })
  PEBBLES.sort(function (a, b) { return a.s - b.s })
  function firstFrom(list, s) { var lo = 0, hi = list.length; while (lo < hi) { var m = (lo + hi) >> 1; if (list[m].s < s) lo = m + 1; else hi = m } return lo }

  // ---- State ----
  var cw = 1, ch = 1, dpr = 1, S = 10, y0 = 200
  var s = 0, lat = 0, latV = 0, latT = 0, camX = cen(0), steering = false
  var playing = false, sGoal = null, grab = null, shake = 0, T = 0
  var bumps = 0, jumps = 0, jump = null, lastEv = null, slot = 'afternoon', sun = 1
  var streaks = [], spray = []
  for (var si = 0; si < 90; si++) streaks.push({ s: -40 + Math.random() * 120, u: -0.92 + Math.random() * 1.84, len: 1.5 + Math.random() * 3.5 })

  function X(m) { return cw / 2 + (m - camX) * S }
  function Y(ss) { return y0 + (ss - s) * S }
  function viewTop() { return s - y0 / S - 6 }
  function viewBot() { return s + (ch - y0) / S + 6 }

  function vgrad(fn) {
    var g = ctx.createLinearGradient(0, 0, 0, ch), n = 16
    for (var i = 0; i <= n; i++) { var c = fn(s + (ch * i / n - y0) / S); g.addColorStop(i / n, rgba(c, c[3])) }
    return g
  }
  function rr(x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2)
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath()
  }
  function ellipse(x, y, a, b, rot) { ctx.beginPath(); ctx.ellipse(x, y, Math.max(0.1, a), Math.max(0.1, b), rot || 0, 0, Math.PI * 2) }

  // ---- Drawing ----
  var GRAVEL = [163, 155, 137], LIT = [214, 205, 186], SHADE = [124, 117, 104], PEBBLE = [192, 184, 166]
  function buildRows() {
    var rows = [], step = 6
    for (var y = -12; y <= ch + 12; y += step) {
      var ss = s + (y - y0) / S, c = cen(ss), w = wid(ss)
      rows.push({ y: y, s: ss, c: c, w: w, xl: X(c - w / 2), xr: X(c + w / 2), bl: band(ss, -1), br: band(ss, 1) })
    }
    return rows
  }
  function path(rows, fx) { ctx.beginPath(); for (var i = 0; i < rows.length; i++) { var x = fx(rows[i]); if (i) ctx.lineTo(x, rows[i].y); else ctx.moveTo(x, rows[i].y) } }

  function drawLand(rows) {
    ctx.fillStyle = vgrad(function (ss) { return mix([28, 47, 35], [52, 60, 42], canyon(ss) * 0.8).concat(1) })
    ctx.fillRect(0, 0, cw, ch)
    var top = viewTop() - 30, bot = viewBot() + 30, i = firstFrom(TREES, top), t, sh = sun ? -sun : 0.4
    for (; i < TREES.length && (t = TREES[i]).s < bot; i++) {
      var w = wid(t.s), x = X(cen(t.s) + t.side * (w / 2 + band(t.s, t.side) + 0.8 + t.d)), y = Y(t.s), r = t.r * S
      if (x < -r * 2 || x > cw + r * 2) continue
      ctx.fillStyle = 'rgba(8,20,14,.34)'; ellipse(x + sh * r * 0.45, y + r * 0.4, r, r * 0.92); ctx.fill()
      ctx.fillStyle = t.fill; ellipse(x, y, r, r); ctx.fill()
      ctx.fillStyle = t.hi; ellipse(x - sh * r * 0.3, y - r * 0.3, r * 0.45, r * 0.45); ctx.fill()
    }
  }

  function drawBanks(rows) {
    ;[-1, 1].forEach(function (side) {
      var lit = sun === 0 ? 0.55 : (side === -sun ? 1 : 0)
      ctx.fillStyle = vgrad(function (ss) {
        var c = mix(GRAVEL, mix(SHADE, LIT, lit), canyon(ss))
        if (side < 0) c = mix(c, PEBBLE, bump(ss, BEACH, 40))
        return c.concat(1)
      })
      ctx.beginPath()
      for (var i = 0; i < rows.length; i++) { var r = rows[i], x = side < 0 ? r.xl - r.bl * S : r.xr + r.br * S; if (i) ctx.lineTo(x, r.y); else ctx.moveTo(x, r.y) }
      for (i = rows.length - 1; i >= 0; i--) { r = rows[i]; ctx.lineTo(side < 0 ? r.xl + 2 : r.xr - 2, r.y) }
      ctx.closePath(); ctx.fill()
    })
    // limestone strata and gravel speckle, anchored to the river so they travel with it
    var top = viewTop(), bot = viewBot()
    for (var ss = Math.ceil(top / 1.4) * 1.4; ss < bot; ss += 1.4) {
      var k = canyon(ss), c = cen(ss), w = wid(ss), y = Y(ss)
      for (var side = -1; side <= 1; side += 2) {
        var b = band(ss, side), edge = X(c + side * w / 2), outer = X(c + side * (w / 2 + b))
        if (k > 0.15 && hash(ss * 3.1 + side) < 0.55) {
          var a = edge + (outer - edge) * hash(ss + side * 9) * 0.35, len = (outer - edge) * (0.35 + 0.6 * hash(ss * 1.7 + side))
          ctx.strokeStyle = 'rgba(52,46,38,' + (0.28 * k).toFixed(3) + ')'; ctx.lineWidth = Math.max(1, 0.18 * S)
          ctx.beginPath(); ctx.moveTo(a, y); ctx.lineTo(a + len, y + 0.25 * S); ctx.stroke()
        }
        if (k < 0.7) {
          ctx.fillStyle = 'rgba(96,90,78,' + (0.35 * (1 - k)).toFixed(3) + ')'
          ellipse(edge + (outer - edge) * hash(ss * 5.3 + side * 3), y, 0.22 * S, 0.17 * S); ctx.fill()
        }
      }
    }
    // pebbles on the beach
    var i = firstFrom(PEBBLES, top), p
    for (; i < PEBBLES.length && (p = PEBBLES[i]).s < bot; i++) {
      var pw = wid(p.s), pb = band(p.s, -1), px = X(cen(p.s) - pw / 2 - pb * p.d * 0.95)
      ctx.fillStyle = rgba(mix([132, 124, 108], [222, 214, 196], p.tone), 0.85); ellipse(px, Y(p.s), p.r * S, p.r * S * 0.75, p.tone * 3); ctx.fill()
    }
    // boulders where the bank meets the water
    i = firstFrom(BOULDERS, top - 4)
    for (; i < BOULDERS.length && (p = BOULDERS[i]).s < bot + 4; i++) {
      var bw = wid(p.s), bx = X(cen(p.s) + p.side * (bw / 2 + band(p.s, p.side) * p.d * 0.6)), by = Y(p.s), br = p.r * S * (1 + canyon(p.s) * 0.6)
      ctx.fillStyle = 'rgba(10,24,20,.3)'; ellipse(bx + 0.3 * br, by + 0.35 * br, br, br * 0.8); ctx.fill()
      ctx.fillStyle = rgba(mix([104, 98, 88], [176, 168, 150], p.tone)); ellipse(bx, by, br, br * 0.8, p.tone * 2); ctx.fill()
    }
  }

  function shoreRafts() {
    var list = [[6, 1, 1.35], [14, 1, 1.45], [BEACH - 10, -1, 1.7], [BEACH + 5, -1, 1.5], [L - 6, 1, 1.4], [L + 3, 1, 1.5]], top = viewTop() - 10, bot = viewBot() + 10
    list.forEach(function (q) {
      if (q[0] < top || q[0] > bot) return
      var w = wid(q[0]), x = X(cen(q[0]) + q[1] * (w / 2 + 3.6))
      raftShape(x, Y(q[0]), q[2], 0.92, false, '#c4382c', 0)
    })
  }

  function strokeRows(rows, fx, width, style) { path(rows, fx); ctx.lineWidth = width; ctx.strokeStyle = style; ctx.lineJoin = 'round'; ctx.stroke() }

  function drawWater(rows) {
    ctx.beginPath()
    for (var i = 0; i < rows.length; i++) { if (i) ctx.lineTo(rows[i].xl, rows[i].y); else ctx.moveTo(rows[i].xl, rows[i].y) }
    for (i = rows.length - 1; i >= 0; i--) ctx.lineTo(rows[i].xr, rows[i].y)
    ctx.closePath()
    ctx.fillStyle = vgrad(function (ss) {
      var c = mix([27, 104, 94], [21, 88, 82], canyon(ss))
      c = mix(c, [58, 146, 130], rapidK(ss) * 0.55)
      c = mix(c, [34, 120, 146], bump(ss, 760, 70) * 0.75)
      c = mix(c, [46, 144, 132], bump(ss, BEACH, 45) * 0.7)
      return c.concat(1)
    })
    ctx.fill()
    ctx.save(); ctx.clip()
    var w = wid(s)
    strokeRows(rows, function (r) { return X(r.c) }, w * 0.6 * S, 'rgba(6,40,38,.14)')
    strokeRows(rows, function (r) { return X(r.c) }, w * 0.32 * S, 'rgba(6,40,38,.16)')
    strokeRows(rows, function (r) { return r.xl }, 9 * S, 'rgba(120,200,180,.15)')
    strokeRows(rows, function (r) { return r.xr }, 9 * S, 'rgba(120,200,180,.15)')
    strokeRows(rows, function (r) { return r.xl }, 3 * S, 'rgba(184,232,212,.2)')
    strokeRows(rows, function (r) { return r.xr }, 3 * S, 'rgba(184,232,212,.2)')
    if (sun) strokeRows(rows, sun > 0 ? function (r) { return r.xr } : function (r) { return r.xl }, 20 * S, vgrad(function (ss) { return [4, 24, 22, 0.5 * canyon(ss) + 0.1] }))

    // current lines
    ctx.lineCap = 'round'
    var top = viewTop(), bot = viewBot()
    streaks.forEach(function (p) {
      var k = rapidK(p.s), x = X(cen(p.s) + p.u * wid(p.s) / 2), y = Y(p.s), sl = dcen(p.s), len = p.len * (1 + k) * S
      ctx.strokeStyle = 'rgba(214,240,230,' + (0.13 + 0.3 * k).toFixed(3) + ')'; ctx.lineWidth = Math.max(1, 0.16 * S)
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - sl * len, y - len); ctx.stroke()
    })
    // sun glints in the afternoon and at midday
    if (sun !== -1) {
      for (var ss = Math.ceil(top / 2.2) * 2.2; ss < bot; ss += 2.2) {
        var h = hash(ss * 4.7), a = Math.pow(Math.max(0, Math.sin(T * 2.6 + h * 40)), 10) * 0.9
        if (a < 0.05) continue
        var gx = X(cen(ss) + (-0.85 + 1.7 * hash(ss * 9.1)) * wid(ss) / 2), gy = Y(ss), gr = (0.25 + 0.3 * h) * S
        ctx.strokeStyle = 'rgba(255,248,226,' + a.toFixed(3) + ')'; ctx.lineWidth = 1
        ctx.beginPath(); ctx.moveTo(gx - gr * 2, gy); ctx.lineTo(gx + gr * 2, gy); ctx.moveTo(gx, gy - gr); ctx.lineTo(gx, gy + gr); ctx.stroke()
      }
    }
    drawRapids(top, bot)
    ctx.restore()
  }

  function drawRapids(top, bot) {
    RAPIDS.forEach(function (r) {
      if (r.b + 24 < top || r.a - 24 > bot) return
      // riffles across the whole width
      for (var ss = Math.ceil(Math.max(r.a - 12, top) / 3) * 3; ss < Math.min(r.b + 14, bot); ss += 3) {
        var k = rapidK(ss), c = cen(ss), w = wid(ss)
        for (var j = 0; j < 6; j++) {
          var h = hash(ss * 7.1 + j * 13.7), u = -0.92 + h * 1.84, len = (1 + 2.6 * hash(ss + j * 2.9)) * S
          var x = X(c + u * w / 2), y = Y(ss + hash(j * 3.3 + ss) * 2.6), a = (0.16 + 0.34 * k) * (0.55 + 0.45 * Math.sin(T * 5.5 + h * 30))
          ctx.strokeStyle = 'rgba(238,243,238,' + a.toFixed(3) + ')'; ctx.lineWidth = Math.max(1, 0.2 * S)
          ctx.beginPath(); ctx.moveTo(x - len, y + 0.3 * S); ctx.quadraticCurveTo(x, y - 0.8 * S, x + len, y + 0.3 * S); ctx.stroke()
        }
      }
      // the Blue Wave's train of standing waves
      if (r.blue) {
        for (ss = r.a + 40; ss <= r.a + 92; ss += 6.5) {
          if (ss < top || ss > bot) continue
          var lu = lineAt(r, ss), c2 = cen(ss), hw = wid(ss) / 2, y2 = Y(ss), xa = X(c2 + (lu - 0.42) * hw), xb = X(c2 + (lu + 0.42) * hw)
          var pulse = 0.5 + 0.5 * Math.sin(T * 3.2 - ss * 0.4)
          ctx.fillStyle = 'rgba(8,52,70,.32)'
          ctx.beginPath(); ctx.moveTo(xa, y2 + 1.2 * S); ctx.quadraticCurveTo((xa + xb) / 2, y2 + 3.4 * S, xb, y2 + 1.2 * S); ctx.quadraticCurveTo((xa + xb) / 2, y2 + 1.6 * S, xa, y2 + 1.2 * S); ctx.fill()
          ctx.strokeStyle = 'rgba(240,248,246,' + (0.55 + 0.35 * pulse).toFixed(3) + ')'; ctx.lineWidth = (0.45 + 0.25 * pulse) * S
          ctx.beginPath(); ctx.moveTo(xa, y2 + 0.6 * S); ctx.quadraticCurveTo((xa + xb) / 2, y2 - (1.2 + 0.5 * pulse) * S, xb, y2 + 0.6 * S); ctx.stroke()
        }
      }
      // the guide's line, shown once you take the helm
      if (steering) {
        ctx.setLineDash([0.9 * S, 1.1 * S]); ctx.strokeStyle = 'rgba(255,122,102,.85)'; ctx.lineWidth = Math.max(1.5, 0.28 * S)
        ctx.beginPath()
        for (ss = r.a - 16; ss <= r.b + 6; ss += 3) { var lx = X(cen(ss) + lineAt(r, clamp(ss, r.a, r.b)) * wid(ss) / 2), ly = Y(ss); if (ss === r.a - 16) ctx.moveTo(lx, ly); else ctx.lineTo(lx, ly) }
        ctx.stroke(); ctx.setLineDash([])
      }
      // rocks: foam pillow upstream, eddy below
      r.rocks.forEach(function (q) {
        if (q.s < top - 4 || q.s > bot + 4) return
        var x = X(cen(q.s) + q.u * wid(q.s) / 2), y = Y(q.s), rad = q.r * S, fl = Math.sin(T * 7 + q.s) * 0.08
        ctx.fillStyle = 'rgba(6,34,32,.38)'; ellipse(x, y + rad * 1.3, rad * 0.85, rad * 1.7); ctx.fill()
        ctx.strokeStyle = 'rgba(244,248,246,' + (0.72 + fl).toFixed(3) + ')'; ctx.lineWidth = 0.55 * S
        ctx.beginPath(); ctx.arc(x, y, rad * 1.22, Math.PI * 1.04, Math.PI * 1.96); ctx.stroke()
        ctx.strokeStyle = 'rgba(244,248,246,.35)'; ctx.lineWidth = 0.3 * S
        ctx.beginPath(); ctx.arc(x, y, rad * 1.55, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke()
        var g = ctx.createRadialGradient(x - (sun || -0.5) * rad * 0.35, y - rad * 0.35, rad * 0.1, x, y, rad)
        g.addColorStop(0, '#b4ab99'); g.addColorStop(1, '#58534b')
        ctx.fillStyle = g; ellipse(x, y, rad, rad * 0.86, q.s); ctx.fill()
        if (q.flash > 0.02) { ctx.strokeStyle = 'rgba(255,122,102,' + q.flash.toFixed(3) + ')'; ctx.lineWidth = 2; ellipse(x, y, rad + 4, rad * 0.86 + 4); ctx.stroke() }
      })
    })
  }

  function drawCliff() {
    var top = viewTop() - 20, bot = viewBot() + 20
    if (CLIFF + 16 < top || CLIFF - 16 > bot) return
    var pts = [[10.5, -6], [9.5, 2], [11, 9], [15, 13], [22, 12], [27, 4], [27, -10], [18, -14], [13, -11]]
    ctx.fillStyle = 'rgba(6,24,22,.4)'
    ctx.beginPath(); pts.forEach(function (p, i) { var ss = CLIFF + p[1] + 1.5, x = X(cen(ss) + p[0] + 1.6); if (i) ctx.lineTo(x, Y(ss)); else ctx.moveTo(x, Y(ss)) }); ctx.closePath(); ctx.fill()
    var cx = X(cen(CLIFF) + 18), cy = Y(CLIFF)
    var g = ctx.createRadialGradient(cx - (sun || -0.5) * 6 * S, cy - 5 * S, S, cx, cy, 16 * S)
    g.addColorStop(0, '#ddd4c0'); g.addColorStop(0.6, '#a69d8b'); g.addColorStop(1, '#6e675c')
    ctx.fillStyle = g
    ctx.beginPath(); pts.forEach(function (p, i) { var ss = CLIFF + p[1], x = X(cen(ss) + p[0]); if (i) ctx.lineTo(x, Y(ss)); else ctx.moveTo(x, Y(ss)) }); ctx.closePath(); ctx.fill()
    ctx.strokeStyle = 'rgba(52,46,38,.45)'; ctx.lineWidth = Math.max(1, 0.2 * S); ctx.stroke()
    for (var j = 0; j < 5; j++) { var sy = Y(CLIFF - 9 + j * 4.4); ctx.beginPath(); ctx.moveTo(X(cen(CLIFF) + 13 + j), sy); ctx.lineTo(X(cen(CLIFF) + 24 - j * 0.6), sy + 0.6 * S); ctx.strokeStyle = 'rgba(70,62,52,.3)'; ctx.stroke() }
    // foam where the rock meets the water
    ctx.strokeStyle = 'rgba(240,246,244,' + (0.55 + 0.15 * Math.sin(T * 4)).toFixed(3) + ')'; ctx.lineWidth = 0.4 * S
    ctx.beginPath(); [[10.5, -6], [9.5, 2], [11, 9]].forEach(function (p, i) { var ss = CLIFF + p[1], x = X(cen(ss) + p[0] - 0.6); if (i) ctx.lineTo(x, Y(ss)); else ctx.moveTo(x, Y(ss)) }); ctx.stroke()
    // people waiting on top
    var who = jump && jump.t < 1 ? [[21, 3]] : [[18, -2], [21, 3]]
    who.forEach(function (p) { person(X(cen(CLIFF + p[1]) + p[0]), Y(CLIFF + p[1]), 1, 0.2) })
  }

  function person(x, y, scl, rot) {
    var r = 0.34 * S * scl
    ctx.fillStyle = 'rgba(8,20,18,.35)'; ellipse(x + r * 0.5, y + r * 0.6, r * 1.6, r * 1.3); ctx.fill()
    ctx.fillStyle = '#c4382c'; ellipse(x, y + r * 0.3, r * 1.55, r * 1.2, rot); ctx.fill()
    ctx.fillStyle = '#eef3ee'; ellipse(x, y, r, r); ctx.fill()
  }

  function swimmers() {
    var top = viewTop(), bot = viewBot()
    ;[[BEACH - 8, 5], [BEACH + 1, 8], [BEACH + 9, 5.5]].forEach(function (q, i) {
      if (q[0] < top || q[0] > bot) return
      var ss = q[0], x = X(cen(ss) - wid(ss) / 2 + q[1]), y = Y(ss) + Math.sin(T * 2 + i * 2) * 0.15 * S
      ctx.strokeStyle = 'rgba(232,246,240,.35)'; ctx.lineWidth = 1
      ellipse(x, y, (0.9 + 0.25 * Math.sin(T * 2.4 + i)) * S, (0.75 + 0.2 * Math.sin(T * 2.4 + i)) * S); ctx.stroke()
      ctx.fillStyle = '#c4382c'; ellipse(x, y + 0.12 * S, 0.5 * S, 0.38 * S); ctx.fill()
      ctx.fillStyle = '#eef3ee'; ellipse(x, y, 0.3 * S, 0.3 * S); ctx.fill()
    })
  }

  function stopMarks() {
    ctx.font = '500 ' + (cw < 520 ? 10 : 11) + 'px ' + MONO
    ctx.textBaseline = 'middle'
    STOPS.forEach(function (st) {
      var y = Y(st.s)
      if (y < -30 || y > ch + 30) return
      var c = cen(st.s), w = wid(st.s)
      if (st.rapid) {
        ctx.setLineDash([4, 6]); ctx.strokeStyle = 'rgba(238,243,238,.4)'; ctx.lineWidth = 1
        ctx.beginPath(); ctx.moveTo(X(c - w / 2), y); ctx.lineTo(X(c + w / 2), y); ctx.stroke(); ctx.setLineDash([])
      }
      var txt = st.tag.toUpperCase(), tw = ctx.measureText(txt).width, pw = tw + 26, ph = 24
      var px = st.side > 0 ? X(c + w / 2 + band(st.s, 1)) + 6 : X(c - w / 2 - band(st.s, -1)) - pw - 6
      px = clamp(px, 8, cw - pw - 8)
      var rx = X(cen(s) + lat)
      if (Math.abs(y - y0) < 36 && px < rx + 44 && px + pw > rx - 44) y = y0 - 50
      ctx.fillStyle = 'rgba(6,20,19,.78)'; rr(px, y - ph / 2, pw, ph, ph / 2); ctx.fill()
      ctx.strokeStyle = 'rgba(169,195,187,.35)'; ctx.lineWidth = 1; ctx.stroke()
      ctx.fillStyle = st.rapid ? '#FF7A66' : '#CFC6B4'; ellipse(px + 11, y, 3.2, 3.2); ctx.fill()
      ctx.fillStyle = '#EEF3EE'; ctx.fillText(txt, px + 19, y + 0.5)
    })
  }

  function raftShape(x, y, ang, scl, people, col, phase) {
    var Lr = 5.2 * S * scl, Wr = 2.6 * S * scl
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang)
    rr(-Wr / 2, -Lr / 2, Wr, Lr, Wr / 2); ctx.fillStyle = col; ctx.fill()
    rr(-Wr / 2 + Wr * 0.2, -Lr / 2 + Wr * 0.2, Wr * 0.6, Lr - Wr * 0.4, Wr * 0.3); ctx.fillStyle = 'rgba(46,10,8,.42)'; ctx.fill()
    rr(-Wr / 2 + 1, -Lr / 2 + 1, Wr - 2, Lr - 2, Wr / 2); ctx.strokeStyle = 'rgba(255,255,255,.22)'; ctx.lineWidth = Math.max(1, 0.1 * S); ctx.stroke()
    ctx.fillStyle = 'rgba(255,190,180,.35)'
    ;[-0.2, 0.14].forEach(function (j) { ctx.fillRect(-Wr * 0.32, j * Lr - 0.13 * S * scl, Wr * 0.64, 0.26 * S * scl) })
    if (people) {
      var seats = [[-1, -0.24], [1, -0.24], [-1, 0.04], [1, 0.04], [-1, 0.3], [1, 0.3]]
      ctx.lineCap = 'round'
      seats.forEach(function (p, i) {
        var px = p[0] * Wr * 0.36, py = p[1] * Lr, sw = Math.sin(phase + (i % 2) * 0.25)
        ctx.strokeStyle = '#d9d1bf'; ctx.lineWidth = Math.max(1, 0.15 * S)
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(p[0] * (Wr * 0.5 + 1.15 * S), py + (0.3 + 0.75 * sw) * S); ctx.stroke()
        ctx.fillStyle = '#0d2a24'; ellipse(p[0] * (Wr * 0.5 + 1.25 * S), py + (0.3 + 0.75 * sw) * S + 0.25 * S, 0.22 * S, 0.42 * S); ctx.fill()
      })
      seats.forEach(function (p) {
        var px = p[0] * Wr * 0.36, py = p[1] * Lr
        ctx.fillStyle = '#123a31'; ellipse(px, py - 0.08 * S, 0.5 * S, 0.4 * S); ctx.fill()
        ctx.fillStyle = '#eef3ee'; ellipse(px, py + 0.04 * S, 0.3 * S, 0.3 * S); ctx.fill()
      })
      // the guide at the stern with the long steering paddle
      var gy = -0.42 * Lr, gs = Math.sin(phase * 0.5) * 0.5
      ctx.strokeStyle = '#d9d1bf'; ctx.lineWidth = Math.max(1, 0.17 * S)
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(gs * 1.6 * S, gy - 2.1 * S); ctx.stroke()
      ctx.fillStyle = '#0d2a24'; ellipse(gs * 1.75 * S, gy - 2.35 * S, 0.24 * S, 0.45 * S, gs * 0.6); ctx.fill()
      ctx.fillStyle = '#123a31'; ellipse(0, gy - 0.05 * S, 0.52 * S, 0.42 * S); ctx.fill()
      ctx.fillStyle = '#CFC6B4'; ellipse(0, gy + 0.04 * S, 0.32 * S, 0.32 * S); ctx.fill()
    }
    ctx.restore()
  }

  function drawRaft() {
    var k = rapidK(s), lift = k * 0.5 * (1 + Math.sin(T * 9)) + shake * 0.7
    var x = X(cen(s) + lat) + Math.sin(T * 55) * shake * 3, y = y0 + (grab ? grab.vis : 0)
    var ang = -Math.atan(dcen(s) + clamp(latV / Math.max(6, flowV(s)), -0.6, 0.6)) + Math.sin(T * 6.5) * 0.05 * k + Math.sin(T * 40) * shake * 0.08
    var moving = playing || sGoal !== null || (grab && grab.pull)
    // wake
    if (moving) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(ang)
      ctx.strokeStyle = 'rgba(232,246,240,.26)'; ctx.lineWidth = Math.max(1, 0.16 * S)
      ;[-1, 1].forEach(function (sd) { ctx.beginPath(); ctx.moveTo(sd * 1.1 * S, -2.4 * S); ctx.quadraticCurveTo(sd * 1.6 * S, -4.5 * S, sd * 2.6 * S, -7 * S); ctx.stroke() })
      ctx.restore()
    }
    var sh = sun ? -sun : 0.3
    ctx.save(); ctx.translate(x + sh * (2 + 6 * lift), y + 3 + 6 * lift); ctx.rotate(ang)
    ctx.fillStyle = 'rgba(4,24,22,' + (0.38 - 0.1 * lift).toFixed(3) + ')'; rr(-1.3 * S, -2.6 * S, 2.6 * S, 5.2 * S, 1.3 * S); ctx.fill()
    ctx.restore()
    var paddling = moving || steering ? T * (7 + 5 * k) : 0
    raftShape(x, y, ang, 1 + 0.07 * lift, true, '#EE3F2F', paddling)
    return { x: x, y: y }
  }

  function drawJump() {
    if (!jump) return
    var t = jump.t, p = Math.min(1, t)
    var s0 = CLIFF - 1, s1 = CLIFF + 3, l0 = 19, l1 = 6.5
    var ss = s0 + (s1 - s0) * p, lx = l0 + (l1 - l0) * p, h = Math.sin(Math.PI * p)
    var x = X(cen(ss) + lx), y = Y(ss)
    if (t < 1) {
      ctx.fillStyle = 'rgba(4,24,22,.3)'; ellipse(x + 3 * h * S, y + 2 * h * S, 0.6 * S, 0.5 * S); ctx.fill()
      person(x, y - h * 1.2 * S, 1 + 0.9 * h, p * 3)
    } else {
      var rt = t - 1
      for (var i = 0; i < 3; i++) {
        var rad = (0.6 + rt * 3.2 + i * 1.1) * S, a = Math.max(0, 0.7 - rt * 0.5 - i * 0.15)
        ctx.strokeStyle = 'rgba(240,248,246,' + a.toFixed(3) + ')'; ctx.lineWidth = Math.max(1, 0.25 * S)
        ellipse(x, y, rad, rad * 0.8); ctx.stroke()
      }
      if (rt > 0.5) { ctx.fillStyle = '#eef3ee'; ellipse(x, y, 0.3 * S, 0.3 * S); ctx.fill() }
    }
  }

  function drawSpray() {
    spray.forEach(function (d) {
      var a = d.life / d.max
      ctx.fillStyle = 'rgba(244,250,248,' + (0.85 * a).toFixed(3) + ')'
      ellipse(d.x, d.y, d.r * (0.6 + 0.4 * a), d.r * (0.6 + 0.4 * a)); ctx.fill()
    })
  }

  function drawLight() {
    var g
    if (sun < 0) {
      g = ctx.createLinearGradient(0, 0, cw, ch); g.addColorStop(0, 'rgba(206,226,236,.16)'); g.addColorStop(0.6, 'rgba(206,226,236,.03)'); g.addColorStop(1, 'rgba(10,30,40,.12)')
    } else if (sun > 0) {
      g = ctx.createLinearGradient(cw, 0, 0, ch); g.addColorStop(0, 'rgba(255,196,124,.16)'); g.addColorStop(0.6, 'rgba(255,196,124,.03)'); g.addColorStop(1, 'rgba(30,14,6,.1)')
    }
    if (g) { ctx.fillStyle = g; ctx.fillRect(0, 0, cw, ch) }
    var v = ctx.createRadialGradient(cw / 2, ch / 2, Math.min(cw, ch) * 0.35, cw / 2, ch / 2, Math.max(cw, ch) * 0.75)
    v.addColorStop(0, 'rgba(6,20,19,0)'); v.addColorStop(1, 'rgba(6,20,19,.42)')
    ctx.fillStyle = v; ctx.fillRect(0, 0, cw, ch)
  }

  function render() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    var rows = buildRows()
    drawLand(rows)
    drawBanks(rows)
    shoreRafts()
    drawWater(rows)
    drawCliff()
    swimmers()
    stopMarks()
    drawRaft()
    drawJump()
    drawSpray()
    drawLight()
  }

  // ---- Simulation ----
  function event(key) { lastEv = { key: key, t: T, at: performance.now() } }
  function cleanCount() { return RAPIDS.filter(function (r) { return r.clean }).length }
  function burst(n, x, y, power) {
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2, v = (30 + Math.random() * 90) * power
      spray.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: 1 + Math.random() * 2.2, life: 0.5 + Math.random() * 0.4, max: 0.9 })
    }
  }
  function hitRocks(prev, cur) {
    RAPIDS.forEach(function (r) {
      if (cur < r.a - 6 || prev > r.b + 6) return
      r.rocks.forEach(function (q) {
        if (q.hit || Math.abs(cur - q.s) > q.r + 2.4) return
        var ql = q.u * wid(q.s) / 2
        if (Math.abs(lat - ql) < q.r + 1.2) {
          q.hit = true; q.flash = 1; bumps++; shake = 1
          latV += (lat >= ql ? 1 : -1) * 11
          if (r.pass) r.pass.clean = false
          event('bump')
          burst(16, X(cen(s) + lat), y0 + 2.2 * S, 1.2)
        }
      })
    })
  }
  function passes(prev, cur, seeking) {
    RAPIDS.forEach(function (r) {
      r.rocks.forEach(function (q) { if (cur < q.s - 12) q.hit = false })
      if (cur < r.a - 2 || seeking) { r.pass = null; return }
      if (prev < r.a && cur >= r.a) r.pass = { clean: true }
      if (r.pass && prev < r.b && cur >= r.b) { if (r.pass.clean) { r.clean = true; event('clean') } else event('rough'); r.pass = null }
    })
  }

  function step(dt) {
    var prev = s, seeking = sGoal !== null
    if (grab && grab.pull) s = clamp(s + grab.pull * 0.6 * dt, 0, L)
    else if (seeking) { s += (sGoal - s) * Math.min(1, dt * 9); if (Math.abs(sGoal - s) < 0.4) { s = sGoal; sGoal = null } }
    else if (playing) { s = Math.min(L, s + flowV(s) * dt); if (s >= L) playing = false }
    if (grab) grab.vis += ((grab.pull ? clamp(grab.pull * 0.45, -30, 60) : 0) - grab.vis) * Math.min(1, dt * 12)

    var w = wid(s), maxLat = w / 2 - 1.7
    if (Math.abs(s - CLIFF) < 12) maxLat = Math.min(maxLat, 8)
    if (!steering) latT = autoLat(s)
    latT = clamp(latT, -maxLat, maxLat)
    if (seeking && !steering) { lat = latT; latV = 0 }
    else { latV += ((latT - lat) * 9 - latV * 5.2) * dt; lat += latV * dt }
    if (lat > maxLat) { lat = maxLat; latV = -Math.abs(latV) * 0.4 }
    if (lat < -maxLat) { lat = -maxLat; latV = Math.abs(latV) * 0.4 }

    if (s > prev && !seeking) hitRocks(prev, s)
    passes(prev, s, seeking)

    var look = cen(s + (ch * 0.5 - y0) / S * 0.7) + lat * 0.35
    camX += (look - camX) * Math.min(1, dt * 2.5)
    if (Math.abs(look - camX) > 25) camX = look
    shake *= Math.exp(-dt * 4.5)
    RAPIDS.forEach(function (r) { r.rocks.forEach(function (q) { q.flash *= Math.exp(-dt * 3) }) })

    var top = viewTop(), bot = viewBot()
    streaks.forEach(function (p) {
      p.s += (flowV(p.s) * 1.3 + 3) * dt
      if (p.s > bot + 4 || p.s < top - 30) { p.s = (p.s > bot + 4 ? top : top + Math.random() * (bot - top)) - Math.random() * 6; p.u = -0.92 + Math.random() * 1.84 }
    })
    var k = rapidK(s), moved = Math.abs(s - prev) > 0.02
    if (k > 0.1 && moved && Math.random() < k * dt * 40) {
      var rx = X(cen(s) + lat)
      burst(1 + (Math.random() * 3 | 0), rx + (Math.random() - 0.5) * 2.6 * S, y0 + 2.4 * S, 0.7)
    }
    spray = spray.filter(function (d) { d.life -= dt; d.x += d.vx * dt; d.y += d.vy * dt - (s - prev) * S * 0.6; d.vx *= 0.94; d.vy *= 0.94; return d.life > 0 })

    if (jump) {
      var before = jump.t; jump.t += dt
      if (before < 1 && jump.t >= 1) { jumps++; event('jump'); var ss = CLIFF + 3; burst(14, X(cen(ss) + 6.5), Y(ss), 0.9) }
      if (jump.t > 2.6) jump = null
    }
    T += dt
  }

  // ---- Panel ----
  var CALLS = {
    start: 'Helmets on? Paddles up. Let’s go.',
    ahead: 'Forward paddle! Aim for the V between the rocks.',
    in: 'Paddle forward! Hold the line.',
    inSteer: 'You have the helm. Follow the red line between the rocks.',
    bump: 'Bump! Lean in and keep paddling.',
    clean: 'Clean line. Nice paddling.',
    rough: 'Through it. Next time hold the V.',
    cliff: 'Cliff Jump Rock. Jump only on my green light.',
    jump: 'Big splash! Swim back to the raft.',
    beach: 'Swim stop. The pool is calm here.',
    idle: 'Easy water. Enjoy the views of the Vjosa National Park.',
    end: 'That is the full 8.7 km. Your photos and videos are on the way.',
    end2: 'Two clean lines, 8.7 km, no bumps. You paddle like a local.'
  }
  function callKey() {
    if (lastEv && performance.now() - lastEv.at < 2400) return lastEv.key
    if (s >= L - 1) return cleanCount() === 2 && bumps === 0 ? 'end2' : 'end'
    for (var i = 0; i < RAPIDS.length; i++) { var r = RAPIDS[i]; if (s >= r.a - 60 && s < r.a) return 'ahead'; if (s >= r.a && s < r.b) return steering ? 'inSteer' : 'in' }
    if (Math.abs(s - CLIFF) < 60) return 'cliff'
    if (Math.abs(s - BEACH) < 55) return 'beach'
    if (s < 40) return 'start'
    return 'idle'
  }
  function set(el, prop, v) { if (el[prop] !== v) el[prop] = v }
  var shownStop = -1
  function ui() {
    var f = s / L, idx = 0
    for (var i = 0; i < STOPS.length; i++) if (STOPS[i].s <= s + 22) idx = i
    if (idx !== shownStop) {
      shownStop = idx
      var st = STOPS[idx]
      elStop.textContent = st.name; elCls.textContent = st.cls; elText.textContent = st.text
    }
    set(elKm, 'textContent', (f * KM).toFixed(1))
    var mins = Math.round(f * 165)
    set(elTime, 'textContent', f >= 0.999 ? '2.5 to 3 h' : mins < 60 ? '≈ ' + mins + ' min' : '≈ ' + Math.floor(mins / 60) + ' h ' + ('0' + mins % 60).slice(-2))
    var nx = STOPS[idx + 1]
    set(elNext, 'textContent', nx ? 'Next: ' + nx.name + ' in ' + Math.max(0.1, (nx.f - f) * KM).toFixed(1) + ' km' : 'Then the transfer back to central Përmet.')
    var key = callKey()
    set(elCall, 'textContent', key ? 'Guide: “' + CALLS[key] + '”' : '')
    var pc = (f * 100).toFixed(2) + '%'
    knob.style.left = pc; fillEl.style.width = pc
    knob.setAttribute('aria-valuenow', (f * KM).toFixed(1))
    knob.setAttribute('aria-valuetext', (f * KM).toFixed(1) + ' km, ' + STOPS[idx].name)
  }

  // ---- Loop ----
  var raf = 0, lastT = 0, visible = false
  function frame(now) {
    raf = 0
    var dt = lastT ? Math.min(0.05, (now - lastT) / 1000) : 1 / 60
    lastT = now
    step(dt); render(); ui()
    if (visible) raf = requestAnimationFrame(frame)
    else lastT = 0
  }
  function kick() {
    if (reduce) { step(0); render(); ui(); return }
    if (!raf && visible) { lastT = 0; raf = requestAnimationFrame(frame) }
  }
  function goto(ns) {
    ns = clamp(ns, 0, L)
    if (reduce) { var prev = s; s = ns; passes(prev, s, true); lat = latT = steering ? clamp(latT, -wid(s) / 2 + 1.7, wid(s) / 2 - 1.7) : autoLat(s); camX = cen(s + (ch * 0.5 - y0) / S * 0.7); kick(); return }
    sGoal = ns; kick()
  }
  // Joel, 2026-11-14: no dragging, steering or buttons. The run follows the page scroll:
  // down floats downstream, up paddles back to the put-in. The guide steers the lines.
  function scrollRun() {
    var r = stage.getBoundingClientRect(), vh = window.innerHeight, ns = clamp((vh * 0.75 - r.top) / (r.height + vh * 0.5), 0, 1) * L
    if (r.bottom > 0 && r.top < vh) return goto(ns)
    // off screen (measured now; the observer reports a frame late): jump straight there, so scrolling back up always finds the raft at the put-in
    s = ns; sGoal = null; lat = latT = autoLat(s); latV = 0; camX = cen(s + (ch * 0.5 - y0) / S * 0.7); ui()
  }
  window.addEventListener('scroll', scrollRun, { passive: true })
  window.addEventListener('resize', scrollRun)

  var SLOTS = {
    morning: { sun: -1, light: 'Morning light: crisp air and calmer canyon water.', book: 'Book the Morning Run · €30' },
    afternoon: { sun: 1, light: 'Afternoon sun: warm, turquoise water for the swim stops.', book: 'Book the Afternoon Run · €30' },
    custom: { sun: 0, light: 'Your own time: we fit the start to your group.', book: 'Book a Custom Time · €30' }
  }
  var slotBtns = root.querySelectorAll('[data-slot]')
  function setSlot(v) {
    slot = v; sun = SLOTS[v].sun
    slotBtns.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.slot === v ? 'true' : 'false') })
    elLight.textContent = SLOTS[v].light
    btnBook.dataset.trip = v; btnBook.textContent = SLOTS[v].book
    kick()
  }
  slotBtns.forEach(function (b) { b.addEventListener('click', function () { setSlot(b.dataset.slot) }) })

  // ---- Size and visibility ----
  function resize() {
    var r = stage.getBoundingClientRect()
    cw = Math.max(1, r.width); ch = Math.max(1, r.height)
    dpr = Math.min(2, window.devicePixelRatio || 1)
    cv.width = Math.round(cw * dpr); cv.height = Math.round(ch * dpr)
    S = cw / (cw < 520 ? 46 : 52); y0 = ch * 0.3
    camX = cen(s + (ch * 0.5 - y0) / S * 0.7)
    render(); ui()
  }
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(stage)
  else window.addEventListener('resize', resize)
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) kick() }).observe(stage)
  } else { visible = true }
  setSlot('afternoon')
  resize()
  scrollRun()
  kick()
})()
