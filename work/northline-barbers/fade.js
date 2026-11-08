// Northline "Design your cut": a side-profile head you style live (fade height, guard, top, beard, colours).
// It names the cut, picks the service, price and barber, and pre-fills the booker. English and Albanian.
// Loaded by main.js when #fade scrolls near.
;(function () {
  var root = document.getElementById('fade')
  if (!root || root.dataset.ready) return
  root.dataset.ready = '1'
  var $ = function (s) { return root.querySelector(s) }
  var $$ = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)) }
  var NS = 'http://www.w3.org/2000/svg'
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)

  var TXT = {
    en: {
      heights: ['Low fade', 'Mid fade', 'High fade'], guards: ['0 · skin', '0.5', '1', '2'],
      tops: { crop: 'Textured crop', quiff: 'Quiff', slick: 'Slick back', curls: 'Curls' },
      beards: { none: 'No beard', stubble: 'Stubble', sculpt: 'Beard sculpt' },
      skin: 'Skin', hair: 'Hair', fadeL: 'Fade height', guardL: 'Clipper guard', topL: 'Top', lenL: 'Top length', beardL: 'Beard',
      cut: 'Your cut', service: 'Book as', barber: 'Best barber', book: 'Book this cut', mins: 'min', short: 'short', mid: 'medium', long: 'long',
      why: { Dan: 'fades are his thing', Arben: 'scissor work on longer tops', Leo: 'textured crops and beards' },
      skinFade: 'skin', guard: 'guard', top: 'on top', drag: 'Drag the fade line',
    },
    sq: {
      heights: ['Fade i ulët', 'Fade i mesëm', 'Fade i lartë'], guards: ['0 · lëkurë', '0.5', '1', '2'],
      tops: { crop: 'Me teksturë', quiff: 'Quiff', slick: 'Krehur prapa', curls: 'Kaçurrela' },
      beards: { none: 'Pa mjekër', stubble: 'Mjekër e shkurtër', sculpt: 'Mjekër e formuar' },
      skin: 'Lëkura', hair: 'Flokët', fadeL: 'Lartësia e fade-it', guardL: 'Numri i makinës', topL: 'Sipër', lenL: 'Gjatësia sipër', beardL: 'Mjekra',
      cut: 'Prerja jote', service: 'Rezervo si', barber: 'Berberi më i mirë', book: 'Rezervo këtë prerje', mins: 'min', short: 'shkurt', mid: 'mesatar', long: 'gjatë',
      why: { Dan: 'fade-t janë specialiteti i tij', Arben: 'punë me gërshërë për flokë më të gjata', Leo: 'prerje me teksturë dhe mjekra' },
      skinFade: 'deri te lëkura', guard: 'numri', top: 'sipër', drag: 'Tërhiq vijën e fade-it',
    },
  }
  // Same services and prices as the booker in main.js: [index in the booker, name en, name sq, minutes, price]
  var SERVICE = { fade: [0, 'Skin fade', 'Skin fade', 30, 24], classic: [1, 'Classic cut', 'Prerje klasike', 30, 20], combo: [3, 'Cut and beard', 'Prerje dhe mjekër', 50, 34] }
  var BARBER_INDEX = { Dan: 1, Arben: 2, Leo: 3 }
  var SKINS = ['#f1cfb4', '#d9a37f', '#a8704b', '#6b4430']
  var HAIRS = ['#1b1712', '#3b2617', '#7a5131', '#c9a46a']
  var GUARD_ALPHA = [0, 0.22, 0.42, 0.62]

  var st = { fade: 0.5, guard: 0, top: 'crop', len: 0.45, beard: 'none', skin: 1, hair: 0 }
  var lang = document.documentElement.lang === 'sq' ? 'sq' : 'en'
  var T = function () { return TXT[lang] }

  // ---- The head (viewBox 0 0 400 420, facing right) ----
  var HEAD = 'M120 300 C85 270 78 200 100 150 C125 95 200 80 250 100 C285 115 295 150 292 185 C293 195 300 205 316 222 C320 228 312 236 302 236 C304 246 306 254 300 260 C306 266 302 274 296 276 C296 288 292 300 278 306 C260 314 236 312 220 300 C210 292 200 300 196 330 L196 420 L128 420 L132 330 C130 318 126 308 120 300 Z'
  var SIDES = 'M124 300 C94 276 86 214 100 158 L101 150 C150 140 200 137 230 145 C234 168 230 196 225 214 L223 232 C216 236 210 230 208 222 C204 206 194 196 180 195 C160 198 150 220 154 246 C156 272 142 292 124 300 Z'
  var EAR = 'M178 196 C164 196 158 210 160 224 C162 238 170 248 182 246 C190 244 190 236 186 232 C192 226 194 214 190 206 C188 200 184 196 178 196 Z'
  var BEARD_FULL = 'M246 232 C240 262 244 292 266 312 C282 324 298 314 302 298 C305 288 300 280 294 279 L284 279 C281 270 290 264 299 263 C306 259 309 251 303 246 L292 246 C278 248 262 242 258 228 Z'
  var SKULL = [[100, 150], [125, 95], [200, 80], [250, 100]] // cubic from the back of the crown to the front hairline

  function el(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e }
  function bez(p, u) { var a = 1 - u; return [a * a * a * p[0][0] + 3 * a * a * u * p[1][0] + 3 * a * u * u * p[2][0] + u * u * u * p[3][0], a * a * a * p[0][1] + 3 * a * a * u * p[1][1] + 3 * a * u * u * p[2][1] + u * u * u * p[3][1]] }
  function f(n) { return Math.round(n * 10) / 10 }

  var svg = el('svg', { viewBox: '0 0 400 420', class: 'fd__svg', role: 'img' })
  var defs = el('defs', {}, svg)
  var grad = el('linearGradient', { id: 'fd-grad', gradientUnits: 'userSpaceOnUse', x1: 0, y1: 300, x2: 0, y2: 140 }, defs)
  var stops = [0, 1, 2, 3].map(function () { return el('stop', {}, grad) })
  var pat = el('pattern', { id: 'fd-tex', width: 6, height: 6, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(-28)' }, defs)
  el('path', { d: 'M0 3 H6', stroke: 'rgba(0,0,0,.28)', 'stroke-width': 0.8 }, pat)
  var mask = el('mask', { id: 'fd-mask', maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: 400, height: 420 }, defs)
  var mgrad = el('linearGradient', { id: 'fd-mgrad', gradientUnits: 'userSpaceOnUse', x1: 0, y1: 300, x2: 0, y2: 140 }, defs)
  var mstops = [0, 1, 2].map(function () { return el('stop', {}, mgrad) })
  el('path', { d: SIDES, fill: 'url(#fd-mgrad)' }, mask)
  var clip = el('clipPath', { id: 'fd-head' }, defs); el('path', { d: HEAD }, clip)

  // backdrop: barber chair headrest and cape
  el('rect', { x: 0, y: 0, width: 400, height: 420, fill: 'url(#fd-bg)' }, svg)
  var bg = el('radialGradient', { id: 'fd-bg', cx: '62%', cy: '38%', r: '70%' }, defs)
  el('stop', { offset: 0, 'stop-color': '#2a303b' }, bg); el('stop', { offset: 1, 'stop-color': '#14171c' }, bg)
  el('circle', { cx: 196, cy: 205, r: 168, fill: 'none', stroke: 'rgba(201,164,106,.18)', 'stroke-width': 1.5, 'stroke-dasharray': '2 7' }, svg)
  var capeEls = []
  var cape = el('path', { d: 'M40 420 C60 360 110 338 160 336 C210 334 258 340 300 362 C330 378 350 400 360 420 Z', fill: '#1f242c' }, svg)
  capeEls.push(cape, el('path', { d: 'M100 346 C150 336 230 336 290 356', fill: 'none', stroke: '#c9a46a', 'stroke-width': 2, opacity: 0.7 }, svg))
  var head = el('path', { d: HEAD }, svg)
  el('path', { d: 'M220 300 C236 312 260 314 278 306 C260 322 232 330 200 334 L198 318 C206 310 212 304 220 300 Z', fill: 'rgba(0,0,0,.14)' }, svg) // under the jaw
  var sides = el('path', { d: SIDES, fill: 'url(#fd-grad)' }, svg)
  var tex = el('path', { d: SIDES, fill: 'url(#fd-tex)', mask: 'url(#fd-mask)' }, svg)
  var ear = el('path', { d: EAR }, svg)
  var earIn = el('path', { d: 'M180 206 C172 208 170 218 172 228 C174 236 180 238 182 234', fill: 'none', 'stroke-width': 2, 'stroke-linecap': 'round' }, svg)
  var beard = el('path', { d: BEARD_FULL }, svg)
  var top = el('path', {}, svg)
  var strands = el('g', { fill: 'none', 'stroke-linecap': 'round' }, svg)
  el('path', { d: 'M262 176 C270 172 282 172 290 176', fill: 'none', stroke: 'rgba(20,16,12,.7)', 'stroke-width': 3, 'stroke-linecap': 'round' }, svg) // brow
  el('path', { d: 'M270 190 C276 187 283 187 287 190', fill: 'none', stroke: 'rgba(20,16,12,.8)', 'stroke-width': 2, 'stroke-linecap': 'round' }, svg) // eye
  var guide = el('g', { class: 'fd__guide' }, svg)
  var hitLine = el('line', { x1: 80, x2: 236, stroke: 'transparent', 'stroke-width': 30, class: 'fd__hit' }, guide)
  var guideLine = el('line', { x1: 92, x2: 230, stroke: '#c9a46a', 'stroke-width': 2, 'stroke-dasharray': '5 5' }, guide)
  var handle = el('g', { class: 'fd__handle' }, guide)
  el('circle', { r: 22, fill: 'transparent' }, handle); el('circle', { r: 13, fill: '#c9a46a' }, handle)
  el('path', { d: 'M-4 -3 L0 -7 L4 -3 M-4 3 L0 7 L4 3', fill: 'none', stroke: '#1a150d', 'stroke-width': 2, 'stroke-linecap': 'round' }, handle)
  var clips = el('g', {}, svg)
  capeEls.forEach(function (c) { svg.insertBefore(c, guide) }) // the cape sits in front of the neck
  $('#fd-stage').appendChild(svg)

  function fadeY() { return 250 - st.fade * 88 }
  function topPath() {
    var L = st.len, n = 26, outer = [], inner = [], i, u, p, q, nx, ny, len, th
    for (i = 0; i <= n; i++) {
      u = i / n; p = bez(SKULL, u); q = bez(SKULL, Math.min(1, u + 0.01)); var q0 = bez(SKULL, Math.max(0, u - 0.01))
      nx = (q[1] - q0[1]); ny = -(q[0] - q0[0]); len = Math.hypot(nx, ny) || 1; nx /= len; ny /= len
      if (ny > 0) { nx = -nx; ny = -ny }
      if (st.top === 'crop') th = 5 + L * 26 * (0.65 + 0.35 * u)
      else if (st.top === 'quiff') th = 5 + L * 22 * (0.45 + 1.4 * Math.pow(u, 3))
      else if (st.top === 'slick') th = 5 + L * 20 * (0.85 - 0.25 * u)
      else th = 8 + L * 30 + Math.sin(u * Math.PI * 9) * (3 + L * 4)
      inner.push(p); outer.push([p[0] + nx * th, p[1] + ny * th])
    }
    var front = inner[n], tip
    if (st.top === 'crop') tip = [[front[0] + 10 + L * 8, front[1] + 2], [front[0] + 6 + L * 6, front[1] + 12 + L * 10]]
    else if (st.top === 'quiff') tip = [[front[0] + 20 + L * 18, front[1] - 18 - L * 38], [front[0] + 12, front[1] + 2]]
    else if (st.top === 'slick') tip = [[front[0] + 6, front[1] - 8 - L * 10], [front[0] + 4, front[1] + 4]]
    else tip = [[front[0] + 12 + L * 10, front[1] - 4], [front[0] + 6, front[1] + 10 + L * 6]]
    var back = st.top === 'slick' ? [[inner[0][0] - 6 - L * 6, inner[0][1] + 10 + L * 16]] : [[inner[0][0] - 2, inner[0][1] + 4]]
    // the top covers the whole crown: from the parietal line up to the styled outline, then down the front hairline
    var d = 'M101 150'
    back.forEach(function (b) { d += ' L' + f(b[0]) + ' ' + f(b[1]) })
    outer.forEach(function (o) { d += ' L' + f(o[0]) + ' ' + f(o[1]) })
    tip.forEach(function (t) { d += ' L' + f(t[0]) + ' ' + f(t[1]) })
    d += ' L258 110 C252 122 238 136 230 145 C200 137 150 140 101 150'
    return { d: d + ' Z', outer: outer, inner: inner }
  }
  function drawStrands(shape) {
    while (strands.firstChild) strands.removeChild(strands.firstChild)
    var col = HAIRS[st.hair] === '#c9a46a' ? 'rgba(255,240,210,.45)' : 'rgba(255,255,255,.14)'
    for (var k = 1; k <= 3; k++) {
      var t = k / 4, d = ''
      shape.outer.forEach(function (o, i) { var p = shape.inner[i], x = p[0] + (o[0] - p[0]) * t, y = p[1] + (o[1] - p[1]) * t; d += (i ? ' L' : 'M') + f(x) + ' ' + f(y) })
      el('path', { d: d, stroke: col, 'stroke-width': st.top === 'slick' ? 1.6 : 1.1, 'stroke-dasharray': st.top === 'crop' ? '7 5' : st.top === 'curls' ? '3 6' : 'none' }, strands)
    }
  }
  function draw() {
    var hair = HAIRS[st.hair], skin = SKINS[st.skin], y = fadeY(), ga = GUARD_ALPHA[st.guard]
    head.setAttribute('fill', skin); ear.setAttribute('fill', skin); earIn.setAttribute('stroke', 'rgba(0,0,0,.22)')
    // sides: guard shade at the bottom, blending into full hair above the fade line
    var bottom = st.guard === 0 ? skin : mixHex(skin, hair, ga)
    var spread = 22 + st.fade * 10
    var a = clamp01((300 - (y + spread)) / 160), b = clamp01((300 - (y - spread)) / 160)
    var vals = [[0, bottom], [a, bottom], [b, hair], [1, hair]]
    stops.forEach(function (s, i) { s.setAttribute('offset', vals[i][0].toFixed(3)); s.setAttribute('stop-color', vals[i][1]) })
    var mv = [[0, 0.15 + ga], [a, 0.15 + ga], [b, 1]]
    mstops.forEach(function (s, i) { s.setAttribute('offset', mv[i][0].toFixed(3)); s.setAttribute('stop-color', '#fff'); s.setAttribute('stop-opacity', Math.min(1, mv[i][1]).toFixed(2)) })
    // top
    var shape = topPath()
    top.setAttribute('d', shape.d); top.setAttribute('fill', hair)
    drawStrands(shape)
    // beard
    beard.setAttribute('fill', hair)
    beard.setAttribute('opacity', st.beard === 'none' ? 0 : st.beard === 'stubble' ? 0.28 : 0.95)
    beard.setAttribute('stroke', st.beard === 'sculpt' ? 'rgba(201,164,106,.7)' : 'none'); beard.setAttribute('stroke-width', 1.2)
    // guide
    guideLine.setAttribute('y1', y); guideLine.setAttribute('y2', y - 6); hitLine.setAttribute('y1', y); hitLine.setAttribute('y2', y - 6)
    handle.setAttribute('transform', 'translate(92 ' + f(y) + ')')
    renderResult()
  }
  function clamp01(v) { return Math.max(0, Math.min(1, v)) }
  function mixHex(a, b, t) {
    var pa = [1, 3, 5].map(function (i) { return parseInt(a.substr(i, 2), 16) }), pb = [1, 3, 5].map(function (i) { return parseInt(b.substr(i, 2), 16) })
    return '#' + pa.map(function (v, i) { return ('0' + Math.round(v + (pb[i] - v) * t).toString(16)).slice(-2) }).join('')
  }

  // ---- What to ask for, which service, which barber ----
  function result() {
    var tx = T(), h = st.fade < 0.34 ? 0 : st.fade < 0.67 ? 1 : 2
    var skinFade = st.guard <= 1
    var name = tx.heights[h] + (skinFade ? ' (' + (st.guard === 0 ? tx.skinFade : tx.guard + ' ' + tx.guards[st.guard]) + ')' : ' · ' + tx.guard + ' ' + tx.guards[st.guard]) +
      ', ' + tx.tops[st.top].toLowerCase() + ' ' + tx.top + (st.beard !== 'none' ? ', ' + tx.beards[st.beard].toLowerCase() : '')
    var svc = st.beard === 'sculpt' ? SERVICE.combo : skinFade ? SERVICE.fade : SERVICE.classic
    var barber = st.beard === 'sculpt' || st.top === 'curls' ? 'Leo' : st.top === 'slick' || st.len > 0.7 ? 'Arben' : skinFade ? 'Dan' : st.top === 'crop' ? 'Leo' : 'Dan'
    return { name: name, svc: svc, barber: barber }
  }
  function renderResult() {
    var tx = T(), r = result()
    $('#fd-name').textContent = r.name.charAt(0).toUpperCase() + r.name.slice(1)
    $('#fd-svc').textContent = (lang === 'sq' ? r.svc[2] : r.svc[1]) + ' · ' + r.svc[3] + ' ' + tx.mins + ' · £' + r.svc[4]
    $('#fd-barber').textContent = r.barber + ': ' + tx.why[r.barber]
    svg.setAttribute('aria-label', r.name)
  }
  function labels() {
    var tx = T()
    $('#fd-l-fade').textContent = tx.fadeL; $('#fd-l-guard').textContent = tx.guardL; $('#fd-l-top').textContent = tx.topL
    $('#fd-l-len').textContent = tx.lenL; $('#fd-l-beard').textContent = tx.beardL; $('#fd-l-skin').textContent = tx.skin; $('#fd-l-hair').textContent = tx.hair
    $('#fd-k-cut').textContent = tx.cut; $('#fd-k-svc').textContent = tx.service; $('#fd-k-barber').textContent = tx.barber
    $('#fd-book').textContent = tx.book; $('#fd-hint').textContent = tx.drag
    $$('[data-guard]').forEach(function (b) { b.textContent = tx.guards[Number(b.dataset.guard)] })
    $$('[data-top]').forEach(function (b) { b.textContent = tx.tops[b.dataset.top] })
    $$('[data-beard]').forEach(function (b) { b.textContent = tx.beards[b.dataset.beard] })
    $('#fd-fade').setAttribute('aria-valuetext', tx.heights[st.fade < 0.34 ? 0 : st.fade < 0.67 ? 1 : 2])
    $('#fd-len-out').textContent = st.len < 0.35 ? tx.short : st.len > 0.7 ? tx.long : tx.mid
  }
  function pressed(attr, value) { $$('[' + attr + ']').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute(attr) === String(value))) }) }

  // a few clippings fall when the fade moves
  var lastClip = 0
  function clippings(y) {
    if (reduce || performance.now() - lastClip < 70) return
    lastClip = performance.now()
    for (var i = 0; i < 3; i++) {
      var x = 120 + Math.random() * 120, l = el('line', { x1: x, y1: y, x2: x + 3, y2: y + 5, stroke: HAIRS[st.hair], 'stroke-width': 1.4, 'stroke-linecap': 'round' }, clips)
      ;(function (l, x, vx) {
        var t0 = performance.now()
        ;(function fall(now) {
          var t = (now - t0) / 1000, yy = y + 140 * t * t + 30 * t
          l.setAttribute('transform', 'translate(' + f(vx * t) + ' ' + f(yy - y) + ') rotate(' + f(t * 300) + ' ' + f(x) + ' ' + f(y) + ')')
          l.setAttribute('opacity', Math.max(0, 1 - t / 0.6).toFixed(2))
          if (t < 0.6) requestAnimationFrame(fall); else l.remove()
        })(t0)
      })(l, x, (Math.random() - 0.5) * 40)
    }
  }

  // ---- Controls ----
  var fadeIn = $('#fd-fade')
  function setFade(v, fromDrag) { st.fade = clamp01(v); fadeIn.value = Math.round(st.fade * 100); draw(); labels(); clippings(fadeY()) }
  fadeIn.addEventListener('input', function () { setFade(Number(fadeIn.value) / 100) })
  $('#fd-len').addEventListener('input', function () { st.len = Number(this.value) / 100; draw(); labels() })
  $$('[data-guard]').forEach(function (b) { b.addEventListener('click', function () { st.guard = Number(b.dataset.guard); pressed('data-guard', st.guard); draw() }) })
  $$('[data-top]').forEach(function (b) { b.addEventListener('click', function () { st.top = b.dataset.top; pressed('data-top', st.top); draw() }) })
  $$('[data-beard]').forEach(function (b) { b.addEventListener('click', function () { st.beard = b.dataset.beard; pressed('data-beard', st.beard); draw() }) })
  $$('[data-skin]').forEach(function (b) { b.style.background = SKINS[b.dataset.skin]; b.addEventListener('click', function () { st.skin = Number(b.dataset.skin); pressed('data-skin', st.skin); draw() }) })
  $$('[data-hair]').forEach(function (b) { b.style.background = HAIRS[b.dataset.hair]; b.addEventListener('click', function () { st.hair = Number(b.dataset.hair); pressed('data-hair', st.hair); draw() }) })
  // drag the fade line straight on the head
  var dragging = false
  function yFromEvent(e) { var r = svg.getBoundingClientRect(); return (e.clientY - r.top) / r.height * 420 }
  svg.addEventListener('pointerdown', function (e) {
    var y = yFromEvent(e); if (y < 140 || y > 300) return
    dragging = true; try { svg.setPointerCapture(e.pointerId) } catch (er) {}
    root.classList.add('is-dragging'); setFade((250 - y) / 88, true)
  })
  svg.addEventListener('pointermove', function (e) { if (dragging) setFade((250 - yFromEvent(e)) / 88, true) })
  function stop() { dragging = false; root.classList.remove('is-dragging') }
  svg.addEventListener('pointerup', stop); svg.addEventListener('pointercancel', stop)

  // ---- Book it ----
  $('#fd-book').addEventListener('click', function () {
    var r = result()
    window.northlineCut = $('#fd-name').textContent
    var svcBtn = document.querySelectorAll('#opt-service .opt')[r.svc[0]]
    if (svcBtn) svcBtn.click()
    var barberBtn = document.querySelectorAll('#opt-barber .opt')[BARBER_INDEX[r.barber]]
    if (barberBtn) barberBtn.click()
    var book = document.getElementById('book'); if (book) book.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
  })

  // follow the site's EN/SQ switch
  new MutationObserver(function () { var l = document.documentElement.lang === 'sq' ? 'sq' : 'en'; if (l !== lang) { lang = l; labels(); renderResult() } }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] })

  fadeIn.value = st.fade * 100; $('#fd-len').value = st.len * 100
  pressed('data-guard', st.guard); pressed('data-top', st.top); pressed('data-beard', st.beard); pressed('data-skin', st.skin); pressed('data-hair', st.hair)
  draw(); labels()
  root.classList.add('is-ready')
})()
