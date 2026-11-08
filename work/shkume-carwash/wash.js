// Shkumë "Wash it yourself": a dirty car you clean by dragging foam, rinse, wax, tire shine and glass treatment over it.
// Each step ticks off the same features as the wash menu, so you end up knowing which wash you just did.
// Loaded by main.js when #diy scrolls near. No libraries.
;(function () {
  var root = document.getElementById('diy')
  if (!root || root.dataset.ready) return
  root.dataset.ready = '1'
  var $ = function (s) { return root.querySelector(s) }
  var $$ = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)) }
  var stage = $('#dw-stage'), canvas = $('#dw-canvas'), ctx = canvas.getContext('2d')
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)

  var W = 800, H = 420, GROUND = 352, RS = 1.5, CELL = 10, GW = W / CELL, GH = Math.ceil(H / CELL), R = 34
  var COL = { paint: '#35546a', paintHi: '#7697b0', paintLo: '#16232d', accent: '#8db8d6', wax: '#d8b85a' }
  var FEATURES = ['Pre-soak and soft-cloth wash', 'Spot-free rinse and power dry', 'Underbody salt flush', 'Triple foam polish', 'Hot carnauba wax', 'Tire shine', 'Rain repellent on glass']
  var WASHES = [{ name: 'Express', price: 12, has: 2 }, { name: 'Deluxe', price: 18, has: 4 }, { name: 'Ultimate', price: 25, has: 7 }]
  var SIZE = { car: { add: 0, name: 'car' }, suv: { add: 3, name: 'SUV' }, truck: { add: 5, name: 'truck or van' } }
  var TOOLS = {
    foam: { label: 'Triple foam', color: '#e9f4fb' },
    rinse: { label: 'Rinse', color: '#8db8d6' },
    wax: { label: 'Hot wax', color: '#d8b85a' },
    tires: { label: 'Tire shine', color: '#9aa7ae' },
    glass: { label: 'Rain repellent', color: '#b9e3f2' },
  }

  var size = 'car', tool = 'foam', shape = null, cells = null
  var dirtC = document.createElement('canvas'), foamC = document.createElement('canvas'), shineC = document.createElement('canvas'), sheenC = document.createElement('canvas')
  ;[dirtC, foamC, shineC, sheenC].forEach(function (c) { c.width = W * RS; c.height = H * RS })
  var dctx = dirtC.getContext('2d'), fctx = foamC.getContext('2d'), sctx = shineC.getContext('2d'), hctx = sheenC.getContext('2d')
  var drops = [], spray = [], sparks = [], beads = []
  var ptr = { down: false, x: 0, y: 0, lx: 0, ly: 0, over: false, id: -1 }
  var view = { w: 0, h: 0, k: 1, ox: 0, oy: 0, dpr: 1 }
  var auto = null, running = false, raf = 0, last = 0, clock = 0, statsDue = 0, done = []

  // ---- Seeded random, so the dirt looks the same every time ----
  var seed = 7
  function rnd() { seed = (seed + 0x6D2B79F5) | 0; var t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }

  // ---- Vehicle shapes (side view, facing right) ----
  function arch(p, cx, cy, r, by) { var a = Math.asin((by - cy) / r); p.lineTo(cx + r * Math.cos(a), by); p.arc(cx, cy, r, a, -Math.PI - a, true) }
  function build(kind) {
    var b = new Path2D(), g = new Path2D(), s
    if (kind === 'suv') {
      s = { wheels: [{ x: 214, y: 306 }, { x: 588, y: 306 }], pillars: [[326, 338]], head: [712, 212], tail: [98, 214], crease: 236, mirror: [548, 178] }
      b.moveTo(96, 300); b.lineTo(92, 246); b.quadraticCurveTo(92, 204, 118, 192); b.lineTo(160, 124); b.quadraticCurveTo(170, 106, 196, 104); b.lineTo(468, 101)
      b.quadraticCurveTo(496, 102, 514, 118); b.lineTo(584, 176); b.lineTo(686, 190); b.quadraticCurveTo(720, 196, 726, 220); b.lineTo(729, 272); b.quadraticCurveTo(729, 300, 704, 300)
      arch(b, 588, 306, 57, 300); arch(b, 214, 306, 57, 300); b.lineTo(120, 300); b.closePath()
      g.moveTo(178, 176); g.lineTo(206, 124); g.quadraticCurveTo(212, 116, 224, 115); g.lineTo(462, 113); g.quadraticCurveTo(482, 114, 496, 127); g.lineTo(552, 178); g.closePath()
    } else if (kind === 'truck') {
      s = { wheels: [{ x: 200, y: 306 }, { x: 606, y: 306 }], pillars: [[420, 432]], head: [714, 216], tail: [84, 214], crease: 240, mirror: [538, 180], bed: true }
      b.moveTo(80, 300); b.lineTo(78, 206); b.quadraticCurveTo(78, 198, 86, 198); b.lineTo(300, 198); b.lineTo(304, 124); b.quadraticCurveTo(306, 108, 324, 107); b.lineTo(470, 105)
      b.quadraticCurveTo(492, 106, 506, 121); b.lineTo(560, 182); b.lineTo(690, 192); b.quadraticCurveTo(724, 198, 728, 224); b.lineTo(730, 272); b.quadraticCurveTo(730, 300, 706, 300)
      arch(b, 606, 306, 58, 300); arch(b, 200, 306, 58, 300); b.lineTo(106, 300); b.closePath()
      g.moveTo(320, 180); g.lineTo(322, 128); g.quadraticCurveTo(324, 120, 334, 120); g.lineTo(466, 119); g.quadraticCurveTo(482, 120, 492, 132); g.lineTo(536, 180); g.closePath()
    } else {
      s = { wheels: [{ x: 222, y: 306 }, { x: 592, y: 306 }], pillars: [[384, 396]], head: [712, 238], tail: [94, 246], crease: 252, mirror: [538, 206] }
      b.moveTo(92, 300); b.lineTo(88, 264); b.quadraticCurveTo(88, 240, 112, 234); b.lineTo(182, 220); b.quadraticCurveTo(204, 216, 222, 198); b.lineTo(272, 152)
      b.quadraticCurveTo(286, 140, 308, 139); b.lineTo(470, 137); b.quadraticCurveTo(492, 138, 508, 152); b.lineTo(566, 204); b.quadraticCurveTo(580, 214, 606, 216)
      b.lineTo(692, 224); b.quadraticCurveTo(720, 228, 725, 250); b.lineTo(728, 282); b.quadraticCurveTo(728, 300, 706, 300)
      arch(b, 592, 306, 57, 300); arch(b, 222, 306, 57, 300); b.lineTo(118, 300); b.closePath()
      g.moveTo(236, 206); g.lineTo(282, 160); g.quadraticCurveTo(292, 152, 306, 152); g.lineTo(466, 150); g.quadraticCurveTo(482, 151, 494, 162); g.lineTo(544, 208); g.closePath()
    }
    s.body = b; s.glass = g
    s.all = new Path2D(); s.all.addPath(b); s.all.addPath(g)
    return s
  }

  // ---- Grid of cells: what is dirty, foamed, waxed... ----
  function classify() {
    var t = document.createElement('canvas').getContext('2d')
    cells = []
    for (var j = 0; j < GH; j++) for (var i = 0; i < GW; i++) {
      var x = i * CELL + CELL / 2, y = j * CELL + CELL / 2
      var glass = t.isPointInPath(shape.glass, x, y), body = !glass && t.isPointInPath(shape.body, x, y)
      var tire = -1
      shape.wheels.forEach(function (w, k) { if (Math.hypot(x - w.x, y - w.y) < 46) tire = k })
      if (!glass && !body && tire < 0) continue
      cells.push({ x: x, y: y, body: body, glass: glass, tire: tire, rocker: body && y > 266, dirt: tire < 0 ? 1 : 0, foam: 0, foamed: 0, wax: 0, rx: 0, tireT: 0 })
    }
  }
  function each(x, y, r, fn) {
    for (var n = 0; n < cells.length; n++) { var c = cells[n]; var d = Math.hypot(c.x - x, c.y - y); if (d < r) fn(c, 1 - d / r) }
  }

  // ---- Dirt: Michigan road salt and spray from the wheels ----
  function paintDirt() {
    seed = 7
    dctx.setTransform(RS, 0, 0, RS, 0, 0)
    dctx.globalCompositeOperation = 'source-over'
    dctx.clearRect(0, 0, W, H)
    dctx.save(); dctx.clip(shape.all)
    var g = dctx.createLinearGradient(0, 100, 0, 300)
    g.addColorStop(0, 'rgba(150,134,110,0.42)'); g.addColorStop(0.6, 'rgba(118,98,74,0.62)'); g.addColorStop(1, 'rgba(92,74,54,0.85)')
    dctx.fillStyle = g; dctx.fillRect(0, 0, W, H)
    for (var i = 0; i < 1400; i++) {
      var x = 70 + rnd() * 680, y = 95 + rnd() * 215, r = 0.6 + rnd() * 2.6 * (y / 300)
      dctx.fillStyle = rnd() < 0.7 ? 'rgba(84,66,46,' + (0.25 + rnd() * 0.5).toFixed(2) + ')' : 'rgba(210,205,190,' + (0.15 + rnd() * 0.35).toFixed(2) + ')'
      dctx.beginPath(); dctx.arc(x, y, r, 0, Math.PI * 2); dctx.fill()
    }
    // spray thrown up behind the wheels
    shape.wheels.forEach(function (w) {
      for (var k = 0; k < 46; k++) {
        var a = -Math.PI * (0.55 + rnd() * 0.4), len = 40 + rnd() * 80, x0 = w.x - 20 + rnd() * 10, y0 = w.y - 30
        dctx.strokeStyle = 'rgba(78,60,40,' + (0.15 + rnd() * 0.35).toFixed(2) + ')'; dctx.lineWidth = 1 + rnd() * 2.5
        dctx.beginPath(); dctx.moveTo(x0, y0); dctx.quadraticCurveTo(x0 - len * 0.6, y0 - len * 0.2, x0 + Math.cos(a) * len, y0 + Math.sin(a) * len * 0.6); dctx.stroke()
      }
    })
    // road-salt crust along the bottom
    for (var j = 0; j < 500; j++) {
      var sx = 80 + rnd() * 660, sy = 262 + rnd() * 40
      dctx.fillStyle = 'rgba(226,222,208,' + (0.2 + rnd() * 0.45).toFixed(2) + ')'
      dctx.beginPath(); dctx.arc(sx, sy, 0.6 + rnd() * 2.2, 0, Math.PI * 2); dctx.fill()
    }
    // grime on the glass
    dctx.fillStyle = 'rgba(160,150,128,0.5)'; dctx.fill(shape.glass)
    dctx.restore()
    // somebody wrote in it
    dctx.save(); dctx.globalCompositeOperation = 'destination-out'
    dctx.translate((shape.pillars[0][0] + shape.wheels[1].x) / 2 - 10, shape.crease + 22); dctx.rotate(-0.06)
    dctx.font = '700 30px "DM Sans", system-ui, sans-serif'; dctx.textAlign = 'center'; dctx.fillStyle = 'rgba(0,0,0,0.75)'
    dctx.fillText('WASH ME', 0, 0); dctx.restore()
    fctx.setTransform(1, 0, 0, 1, 0, 0); fctx.clearRect(0, 0, foamC.width, foamC.height)
    sctx.setTransform(1, 0, 0, 1, 0, 0); sctx.clearRect(0, 0, shineC.width, shineC.height)
    // beads for the treated glass
    beads = []
    for (var b = 0; b < 70; b++) beads.push({ x: 160 + rnd() * 420, y: 105 + rnd() * 110, r: 1.2 + rnd() * 2.6, v: 8 + rnd() * 18 })
  }

  // ---- Tools ----
  function stamp(kind, x, y) {
    if (kind === 'foam') {
      fctx.setTransform(RS, 0, 0, RS, 0, 0); fctx.save(); fctx.clip(shape.all)
      for (var i = 0; i < 4; i++) {
        var a = Math.random() * Math.PI * 2, d = Math.random() * R * 0.85, bx = x + Math.cos(a) * d, by = y + Math.sin(a) * d, br = 7 + Math.random() * 13
        var tint = ['255,255,255', '226,240,250', '247,219,233', '247,236,196'][Math.random() < 0.55 ? 0 : 1 + Math.floor(Math.random() * 3)]
        var gr = fctx.createRadialGradient(bx - br * 0.3, by - br * 0.3, 1, bx, by, br)
        gr.addColorStop(0, 'rgba(' + tint + ',0.95)'); gr.addColorStop(0.7, 'rgba(' + tint + ',0.75)'); gr.addColorStop(1, 'rgba(' + tint + ',0)')
        fctx.fillStyle = gr; fctx.beginPath(); fctx.arc(bx, by, br, 0, Math.PI * 2); fctx.fill()
      }
      fctx.restore()
      each(x, y, R, function (c) { if (c.tire < 0) { c.foam = Math.min(1, c.foam + 0.35); c.foamed = Math.max(c.foamed, c.foam) } })
    } else if (kind === 'rinse') {
      // dirt comes off fast where foam loosened it, slowly where it did not
      dctx.setTransform(1, 0, 0, 1, 0, 0); dctx.save(); dctx.globalCompositeOperation = 'destination-out'
      dctx.beginPath(); dctx.arc(x * RS, y * RS, R * RS, 0, Math.PI * 2); dctx.clip()
      dctx.globalAlpha = 0.22; dctx.drawImage(foamC, 0, 0)
      dctx.globalAlpha = 0.035; dctx.fillStyle = '#000'; dctx.fillRect(0, 0, dirtC.width, dirtC.height)
      dctx.restore()
      fctx.setTransform(1, 0, 0, 1, 0, 0); fctx.save(); fctx.globalCompositeOperation = 'destination-out'; fctx.globalAlpha = 0.28
      fctx.beginPath(); fctx.arc(x * RS, y * RS, R * RS, 0, Math.PI * 2); fctx.fill(); fctx.restore()
      each(x, y, R, function (c) {
        if (c.tire >= 0) return
        c.dirt = Math.max(0, c.dirt - 0.22 * c.foam - 0.035); c.foam = Math.max(0, c.foam - 0.28)
        if (c.rocker && c.dirt < 0.25) c.rx = 1
        // once a spot is clean, take the last film of dirt off too (no ghost marks left behind)
        if (c.dirt < 0.08 && !c.wiped) { c.wiped = true; dctx.setTransform(1, 0, 0, 1, 0, 0); dctx.clearRect((c.x - CELL / 2 - 1) * RS, (c.y - CELL / 2 - 1) * RS, (CELL + 2) * RS, (CELL + 2) * RS) }
      })
      if (!reduce) for (var k = 0; k < 2; k++) drops.push({ x: x + (Math.random() - 0.5) * R * 1.4, y: y + (Math.random() - 0.5) * R, vy: 20 + Math.random() * 40, t: 0, life: 0.9 + Math.random() * 0.8 })
      spray.push({ x: x, y: y, t: 0 })
    } else if (kind === 'wax') {
      sctx.setTransform(RS, 0, 0, RS, 0, 0); sctx.save(); sctx.clip(shape.body)
      sctx.globalAlpha = 0.2; sctx.fillStyle = '#fff'; sctx.beginPath(); sctx.arc(x, y, R, 0, Math.PI * 2); sctx.fill(); sctx.restore()
      each(x, y, R, function (c) { if (c.body && c.dirt < 0.3) c.wax = Math.min(1, c.wax + 0.2) })
      if (!reduce && Math.random() < 0.5) sparks.push({ x: x + (Math.random() - 0.5) * R * 1.6, y: y + (Math.random() - 0.5) * R * 1.4, t: 0 })
    } else if (kind === 'tires') {
      each(x, y, R + 6, function (c) { if (c.tire >= 0) c.tireT = Math.min(1, c.tireT + 0.12) })
    } else if (kind === 'glass') {
      each(x, y, R, function (c) { if (c.glass && c.dirt < 0.35) c.rx = Math.min(1, c.rx + 0.2) })
    }
    statsDue = 1
  }
  function strokeTo(kind, x, y) {
    var dx = x - ptr.lx, dy = y - ptr.ly, n = Math.max(1, Math.ceil(Math.hypot(dx, dy) / 7))
    for (var i = 1; i <= n; i++) stamp(kind, ptr.lx + dx * i / n, ptr.ly + dy * i / n)
    ptr.lx = x; ptr.ly = y
  }

  // ---- What the wash adds up to ----
  function measure() {
    var body = 0, dirt = 0, foamed = 0, rock = 0, rockC = 0, wax = 0, glass = 0, glassR = 0, tires = [0, 0], tireN = [0, 0]
    cells.forEach(function (c) {
      if (c.tire >= 0) { tires[c.tire] += c.tireT; tireN[c.tire]++; return }
      dirt += c.dirt; body++
      if (c.body) { foamed += c.foamed >= 0.5 ? 1 : 0; wax += c.wax >= 0.6 ? 1 : 0; if (c.rocker) { rock++; rockC += c.rx } }
      if (c.glass) { glass++; glassR += c.rx >= 0.6 ? 1 : 0 }
    })
    var bodyN = cells.filter(function (c) { return c.body }).length
    var clean = 1 - dirt / body, f = foamed / bodyN
    var tireAvg = Math.min(tires[0] / tireN[0], tires[1] / tireN[1])
    return [f >= 0.45, clean >= 0.85, rockC / rock >= 0.85, f >= 0.8, wax / bodyN >= 0.7, tireAvg >= 0.7, glassR / glass >= 0.7]
  }
  function renderResult() {
    done = measure()
    $$('#dw-list li').forEach(function (li, i) { li.classList.toggle('is-done', !!done[i]) })
    var lvl = -1
    WASHES.forEach(function (w, i) { var ok = true; for (var k = 0; k < w.has; k++) if (!done[k]) ok = false; if (ok) lvl = i })
    var out = $('#dw-verdict'), btn = $('#dw-choose')
    if (lvl < 0) {
      out.textContent = done[0] ? 'Now rinse it all off, top to bottom.' : 'Start with the triple foam: drag it over the whole car.'
      btn.hidden = true
    } else {
      var w = WASHES[lvl], price = w.price + SIZE[size].add
      out.textContent = 'You just did our ' + w.name + ': $' + price + ' for a ' + SIZE[size].name + '.' + (lvl < 2 ? ' Keep going for the ' + WASHES[lvl + 1].name + '.' : ' The full works.')
      btn.hidden = false; btn.textContent = 'Choose the ' + w.name; btn.dataset.lvl = lvl
    }
  }

  // ---- Drawing ----
  function drawTunnel() {
    var g = ctx.createLinearGradient(0, 0, 0, H)
    g.addColorStop(0, '#0b1116'); g.addColorStop(0.75, '#121b21'); g.addColorStop(1, '#0a0f12')
    ctx.fillStyle = g; ctx.fillRect(-1000, -1000, W + 2000, H + 2000)
    for (var i = -2; i < 9; i++) { // ceiling lights
      var x = i * 110 + 40
      ctx.fillStyle = 'rgba(141,184,214,0.5)'; ctx.fillRect(x, 26, 60, 3)
      var lg = ctx.createRadialGradient(x + 30, 28, 2, x + 30, 28, 80); lg.addColorStop(0, 'rgba(141,184,214,0.16)'); lg.addColorStop(1, 'rgba(141,184,214,0)')
      ctx.fillStyle = lg; ctx.fillRect(x - 60, 0, 180, 120)
    }
    var fl = ctx.createLinearGradient(0, GROUND, 0, GROUND + 120)
    fl.addColorStop(0, '#16222a'); fl.addColorStop(1, '#0a0f12')
    ctx.fillStyle = fl; ctx.fillRect(-1000, GROUND, W + 2000, 1000)
    ctx.fillStyle = 'rgba(141,184,214,0.18)'; ctx.fillRect(-1000, GROUND, W + 2000, 2)
    // a soft reflection of the car on the wet floor, fading out
    ctx.save(); ctx.beginPath(); ctx.rect(-1000, GROUND, W + 2000, 90); ctx.clip()
    ctx.translate(0, GROUND * 2); ctx.scale(1, -1); ctx.globalAlpha = 0.06
    ctx.fillStyle = COL.paintHi; ctx.fill(shape.body); ctx.restore()
    var sh = ctx.createRadialGradient(410, GROUND, 10, 410, GROUND, 330)
    sh.addColorStop(0, 'rgba(0,0,0,0.6)'); sh.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = sh; ctx.beginPath(); ctx.ellipse(410, GROUND, 340, 16, 0, 0, Math.PI * 2); ctx.fill()
  }
  function drawCar(now) {
    // paint
    var g = ctx.createLinearGradient(0, 100, 0, 300)
    g.addColorStop(0, COL.paintHi); g.addColorStop(0.35, COL.paint); g.addColorStop(0.7, '#2b4558'); g.addColorStop(1, COL.paintLo)
    ctx.fillStyle = g; ctx.fill(shape.body)
    // character line and a long reflection
    ctx.save(); ctx.clip(shape.body)
    ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(100, shape.crease); ctx.lineTo(724, shape.crease - 6); ctx.stroke()
    var rf = ctx.createLinearGradient(0, shape.crease - 30, 0, shape.crease)
    rf.addColorStop(0, 'rgba(255,255,255,0)'); rf.addColorStop(1, 'rgba(255,255,255,0.1)')
    ctx.fillStyle = rf; ctx.fillRect(0, shape.crease - 30, W, 30)
    // door seams and handles
    ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 1.5
    shape.pillars.forEach(function (p) { var x = (p[0] + p[1]) / 2; ctx.beginPath(); ctx.moveTo(x, 150); ctx.lineTo(x + 4, 292); ctx.stroke(); ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(x + 22, shape.crease - 2, 26, 5); ctx.fillRect(x - 70, shape.crease - 2, 26, 5) })
    if (shape.bed) { ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.beginPath(); ctx.moveTo(86, 210); ctx.lineTo(298, 210); ctx.moveTo(300, 200); ctx.lineTo(302, 292); ctx.stroke() }
    ctx.restore()
    // glass
    var gl = ctx.createLinearGradient(0, 100, 0, 210)
    gl.addColorStop(0, '#2c3d48'); gl.addColorStop(1, '#0d1419')
    ctx.fillStyle = gl; ctx.fill(shape.glass)
    ctx.save(); ctx.clip(shape.glass)
    ctx.fillStyle = 'rgba(169,203,227,0.12)'; ctx.beginPath(); ctx.moveTo(240, 100); ctx.lineTo(300, 100); ctx.lineTo(220, 230); ctx.lineTo(160, 230); ctx.fill()
    ctx.beginPath(); ctx.moveTo(330, 100); ctx.lineTo(350, 100); ctx.lineTo(270, 230); ctx.lineTo(250, 230); ctx.fill()
    // treated glass: water beads that run off
    beads.forEach(function (b) {
      var c = cellAt(b.x, b.y); if (!c || c.rx < 0.5) return
      ctx.fillStyle = 'rgba(10,18,24,0.5)'; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = 'rgba(220,240,250,0.85)'; ctx.beginPath(); ctx.arc(b.x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.35, 0, Math.PI * 2); ctx.fill()
    })
    ctx.restore()
    ctx.fillStyle = COL.paint; shape.pillars.forEach(function (p) { ctx.save(); ctx.clip(shape.glass); ctx.fillRect(p[0], 90, p[1] - p[0], 140); ctx.restore() })
    // mirror, lights
    ctx.fillStyle = COL.paintLo; ctx.beginPath(); ctx.ellipse(shape.mirror[0], shape.mirror[1], 13, 8, -0.3, 0, Math.PI * 2); ctx.fill()
    var hl = ctx.createRadialGradient(shape.head[0], shape.head[1], 1, shape.head[0], shape.head[1], 16); hl.addColorStop(0, '#fffbe8'); hl.addColorStop(1, 'rgba(255,240,200,0.2)')
    ctx.fillStyle = hl; ctx.beginPath(); ctx.ellipse(shape.head[0], shape.head[1], 14, 7, -0.1, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#c8553d'; ctx.beginPath(); ctx.ellipse(shape.tail[0], shape.tail[1], 6, 12, 0, 0, Math.PI * 2); ctx.fill()
    // wheels
    shape.wheels.forEach(function (w, i) {
      var tt = tireState(i)
      ctx.fillStyle = mix([74, 71, 66], [16, 18, 20], tt); ctx.beginPath(); ctx.arc(w.x, w.y, 46, 0, Math.PI * 2); ctx.fill()
      if (tt > 0.05) { ctx.strokeStyle = 'rgba(255,255,255,' + (0.35 * tt).toFixed(3) + ')'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(w.x, w.y, 40, Math.PI * 1.1, Math.PI * 1.55); ctx.stroke() }
      var rg = ctx.createRadialGradient(w.x - 8, w.y - 8, 2, w.x, w.y, 29); rg.addColorStop(0, '#d9e1e6'); rg.addColorStop(1, '#6d7a83')
      ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(w.x, w.y, 28, 0, Math.PI * 2); ctx.fill()
      ctx.strokeStyle = 'rgba(30,38,44,0.7)'; ctx.lineWidth = 3
      for (var k = 0; k < 5; k++) { var a = k * Math.PI * 2 / 5 + 0.3; ctx.beginPath(); ctx.moveTo(w.x + Math.cos(a) * 8, w.y + Math.sin(a) * 8); ctx.lineTo(w.x + Math.cos(a) * 26, w.y + Math.sin(a) * 26); ctx.stroke() }
      ctx.fillStyle = '#2a343b'; ctx.beginPath(); ctx.arc(w.x, w.y, 6, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = 'rgba(120,100,76,' + (0.4 * (1 - tt)).toFixed(3) + ')'; ctx.beginPath(); ctx.arc(w.x, w.y, 29, 0, Math.PI * 2); ctx.fill()
    })
    // wax sheen sweeping across the waxed paint
    hctx.setTransform(1, 0, 0, 1, 0, 0); hctx.globalCompositeOperation = 'source-over'; hctx.clearRect(0, 0, sheenC.width, sheenC.height)
    hctx.drawImage(shineC, 0, 0); hctx.globalCompositeOperation = 'source-in'
    var sx = ((now / 1000) * 260) % (W + 500) - 250
    var sg = hctx.createLinearGradient((sx - 120) * RS, 0, (sx + 120) * RS, 0)
    sg.addColorStop(0, 'rgba(255,246,214,0)'); sg.addColorStop(0.5, 'rgba(255,246,214,0.3)'); sg.addColorStop(1, 'rgba(255,246,214,0)')
    hctx.fillStyle = sg; hctx.fillRect(0, 0, sheenC.width, sheenC.height)
    // waxed paint gets deeper and glossier, not lighter
    ctx.save(); ctx.globalAlpha = 0.18; ctx.globalCompositeOperation = 'multiply'; ctx.drawImage(shineC, 0, 0, W, H)
    ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.05; ctx.drawImage(shineC, 0, 0, W, H)
    ctx.globalAlpha = 1; ctx.drawImage(sheenC, 0, 0, W, H); ctx.restore()
    // dirt and foam on top
    ctx.drawImage(dirtC, 0, 0, W, H)
    ctx.drawImage(foamC, 0, 0, W, H)
  }
  function cellAt(x, y) { var i = Math.floor(x / CELL), j = Math.floor(y / CELL); return cellIndex[j * GW + i] }
  var cellIndex = {}
  function indexCells() { cellIndex = {}; cells.forEach(function (c) { cellIndex[Math.floor(c.y / CELL) * GW + Math.floor(c.x / CELL)] = c }) }
  function tireState(i) { var s = 0, n = 0; cells.forEach(function (c) { if (c.tire === i) { s += c.tireT; n++ } }); return n ? s / n : 0 }
  function mix(a, b, t) { return 'rgb(' + a.map(function (v, i) { return Math.round(v + (b[i] - v) * t) }).join(',') + ')' }
  function drawFx(dt, now) {
    ctx.save(); ctx.clip(shape.all)
    drops.forEach(function (d) { ctx.strokeStyle = 'rgba(220,240,250,' + (0.55 * (1 - d.t / d.life)).toFixed(3) + ')'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(d.x, d.y - 9); ctx.lineTo(d.x, d.y); ctx.stroke() })
    ctx.restore()
    spray.forEach(function (s) {
      var a = 1 - s.t / 0.25
      ctx.strokeStyle = 'rgba(200,230,248,' + (0.35 * a).toFixed(3) + ')'; ctx.lineWidth = 1.2
      for (var i = 0; i < 6; i++) { var ox = (Math.random() - 0.5) * R * 1.6; ctx.beginPath(); ctx.moveTo(s.x + 46 + ox * 0.2, s.y - 70); ctx.lineTo(s.x + ox, s.y + (Math.random() - 0.5) * R) ; ctx.stroke() }
    })
    sparks.forEach(function (p) {
      var a = 1 - p.t / 0.6, r = 5 * Math.sin(Math.PI * p.t / 0.6)
      ctx.strokeStyle = 'rgba(255,240,190,' + a.toFixed(3) + ')'; ctx.lineWidth = 1.4
      ctx.beginPath(); ctx.moveTo(p.x - r, p.y); ctx.lineTo(p.x + r, p.y); ctx.moveTo(p.x, p.y - r); ctx.lineTo(p.x, p.y + r); ctx.stroke()
    })
  }
  function drawCursor() {
    if (auto || !(ptr.over || ptr.down)) return
    var t = TOOLS[tool]
    ctx.strokeStyle = t.color; ctx.globalAlpha = 0.8; ctx.lineWidth = 2; ctx.setLineDash([6, 6])
    ctx.beginPath(); ctx.arc(ptr.x, ptr.y, R, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1
    // the lance
    ctx.strokeStyle = '#c6d2d8'; ctx.lineWidth = 5; ctx.lineCap = 'round'
    ctx.beginPath(); ctx.moveTo(ptr.x + 50, ptr.y - 74); ctx.lineTo(ptr.x + 92, ptr.y - 132); ctx.stroke()
    ctx.fillStyle = t.color; ctx.beginPath(); ctx.arc(ptr.x + 48, ptr.y - 70, 7, 0, Math.PI * 2); ctx.fill()
    ctx.lineCap = 'butt'
  }
  function drawArch() {
    if (!auto) return
    var x = auto.x, t = TOOLS[auto.steps[auto.i]]
    ctx.fillStyle = 'rgba(8,19,27,0.85)'; ctx.fillRect(x - 34, 52, 12, GROUND - 52); ctx.fillRect(x + 22, 52, 12, GROUND - 52)
    ctx.fillStyle = t.color; ctx.fillRect(x - 40, 44, 80, 16)
    ctx.fillStyle = '#08131b'; ctx.font = '700 10px "DM Sans", sans-serif'; ctx.textAlign = 'center'; ctx.fillText(t.label.toUpperCase(), x, 56)
    ctx.globalAlpha = 0.25; ctx.fillStyle = t.color; ctx.fillRect(x - 22, 60, 44, GROUND - 60); ctx.globalAlpha = 1
  }

  // ---- Loop ----
  function step(dt, now) {
    clock += dt
    for (var i = drops.length - 1; i >= 0; i--) { var d = drops[i]; d.t += dt; d.vy += 220 * dt; d.y += d.vy * dt; if (d.t > d.life) drops.splice(i, 1) }
    for (var j = spray.length - 1; j >= 0; j--) { spray[j].t += dt; if (spray[j].t > 0.25) spray.splice(j, 1) }
    for (var k = sparks.length - 1; k >= 0; k--) { sparks[k].t += dt; if (sparks[k].t > 0.6) sparks.splice(k, 1) }
    beads.forEach(function (b) { b.x -= b.v * dt; if (b.x < 150) b.x = 590 })
    if (auto) {
      var kind = auto.steps[auto.i], x0 = auto.x
      auto.x += 520 * dt
      for (var x = x0; x < auto.x; x += 7) for (var y = 96; y <= 344; y += 12) stamp(kind, x, y)
      if (auto.x > W + 60) { auto.i++; auto.x = -60; if (auto.i >= auto.steps.length) { auto = null; $('#dw-auto').disabled = false } }
    }
    if (statsDue && now - statsDue > 120) { statsDue = 0; renderResult() }
  }
  function frame(now) {
    raf = 0
    var dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60
    last = now
    step(dt, now)
    var dpr = view.dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, view.w, view.h)
    ctx.setTransform(dpr * view.k, 0, 0, dpr * view.k, dpr * view.ox, dpr * view.oy)
    drawTunnel(); drawCar(now); drawFx(dt, now); drawArch(); drawCursor()
    if (running) raf = requestAnimationFrame(frame)
  }
  function kick() { if (running && !raf) { last = 0; raf = requestAnimationFrame(frame) } }
  function size_() {
    var r = stage.getBoundingClientRect()
    view.dpr = Math.min(2, window.devicePixelRatio || 1); view.w = r.width; view.h = r.height
    canvas.width = Math.round(r.width * view.dpr); canvas.height = Math.round(r.height * view.dpr)
    view.k = Math.min(r.width / 760, r.height / 330); view.ox = (r.width - W * view.k) / 2; view.oy = (r.height - H * view.k) / 2 - 20 * view.k
    if (!raf) frame(performance.now())
  }
  function reset() {
    shape = build(size); classify(); indexCells(); paintDirt()
    drops = []; spray = []; sparks = []; auto = null; $('#dw-auto').disabled = false
    renderResult(); kick()
  }

  // ---- Input ----
  function toWorld(e) { var r = stage.getBoundingClientRect(); return { x: (e.clientX - r.left - view.ox) / view.k, y: (e.clientY - r.top - view.oy) / view.k } }
  canvas.addEventListener('pointerdown', function (e) {
    if (auto || e.button !== 0) return
    var p = toWorld(e); ptr.down = true; ptr.id = e.pointerId; ptr.x = ptr.lx = p.x; ptr.y = ptr.ly = p.y
    try { canvas.setPointerCapture(e.pointerId) } catch (er) {}
    stamp(tool, p.x, p.y); kick()
  })
  canvas.addEventListener('pointermove', function (e) {
    var p = toWorld(e); ptr.x = p.x; ptr.y = p.y; ptr.over = e.pointerType === 'mouse'
    if (ptr.down && e.pointerId === ptr.id && !auto) strokeTo(tool, p.x, p.y)
  })
  function up(e) { if (e.pointerId === ptr.id) { ptr.down = false; ptr.id = -1 } }
  canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up)
  canvas.addEventListener('pointerleave', function () { ptr.over = false })
  $$('[data-tool]').forEach(function (b) {
    b.addEventListener('click', function () { tool = b.dataset.tool; $$('[data-tool]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)) }) })
  })
  $('#dw-auto').addEventListener('click', function () { if (auto) return; auto = { steps: ['foam', 'rinse', 'wax', 'tires', 'glass'], i: 0, x: -60 }; this.disabled = true; kick() })
  $('#dw-reset').addEventListener('click', reset)
  $('#dw-choose').addEventListener('click', function () {
    var card = document.querySelectorAll('#wash-list .wash')[Number(this.dataset.lvl)]
    if (card) { card.click(); var target = document.getElementById('washes'); if (target) target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }) }
  })
  // follow the vehicle size picked in the wash menu
  Array.prototype.forEach.call(document.querySelectorAll('#size input'), function (inp) {
    inp.addEventListener('change', function () { if (inp.checked && SIZE[inp.value]) { size = inp.value; $('#dw-size').textContent = SIZE[size].name; reset() } })
    if (inp.checked && SIZE[inp.value]) size = inp.value
  })
  $('#dw-size').textContent = SIZE[size].name

  // checklist
  var list = $('#dw-list')
  FEATURES.forEach(function (f) { var li = document.createElement('li'); li.textContent = f; list.appendChild(li) })

  if ('ResizeObserver' in window) new ResizeObserver(size_).observe(stage); else window.addEventListener('resize', size_)
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      running = es[0].isIntersecting && !document.hidden
      if (running) kick(); else if (raf) { cancelAnimationFrame(raf); raf = 0 }
    }).observe(stage)
  } else running = true
  document.addEventListener('visibilitychange', function () { if (document.hidden) { running = false; if (raf) { cancelAnimationFrame(raf); raf = 0 } } })
  reset(); size_()
  root.classList.add('is-ready')
})()
