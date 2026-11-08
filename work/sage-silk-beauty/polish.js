// Sage & Silk "Polish bar": paint a hand nail by nail. Colours from the studio's own palette, four finishes
// (gloss, matte, chrome shimmer, French), four shapes and gold nail art. "Book this set" ticks a gel manicure
// (and nail art) in the visit basket and adds the design to the booking. Loaded by main.js when #polish scrolls near.
;(function () {
  var root = document.getElementById('polish')
  if (!root || root.dataset.ready) return
  root.dataset.ready = '1'
  var $ = function (s) { return root.querySelector(s) }
  var $$ = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)) }
  var NS = 'http://www.w3.org/2000/svg'
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)

  var COLOURS = [['Milk', '#efe8e0'], ['Nude', '#d8b4a0'], ['Blush', '#dfa7a0'], ['Sage', '#a8b49a'], ['Candle gold', '#c9b38f'], ['Aubergine', '#4a2c40'], ['Midnight', '#2b2f3a'], ['Brick', '#a5483a']]
  var SKINS = ['#f2d3c0', '#ddb08e', '#b47e58', '#6f4a35']
  var FINGERS = [ // name, base x, base y, angle, length, width
    ['Pinky', 118, 246, -15, 118, 29], ['Ring', 162, 220, -6, 150, 33], ['Middle', 210, 210, 1, 166, 35], ['Index', 258, 220, 9, 150, 33], ['Thumb', 300, 304, 50, 118, 38],
  ]
  var st = { colour: 3, finish: 'gloss', shape: 'almond', art: 'none', skin: 1 }
  var nails = FINGERS.map(function (f) { return { name: f[0], painted: false, colour: 0, finish: 'gloss', art: 'none' } })

  function el(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e }
  var svg = el('svg', { viewBox: '0 0 420 480', class: 'pl__svg', role: 'group', 'aria-label': 'A hand. Tap a nail to paint it.' })
  var defs = el('defs', {}, svg)
  el('ellipse', { cx: 210, cy: 250, rx: 190, ry: 210, fill: 'rgba(201,179,143,0.06)' }, svg)
  var hand = el('g', {}, svg)
  var skinEls = []
  // palm and wrist
  var palm = el('path', { d: 'M100 252 C 112 236 286 226 304 246 C 326 270 338 300 330 330 C 322 368 300 400 292 440 L 300 480 L 128 480 L 134 440 C 112 404 92 360 94 318 C 95 290 92 266 100 252 Z' }, hand)
  skinEls.push(palm)
  FINGERS.forEach(function (f, i) {
    var g = el('g', { transform: 'translate(' + f[1] + ' ' + f[2] + ') rotate(' + f[3] + ')' }, hand)
    var w = f[5], L = f[4]
    skinEls.push(el('path', { d: 'M' + (-w / 2) + ' 48 V' + (-L + w / 2) + ' A' + (w / 2) + ' ' + (w / 2) + ' 0 0 1 ' + (w / 2) + ' ' + (-L + w / 2) + ' V48 Z' }, g))
    el('path', { d: 'M' + (-w * 0.3) + ' ' + (-L * 0.42) + ' Q0 ' + (-L * 0.4) + ' ' + (w * 0.3) + ' ' + (-L * 0.42), stroke: 'rgba(80,40,30,0.18)', 'stroke-width': 1.4, fill: 'none' }, g)
    el('path', { d: 'M' + (-w * 0.26) + ' ' + (-L * 0.7) + ' Q0 ' + (-L * 0.68) + ' ' + (w * 0.26) + ' ' + (-L * 0.7), stroke: 'rgba(80,40,30,0.14)', 'stroke-width': 1.2, fill: 'none' }, g)
    var n = nails[i]
    n.g = el('g', { class: 'pl__nail', tabindex: 0, role: 'button', 'aria-label': f[0] + ' nail' }, g)
    n.w = w; n.L = L
    n.clipId = 'pl-clip-' + i
    var clip = el('clipPath', { id: n.clipId }, defs)
    n.clipRect = el('rect', { x: -w, y: -L - 30, width: w * 2, height: 0 }, clip)
    n.gradId = 'pl-chrome-' + i
    n.grad = el('linearGradient', { id: n.gradId, x1: 0, y1: 0, x2: 1, y2: 0.4 }, defs)
    n.bare = el('path', { fill: 'rgba(255,232,226,0.85)', stroke: 'rgba(120,70,60,0.25)', 'stroke-width': 1 }, n.g)
    n.paint = el('g', { 'clip-path': 'url(#' + n.clipId + ')' }, n.g)
    n.coat = el('path', {}, n.paint)
    var tipClip = el('clipPath', { id: 'pl-tip-' + i }, defs)
    el('rect', { x: -w, y: -L - 30, width: w * 2, height: 30 + w * 0.42 }, tipClip)
    n.tip = el('path', { fill: '#fbf7f2', 'clip-path': 'url(#pl-tip-' + i + ')' }, n.paint)
    n.shine = el('path', { fill: '#fff', opacity: 0 }, n.paint)
    n.artG = el('g', {}, n.paint)
    el('path', { d: 'M' + (-w * 0.6) + ' ' + (-L * 0.55) + ' H' + (w * 0.6), stroke: 'transparent', 'stroke-width': w * 1.4 }, n.g) // larger tap target
    n.g.addEventListener('click', function () { paint(n) })
    n.g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); paint(n) } })
  })
  // the palm sits over the finger roots (thumb stays on top), so there are no gaps at the knuckles
  hand.insertBefore(palm, hand.children[4] || null)
  $('#pl-stage').appendChild(svg)

  // ---- Nail shapes (local coords: the fingertip is at y = -L) ----
  function nailPath(n, shape) {
    var w = n.w * 0.36, top = -n.L - 6, base = -n.L + n.w * 0.95, r = w
    if (shape === 'almond') return 'M' + (-w) + ' ' + base + ' V' + (top + n.w * 0.45) + ' C' + (-w) + ' ' + (top + 4) + ' -2 ' + (top - 8) + ' 0 ' + (top - 10) + ' C2 ' + (top - 8) + ' ' + w + ' ' + (top + 4) + ' ' + w + ' ' + (top + n.w * 0.45) + ' V' + base + ' Q0 ' + (base + 7) + ' ' + (-w) + ' ' + base + ' Z'
    if (shape === 'square') return 'M' + (-w) + ' ' + base + ' V' + (top + 3) + ' Q' + (-w) + ' ' + top + ' ' + (-w + 3) + ' ' + top + ' H' + (w - 3) + ' Q' + w + ' ' + top + ' ' + w + ' ' + (top + 3) + ' V' + base + ' Q0 ' + (base + 7) + ' ' + (-w) + ' ' + base + ' Z'
    if (shape === 'coffin') return 'M' + (-w) + ' ' + base + ' V' + (top + 12) + ' L' + (-w * 0.55) + ' ' + (top - 6) + ' H' + (w * 0.55) + ' L' + w + ' ' + (top + 12) + ' V' + base + ' Q0 ' + (base + 7) + ' ' + (-w) + ' ' + base + ' Z'
    return 'M' + (-w) + ' ' + base + ' V' + (top + r) + ' A' + r + ' ' + r + ' 0 0 1 ' + w + ' ' + (top + r) + ' V' + base + ' Q0 ' + (base + 7) + ' ' + (-w) + ' ' + base + ' Z'
  }
  function hex(h, f) { var c = [1, 3, 5].map(function (i) { return parseInt(h.substr(i, 2), 16) }); return 'rgb(' + c.map(function (v) { return Math.round(f > 0 ? v + (255 - v) * f : v * (1 + f)) }).join(',') + ')' }
  function drawNail(n) {
    var d = nailPath(n, st.shape), c = COLOURS[n.colour][1]
    n.bare.setAttribute('d', d); n.coat.setAttribute('d', d)
    var w = n.w * 0.36, top = -n.L - 6
    // French: a nude base and a white tip (the tip path is clipped to the free edge)
    n.tip.setAttribute('d', n.finish === 'french' ? d : '')
    if (n.finish === 'french') n.coat.setAttribute('fill', '#ecd3c6')
    if (n.finish === 'chrome') {
      while (n.grad.firstChild) n.grad.removeChild(n.grad.firstChild)
      ;[[0, hex(c, -0.45)], [0.35, hex(c, 0.35)], [0.5, '#ffffff'], [0.62, hex(c, 0.15)], [1, hex(c, -0.5)]].forEach(function (s) { el('stop', { offset: s[0], 'stop-color': s[1] }, n.grad) })
      n.coat.setAttribute('fill', 'url(#' + n.gradId + ')')
    } else if (n.finish !== 'french') n.coat.setAttribute('fill', n.finish === 'matte' ? hex(c, -0.08) : c)
    n.shine.setAttribute('d', 'M' + (-w * 0.55) + ' ' + (top + n.w * 0.35) + ' Q' + (-w * 0.6) + ' ' + (top + n.w * 0.9) + ' ' + (-w * 0.35) + ' ' + (top + n.w * 1.05) + ' Q' + (-w * 0.3) + ' ' + (top + n.w * 0.7) + ' ' + (-w * 0.55) + ' ' + (top + n.w * 0.35) + ' Z')
    n.shine.setAttribute('opacity', n.finish === 'gloss' || n.finish === 'french' ? 0.55 : n.finish === 'chrome' ? 0.25 : 0)
    while (n.artG.firstChild) n.artG.removeChild(n.artG.firstChild)
    var base = -n.L + n.w * 0.95, gold = '#d8c08f'
    if (n.art === 'moon') el('path', { d: 'M' + (-w * 0.8) + ' ' + (base - 2) + ' A' + (w * 0.8) + ' ' + (w * 0.8) + ' 0 0 1 ' + (w * 0.8) + ' ' + (base - 2) + ' Z', fill: gold }, n.artG)
    if (n.art === 'line') el('path', { d: 'M0 ' + (base - 2) + ' V' + (top + 2), stroke: gold, 'stroke-width': 1.6, 'stroke-linecap': 'round' }, n.artG)
    if (n.art === 'flower') { var cy = (top + base) / 2; for (var k = 0; k < 5; k++) { var a = k / 5 * Math.PI * 2; el('ellipse', { cx: Math.cos(a) * 3.2, cy: cy + Math.sin(a) * 3.2, rx: 2.6, ry: 1.6, transform: 'rotate(' + (a * 57.3) + ' ' + (Math.cos(a) * 3.2) + ' ' + (cy + Math.sin(a) * 3.2) + ')', fill: '#fbf7f2' }, n.artG) } el('circle', { cx: 0, cy: cy, r: 1.6, fill: gold }, n.artG) }
    n.clipRect.setAttribute('height', n.painted ? n.L : 0)
  }
  function paint(n, delay) {
    n.colour = st.colour; n.finish = st.finish; n.art = st.art; n.painted = true
    drawNail(n)
    // brush it on from the cuticle to the tip
    var base = -n.L + n.w * 0.95 + 8, full = n.w * 1.5 + 30
    if (reduce) { n.clipRect.setAttribute('y', base - full); n.clipRect.setAttribute('height', full) }
    else {
      var t0 = performance.now() + (delay || 0)
      ;(function grow(now) { var k = Math.max(0, Math.min(1, (now - t0) / 380)), e = 1 - Math.pow(1 - k, 3); n.clipRect.setAttribute('y', (base - full * e).toFixed(1)); n.clipRect.setAttribute('height', (full * e).toFixed(1)); if (k < 1) requestAnimationFrame(grow) })(performance.now())
    }
    render()
  }
  // chrome shimmer drifts slowly
  var onScreen = false, shimmerRaf = 0
  function shimmer(now) {
    shimmerRaf = 0
    nails.forEach(function (n) { if (n.painted && n.finish === 'chrome') { var x = Math.sin(now / 900 + n.w) * 0.25; n.grad.setAttribute('gradientTransform', 'translate(' + x.toFixed(3) + ' 0)') } })
    if (onScreen && nails.some(function (n) { return n.painted && n.finish === 'chrome' })) shimmerRaf = requestAnimationFrame(shimmer)
  }
  function kickShimmer() { if (!reduce && onScreen && !shimmerRaf) shimmerRaf = requestAnimationFrame(shimmer) }
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { onScreen = es[0].isIntersecting; kickShimmer() }).observe(svg)

  // ---- What it is and what it costs (same prices as the treatment menu) ----
  function summary() {
    var done = nails.filter(function (n) { return n.painted })
    if (!done.length) return { text: 'Tap a nail to paint it, or paint them all.', art: false, any: false }
    var groups = {}
    done.forEach(function (n) { var k = COLOURS[n.colour][0].toLowerCase() + ' ' + n.finish; groups[k] = (groups[k] || 0) + 1 })
    var parts = Object.keys(groups).map(function (k) { return k + (groups[k] < 5 ? ' (' + groups[k] + ')' : '') })
    var arts = done.filter(function (n) { return n.art !== 'none' }).map(function (n) { return n.art + ' on the ' + n.name.toLowerCase() })
    return { text: st.shape.charAt(0).toUpperCase() + st.shape.slice(1) + ' nails, ' + parts.join(', ') + (arts.length ? '; gold ' + arts.join(', ') : ''), art: arts.length > 0, any: true }
  }
  function render() {
    kickShimmer()
    var s = summary()
    $('#pl-desc').textContent = s.text
    var price = s.any ? 32 + (s.art ? 24 : 0) : 0, mins = s.any ? 45 + (s.art ? 40 : 0) : 0
    $('#pl-price').textContent = s.any ? '£' + price : '£0'
    $('#pl-line').textContent = s.any ? 'Gel manicure £32 · 45 min' + (s.art ? ' + nail art, both hands £24 · 40 min' : '') : 'Gel manicure from £32'
    $('#pl-book').disabled = !s.any
    ;[['data-colour', st.colour], ['data-finish', st.finish], ['data-shape', st.shape], ['data-art', st.art], ['data-skin', st.skin]].forEach(function (p) { $$('[' + p[0] + ']').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute(p[0]) === String(p[1]))) }) })
  }

  // ---- Controls ----
  $$('[data-colour]').forEach(function (b) { b.style.background = COLOURS[Number(b.dataset.colour)][1]; b.setAttribute('aria-label', COLOURS[Number(b.dataset.colour)][0]); b.title = COLOURS[Number(b.dataset.colour)][0]; b.addEventListener('click', function () { st.colour = Number(b.dataset.colour); render() }) })
  $$('[data-finish]').forEach(function (b) { b.addEventListener('click', function () { st.finish = b.dataset.finish; render() }) })
  $$('[data-art]').forEach(function (b) { b.addEventListener('click', function () { st.art = b.dataset.art; render() }) })
  $$('[data-shape]').forEach(function (b) { b.addEventListener('click', function () { st.shape = b.dataset.shape; nails.forEach(drawNail); render() }) })
  $$('[data-skin]').forEach(function (b) { b.style.background = SKINS[Number(b.dataset.skin)]; b.addEventListener('click', function () { st.skin = Number(b.dataset.skin); skinEls.forEach(function (e) { e.setAttribute('fill', SKINS[st.skin]) }); render() }) })
  $('#pl-all').addEventListener('click', function () { var art = st.art; nails.forEach(function (n, i) { st.art = i === 1 ? art : 'none'; paint(n, i * 90) }); st.art = art; render() })
  $('#pl-clear').addEventListener('click', function () { nails.forEach(function (n) { n.painted = false; drawNail(n) }); render() })
  $('#pl-book').addEventListener('click', function () {
    var s = summary(); if (!s.any) return
    window.sageDesign = s.text
    var tab = Array.prototype.find.call(document.querySelectorAll('#cats button'), function (b) { return b.textContent === 'Nails' })
    if (tab) tab.click()
    var rows = document.querySelectorAll('#list li input')
    var want = [0]; if (s.art) want.push(2)
    want.forEach(function (i) { var box = rows[i]; if (box && !box.checked) { box.checked = true; box.dispatchEvent(new Event('change', { bubbles: true })) } })
    var menu = document.getElementById('menu'); if (menu) menu.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
    $('#pl-msg').textContent = 'Added to your visit. Pick a day and time.'
  })

  skinEls.forEach(function (e) { e.setAttribute('fill', SKINS[st.skin]) })
  nails.forEach(drawNail); render()
  root.classList.add('is-ready')
})()
