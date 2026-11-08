// ΒRÓŁΙN "Design it": draw in one slice of the circle and it is repeated (and mirrored) all the way round,
// the way blackwork mandalas are built. Line, bold or dotwork; see it on paper or at size on a forearm;
// save a PNG to send on Instagram. English and Greek. Loaded by assets/main.js when #design scrolls near.
;(function () {
  var root = document.getElementById('design')
  if (!root || root.dataset.ready) return
  root.dataset.ready = '1'
  var $ = function (s) { return root.querySelector(s) }
  var $$ = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)) }
  var stage = $('#dz-stage'), canvas = $('#dz-canvas'), ctx = canvas.getContext('2d')
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)

  var TXT = {
    en: { k: 'Design it', h: 'Draw once. The needle repeats it.', l: 'Draw inside one slice and it is mirrored round the circle, the way blackwork mandalas are built. Save it and send it to me.', sym: 'Symmetry', mirror: 'Mirror', pen: 'Pen', line: 'Line', bold: 'Bold', dots: 'Dotwork', view: 'View', paper: 'On paper', arm: 'On the forearm', size: 'Size', undo: 'Undo', clear: 'Clear', seed: 'Surprise me', save: 'Save the design', send: 'Send it on Instagram', hint: 'Draw inside the circle', guide: 'Rough guide: one session of about {h}. I confirm when I see your idea.', empty: 'Start drawing, or press Surprise me.', saved: 'Saved. Now send it to me on Instagram with where you want it.', hours: '{a} to {b} hours', guideMany: 'Rough guide: about {n} sessions of 3 to 4 hours. I confirm when I see your idea.' },
    el: { k: 'Σχεδίασέ το', h: 'Σχεδίασε μία φορά. Η βελόνα το επαναλαμβάνει.', l: 'Σχεδίασε σε ένα κομμάτι και καθρεφτίζεται γύρω από τον κύκλο, όπως χτίζονται τα blackwork μάνταλα. Αποθήκευσέ το και στείλ\' το μου.', sym: 'Συμμετρία', mirror: 'Καθρέφτης', pen: 'Πένα', line: 'Γραμμή', bold: 'Έντονη', dots: 'Dotwork', view: 'Προβολή', paper: 'Σε χαρτί', arm: 'Στον πήχη', size: 'Μέγεθος', undo: 'Αναίρεση', clear: 'Καθαρισμός', seed: 'Έκπληξη', save: 'Αποθήκευση σχεδίου', send: 'Στείλ\' το στο Instagram', hint: 'Σχεδίασε μέσα στον κύκλο', guide: 'Ενδεικτικά: μία συνεδρία περίπου {h}. Το επιβεβαιώνω όταν δω την ιδέα σου.', empty: 'Ξεκίνα να σχεδιάζεις ή πάτα Έκπληξη.', saved: 'Αποθηκεύτηκε. Στείλ\' το μου στο Instagram και πες μου πού το θέλεις.', hours: '{a} έως {b} ωρών', guideMany: 'Ενδεικτικά: περίπου {n} συνεδρίες των 3 με 4 ωρών. Το επιβεβαιώνω όταν δω την ιδέα σου.' },
  }
  var lang = document.documentElement.lang === 'el' ? 'el' : 'en'
  function T(k, v) { var s = TXT[lang][k]; if (v) Object.keys(v).forEach(function (x) { s = s.split('{' + x + '}').join(v[x]) }); return s }

  var S = 600 // design space (square); circle radius 270
  var R = 270, C = S / 2
  var st = { n: 8, mirror: true, pen: 'line', view: 'paper', size: 8 }
  var strokes = [], cur = null, view = { w: 0, h: 0, dpr: 1 }, inkC = document.createElement('canvas')
  inkC.width = S * 2; inkC.height = S * 2
  var ictx = inkC.getContext('2d')
  var INK = '#14161a', SKIN = '#e6c8ae'

  // ---- Rendering a stroke with its symmetry copies, into the ink layer (design space, 2x) ----
  function copies(fn) {
    for (var k = 0; k < st.n; k++) {
      var a = k / st.n * Math.PI * 2
      fn(a, 1)
      if (st.mirror) fn(a, -1)
    }
  }
  function drawStroke(s, c) {
    c = c || ictx
    c.save(); c.scale(2, 2)
    copies(function (a, flip) {
      c.save(); c.translate(C, C); c.rotate(a); c.scale(flip, 1)
      if (s.pen === 'dots') {
        c.fillStyle = INK
        var acc = 0
        for (var i = 1; i < s.pts.length; i++) {
          var p0 = s.pts[i - 1], p1 = s.pts[i], d = Math.hypot(p1[0] - p0[0], p1[1] - p0[1])
          acc += d
          while (acc > 4.5) { acc -= 4.5; var t = Math.random(); var x = p0[0] + (p1[0] - p0[0]) * t + (Math.random() - 0.5) * 3, y = p0[1] + (p1[1] - p0[1]) * t + (Math.random() - 0.5) * 3; c.beginPath(); c.arc(x, y, 0.9 + Math.random() * 0.9, 0, Math.PI * 2); c.fill() }
        }
      } else {
        c.strokeStyle = INK; c.lineWidth = s.pen === 'bold' ? 6 : 2; c.lineCap = 'round'; c.lineJoin = 'round'
        c.beginPath(); s.pts.forEach(function (p, i) { if (i) c.lineTo(p[0], p[1]); else c.moveTo(p[0], p[1]) }); c.stroke()
      }
      c.restore()
    })
    c.restore()
  }
  function redrawInk() {
    ictx.setTransform(1, 0, 0, 1, 0, 0); ictx.clearRect(0, 0, inkC.width, inkC.height)
    strokes.forEach(function (s) { drawStroke(s) })
  }

  // ---- The page canvas: paper or forearm ----
  function draw() {
    var dpr = view.dpr, w = view.w, h = view.h
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h)
    if (st.view === 'paper') {
      var k = Math.min(w, h) / S, ox = (w - S * k) / 2, oy = (h - S * k) / 2
      ctx.setTransform(dpr * k, 0, 0, dpr * k, dpr * ox, dpr * oy)
      // paper disc with a soft edge
      var g = ctx.createRadialGradient(C, C, R * 0.2, C, C, R + 14)
      g.addColorStop(0, '#f3efe6'); g.addColorStop(0.92, '#e9e4d8'); g.addColorStop(1, 'rgba(233,228,216,0)')
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(C, C, R + 14, 0, Math.PI * 2); ctx.fill()
      // slice guides
      ctx.strokeStyle = 'rgba(95,208,238,0.35)'; ctx.lineWidth = 1; ctx.setLineDash([3, 6])
      for (var i = 0; i < st.n; i++) { var a = i / st.n * Math.PI * 2 - Math.PI / 2; ctx.beginPath(); ctx.moveTo(C, C); ctx.lineTo(C + Math.cos(a) * R, C + Math.sin(a) * R); ctx.stroke() }
      ctx.setLineDash([]); ctx.beginPath(); ctx.arc(C, C, R, 0, Math.PI * 2); ctx.stroke()
      // the slice you draw in
      var a0 = -Math.PI / 2, a1 = a0 + Math.PI * 2 / st.n
      ctx.fillStyle = 'rgba(95,208,238,0.07)'; ctx.beginPath(); ctx.moveTo(C, C); ctx.arc(C, C, R, a0, a1); ctx.closePath(); ctx.fill()
      ctx.drawImage(inkC, 0, 0, S, S)
    } else {
      // forearm, with the design at its real size (a forearm is about 9 cm across)
      var ak = Math.min(w / 640, h / 480), ax = (w - 640 * ak) / 2, ay = (h - 480 * ak) / 2
      ctx.setTransform(dpr * ak, 0, 0, dpr * ak, dpr * ax, dpr * ay)
      var skin = ctx.createLinearGradient(0, 120, 0, 380)
      skin.addColorStop(0, '#c9a487'); skin.addColorStop(0.45, SKIN); skin.addColorStop(1, '#b8927a')
      var arm = function () { ctx.beginPath(); ctx.moveTo(-20, 150); ctx.bezierCurveTo(200, 120, 420, 128, 560, 160); ctx.bezierCurveTo(610, 170, 660, 190, 660, 240); ctx.bezierCurveTo(660, 300, 610, 318, 560, 326); ctx.bezierCurveTo(420, 352, 200, 362, -20, 340); ctx.closePath() }
      ctx.fillStyle = skin; arm(); ctx.fill()
      ctx.strokeStyle = 'rgba(120,80,60,0.25)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(40, 246); ctx.bezierCurveTo(200, 240, 380, 238, 540, 240); ctx.stroke()
      var px = 190 / 9 * st.size // 190 units across the arm ≈ 9 cm
      ctx.save(); arm(); ctx.clip(); ctx.globalAlpha = 0.92; ctx.globalCompositeOperation = 'multiply'
      ctx.drawImage(inkC, 300 - px / 2 * (S / (2 * R)), 244 - px / 2 * (S / (2 * R)), px * S / (2 * R), px * S / (2 * R))
      ctx.restore()
      ctx.fillStyle = 'rgba(233,231,225,0.75)'; ctx.font = '500 13px ' + getComputedStyle(document.body).fontFamily; ctx.textAlign = 'center'; ctx.fillText(st.size + ' cm', 300, 420)
      ctx.strokeStyle = 'rgba(95,208,238,0.6)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(300 - px / 2, 400); ctx.lineTo(300 + px / 2, 400); ctx.stroke()
    }
  }
  function size() {
    var r = stage.getBoundingClientRect()
    view.dpr = Math.min(2, window.devicePixelRatio || 1); view.w = r.width; view.h = r.height
    canvas.width = Math.round(r.width * view.dpr); canvas.height = Math.round(r.height * view.dpr)
    draw()
  }

  // ---- Drawing input (paper view only); every stroke is repeated round the circle ----
  function toDesign(e) {
    var r = stage.getBoundingClientRect(), k = Math.min(r.width, r.height) / S, ox = (r.width - S * k) / 2, oy = (r.height - S * k) / 2
    var x = (e.clientX - r.left - ox) / k - C, y = (e.clientY - r.top - oy) / k - C
    return [x, y]
  }
  canvas.addEventListener('pointerdown', function (e) {
    if (st.view !== 'paper' || e.button !== 0) return
    var p = toDesign(e); if (Math.hypot(p[0], p[1]) > R) return
    cur = { pen: st.pen, pts: [p] }; try { canvas.setPointerCapture(e.pointerId) } catch (er) {}
    $('#dz-hint').hidden = true
  })
  canvas.addEventListener('pointermove', function (e) {
    if (!cur) return
    var p = toDesign(e), d = Math.hypot(p[0], p[1])
    if (d > R) { p = [p[0] / d * R, p[1] / d * R] }
    var last = cur.pts[cur.pts.length - 1]
    if (Math.hypot(p[0] - last[0], p[1] - last[1]) < 2) return
    var seg = { pen: cur.pen, pts: [last, p] }
    drawStroke(seg) // draw incrementally, all copies at once
    cur.pts.push(p); draw()
  })
  function end() { if (cur && cur.pts.length > 1) { strokes.push(cur); renderInfo() } cur = null }
  canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end)

  // ---- Surprise me: a seed in the house style (rings, petals, dot halos) ----
  function seed() {
    strokes = []
    var rings = 2 + Math.floor(Math.random() * 3)
    for (var r = 0; r < rings; r++) {
      var rad = 40 + r * (R - 60) / rings + Math.random() * 20, pts = [], span = Math.PI * 2 / st.n
      for (var t = 0; t <= 1; t += 0.05) { var a = -Math.PI / 2 + t * span; pts.push([Math.cos(a) * rad, Math.sin(a) * rad]) }
      strokes.push({ pen: r % 2 ? 'dots' : 'line', pts: pts })
      // a petal from this ring outwards
      var pr = rad + 30 + Math.random() * 30, petal = []
      for (var u = 0; u <= 1; u += 0.05) { var aa = -Math.PI / 2 + span * 0.5 + Math.sin(u * Math.PI) * span * 0.35 * (u < 0.5 ? -1 : 1) * 0, rr = rad + (pr - rad) * Math.sin(u * Math.PI); var ang = -Math.PI / 2 + u * span * 0.5; petal.push([Math.cos(ang) * rr, Math.sin(ang) * rr]) }
      strokes.push({ pen: Math.random() < 0.3 ? 'bold' : 'line', pts: petal })
    }
    var dots = []; for (var d = 0; d <= 1; d += 0.1) { var a2 = -Math.PI / 2 + d * Math.PI * 2 / st.n; dots.push([Math.cos(a2) * (R - 12), Math.sin(a2) * (R - 12)]) }
    strokes.push({ pen: 'dots', pts: dots })
    redrawInk(); draw(); renderInfo(); $('#dz-hint').hidden = true
  }

  // ---- Info: rough session guide ----
  function renderInfo() {
    if (!strokes.length) { $('#dz-guide').textContent = T('empty'); return }
    var ink = strokes.reduce(function (a, s) { var l = 0; for (var i = 1; i < s.pts.length; i++) l += Math.hypot(s.pts[i][0] - s.pts[i - 1][0], s.pts[i][1] - s.pts[i - 1][1]); return a + l * (s.pen === 'dots' ? 2.2 : s.pen === 'bold' ? 1.6 : 1) }, 0)
    var work = ink * st.n * (st.mirror ? 2 : 1) / 4000 * Math.pow(st.size / 8, 2)
    var a = Math.max(1, Math.round(work + 1)), b = a + Math.max(1, Math.round(a * 0.5))
    // nobody sits for more than about five hours: bigger pieces are split into sessions
    $('#dz-guide').textContent = b <= 5 ? T('guide', { h: T('hours', { a: a, b: b }) }) : T('guideMany', { n: Math.ceil(b / 4) })
  }
  function labels() {
    $('#dz-k').textContent = T('k'); $('#dz-h').textContent = T('h'); $('#dz-l').textContent = T('l')
    $$('[data-t]').forEach(function (el) { el.textContent = T(el.dataset.t) })
    $('#dz-hint').textContent = T('hint')
    renderInfo()
  }
  function press() {
    $$('[data-n]').forEach(function (b) { b.setAttribute('aria-pressed', String(Number(b.dataset.n) === st.n)) })
    $$('[data-pen]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.pen === st.pen)) })
    $$('[data-view]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.view === st.view)) })
    $$('[data-size]').forEach(function (b) { b.setAttribute('aria-pressed', String(Number(b.dataset.size) === st.size)) })
    $('#dz-mirror').setAttribute('aria-pressed', String(st.mirror))
    canvas.style.cursor = st.view === 'paper' ? 'crosshair' : 'default'
  }
  $$('[data-n]').forEach(function (b) { b.addEventListener('click', function () { st.n = Number(b.dataset.n); redrawInk(); draw(); press(); renderInfo() }) })
  $$('[data-pen]').forEach(function (b) { b.addEventListener('click', function () { st.pen = b.dataset.pen; press() }) })
  $$('[data-view]').forEach(function (b) { b.addEventListener('click', function () { st.view = b.dataset.view; draw(); press() }) })
  $$('[data-size]').forEach(function (b) { b.addEventListener('click', function () { st.size = Number(b.dataset.size); draw(); press(); renderInfo() }) })
  $('#dz-mirror').addEventListener('click', function () { st.mirror = !st.mirror; redrawInk(); draw(); press(); renderInfo() })
  $('#dz-undo').addEventListener('click', function () { strokes.pop(); redrawInk(); draw(); renderInfo() })
  $('#dz-clear').addEventListener('click', function () { strokes = []; redrawInk(); draw(); renderInfo() })
  $('#dz-seed').addEventListener('click', seed)
  $('#dz-save').addEventListener('click', function () {
    var out = document.createElement('canvas'); out.width = 1080; out.height = 1080
    var o = out.getContext('2d'); o.fillStyle = '#f3efe6'; o.fillRect(0, 0, 1080, 1080)
    o.drawImage(inkC, 1080 / 2 - 500, 1080 / 2 - 500, 1000, 1000)
    o.fillStyle = 'rgba(20,22,26,0.55)'; o.font = '700 22px sans-serif'; o.textAlign = 'right'; o.fillText('BROLIN · idea', 1050, 1050)
    var a = document.createElement('a'); a.href = out.toDataURL('image/png'); a.download = 'brolin-idea.png'
    document.body.appendChild(a); a.click(); a.remove()
    $('#dz-guide').textContent = T('saved')
  })
  new MutationObserver(function () { var l = document.documentElement.lang === 'el' ? 'el' : 'en'; if (l !== lang) { lang = l; labels() } }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] })

  if ('ResizeObserver' in window) new ResizeObserver(size).observe(stage); else window.addEventListener('resize', size)
  press(); labels(); size()
  root.classList.add('is-ready')
})()
