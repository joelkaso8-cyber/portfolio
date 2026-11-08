// Vreshta "Aroma wheel": pick a wine and the wheel turns to its aromas, which bloom like petals.
// Swirl the glass in the middle (drag around it, or press Swirl) and aroma rises out to the notes.
// Shows structure and food pairings, and adds the bottle to the shop cart. Loaded when #aroma scrolls near.
;(function () {
  var root = document.getElementById('aroma')
  if (!root || root.dataset.ready) return
  root.dataset.ready = '1'
  var $ = function (s) { return root.querySelector(s) }
  var NS = 'http://www.w3.org/2000/svg'
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)

  var FAMILIES = [
    { name: 'Red fruit', color: '#c46a5e', notes: ['Strawberry', 'Raspberry', 'Cherry', 'Watermelon'] },
    { name: 'Dark fruit', color: '#7a5068', notes: ['Blackberry', 'Plum', 'Black cherry', 'Fig'] },
    { name: 'Orchard & citrus', color: '#e0b25c', notes: ['Apricot', 'Peach', 'Grapefruit', 'Lemon zest'] },
    { name: 'Floral', color: '#c7a3c4', notes: ['Rose', 'Violet', 'Honeysuckle', 'Orange blossom'] },
    { name: 'Spice & herb', color: '#9fb07a', notes: ['Black pepper', 'White pepper', 'Garrigue', 'Olive'] },
    { name: 'Earth & oak', color: '#9a7652', notes: ['Wet stone', 'Sea salt', 'Leather', 'Mocha'] },
  ]
  // Same wines, order and prices as the shop in main.js.
  var WINES = [
    { id: 'rose', name: 'Hill Rosé', grapes: 'Grenache rosé', price: 28, c: '#d98c86', notes: { Strawberry: 1, Watermelon: 0.8, Grapefruit: 0.7, Rose: 0.6, 'Sea salt': 0.9, 'Wet stone': 0.5 }, s: [2, 4, 1, 1], pair: 'Grilled shrimp, goat cheese, summer salads.' },
    { id: 'gsm', name: 'Three Rows GSM', grapes: 'Grenache, Syrah, Mourvèdre', price: 42, c: '#6b1f2b', notes: { Raspberry: 1, Cherry: 0.8, Plum: 0.7, Garrigue: 0.9, 'White pepper': 0.6, Leather: 0.5 }, s: [4, 3, 3, 1], pair: 'Lamb, roast chicken, wild mushrooms.' },
    { id: 'syrah', name: 'Limestone Syrah', grapes: 'Syrah on limestone', price: 48, c: '#4a1420', notes: { Blackberry: 1, 'Black cherry': 0.7, 'Black pepper': 1, Olive: 0.8, Violet: 0.6, Mocha: 0.5, 'Wet stone': 0.4 }, s: [5, 3, 4, 1], pair: 'Ribeye, smoked brisket, aged cheddar.' },
    { id: 'white', name: 'Golden Hour White', grapes: 'Roussanne, Viognier', price: 34, c: '#d8c06e', notes: { Apricot: 1, Peach: 0.8, Honeysuckle: 0.9, 'Orange blossom': 0.6, 'Lemon zest': 0.5, 'Wet stone': 0.4 }, s: [3, 3, 0, 2], pair: 'Lobster, roast chicken, mild curries.' },
  ]
  var STRUCT = ['Body', 'Acidity', 'Tannin', 'Sweetness']

  var C = 220, R0 = 66, R1 = 128, R2 = 132, R3 = 182
  var notes = [], step = (Math.PI * 2) / 24
  FAMILIES.forEach(function (f, fi) { f.notes.forEach(function (n, ni) { notes.push({ name: n, fam: fi, a0: (fi * 4 + ni) * step, bloom: 0, vb: 0 }) }) })

  function el(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e }
  function pol(r, a) { return [C + r * Math.cos(a - Math.PI / 2), C + r * Math.sin(a - Math.PI / 2)] }
  function arc(r0, r1, a0, a1) {
    var p0 = pol(r1, a0), p1 = pol(r1, a1), p2 = pol(r0, a1), p3 = pol(r0, a0), big = a1 - a0 > Math.PI ? 1 : 0
    return 'M' + p0.join(' ') + ' A' + r1 + ' ' + r1 + ' 0 ' + big + ' 1 ' + p1.join(' ') + ' L' + p2.join(' ') + ' A' + r0 + ' ' + r0 + ' 0 ' + big + ' 0 ' + p3.join(' ') + ' Z'
  }

  var svg = el('svg', { viewBox: '0 0 440 440', class: 'ar__svg' })
  var defs = el('defs', {}, svg)
  var wheel = el('g', {}, svg)
  FAMILIES.forEach(function (f, fi) {
    var a0 = fi * 4 * step, a1 = a0 + 4 * step
    f.el = el('path', { d: arc(R0, R1, a0 + 0.004, a1 - 0.004), fill: f.color, opacity: 0.32 }, wheel)
    var mid = (a0 + a1) / 2, p = pol((R0 + R1) / 2, mid), deg = mid * 180 / Math.PI, flip = deg > 90 && deg < 270
    f.label = el('text', { x: p[0], y: p[1], 'text-anchor': 'middle', 'dominant-baseline': 'middle', class: 'ar__fam', transform: 'rotate(' + (flip ? deg + 180 : deg) + ' ' + p[0] + ' ' + p[1] + ')' }, wheel)
    f.label.textContent = f.name; f.deg = deg; f.p = p
  })
  notes.forEach(function (n) {
    var g = el('g', { class: 'ar__note', tabindex: -1 }, wheel)
    n.path = el('path', { fill: FAMILIES[n.fam].color }, g)
    var mid = n.a0 + step / 2, deg = mid * 180 / Math.PI, flip = deg > 180
    var p = pol((R2 + R3) / 2 + 2, mid)
    n.text = el('text', { x: p[0], y: p[1], 'dominant-baseline': 'middle', 'text-anchor': 'middle', class: 'ar__label', transform: 'rotate(' + (flip ? deg + 90 : deg - 90) + ' ' + p[0] + ' ' + p[1] + ')' }, g)
    n.text.textContent = n.name; n.deg = deg; n.p = p
    g.addEventListener('pointerenter', function () { hint(n) })
  })
  // the glass, seen from above
  var wineGrad = el('radialGradient', { id: 'ar-wine', cx: '45%', cy: '42%', r: '60%' }, defs)
  var ws = [el('stop', { offset: 0 }, wineGrad), el('stop', { offset: 0.7 }, wineGrad), el('stop', { offset: 1 }, wineGrad)]
  var glass = el('g', { class: 'ar__glass' }, svg)
  el('circle', { cx: C, cy: C, r: 60, fill: 'rgba(247,239,226,0.06)', stroke: 'rgba(247,239,226,0.55)', 'stroke-width': 2 }, glass)
  var liquid = el('ellipse', { cx: C, cy: C, rx: 48, ry: 48, fill: 'url(#ar-wine)' }, glass)
  var crest = el('ellipse', { cx: C, cy: C, rx: 40, ry: 12, fill: 'rgba(255,255,255,0.14)' }, glass)
  var legs = el('g', {}, glass)
  el('path', { d: 'M' + (C - 40) + ' ' + (C - 34) + ' A 54 54 0 0 1 ' + (C + 18) + ' ' + (C - 52), fill: 'none', stroke: 'rgba(255,255,255,0.55)', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, glass)
  var puffs = el('g', {}, svg)
  $('#ar-stage').appendChild(svg)

  var st = { wine: 2, rot: 0, vr: 0, target: 0, swirl: 0, va: 0, energy: 0, angle: 0, legs: [] }
  var parts = [], running = false, raf = 0, last = 0

  function wine() { return WINES[st.wine] }
  function targetRotation() {
    // turn the wheel so the heart of this wine's aromas faces the top
    var x = 0, y = 0
    notes.forEach(function (n) { var w = wine().notes[n.name] || 0; var a = n.a0 + step / 2; x += Math.sin(a) * w; y += Math.cos(a) * w })
    var a = Math.atan2(x, y)
    var t = -a, cur = st.rot
    while (t - cur > Math.PI) t -= Math.PI * 2
    while (t - cur < -Math.PI) t += Math.PI * 2
    return t
  }
  function pick(i) {
    st.wine = i; st.target = targetRotation()
    Array.prototype.forEach.call(root.querySelectorAll('[data-wine]'), function (b) { b.setAttribute('aria-pressed', String(Number(b.dataset.wine) === i)) })
    var w = wine()
    ws[0].setAttribute('stop-color', lighten(w.c, 0.35)); ws[1].setAttribute('stop-color', w.c); ws[2].setAttribute('stop-color', darken(w.c, 0.35))
    $('#ar-name').textContent = w.name; $('#ar-grapes').textContent = w.grapes
    $('#ar-pair').textContent = w.pair
    $('#ar-add').textContent = 'Add to cart · $' + w.price
    var list = $('#ar-notes'); list.innerHTML = ''
    Object.keys(w.notes).sort(function (a, b) { return w.notes[b] - w.notes[a] }).forEach(function (name) {
      var n = notes.find(function (x) { return x.name === name }), li = document.createElement('li')
      li.textContent = name; li.style.setProperty('--c', FAMILIES[n.fam].color)
      li.addEventListener('pointerenter', function () { hint(n) })
      list.appendChild(li)
    })
    var sbox = $('#ar-struct'); sbox.innerHTML = ''
    STRUCT.forEach(function (label, k) {
      var row = document.createElement('div'); row.innerHTML = '<dt></dt><dd></dd>'
      row.firstChild.textContent = label; row.lastChild.setAttribute('aria-label', w.s[k] + ' out of 5')
      for (var j = 0; j < 5; j++) { var i = document.createElement('i'); if (j < w.s[k]) i.className = 'on'; row.lastChild.appendChild(i) }
      sbox.appendChild(row)
    })
    $('#ar-hint').textContent = 'Swirl the glass to open it up.'
    st.legs = []
    kick()
  }
  function hint(n) {
    var w = wine(), has = w.notes[n.name]
    $('#ar-hint').textContent = n.name + ' · ' + FAMILIES[n.fam].name.toLowerCase() + (has ? ': in this glass.' : ': not in this one.')
  }
  function hexRgb(h) { return [1, 3, 5].map(function (i) { return parseInt(h.substr(i, 2), 16) }) }
  function rgbHex(c) { return '#' + c.map(function (v) { return ('0' + Math.max(0, Math.min(255, Math.round(v))).toString(16)).slice(-2) }).join('') }
  function lighten(h, t) { return rgbHex(hexRgb(h).map(function (v) { return v + (255 - v) * t })) }
  function darken(h, t) { return rgbHex(hexRgb(h).map(function (v) { return v * (1 - t) })) }

  // ---- Animation ----
  function step_(dt, now) {
    st.vr += (60 * (st.target - st.rot) - 11 * st.vr) * dt; st.rot += st.vr * dt
    st.va *= Math.exp(-1.6 * dt); st.angle += st.va * dt
    st.energy = Math.max(0, Math.min(1, st.energy + (Math.abs(st.va) / 9 - 0.25) * dt))
    var w = wine(), amp = 0.65 + 0.35 * st.energy
    notes.forEach(function (n) {
      var goal = (w.notes[n.name] || 0) * amp
      n.vb += (140 * (goal - n.bloom) - 16 * n.vb) * dt; n.bloom += n.vb * dt
    })
    // tears of wine form after a swirl and slide down
    if (Math.abs(st.va) < 2 && st.energy > 0.25 && st.legs.length < 9 && Math.random() < dt * 6) st.legs.push({ a: Math.random() * Math.PI * 2, t: 0 })
    st.legs.forEach(function (l) { l.t += dt }); st.legs = st.legs.filter(function (l) { return l.t < 2.4 })
    // aroma rising out of the glass towards the bloomed notes
    if (!reduce && Math.abs(st.va) > 1.5 && Math.random() < dt * Math.min(12, Math.abs(st.va))) {
      var cand = notes.filter(function (n) { return w.notes[n.name] })
      var n = cand[Math.floor(Math.random() * cand.length)]
      parts.push({ n: n, t: 0, wob: Math.random() * 6 })
    }
    parts.forEach(function (p) { p.t += dt * 0.9 }); parts = parts.filter(function (p) { return p.t < 1 })
  }
  function render(now) {
    wheel.setAttribute('transform', 'rotate(' + (st.rot * 180 / Math.PI).toFixed(2) + ' ' + C + ' ' + C + ')')
    // keep every label readable whichever way the wheel has turned
    var rd = st.rot * 180 / Math.PI
    FAMILIES.forEach(function (f) { var eff = ((f.deg + rd) % 360 + 360) % 360, flip = eff > 90 && eff < 270, k = flip ? 1 : 0; if (f.k !== k) { f.k = k; f.label.setAttribute('transform', 'rotate(' + (flip ? f.deg + 180 : f.deg) + ' ' + f.p[0] + ' ' + f.p[1] + ')') } })
    notes.forEach(function (n) { var eff = ((n.deg + rd) % 360 + 360) % 360, flip = eff > 180, k = flip ? 1 : 0; if (n.k !== k) { n.k = k; n.text.setAttribute('text-anchor', 'middle'); n.text.setAttribute('transform', 'rotate(' + (flip ? n.deg + 90 : n.deg - 90) + ' ' + n.p[0] + ' ' + n.p[1] + ')') } })
    var w = wine()
    FAMILIES.forEach(function (f, fi) {
      var has = notes.some(function (n) { return n.fam === fi && w.notes[n.name] })
      f.el.setAttribute('opacity', has ? 0.62 : 0.2); f.label.setAttribute('opacity', has ? 1 : 0.45)
    })
    notes.forEach(function (n) {
      var b = Math.max(0, n.bloom), r1 = R3 + b * 34, inset = 0.012 + (1 - Math.min(1, b)) * 0.006
      n.path.setAttribute('d', arc(R2, r1, n.a0 + inset, n.a0 + step - inset))
      n.path.setAttribute('opacity', (0.16 + 0.84 * Math.min(1, b)).toFixed(3))
      n.text.setAttribute('opacity', (0.35 + 0.65 * Math.min(1, b)).toFixed(3))
      n.text.classList.toggle('is-on', b > 0.3)
    })
    // swirl in the glass
    var s = Math.min(1, Math.abs(st.va) / 10)
    liquid.setAttribute('rx', (48 - s * 2).toFixed(2)); liquid.setAttribute('ry', (48 - s * 5).toFixed(2))
    liquid.setAttribute('transform', 'rotate(' + (st.angle * 57.3).toFixed(1) + ' ' + C + ' ' + C + ') translate(' + (s * 4).toFixed(2) + ' 0)')
    crest.setAttribute('transform', 'rotate(' + (st.angle * 57.3).toFixed(1) + ' ' + C + ' ' + C + ') translate(0 ' + (-18 - s * 10).toFixed(2) + ')')
    crest.setAttribute('opacity', (0.3 + 0.7 * s).toFixed(3))
    while (legs.firstChild) legs.removeChild(legs.firstChild)
    st.legs.forEach(function (l) {
      var k = Math.min(1, l.t / 2.4), r = 56 - k * 9, p = pol(r, l.a), q = pol(56, l.a)
      el('line', { x1: q[0], y1: q[1], x2: p[0], y2: p[1], stroke: lighten(w.c, 0.15), 'stroke-width': 2.2, 'stroke-linecap': 'round', opacity: (0.7 * (1 - k)).toFixed(2) }, legs)
    })
    while (puffs.firstChild) puffs.removeChild(puffs.firstChild)
    parts.forEach(function (p) {
      var a = p.n.a0 + step / 2 + st.rot, r = 50 + p.t * (R3 + 20 - 50), pt = pol(r, a + Math.sin(p.t * 6 + p.wob) * 0.08)
      el('circle', { cx: pt[0], cy: pt[1], r: (2.2 + p.t * 2.5).toFixed(2), fill: FAMILIES[p.n.fam].color, opacity: (0.85 * (1 - p.t)).toFixed(2) }, puffs)
    })
  }
  function busy() {
    return Math.abs(st.target - st.rot) > 0.001 || Math.abs(st.vr) > 0.001 || Math.abs(st.va) > 0.05 || st.legs.length || parts.length ||
      notes.some(function (n) { return Math.abs(n.vb) > 0.002 || Math.abs((wine().notes[n.name] || 0) * (0.65 + 0.35 * st.energy) - n.bloom) > 0.002 }) || st.energy > 0.01
  }
  function frame(now) {
    raf = 0
    var dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60
    last = now
    step_(dt, now); render(now)
    if (running && busy()) raf = requestAnimationFrame(frame); else last = 0
  }
  function kick() { if (!raf) { if (running) { last = 0; raf = requestAnimationFrame(frame) } else render(performance.now()) } }

  // ---- Swirl: drag around the glass ----
  var drag = null
  function angleOf(e) { var r = svg.getBoundingClientRect(); return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) }
  // a round grip over the glass takes the drag (so the rest of the wheel still scrolls the page on phones)
  var grip = document.createElement('div'); grip.className = 'ar__grip'; grip.setAttribute('aria-hidden', 'true'); $('#ar-stage').appendChild(grip)
  grip.addEventListener('pointerdown', function (e) {
    drag = { a: angleOf(e), t: performance.now() }; try { grip.setPointerCapture(e.pointerId) } catch (er) {}
    root.classList.add('is-swirling')
  })
  grip.addEventListener('pointermove', function (e) {
    if (!drag) return
    var a = angleOf(e), d = a - drag.a, now = performance.now()
    if (d > Math.PI) d -= Math.PI * 2; if (d < -Math.PI) d += Math.PI * 2
    var dt = Math.max(0.008, (now - drag.t) / 1000)
    st.va = st.va * 0.6 + (d / dt) * 0.4; st.va = Math.max(-16, Math.min(16, st.va))
    drag.a = a; drag.t = now; kick()
  })
  function end() { drag = null; root.classList.remove('is-swirling') }
  grip.addEventListener('pointerup', end); grip.addEventListener('pointercancel', end)
  $('#ar-swirl').addEventListener('click', function () { st.va = reduce ? 4 : 11; st.energy = Math.max(st.energy, 0.4); kick() })

  Array.prototype.forEach.call(root.querySelectorAll('[data-wine]'), function (b) {
    var w = WINES[Number(b.dataset.wine)]; b.querySelector('i').style.background = w.c
    b.addEventListener('click', function () { pick(Number(b.dataset.wine)) })
  })
  $('#ar-add').addEventListener('click', function () {
    var btn = document.querySelectorAll('#wine-list .wine .btn')[st.wine]
    if (btn) { btn.click(); $('#ar-hint').textContent = wine().name + ' is in your cart.' }
  })

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { running = es[0].isIntersecting && !document.hidden; if (running) kick(); else if (raf) { cancelAnimationFrame(raf); raf = 0 } }).observe(svg)
  } else running = true
  pick(2); st.rot = st.target
  if (reduce) notes.forEach(function (n) { n.bloom = (wine().notes[n.name] || 0) * 0.65 })
  render(performance.now()); kick()
  root.classList.add('is-ready')
})()
