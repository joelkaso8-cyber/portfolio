// Aurelia "Your smile": both dental arches, tooth by tooth. Slide the whitening shade and the teeth change colour;
// pick a treatment and tap teeth to build a plan with the clinic's prices and the same monthly-payment maths as
// the finance calculator; book the main treatment. Loaded by main.js when #smile scrolls near.
;(function () {
  var root = document.getElementById('smile')
  if (!root || root.dataset.ready) return
  root.dataset.ready = '1'
  var $ = function (s) { return root.querySelector(s) }
  var $$ = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)) }
  var NS = 'http://www.w3.org/2000/svg'
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)
  var gbp = function (n) { return '£' + (n % 1 ? n.toFixed(2) : n.toLocaleString('en-GB')) }

  // Same prices as the treatment list in main.js.
  var TOOLS = {
    filling: { name: 'White filling', price: 120, mark: '#9fd3c1' },
    bonding: { name: 'Composite bonding', price: 250, mark: '#d9b779' },
    crown: { name: 'Crown', price: 650, mark: '#d9b779' },
    implant: { name: 'Dental implant', price: 2400, mark: '#8fa59c' },
    clear: { name: 'Healthy', price: 0 },
  }
  var WHITEN = { name: 'Teeth whitening', price: 350 }
  var SHADES = [['A4', '#cfae82'], ['A3.5', '#d9bb8f'], ['A3', '#e0c79f'], ['B3', '#e2cca3'], ['A2', '#e8d6b6'], ['D2', '#e6dac3'], ['B2', '#ebdfc4'], ['A1', '#eee4cf'], ['B1', '#f1ebdc'], ['BL2', '#f4f0e6'], ['BL1', '#f8f6f0']]
  var START = 2 // A3, a typical natural shade

  // ---- Teeth: FDI numbers, names, size along the arch (w) and depth (d) ----
  var KIND = [['central incisor', 26, 18, 'inc'], ['lateral incisor', 21, 17, 'inc'], ['canine', 23, 22, 'can'], ['first premolar', 21, 25, 'pre'], ['second premolar', 21, 25, 'pre'], ['first molar', 30, 31, 'mol'], ['second molar', 28, 29, 'mol']]
  var teeth = []
  function el(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e }
  var svg = el('svg', { viewBox: '0 0 600 600', class: 'sm__svg', role: 'group', 'aria-label': 'Your teeth, upper and lower arch' })
  var defs = el('defs', {}, svg)
  var enamel = el('radialGradient', { id: 'sm-enamel', cx: '40%', cy: '35%', r: '70%' }, defs)
  var e0 = el('stop', { offset: 0 }, enamel), e1 = el('stop', { offset: 0.7 }, enamel), e2 = el('stop', { offset: 1 }, enamel)
  el('ellipse', { cx: 300, cy: 300, rx: 250, ry: 280, fill: 'rgba(159,211,193,0.05)' }, svg)
  var gumU = el('path', { fill: 'none', stroke: 'rgba(217,150,150,0.13)', 'stroke-width': 58, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg)
  var gumL = el('path', { fill: 'none', stroke: 'rgba(217,150,150,0.13)', 'stroke-width': 58, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg)
  var arches = el('g', {}, svg)
  var labU = el('text', { x: 300, y: 272, 'text-anchor': 'middle', class: 'sm__arch' }, svg); labU.textContent = 'UPPER'
  var labL = el('text', { x: 300, y: 336, 'text-anchor': 'middle', class: 'sm__arch' }, svg); labL.textContent = 'LOWER'

  // place teeth along an ellipse by arc length
  function arch(upper) {
    var cx = 300, cy = upper ? 262 : 338, rx = 152, ry = upper ? 186 : 178, dir = upper ? -1 : 1, SZ = 1.4
    function pt(th) { return [cx + rx * Math.sin(th), cy + dir * ry * Math.cos(th)] }
    // arc-length table
    var tbl = [], s = 0, prev = pt(0)
    for (var i = 1; i <= 400; i++) { var th = i / 400 * 2.3, p = pt(th); s += Math.hypot(p[0] - prev[0], p[1] - prev[1]); tbl.push([s, th]); prev = p }
    function at(len) { for (var j = 0; j < tbl.length; j++) if (tbl[j][0] >= len) return tbl[j][1]; return 2.3 }
    var gum = [], gumIn = []
    ;[-1, 1].forEach(function (side) {
      var len = 1.5
      KIND.forEach(function (k, n) {
        var kw = k[1] * SZ, kd = k[2] * SZ, mid = at(len + kw / 2), p = pt(mid * side), t2 = pt((mid + 0.01) * side)
        var ang = Math.atan2(t2[1] - p[1], t2[0] - p[0]) * 180 / Math.PI
        // FDI: upper right 1x, upper left 2x, lower left 3x, lower right 4x (patient's right is on our left)
        var quad = upper ? (side < 0 ? 1 : 2) : (side < 0 ? 4 : 3)
        teeth.push({ id: quad * 10 + n + 1, name: (upper ? 'upper ' : 'lower ') + (side < 0 ? 'right ' : 'left ') + k[0], kind: k[3], w: kw, d: kd, x: p[0], y: p[1], ang: ang, state: 'clear' })
        len += kw + 3
      })
    })
  }
  arch(true); arch(false)
  function toothPath(t) {
    var w = t.w / 2, d = t.d / 2
    if (t.kind === 'inc') return 'M' + (-w) + ' ' + (-d * 0.4) + ' Q0 ' + (-d * 1.2) + ' ' + w + ' ' + (-d * 0.4) + ' L' + (w * 0.8) + ' ' + d + ' Q0 ' + (d * 1.25) + ' ' + (-w * 0.8) + ' ' + d + ' Z'
    if (t.kind === 'can') return 'M0 ' + (-d * 1.05) + ' Q' + (w * 1.2) + ' ' + (-d * 0.5) + ' ' + (w * 0.9) + ' ' + (d * 0.4) + ' Q0 ' + (d * 1.3) + ' ' + (-w * 0.9) + ' ' + (d * 0.4) + ' Q' + (-w * 1.2) + ' ' + (-d * 0.5) + ' 0 ' + (-d * 1.05) + ' Z'
    var r = t.kind === 'mol' ? 12 : 10
    return 'M' + (-w + r) + ' ' + (-d) + ' H' + (w - r) + ' Q' + w + ' ' + (-d) + ' ' + w + ' ' + (-d + r) + ' V' + (d - r) + ' Q' + w + ' ' + d + ' ' + (w - r) + ' ' + d + ' H' + (-w + r) + ' Q' + (-w) + ' ' + d + ' ' + (-w) + ' ' + (d - r) + ' V' + (-d + r) + ' Q' + (-w) + ' ' + (-d) + ' ' + (-w + r) + ' ' + (-d) + ' Z'
  }
  teeth.forEach(function (t) {
    var g = el('g', { class: 'sm__tooth', tabindex: 0, role: 'button', transform: 'translate(' + t.x.toFixed(1) + ' ' + t.y.toFixed(1) + ') rotate(' + t.ang.toFixed(1) + ')' }, arches)
    t.g = g
    t.body = el('path', { d: toothPath(t), fill: 'url(#sm-enamel)', stroke: 'rgba(15,32,27,0.55)', 'stroke-width': 1 }, g)
    // grooves and cusps on the biting surface
    if (t.kind === 'mol') { el('path', { d: 'M' + (-t.w * 0.28) + ' 0 H' + (t.w * 0.28) + ' M0 ' + (-t.d * 0.28) + ' V' + (t.d * 0.28), stroke: 'rgba(120,100,70,0.35)', 'stroke-width': 1.2, fill: 'none' }, g) }
    else if (t.kind === 'pre') el('path', { d: 'M' + (-t.w * 0.25) + ' 0 H' + (t.w * 0.25), stroke: 'rgba(120,100,70,0.35)', 'stroke-width': 1.2 }, g)
    t.mark = el('g', {}, g)
    t.g.addEventListener('click', function () { apply(t) })
    t.g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); apply(t) } })
    t.g.addEventListener('pointerenter', function () { hint(t) }); t.g.addEventListener('focus', function () { hint(t) })
  })
  // gums: a soft band behind each arch
  function gumPath(list) {
    // a smooth band through the middle of the teeth, drawn as a thick round stroke
    var pts = list.slice().sort(function (p, q) { return p.x - q.x })
    var d = 'M' + pts[0].x.toFixed(1) + ' ' + pts[0].y.toFixed(1)
    for (var i = 1; i < pts.length - 1; i++) { var mx = (pts[i].x + pts[i + 1].x) / 2, my = (pts[i].y + pts[i + 1].y) / 2; d += ' Q' + pts[i].x.toFixed(1) + ' ' + pts[i].y.toFixed(1) + ' ' + mx.toFixed(1) + ' ' + my.toFixed(1) }
    return d + ' L' + pts[pts.length - 1].x.toFixed(1) + ' ' + pts[pts.length - 1].y.toFixed(1)
  }
  gumU.setAttribute('d', gumPath(teeth.filter(function (t) { return t.id < 30 })))
  gumL.setAttribute('d', gumPath(teeth.filter(function (t) { return t.id > 30 })))
  $('#sm-stage').appendChild(svg)

  // ---- State ----
  var tool = 'filling', shade = START, whiten = false, months = 12
  function apply(t) {
    t.state = t.state === tool ? 'clear' : tool
    drawMark(t)
    if (!reduce) { t.g.classList.remove('is-pop'); void t.g.getBBox(); t.g.classList.add('is-pop') }
    hint(t); renderPlan()
  }
  function drawMark(t) {
    while (t.mark.firstChild) t.mark.removeChild(t.mark.firstChild)
    t.body.setAttribute('fill', t.state === 'implant' ? 'rgba(143,165,156,0.25)' : 'url(#sm-enamel)')
    t.body.setAttribute('stroke-dasharray', t.state === 'implant' ? '3 3' : 'none')
    if (t.state === 'filling') el('ellipse', { rx: t.w * 0.22, ry: t.d * 0.18, fill: TOOLS.filling.mark, opacity: 0.9 }, t.mark)
    if (t.state === 'crown') el('path', { d: toothPath({ kind: t.kind, w: t.w + 5, d: t.d + 5 }), fill: 'none', stroke: TOOLS.crown.mark, 'stroke-width': 2.5 }, t.mark)
    if (t.state === 'bonding') { el('path', { d: 'M' + (-t.w * 0.35) + ' ' + (-t.d * 0.45) + ' L' + (t.w * 0.35) + ' ' + (-t.d * 0.45), stroke: TOOLS.bonding.mark, 'stroke-width': 3, 'stroke-linecap': 'round' }, t.mark); el('circle', { cx: t.w * 0.25, cy: -t.d * 0.1, r: 2.2, fill: '#fff' }, t.mark) }
    if (t.state === 'implant') { var s = el('g', { stroke: TOOLS.implant.mark, 'stroke-width': 1.6, fill: 'none' }, t.mark); el('path', { d: 'M-4 -8 L4 -8 L3 8 L-3 8 Z' }, s); for (var i = -5; i <= 5; i += 3.3) el('path', { d: 'M-5 ' + i + ' L5 ' + (i + 1.5) }, s) }
  }
  function hint(t) {
    $('#sm-hint').textContent = t.name.charAt(0).toUpperCase() + t.name.slice(1) + ' (' + t.id + ')' + (t.state !== 'clear' ? ': ' + TOOLS[t.state].name.toLowerCase() : '')
  }
  function setShade(i) {
    shade = i
    var c = SHADES[i][1]
    e0.setAttribute('stop-color', '#ffffff'); e1.setAttribute('stop-color', c); e2.setAttribute('stop-color', shadeDown(c))
    $('#sm-shade-out').textContent = SHADES[i][0]
    var lighter = i - START
    $('#sm-shade-note').textContent = lighter > 0 ? lighter + ' shade' + (lighter > 1 ? 's' : '') + ' lighter than A3. Whitening usually takes you 4 to 8 shades lighter.' : lighter < 0 ? 'Darker than a typical A3.' : 'A3 is a very common natural shade.'
    $('#sm-shade').setAttribute('aria-valuetext', SHADES[i][0])
  }
  function shadeDown(hex) { var c = [1, 3, 5].map(function (k) { return parseInt(hex.substr(k, 2), 16) * 0.82 }); return 'rgb(' + c.map(Math.round).join(',') + ')' }

  // ---- The plan, priced like the finance calculator ----
  function monthly(p, m) {
    if (m <= 12) return { pay: p / m, note: '0% interest' }
    var r = Math.pow(1.099, 1 / 12) - 1
    return { pay: p * r / (1 - Math.pow(1 + r, -m)), note: '9.9% APR' }
  }
  function renderPlan() {
    var counts = {}, total = 0
    teeth.forEach(function (t) { if (t.state !== 'clear') { counts[t.state] = (counts[t.state] || 0) + 1; total += TOOLS[t.state].price } })
    if (whiten) total += WHITEN.price
    var ul = $('#sm-plan'); ul.innerHTML = ''
    Object.keys(counts).forEach(function (k) { var li = document.createElement('li'); li.innerHTML = '<span></span><b></b>'; li.firstChild.textContent = counts[k] + ' × ' + TOOLS[k].name; li.lastChild.textContent = gbp(counts[k] * TOOLS[k].price); ul.appendChild(li) })
    if (whiten) { var w = document.createElement('li'); w.innerHTML = '<span></span><b></b>'; w.firstChild.textContent = WHITEN.name; w.lastChild.textContent = gbp(WHITEN.price); ul.appendChild(w) }
    if (!ul.children.length) { var e = document.createElement('li'); e.className = 'is-empty'; e.textContent = 'Tap teeth to add treatments, or add whitening.'; ul.appendChild(e) }
    $('#sm-total').textContent = gbp(total)
    var m = monthly(total, months)
    $('#sm-month').textContent = total ? gbp(Math.round(m.pay * 100) / 100) + ' / month' : '£0'
    $('#sm-month-note').textContent = total ? months + ' months · ' + m.note + (total < 350 ? '' : '') : ''
    $$('[data-months]').forEach(function (b) { b.setAttribute('aria-pressed', String(Number(b.dataset.months) === months)) })
    $('#sm-whiten').setAttribute('aria-pressed', String(whiten))
  }

  // ---- Controls ----
  $$('[data-tool]').forEach(function (b) { b.addEventListener('click', function () { tool = b.dataset.tool; $$('[data-tool]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)) }) }) })
  $$('[data-months]').forEach(function (b) { b.addEventListener('click', function () { months = Number(b.dataset.months); renderPlan() }) })
  var slider = $('#sm-shade'); slider.max = SHADES.length - 1; slider.value = START
  slider.addEventListener('input', function () { setShade(Number(slider.value)) })
  $('#sm-whiten').addEventListener('click', function () {
    whiten = !whiten
    if (whiten && shade < 8) { var from = shade, to = 9, t0 = performance.now(); (function anim(now) { var k = Math.min(1, (now - t0) / (reduce ? 1 : 900)); var i = Math.round(from + (to - from) * k); slider.value = i; setShade(i); if (k < 1) requestAnimationFrame(anim) })(t0) }
    renderPlan()
  })
  $('#sm-reset').addEventListener('click', function () { teeth.forEach(function (t) { t.state = 'clear'; drawMark(t) }); whiten = false; slider.value = START; setShade(START); renderPlan() })
  $('#sm-book').addEventListener('click', function () {
    var best = null
    teeth.forEach(function (t) { if (t.state !== 'clear' && (!best || TOOLS[t.state].price > TOOLS[best].price)) best = t.state })
    var name = best ? TOOLS[best].name : whiten ? WHITEN.name : 'New patient exam'
    var reason = document.getElementById('reason')
    if (reason) Array.prototype.forEach.call(reason.options, function (o) { if (o.textContent === name) reason.value = o.value || o.textContent })
    var book = document.getElementById('book'); if (book) book.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
  })

  setShade(START); renderPlan()
  // a gentle intro: the teeth settle in one by one
  if (!reduce && 'IntersectionObserver' in window) {
    teeth.forEach(function (t) { t.g.style.opacity = 0 })
    var io = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return
      io.disconnect()
      teeth.forEach(function (t, i) { var k = t.id % 10; setTimeout(function () { t.g.style.transition = 'opacity .4s ease'; t.g.style.opacity = 1 }, 80 + k * 70 + (t.id > 30 ? 120 : 0)) })
    }, { threshold: 0.3 })
    io.observe(svg)
  }
  root.classList.add('is-ready')
})()
