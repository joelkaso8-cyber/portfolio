// Kala "See it built": an isometric room that builds itself from your choices. Walls go up, the floor is laid
// board by board, units drop in. Room, size and finish are the same controls as the price guide (kept in sync),
// so the estimate is the guide's own figure; "Send this as a quote" writes the spec into the quote form.
;(function () {
  var root = document.getElementById('rebuild')
  if (!root || root.dataset.ready) return
  root.dataset.ready = '1'
  var $ = function (s) { return root.querySelector(s) }
  var $$ = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)) }
  var NS = 'http://www.w3.org/2000/svg'
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)
  var calc = document.getElementById('calc')

  var FLOORS = { oak: { name: 'oak boards' }, stone: { name: 'stone tiles' }, concrete: { name: 'polished concrete' } }
  var WALLS = { plaster: { name: 'plaster white', c: '#e7e1d7' }, sage: { name: 'sage', c: '#a7b4a0' }, terra: { name: 'terracotta', c: '#cf9a72' } }
  var FINISH = {
    '1': { name: 'standard', unit: '#e9e5dd', unitEdge: '#cfc9bf', top: '#b9b3aa', metal: '#9aa0a4' },
    '1.35': { name: 'premium', unit: '#4c5d54', unitEdge: '#3b4a42', top: '#f1efea', metal: '#c9ccce' },
    '1.8': { name: 'luxury', unit: '#2c3135', unitEdge: '#1f2326', top: '#f5f3ef', metal: '#c9a46a', veins: true },
  }
  var ROOM = { kitchen: 'Kitchen', bath: 'Bathroom', house: 'Whole floor' }
  var st = { room: 'kitchen', size: 12, finish: '1.35', floor: 'oak', walls: 'plaster' }

  function el(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e }
  var svg = el('svg', { viewBox: '0 0 640 480', class: 'rb__svg', role: 'img' })
  var scene = el('g', {}, svg)
  $('#rb-stage').appendChild(svg)

  // ---- Isometric projection (metres → screen) ----
  var C30 = Math.cos(Math.PI / 6), S30 = 0.5, view = { s: 40, ox: 320, oy: 120 }
  function P(x, y, z) { return [view.ox + (x - y) * C30 * view.s, view.oy + ((x + y) * S30 - z) * view.s] }
  function poly(pts) { return pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1) }).join(' ') }
  function shade(col, f) {
    var c = col.charAt(0) === '#' ? [1, 3, 5].map(function (i) { return parseInt(col.substr(i, 2), 16) }) : (col.match(/\d+/g) || [0, 0, 0]).slice(0, 3).map(Number)
    return 'rgb(' + c.map(function (v) { return Math.round(f > 0 ? v + (255 - v) * f : v * (1 + f)) }).join(',') + ')'
  }

  // A box: x,y on the floor plan, z height off the floor; w along x, d along y, h up.
  function box(parent, x, y, z, w, d, h, color, opt) {
    opt = opt || {}
    var g = el('g', {}, parent)
    var t = [P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)]
    var r = [P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)]
    var l = [P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)]
    el('polygon', { points: poly(l), fill: opt.left || shade(color, -0.22) }, g)
    el('polygon', { points: poly(r), fill: opt.right || shade(color, -0.08) }, g)
    el('polygon', { points: poly(t), fill: opt.top || shade(color, 0.08) }, g)
    if (opt.edge) el('polygon', { points: poly(t), fill: 'none', stroke: opt.edge, 'stroke-width': 0.8 }, g)
    return g
  }
  function line(parent, a, b, stroke, w) { return el('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: stroke, 'stroke-width': w || 1, 'stroke-linecap': 'round' }, parent) }

  // ---- Build the room ----
  var drops = []
  function dims() {
    var a = Math.max(4, Math.min(60, st.size)), w = Math.sqrt(a * 1.35), d = a / w
    return { W: Math.max(2.2, w), D: Math.max(1.8, d), H: 2.6 }
  }
  function fit(W, D, H) {
    var pts = [P(0, 0, H), P(W, 0, 0), P(0, D, 0), P(W, D, 0), P(0, 0, 0)]
    view.s = 1; view.ox = 0; view.oy = 0
    pts = [P(0, 0, H), P(W, 0, 0), P(0, D, 0), P(W, D, 0), P(W, 0, H), P(0, D, H)]
    var xs = pts.map(function (p) { return p[0] }), ys = pts.map(function (p) { return p[1] })
    var bw = Math.max.apply(0, xs) - Math.min.apply(0, xs), bh = Math.max.apply(0, ys) - Math.min.apply(0, ys)
    view.s = Math.min(560 / bw, 400 / bh)
    view.ox = 320 - (Math.min.apply(0, xs) + bw / 2) * view.s
    view.oy = 240 - (Math.min.apply(0, ys) + bh / 2) * view.s
  }
  function build(changed) {
    while (scene.firstChild) scene.removeChild(scene.firstChild)
    drops = []
    var d = dims(), W = d.W, D = d.D, H = d.H, F = FINISH[st.finish], wall = WALLS[st.walls].c
    fit(W, D, H)
    // walls (back left at x = 0, back right at y = 0)
    var walls = el('g', { 'data-part': 'walls' }, scene)
    el('polygon', { points: poly([P(0, 0, 0), P(0, D, 0), P(0, D, H), P(0, 0, H)]), fill: shade(wall, -0.12) }, walls)
    el('polygon', { points: poly([P(0, 0, 0), P(W, 0, 0), P(W, 0, H), P(0, 0, H)]), fill: wall }, walls)
    el('polygon', { points: poly([P(0, 0, 0), P(0, D, 0), P(0, D, 0.1), P(0, 0, 0.1)]), fill: shade(wall, -0.35) }, walls)
    el('polygon', { points: poly([P(0, 0, 0), P(W, 0, 0), P(W, 0, 0.1), P(0, 0, 0.1)]), fill: shade(wall, -0.3) }, walls)
    // window on the left wall, with daylight on the floor
    var wy = Math.min(D - 0.4, D * 0.55), ww = Math.min(1.2, D * 0.45)
    el('polygon', { points: poly([P(0, wy - ww / 2, 1), P(0, wy + ww / 2, 1), P(0, wy + ww / 2, 2.2), P(0, wy - ww / 2, 2.2)]), fill: '#bfd3dc', stroke: '#f6f3ee', 'stroke-width': 3 }, walls)
    line(walls, P(0, wy, 1), P(0, wy, 2.2), '#f6f3ee', 2)
    // floor, laid piece by piece
    var floor = el('g', { 'data-part': 'floor' }, scene)
    floorPieces(floor, W, D, changed === 'floor' || !changed)
    var lx1 = Math.min(W - 0.1, 1.6), ly = function (v) { return Math.max(0.05, Math.min(D - 0.05, v)) }
    el('polygon', { points: poly([P(0.15, ly(wy - ww / 2 + 0.4), 0), P(lx1, ly(wy - ww / 2 + 1.1), 0), P(lx1, ly(wy + ww / 2 + 1.1), 0), P(0.15, ly(wy + ww / 2 + 0.4), 0)]), fill: 'rgba(255,248,230,0.14)' }, floor)
    var items = el('g', { 'data-part': 'items' }, scene)
    if (st.room === 'kitchen') kitchen(items, W, D, F)
    else if (st.room === 'bath') bath(items, W, D, F)
    else living(items, W, D, F)
    svg.setAttribute('aria-label', ROOM[st.room] + ' of about ' + st.size + ' square metres, ' + F.name + ' finish, ' + FLOORS[st.floor].name + ' and ' + WALLS[st.walls].name + ' walls')
    if (changed !== 'floor' && changed !== 'walls') animateDrops()
    else drops.forEach(function (g) { g.el.style.opacity = 1 })
    renderPrice()
  }
  function floorPieces(g, W, D, animate) {
    var pieces = []
    if (st.floor === 'oak') {
      var pw = 0.18, cols = ['#b98a5e', '#a87b52', '#c49468', '#b3845a']
      for (var j = 0, y = 0; y < D; j++, y += pw) {
        var off = (j * 0.37) % 1.2
        for (var x = -off; x < W; x += 1.2) { var x0 = Math.max(0, x), x1 = Math.min(W, x + 1.2), y1 = Math.min(D, y + pw); pieces.push({ pts: [P(x0, y, 0), P(x1, y, 0), P(x1, y1, 0), P(x0, y1, 0)], c: cols[(j * 7 + Math.round(x * 3)) % 4], k: x0 + y }) }
      }
    } else if (st.floor === 'stone') {
      var t = 0.6
      for (var a = 0; a < W; a += t) for (var b = 0; b < D; b += t) { var a1 = Math.min(W, a + t), b1 = Math.min(D, b + t); pieces.push({ pts: [P(a, b, 0), P(a1, b, 0), P(a1, b1, 0), P(a, b1, 0)], c: ((a / t + b / t) | 0) % 2 ? '#d8d2c8' : '#cec7bb', k: a + b, stroke: '#a9a197' }) }
    } else {
      pieces.push({ pts: [P(0, 0, 0), P(W, 0, 0), P(W, D, 0), P(0, D, 0)], c: '#a3a19c', k: 0 })
      pieces.push({ pts: [P(W * 0.2, D * 0.1, 0), P(W * 0.7, D * 0.1, 0), P(W * 0.7, D * 0.6, 0), P(W * 0.2, D * 0.6, 0)], c: 'rgba(255,255,255,0.07)', k: 0 })
    }
    pieces.forEach(function (p) {
      var e = el('polygon', { points: poly(p.pts), fill: p.c, stroke: p.stroke || 'rgba(0,0,0,0.12)', 'stroke-width': 0.6 }, g)
      if (animate && !reduce) { e.style.opacity = 0; e.style.transition = 'opacity .35s ease'; setTimeout(function () { e.style.opacity = 1 }, 60 + p.k * 90) }
    })
  }
  function drop(g, delay) { drops.push({ el: g, delay: delay }) }
  function animateDrops() {
    drops.forEach(function (d) {
      if (reduce) return
      d.el.style.opacity = 0; d.el.style.transform = 'translateY(-140px)'; d.el.style.transition = 'none'
    })
    if (reduce) return
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      drops.forEach(function (d) { d.el.style.transition = 'transform .7s cubic-bezier(.3,1.5,.5,1) ' + d.delay + 's, opacity .3s ease ' + d.delay + 's'; d.el.style.opacity = 1; d.el.style.transform = 'translateY(0)' })
    }) })
  }

  function kitchen(g, W, D, F) {
    var run = Math.max(1.8, W - 0.3), n = Math.max(2, Math.round(run / 0.6)), cw = run / n
    for (var i = 0; i < n; i++) {
      var x = 0.15 + i * cw, u = el('g', {}, g)
      box(u, x, 0, 0.1, cw - 0.02, 0.6, 0.78, F.unit)
      line(u, P(x + cw - 0.02, 0.6, 0.45), P(x + cw - 0.02, 0.6, 0.83), 'rgba(0,0,0,.15)')
      var h0 = P(x + cw * 0.7, 0.6, 0.78), h1 = P(x + cw * 0.9, 0.6, 0.78)
      line(u, h0, h1, F.metal, 2)
      drop(u, 0.25 + i * 0.06)
    }
    var top = el('g', {}, g)
    box(top, 0.12, 0, 0.88, run + 0.06, 0.64, 0.05, F.top, { edge: 'rgba(0,0,0,.08)' })
    if (F.veins) for (var v = 0; v < 4; v++) line(top, P(0.4 + v * run / 4, 0.1, 0.93), P(0.8 + v * run / 4, 0.55, 0.93), 'rgba(120,110,100,.35)', 0.8)
    // sink and hob
    var sx = 0.15 + run * 0.35
    el('polygon', { points: poly([P(sx, 0.12, 0.931), P(sx + 0.5, 0.12, 0.931), P(sx + 0.5, 0.48, 0.931), P(sx, 0.48, 0.931)]), fill: shade(F.metal, -0.15) }, top)
    line(top, P(sx + 0.25, 0.05, 0.93), P(sx + 0.25, 0.05, 1.25), F.metal, 3); line(top, P(sx + 0.25, 0.05, 1.25), P(sx + 0.25, 0.25, 1.22), F.metal, 3)
    var hx = 0.15 + run * 0.7
    for (var r = 0; r < 4; r++) { var c = P(hx + (r % 2) * 0.3 + 0.12, 0.14 + (r > 1 ? 0.28 : 0) + 0.06, 0.935); el('ellipse', { cx: c[0], cy: c[1], rx: 0.1 * view.s, ry: 0.05 * view.s, fill: '#2a2d30', stroke: '#4a4e52' }, top) }
    drop(top, 0.25 + n * 0.06)
    // wall units or open shelves
    if (st.finish !== '1.8') {
      for (var k = 0; k < n; k++) { var wu = el('g', {}, g); if (k === Math.floor(n * 0.7)) { box(wu, 0.15 + k * cw, 0, 1.55, cw - 0.02, 0.35, 0.25, F.metal) } else box(wu, 0.15 + k * cw, 0, 1.45, cw - 0.02, 0.35, 0.72, F.unit); drop(wu, 0.55 + k * 0.05) }
    } else {
      for (var s = 0; s < 2; s++) { var sh = el('g', {}, g); box(sh, 0.3, 0, 1.45 + s * 0.45, run * 0.6, 0.28, 0.04, '#b98a5e'); for (var j = 0; j < 4; j++) box(sh, 0.45 + j * 0.35, 0.05, 1.49 + s * 0.45, 0.14, 0.14, 0.2 + (j % 2) * 0.08, ['#e9e5dd', '#9cab95', '#c98a5b', '#f1ede7'][j]); drop(sh, 0.55 + s * 0.1) }
    }
    // island with pendants in bigger rooms
    if (st.size >= 14 && st.finish !== '1') {
      var iw = Math.min(2, W * 0.45), ix = (W - iw) / 2, iy = Math.min(D - 1.1, 1.7)
      var isl = el('g', {}, g); box(isl, ix, iy, 0.1, iw, 0.85, 0.8, F.unit); box(isl, ix - 0.03, iy - 0.03, 0.9, iw + 0.06, 0.91, 0.05, F.top); drop(isl, 0.75)
      for (var q = 0; q < 2; q++) { var pl = el('g', {}, g), px = ix + iw * (0.3 + q * 0.4), py = iy + 0.42; line(pl, P(px, py, 2.6), P(px, py, 1.75), '#2a2d30', 1.2); var pc = P(px, py, 1.7); el('path', { d: 'M' + (pc[0] - 9) + ' ' + pc[1] + ' Q' + pc[0] + ' ' + (pc[1] - 16) + ' ' + (pc[0] + 9) + ' ' + pc[1] + ' Z', fill: F.metal }, pl); el('ellipse', { cx: pc[0], cy: pc[1] + 2, rx: 14, ry: 6, fill: 'rgba(255,230,170,.35)' }, pl); drop(pl, 0.95 + q * 0.1) }
    }
    plant(g, W - 0.35, D - 0.35, 1.1)
  }
  function bath(g, W, D, F) {
    // tiles halfway up the back walls
    var tg = el('g', {}, g), th = 1.2, tile = st.finish === '1' ? 0.15 : 0.3
    for (var x = 0; x < W; x += tile) for (var z = 0.1; z < th; z += tile * (st.finish === '1' ? 0.5 : 1)) el('polygon', { points: poly([P(x, 0.001, z), P(Math.min(W, x + tile), 0.001, z), P(Math.min(W, x + tile), 0.001, Math.min(th, z + tile * (st.finish === '1' ? 0.5 : 1))), P(x, 0.001, Math.min(th, z + tile * (st.finish === '1' ? 0.5 : 1)))]), fill: st.finish === '1.8' ? '#e9e4dc' : '#eef0ee', stroke: 'rgba(0,0,0,.12)', 'stroke-width': 0.5 }, tg)
    drop(tg, 0.2)
    if (st.finish !== '1') {
      var bt = el('g', {}, g), bl = Math.min(1.7, D - 0.3); box(bt, 0.05, 0.05, 0, 0.75, bl, 0.58, '#f4f2ee'); el('polygon', { points: poly([P(0.15, 0.15, 0.581), P(0.7, 0.15, 0.581), P(0.7, bl - 0.05, 0.581), P(0.15, bl - 0.05, 0.581)]), fill: '#cfe0e6' }, bt)
      line(bt, P(0.05, bl * 0.3, 0.58), P(0.05, bl * 0.3, 1.1), F.metal, 3); drop(bt, 0.4)
    } else {
      var sw = el('g', {}, g); box(sw, 0.05, 0.05, 0, 0.9, 0.9, 0.05, '#e8e6e1'); el('polygon', { points: poly([P(0.95, 0.05, 0.05), P(0.95, 0.95, 0.05), P(0.95, 0.95, 2), P(0.95, 0.05, 2)]), fill: 'rgba(190,215,225,.35)', stroke: F.metal }, sw); drop(sw, 0.4)
    }
    var vx = Math.max(1.2, W - 1.3), van = el('g', {}, g)
    box(van, vx, 0.05, 0.25, 0.9, 0.45, 0.45, F.unit); box(van, vx - 0.02, 0.03, 0.7, 0.94, 0.49, 0.04, F.top)
    var bc = P(vx + 0.45, 0.27, 0.745); el('ellipse', { cx: bc[0], cy: bc[1], rx: 0.22 * view.s, ry: 0.11 * view.s, fill: '#fbfaf8', stroke: '#d7d4ce' }, van)
    el('polygon', { points: poly([P(vx + 0.15, 0.002, 1.05), P(vx + 0.75, 0.002, 1.05), P(vx + 0.75, 0.002, 1.75), P(vx + 0.15, 0.002, 1.75)]), fill: '#cfdde3', stroke: F.metal, 'stroke-width': 2 }, van)
    drop(van, 0.55)
    var wc = el('g', {}, g), tx = Math.max(1.2, vx - 0.75); box(wc, tx, 0.05, 0, 0.42, 0.25, 0.75, '#f4f2ee'); box(wc, tx + 0.03, 0.3, 0, 0.36, 0.42, 0.4, '#f4f2ee'); drop(wc, 0.7)
    plant(g, W - 0.3, D - 0.3, 0.8)
  }
  function living(g, W, D, F) {
    var rug = el('g', {}, g); el('polygon', { points: poly([P(0.9, 0.9, 0.01), P(W - 0.6, 0.9, 0.01), P(W - 0.6, D - 0.5, 0.01), P(0.9, D - 0.5, 0.01)]), fill: st.walls === 'terra' ? '#e7dccb' : '#c98a5b', opacity: 0.85 }, rug); drop(rug, 0.2)
    var sofa = el('g', {}, g), sl = Math.min(2.4, D - 0.4), col = F.name === 'luxury' ? '#7a5a44' : F.name === 'premium' ? '#5c6b62' : '#8d8a84'
    box(sofa, 0.1, 0.2, 0.15, 0.85, sl, 0.3, col); box(sofa, 0.1, 0.2, 0.45, 0.25, sl, 0.45, shade(col, -0.1)); box(sofa, 0.1, 0.2, 0.45, 0.85, 0.2, 0.2, shade(col, -0.05)); box(sofa, 0.1, sl, 0.45, 0.85, 0.2, 0.2, shade(col, -0.05)); drop(sofa, 0.35)
    var tb = el('g', {}, g); box(tb, 1.4, sl * 0.45, 0.35, 0.7, 0.5, 0.05, '#b98a5e'); box(tb, 1.45, sl * 0.45 + 0.05, 0, 0.6, 0.4, 0.35, shade('#b98a5e', -0.25)); drop(tb, 0.5)
    var shelf = el('g', {}, g); box(shelf, Math.max(1.5, W - 1.9), 0, 0, 1.6, 0.35, 1.9, F.unit)
    for (var s = 0; s < 3; s++) for (var b = 0; b < 4; b++) box(shelf, Math.max(1.5, W - 1.9) + 0.15 + b * 0.35, 0.05, 0.3 + s * 0.55, 0.12, 0.25, 0.32, ['#c98a5b', '#9cab95', '#e9e5dd', '#3a4045'][(s + b) % 4])
    drop(shelf, 0.6)
    var lamp = el('g', {}, g), lx = W - 0.4, ly = D - 0.9; line(lamp, P(lx, ly, 0), P(lx, ly, 1.5), '#2a2d30', 2); var lc = P(lx, ly, 1.55); el('path', { d: 'M' + (lc[0] - 10) + ' ' + (lc[1] + 6) + ' L' + (lc[0] - 6) + ' ' + (lc[1] - 8) + ' L' + (lc[0] + 6) + ' ' + (lc[1] - 8) + ' L' + (lc[0] + 10) + ' ' + (lc[1] + 6) + ' Z', fill: F.metal }, lamp); drop(lamp, 0.75)
    plant(g, 0.35, D - 0.35, 1.2)
  }
  function plant(g, x, y, h) {
    var p = el('g', {}, g); box(p, x - 0.15, y - 0.15, 0, 0.3, 0.3, 0.3, '#c98a5b')
    var c = P(x, y, 0.3 + h * 0.5)
    ;[[-14, -10, 22], [12, -16, 20], [0, -26, 18], [-6, 4, 16], [14, 2, 15]].forEach(function (l) { el('ellipse', { cx: c[0] + l[0] * h, cy: c[1] + l[1] * h, rx: l[2] * h, ry: l[2] * h * 0.55, fill: '#7f9a78', opacity: 0.92 }, p) })
    drop(p, 0.9)
  }

  // ---- Sync with the price guide ----
  function fromCalc() {
    if (!calc) return
    st.room = (calc.querySelector('input[name="room"]:checked') || {}).value || st.room
    st.size = Number(calc.elements.size.value) || st.size
    st.finish = (calc.querySelector('input[name="finish"]:checked') || {}).value || st.finish
  }
  function toCalc() {
    if (!calc) return
    var r = calc.querySelector('input[name="room"][value="' + st.room + '"]'); if (r) r.checked = true
    var f = calc.querySelector('input[name="finish"][value="' + st.finish + '"]'); if (f) f.checked = true
    calc.elements.size.value = st.size
    calc.dispatchEvent(new Event('input', { bubbles: true }))
  }
  function renderPrice() {
    var out = document.getElementById('calc-out'), wk = document.getElementById('calc-weeks')
    $('#rb-price').textContent = out ? out.textContent : ''
    $('#rb-weeks').textContent = wk ? wk.textContent : ''
    $('#rb-size-out').textContent = st.size + ' m²'
    $('#rb-spec').textContent = ROOM[st.room] + ', ' + st.size + ' m², ' + FINISH[st.finish].name + ' finish, ' + FLOORS[st.floor].name + ', ' + WALLS[st.walls].name + ' walls'
    ;['room', 'finish', 'floor', 'walls'].forEach(function (k) { $$('[data-' + k + ']').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-' + k) === String(st[k]))) }) })
  }
  ;['room', 'finish', 'floor', 'walls'].forEach(function (k) {
    $$('[data-' + k + ']').forEach(function (b) { b.addEventListener('click', function () { st[k] = b.getAttribute('data-' + k); if (k === 'room' || k === 'finish') toCalc(); build(k) }) })
  })
  var sizeIn = $('#rb-size'), sizeT = 0
  sizeIn.addEventListener('input', function () { st.size = Number(sizeIn.value); toCalc(); clearTimeout(sizeT); sizeT = setTimeout(function () { build('size') }, 60) })
  if (calc) calc.addEventListener('input', function (e) { if (!e.isTrusted) return; fromCalc(); sizeIn.value = st.size; build('calc') })
  $('#rb-rebuild').addEventListener('click', function () { build() })
  $('#rb-quote').addEventListener('click', function () {
    var form = document.getElementById('quote-form'); if (!form) return
    form.elements.msg.value = 'From the room builder: ' + $('#rb-spec').textContent + '. Price guide: ' + $('#rb-price').textContent + '.'
    var q = document.getElementById('quote'); if (q) q.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
    setTimeout(function () { form.elements.name.focus({ preventScroll: true }) }, reduce ? 0 : 600)
  })

  fromCalc(); sizeIn.value = st.size
  // build the first time it comes into view, so the drop-in is seen
  if ('IntersectionObserver' in window) {
    var once = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { once.disconnect(); build() } }, { threshold: 0.35 })
    once.observe(svg); build('walls')
  } else build()
  root.classList.add('is-ready')
})()
