// Pranvera "In season": turn the year on a ring of months; the studio's six stems open petal by petal when they are
// in season in Britain and close back to buds when they are not. Tap a flower to add it to the bouquet builder,
// or fill the builder with that month's flowers. Loaded by main.js when #season scrolls near.
;(function () {
  var root = document.getElementById('season')
  if (!root || root.dataset.ready) return
  root.dataset.ready = '1'
  var $ = function (s) { return root.querySelector(s) }
  var NS = 'http://www.w3.org/2000/svg'
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  // Same stems and colours as the builder in main.js; seasons for British-grown flowers (tulips Dutch-grown, as sold).
  var FLOWERS = [
    { id: 'peony', name: 'Peony', kind: 'peony', c1: '#e7bcc8', c2: '#c98b9c', s: [0, 0, 0, 0, 0.6, 1, 0.4, 0, 0, 0, 0, 0], tip: 'British peonies are here for about six weeks. Order early.' },
    { id: 'rose', name: 'Garden rose', kind: 'rose', c1: '#d79bb4', c2: '#a8657f', s: [0, 0, 0, 0, 0.3, 0.9, 1, 1, 0.9, 0.6, 0.2, 0], tip: 'Somerset roses, scented, from June to the first frosts.' },
    { id: 'ranunculus', name: 'Ranunculus', kind: 'ranunculus', c1: '#e6c39d', c2: '#b98d63', s: [0.2, 0.5, 0.9, 1, 0.7, 0.2, 0, 0, 0, 0, 0.1, 0.1], tip: 'At their best in early spring, with layer after layer of petals.' },
    { id: 'tulip', name: 'Tulip', kind: 'tulip', c1: '#eee0c9', c2: '#c8b08a', s: [0.6, 0.9, 1, 1, 0.5, 0, 0, 0, 0, 0, 0, 0.3], tip: 'Dutch tulips carry on growing in the vase. Give them room.' },
    { id: 'lisianthus', name: 'Lisianthus', kind: 'lisianthus', c1: '#b8a5cc', c2: '#8a77a0', s: [0, 0, 0, 0, 0, 0.4, 0.9, 1, 1, 0.7, 0.2, 0], tip: 'Late-summer lilac that lasts two weeks in water.' },
    { id: 'euc', name: 'Eucalyptus', kind: 'euc', c1: '#8fa58a', c2: '#6c8268', s: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], tip: 'Silver-green all year, and it scents the room.' },
  ]
  var SEASON_TINT = ['#2a3326', '#2a3326', '#33402c', '#33402c', '#33402c', '#3d3a26', '#3d3a26', '#3d3a26', '#3b2f25', '#3b2f25', '#3b2f25', '#2a3326']

  function el(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e }
  var C = 260, RING0 = 214, RING1 = 252
  var svg = el('svg', { viewBox: '0 0 520 520', class: 'sn__svg', tabindex: 0, 'aria-label': 'Ring of months. Use the left and right arrow keys to change month.' })
  var defs = el('defs', {}, svg)
  var glow = el('radialGradient', { id: 'sn-glow' }, defs)
  el('stop', { offset: 0, 'stop-color': 'rgba(147,173,127,0.16)' }, glow); el('stop', { offset: 1, 'stop-color': 'rgba(147,173,127,0)' }, glow)
  el('circle', { cx: C, cy: C, r: 210, fill: 'url(#sn-glow)' }, svg)
  // ring of months
  var ring = el('g', { class: 'sn__ring' }, svg)
  MONTHS.forEach(function (m, i) {
    var a0 = (i - 0.5) / 12 * Math.PI * 2, a1 = (i + 0.5) / 12 * Math.PI * 2
    var p = function (r, a) { return [C + r * Math.sin(a), C - r * Math.cos(a)] }
    var q0 = p(RING1, a0 + 0.01), q1 = p(RING1, a1 - 0.01), q2 = p(RING0, a1 - 0.01), q3 = p(RING0, a0 + 0.01)
    el('path', { d: 'M' + q0 + ' A' + RING1 + ' ' + RING1 + ' 0 0 1 ' + q1 + ' L' + q2 + ' A' + RING0 + ' ' + RING0 + ' 0 0 0 ' + q3 + ' Z', fill: SEASON_TINT[i], 'data-m': i, class: 'sn__seg' }, ring)
    var t = p((RING0 + RING1) / 2, i / 12 * Math.PI * 2)
    var txt = el('text', { x: t[0], y: t[1], 'text-anchor': 'middle', 'dominant-baseline': 'middle', class: 'sn__mon', transform: 'rotate(' + (i * 30) + ' ' + t[0] + ' ' + t[1] + ')', 'data-m': i }, ring)
    txt.textContent = m.slice(0, 3).toUpperCase()
  })
  el('path', { d: 'M' + C + ' ' + (C - RING1 - 10) + ' l-9 -12 h18 Z', fill: '#d9a3bb' }, svg) // marker at the top
  var garden = el('g', {}, svg)
  $('#sn-stage').appendChild(svg)

  // ---- Flowers, drawn from above; open = 0 (bud) .. 1 (fully open) ----
  var POS = FLOWERS.map(function (f, i) { var a = i / FLOWERS.length * Math.PI * 2 - Math.PI / 2; return [C + Math.cos(a) * 126, C + Math.sin(a) * 126] })
  function petal(w, l, round) { return round ? 'M0 0 C' + (w) + ' ' + (-l * 0.1) + ' ' + (w * 1.1) + ' ' + (l * 0.85) + ' 0 ' + l + ' C' + (-w * 1.1) + ' ' + (l * 0.85) + ' ' + (-w) + ' ' + (-l * 0.1) + ' 0 0 Z' : 'M0 0 C' + w + ' ' + (l * 0.2) + ' ' + (w * 0.8) + ' ' + (l * 0.8) + ' 0 ' + l + ' C' + (-w * 0.8) + ' ' + (l * 0.8) + ' ' + (-w) + ' ' + (l * 0.2) + ' 0 0 Z' }
  var LAYERS = {
    rose: [[7, 30, 26, 1, 0], [6, 23, 22, 1, 0.3], [5, 15, 16, 1, 0.6], [4, 8, 10, 1, 0.9]],
    peony: [[8, 38, 30, 1, 0], [8, 30, 26, 1, 0.2], [7, 21, 20, 1, 0.45], [9, 12, 12, 1, 0.7]],
    ranunculus: [[12, 30, 13, 1, 0], [11, 24, 12, 1, 0.12], [10, 18, 10, 1, 0.25], [9, 12, 8, 1, 0.38], [7, 7, 6, 1, 0.5]],
    tulip: [[3, 34, 20, 0, 0], [3, 30, 18, 0, 0.5]],
    lisianthus: [[5, 32, 24, 1, 0], [5, 20, 16, 1, 0.5]],
  }
  FLOWERS.forEach(function (f, i) {
    var g = el('g', { class: 'sn__flower', tabindex: 0, role: 'button', transform: 'translate(' + POS[i][0] + ' ' + POS[i][1] + ') scale(1.42)' }, garden)
    f.g = g; f.open = 0; f.vo = 0; f.petals = []
    el('circle', { r: 44, fill: 'transparent' }, g) // tap target
    if (f.kind === 'euc') {
      el('path', { d: 'M-30 26 C-10 6 6 -6 30 -28', fill: 'none', stroke: '#5d6f59', 'stroke-width': 2 }, g)
      for (var k = 0; k < 9; k++) { var u = k / 8, x = -30 + 60 * u, y = 26 - 54 * u + Math.sin(u * 3) * 4; var leaf = el('ellipse', { cx: x + (k % 2 ? 7 : -7), cy: y + (k % 2 ? 5 : -5), rx: 7, ry: 7, fill: k % 2 ? f.c1 : f.c2 }, g); f.petals.push({ el: leaf, k: k, euc: true }) }
    } else {
      LAYERS[f.kind].forEach(function (L, li) {
        for (var p = 0; p < L[0]; p++) {
          var base = p / L[0] * 360 + li * 17
          var pe = el('path', { d: petal(L[2] / 2, L[1], L[3]), fill: li % 2 ? f.c1 : f.c2, stroke: 'rgba(0,0,0,.18)', 'stroke-width': 0.6 }, g)
          f.petals.push({ el: pe, base: base, layer: li, delay: L[4] })
        }
      })
      el('circle', { r: f.kind === 'lisianthus' ? 5 : 3.5, fill: f.kind === 'tulip' ? '#3a3020' : '#f3e2a0', opacity: 0.9 }, g)
    }
    var label = el('text', { y: 58, 'text-anchor': 'middle', class: 'sn__name' }, g); label.textContent = f.name
    f.label = label
    g.addEventListener('click', function () { addStem(f) })
    g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); addStem(f) } })
    g.addEventListener('pointerenter', function () { $('#sn-tip').textContent = f.name + ': ' + f.tip })
  })
  function paintFlower(f) {
    var o = Math.max(0, Math.min(1.08, f.open)), dim = 0.35 + 0.65 * Math.min(1, f.s[month] * 1.4)
    f.g.style.opacity = dim.toFixed(3)
    f.label.setAttribute('opacity', (0.5 + 0.5 * Math.min(1, f.s[month] * 2)).toFixed(2))
    f.petals.forEach(function (p) {
      if (p.euc) { p.el.setAttribute('rx', (3 + 5 * o).toFixed(2)); p.el.setAttribute('ry', (3 + 5 * o).toFixed(2)); return }
      var local = Math.max(0, Math.min(1, (o - p.delay * 0.35) / (1 - p.delay * 0.35)))
      var scale = 0.25 + 0.75 * local, spin = (1 - local) * 40
      p.el.setAttribute('transform', 'rotate(' + (p.base + spin).toFixed(1) + ') scale(' + (0.6 + 0.4 * local).toFixed(3) + ' ' + scale.toFixed(3) + ')')
    })
  }

  // ---- Month and ring ----
  var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', month: 'numeric' }).formatToParts(new Date())
  var month = Number((parts.find(function (x) { return x.type === 'month' }) || { value: 1 }).value) - 1
  var rot = -month * 30, vrot = 0, target = rot, drag = null, running = false, raf = 0, last = 0
  function setMonth(m, fromDrag) {
    month = ((m % 12) + 12) % 12
    if (!fromDrag) { var t = -month * 30; while (t - rot > 180) t -= 360; while (t - rot < -180) t += 360; target = t }
    renderPanel(); kick()
  }
  function renderPanel() {
    var name = MONTHS[month]
    $('#sn-month').textContent = name
    var inS = FLOWERS.filter(function (f) { return f.s[month] >= 0.6 }), coming = FLOWERS.filter(function (f) { return f.s[month] > 0 && f.s[month] < 0.6 })
    $('#sn-in').textContent = inS.map(function (f) { return f.name }).join(', ') || 'Only greenery'
    $('#sn-soon').textContent = coming.length ? coming.map(function (f) { return f.name }).join(', ') : 'Nothing else'
    $('#sn-fill').textContent = 'Fill the builder with ' + name + ' flowers'
    var best = inS.filter(function (f) { return f.id !== 'euc' }).sort(function (a, b) { return b.s[month] - a.s[month] })[0]
    $('#sn-tip').textContent = best ? best.name + ': ' + best.tip : 'Winter is quiet for British flowers. Tulips and eucalyptus carry the studio.'
    Array.prototype.forEach.call(root.querySelectorAll('.sn__mon'), function (t) { t.classList.toggle('is-on', Number(t.dataset.m) === month) })
  }
  // drag the ring around
  function ang(e) { var r = svg.getBoundingClientRect(); return Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) * 180 / Math.PI }
  ring.addEventListener('pointerdown', function (e) {
    var m = e.target.getAttribute('data-m')
    drag = { a: ang(e), r: rot, moved: false, m: m }
    try { ring.setPointerCapture(e.pointerId) } catch (er) {}
  })
  ring.addEventListener('pointermove', function (e) {
    if (!drag) return
    var d = ang(e) - drag.a; if (d > 180) d -= 360; if (d < -180) d += 360
    if (Math.abs(d) > 3) drag.moved = true
    if (drag.moved) { rot = drag.r + d; target = rot; var m = Math.round(-rot / 30); if ((((m % 12) + 12) % 12) !== month) setMonth(m, true); paintAll() }
  })
  ring.addEventListener('pointerup', function () {
    if (!drag) return
    if (!drag.moved && drag.m !== null) setMonth(Number(drag.m))
    else { var m = Math.round(-rot / 30); target = -m * 30; setMonth(m, true); target = -m * 30 }
    drag = null; kick()
  })
  ring.addEventListener('pointercancel', function () { drag = null })
  $('#sn-prev').addEventListener('click', function () { setMonth(month - 1) })
  $('#sn-next').addEventListener('click', function () { setMonth(month + 1) })
  svg.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') setMonth(month - 1); if (e.key === 'ArrowRight') setMonth(month + 1) })

  // ---- Builder hooks: click the builder's own buttons, so prices and the preview stay in step ----
  function stemRow(id) { return document.querySelector('#stems .stem[data-id="' + id + '"]') }
  function addStem(f) {
    var row = stemRow(f.id); if (!row) return
    row.querySelectorAll('button')[1].click()
    $('#sn-status').textContent = 'Added one ' + f.name.toLowerCase() + ' to your bouquet.'
    f.vo += 4; kick()
  }
  $('#sn-fill').addEventListener('click', function () {
    var picks = FLOWERS.filter(function (f) { return f.s[month] >= 0.6 && f.id !== 'euc' })
    if (!picks.length) picks = FLOWERS.filter(function (f) { return f.s[month] > 0 && f.id !== 'euc' })
    Array.prototype.forEach.call(document.querySelectorAll('#stems .stem'), function (row) { var out = row.querySelector('output'), minus = row.querySelectorAll('button')[0], n = Number(out.textContent) || 0; for (var i = 0; i < n; i++) minus.click() })
    var total = 15, weights = picks.reduce(function (a, f) { return a + f.s[month] }, 0)
    picks.forEach(function (f) { var n = Math.max(3, Math.round(total * f.s[month] / weights)); for (var i = 0; i < n; i++) stemRow(f.id).querySelectorAll('button')[1].click() })
    for (var e = 0; e < 4; e++) stemRow('euc').querySelectorAll('button')[1].click()
    var build = document.getElementById('build'); if (build) build.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
  })

  // ---- Animation ----
  function paintAll() { ring.setAttribute('transform', 'rotate(' + rot.toFixed(2) + ' ' + C + ' ' + C + ')'); FLOWERS.forEach(paintFlower) }
  function frame(now) {
    raf = 0
    var dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60
    last = now
    var busy = false
    if (!drag) { vrot += (90 * (target - rot) - 14 * vrot) * dt; rot += vrot * dt; if (Math.abs(target - rot) > 0.05 || Math.abs(vrot) > 0.05) busy = true; else { rot = target; vrot = 0 } }
    FLOWERS.forEach(function (f) {
      var goal = f.s[month]
      if (reduce) { f.open = goal; f.vo = 0; return }
      f.vo += (55 * (goal - f.open) - 7 * f.vo) * dt; f.open += f.vo * dt
      if (Math.abs(goal - f.open) > 0.002 || Math.abs(f.vo) > 0.01) busy = true
    })
    paintAll()
    if (running && busy) raf = requestAnimationFrame(frame); else last = 0
  }
  function kick() { if (running && !raf) { last = 0; raf = requestAnimationFrame(frame) } else if (!running) paintAll() }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { running = es[0].isIntersecting && !document.hidden; if (running) kick() }).observe(svg)
  } else running = true
  FLOWERS.forEach(function (f) { f.open = reduce ? f.s[month] : 0 })
  rot = -month * 30 + 60; target = -month * 30
  renderPanel(); paintAll(); kick()
  root.classList.add('is-ready')
})()
