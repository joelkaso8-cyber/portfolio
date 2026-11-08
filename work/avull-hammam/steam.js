// Avull "Wipe the glass": the hot room behind a steamed-up window. Wipe with a finger or the mouse to find the
// four stations of the ritual where they really happen; the glass fogs up again and drops run down it.
// Uses the site's own ritual text (window.I18N) in English and Albanian. Loaded by app.js when #steam scrolls near.
;(function () {
  var root = document.getElementById('steam')
  if (!root || root.dataset.ready) return
  root.dataset.ready = '1'
  var $ = function (s) { return root.querySelector(s) }
  var stage = $('#st-stage'), canvas = $('#st-canvas'), ctx = canvas.getContext('2d')
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)

  var TXT = {
    en: { hint: 'Wipe the glass', found: '{n} of 4 found', all: 'Your hour, mapped: 60 minutes on the marble.', book: 'Book the hammam ritual · £65', auto: 'Wipe it for me', fog: 'Steam it up again', temp: '45 °C · steam' },
    sq: { hint: 'Fshi xhamin', found: '{n} nga 4 të gjetura', all: 'Ora jote, e plotë: 60 minuta mbi mermer.', book: 'Rezervo ritualin e hammamit · £65', auto: 'Fshije për mua', fog: 'Mbushe sërish me avull', temp: '45 °C · avull' },
  }
  // where each station is in img/hotroom (fractions of the photo) and its minutes, as in the ritual list
  var SPOTS = [
    { k: 1, x: 0.5, y: 0.76, min: 10 }, // warm marble slab in the middle
    { k: 2, x: 0.1, y: 0.6, min: 15 },  // scrub at the basin in the left alcove
    { k: 3, x: 0.5, y: 0.5, min: 15 },  // foam in the middle arch
    { k: 4, x: 0.67, y: 0.52, min: 20 }, // rest through the right arch
  ]
  var lang = document.documentElement.lang === 'sq' ? 'sq' : 'en'
  function T(k) { return TXT[lang][k] }
  function site(k) { var d = window.I18N && (window.I18N[lang] || window.I18N.en); return d && d[k] ? String(d[k]).replace(/<[^>]+>/g, '') : '' }

  var photo = new Image(), ready = false
  photo.onload = function () { ready = true; makeFog(); kick() }
  photo.src = 'img/hotroom.webp'
  var FW = 480, FH = 320
  var fogC = mk(FW, FH), maskC = mk(FW, FH), compC = mk(FW, FH), blob = mk(128, 128)
  var fctx = fogC.getContext('2d'), mctx = maskC.getContext('2d'), cctx = compC.getContext('2d')
  function mk(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c }
  ;(function () { var b = blob.getContext('2d'), g = b.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,248,236,0.5)'); g.addColorStop(1, 'rgba(255,248,236,0)'); b.fillStyle = g; b.fillRect(0, 0, 128, 128) })()

  var view = { w: 0, h: 0, dpr: 1, img: null }
  var drops = [], wisps = [], ptr = null, auto = null, running = false, raf = 0, last = 0, wiped = false

  // photo placement (cover) in css px, and the matching fog-canvas scale
  function layout() {
    var r = stage.getBoundingClientRect(), iw = 1600, ih = 1066, s = Math.max(r.width / iw, r.height / ih)
    view.img = { x: (r.width - iw * s) / 2, y: (r.height - ih * s) / 2, w: iw * s, h: ih * s }
    view.w = r.width; view.h = r.height
  }
  function spotXY(s) { return { x: view.img.x + s.x * view.img.w, y: view.img.y + s.y * view.img.h } }
  function toFog(x, y) { return { x: x / view.w * FW, y: y / view.h * FH } }

  function makeFog() {
    fctx.clearRect(0, 0, FW, FH)
    if (ready) {
      fctx.filter = 'blur(9px)'
      var s = Math.max(FW / 1600, FH / 1066)
      fctx.drawImage(photo, (FW - 1600 * s) / 2, (FH - 1066 * s) / 2, 1600 * s, 1066 * s)
      fctx.filter = 'none'
    }
    fctx.fillStyle = 'rgba(232,222,204,0.5)'; fctx.fillRect(0, 0, FW, FH)
    var g = fctx.createLinearGradient(0, 0, 0, FH)
    g.addColorStop(0, 'rgba(255,250,240,0.3)'); g.addColorStop(1, 'rgba(255,250,240,0.04)')
    fctx.fillStyle = g; fctx.fillRect(0, 0, FW, FH)
    // a few beads of condensation
    for (var i = 0; i < 70; i++) {
      var x = Math.random() * FW, y = Math.random() * FH, r = 0.6 + Math.random() * 1.8
      fctx.fillStyle = 'rgba(80,66,44,0.18)'; fctx.beginPath(); fctx.arc(x + 0.4, y + 0.5, r, 0, Math.PI * 2); fctx.fill()
      fctx.fillStyle = 'rgba(255,252,244,0.55)'; fctx.beginPath(); fctx.arc(x - r * 0.3, y - r * 0.3, r * 0.45, 0, Math.PI * 2); fctx.fill()
    }
  }
  function steamUp() {
    mctx.clearRect(0, 0, FW, FH); drops = []
    SPOTS.forEach(function (s) { s.clear = 0; s.found = false })
    renderPanel(); renderPins(); kick()
  }

  // ---- Wiping ----
  function wipe(x, y, strength) {
    var p = toFog(x, y), r = Math.max(14, 30 * FW / Math.max(400, view.w))
    var g = mctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r)
    g.addColorStop(0, 'rgba(0,0,0,' + (0.9 * strength).toFixed(3) + ')'); g.addColorStop(0.6, 'rgba(0,0,0,' + (0.6 * strength).toFixed(3) + ')'); g.addColorStop(1, 'rgba(0,0,0,0)')
    mctx.globalCompositeOperation = 'source-over'; mctx.fillStyle = g; mctx.beginPath(); mctx.arc(p.x, p.y, r, 0, Math.PI * 2); mctx.fill()
    var hitR = Math.max(34, view.w * 0.06)
    SPOTS.forEach(function (s) {
      var q = spotXY(s), d = Math.hypot(q.x - x, q.y - y)
      if (d < hitR) { s.clear += strength * 0.14 * (1 - d / hitR); if (!s.found && s.clear >= 1) { s.found = true; renderPins(); renderPanel() } }
    })
    if (!reduce && drops.length < 16 && Math.random() < 0.045 * strength) drops.push({ x: x + (Math.random() - 0.5) * 30, y: y + 10, vy: 0, r: 1.6 + Math.random() * 2, stuck: Math.random() * 0.4, t: 0 })
    if (!wiped) { wiped = true; $('#st-hint').hidden = true }
  }
  function stroke(a, b, strength) {
    var n = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 6))
    for (var i = 1; i <= n; i++) wipe(a.x + (b.x - a.x) * i / n, a.y + (b.y - a.y) * i / n, strength)
  }
  function local(e) { var r = stage.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top } }
  canvas.addEventListener('pointerdown', function (e) { if (auto) return; ptr = local(e); try { canvas.setPointerCapture(e.pointerId) } catch (er) {} ; wipe(ptr.x, ptr.y, 1); kick() })
  canvas.addEventListener('pointermove', function (e) { if (!ptr) return; var p = local(e); stroke(ptr, p, 1); ptr = p; kick() })
  function up() { ptr = null }
  canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up)

  // ---- Wipe it for me: one long swipe through all four stations ----
  function autoWipe() {
    if (auto) return
    var pts = [SPOTS[1], SPOTS[2], SPOTS[3], SPOTS[0]].map(spotXY)
    pts.unshift({ x: pts[0].x - 30, y: pts[0].y - 20 })
    auto = { pts: pts, t: 0, last: pts[0] }
    $('#st-auto').disabled = true; kick()
  }

  // ---- Loop ----
  function frame(now) {
    raf = 0
    var dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60
    last = now
    // the glass fogs up again, slowly
    mctx.globalCompositeOperation = 'destination-out'; mctx.fillStyle = 'rgba(0,0,0,' + (dt * (reduce ? 0.05 : 0.085)).toFixed(4) + ')'; mctx.fillRect(0, 0, FW, FH)
    if (auto) {
      auto.t += dt / 3.2
      var k = Math.min(1, auto.t) * (auto.pts.length - 1), i = Math.min(auto.pts.length - 2, Math.floor(k)), f = k - i
      var a = auto.pts[i], b = auto.pts[i + 1], p = { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f + Math.sin(f * Math.PI) * -18 }
      stroke(auto.last, p, 1.4); auto.last = p
      SPOTS.forEach(function (s) { var q = spotXY(s); if (Math.hypot(q.x - p.x, q.y - p.y) < 8 && !s.found) { s.clear = 1; s.found = true; renderPins(); renderPanel() } })
      if (auto.t >= 1) { auto = null; $('#st-auto').disabled = false }
    }
    // drops run down and leave a clear trail
    for (var d = drops.length - 1; d >= 0; d--) {
      var dr = drops[d]; dr.t += dt
      if (dr.t > dr.stuck) { dr.vy += (40 + Math.random() * 60 - dr.vy) * dt * 3; dr.y += dr.vy * dt; var p2 = toFog(dr.x, dr.y); mctx.globalCompositeOperation = 'source-over'; mctx.fillStyle = 'rgba(0,0,0,0.55)'; mctx.beginPath(); mctx.arc(p2.x, p2.y, dr.r * FW / view.w, 0, Math.PI * 2); mctx.fill() }
      if (dr.y > view.h + 10) drops.splice(d, 1)
    }
    if (!reduce && Math.random() < dt * 0.6 && drops.length < 14) drops.push({ x: Math.random() * view.w, y: Math.random() * view.h * 0.5, vy: 0, r: 1.4 + Math.random() * 1.6, stuck: 0.5 + Math.random(), t: 0 })
    // steam drifting up
    if (!reduce) {
      if (wisps.length < 7 && Math.random() < dt * 1.2) wisps.push({ x: Math.random() * view.w, y: view.h + 40, s: 80 + Math.random() * 120, v: 14 + Math.random() * 18, t: 0 })
      wisps.forEach(function (w) { w.t += dt; w.y -= w.v * dt; w.x += Math.sin(w.t * 0.7) * 6 * dt })
      wisps = wisps.filter(function (w) { return w.y > -w.s })
    }
    draw()
    if (running) raf = requestAnimationFrame(frame)
  }
  function draw() {
    var dpr = view.dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = '#18170f'; ctx.fillRect(0, 0, view.w, view.h)
    if (ready) ctx.drawImage(photo, view.img.x, view.img.y, view.img.w, view.img.h)
    // warm wet-glass tint over the clear parts too
    ctx.fillStyle = 'rgba(215,166,95,0.06)'; ctx.fillRect(0, 0, view.w, view.h)
    cctx.globalCompositeOperation = 'source-over'; cctx.clearRect(0, 0, FW, FH); cctx.drawImage(fogC, 0, 0)
    cctx.globalCompositeOperation = 'destination-out'; cctx.drawImage(maskC, 0, 0)
    ctx.drawImage(compC, 0, 0, view.w, view.h)
    wisps.forEach(function (w) { ctx.globalAlpha = Math.min(1, w.t / 2) * 0.55; ctx.drawImage(blob, w.x - w.s / 2, w.y - w.s / 2, w.s, w.s) })
    ctx.globalAlpha = 1
    drops.forEach(function (dr) {
      ctx.fillStyle = 'rgba(40,30,18,0.25)'; ctx.beginPath(); ctx.arc(dr.x + 0.6, dr.y + 0.8, dr.r, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = 'rgba(255,250,240,0.7)'; ctx.beginPath(); ctx.arc(dr.x - dr.r * 0.3, dr.y - dr.r * 0.35, dr.r * 0.45, 0, Math.PI * 2); ctx.fill()
    })
  }
  function kick() { if (running && !raf) { last = 0; raf = requestAnimationFrame(frame) } else if (!running && view.img) draw() }
  function size() {
    layout()
    view.dpr = Math.min(2, window.devicePixelRatio || 1)
    canvas.width = Math.round(view.w * view.dpr); canvas.height = Math.round(view.h * view.dpr)
    renderPins(); draw()
  }

  // ---- Pins on the photo and the list beside it ----
  function renderPins() {
    if (!view.img) return
    var box = $('#st-pins'); box.innerHTML = ''
    SPOTS.forEach(function (s) {
      var q = spotXY(s), el = document.createElement('div')
      el.className = 'st__pin' + (s.found ? ' is-found' : '')
      el.style.left = (q.x / view.w * 100) + '%'; el.style.top = (q.y / view.h * 100) + '%'
      el.innerHTML = '<b></b><span></span>'
      el.firstChild.textContent = '0' + s.k; el.lastChild.textContent = site('ritual.' + s.k) + ' · ' + s.min + '′'
      el.setAttribute('aria-hidden', String(!s.found))
      box.appendChild(el)
    })
  }
  function renderPanel() {
    var n = SPOTS.filter(function (s) { return s.found }).length
    $('#st-count').textContent = T('found').replace('{n}', n)
    $('#st-bar').style.transform = 'scaleX(' + (n / 4) + ')'
    var ol = $('#st-list'); ol.innerHTML = ''
    SPOTS.forEach(function (s) {
      var li = document.createElement('li'); li.className = s.found ? 'is-found' : ''
      li.innerHTML = '<b></b><div><h3></h3><p></p></div><span></span>'
      li.children[0].textContent = '0' + s.k; li.querySelector('h3').textContent = site('ritual.' + s.k)
      li.querySelector('p').textContent = s.found ? site('ritual.' + s.k + 's') : '· · ·'
      li.lastChild.textContent = s.min + '′'
      ol.appendChild(li)
    })
    var done = n === 4
    $('#st-done').hidden = !done; $('#st-done-t').textContent = T('all')
    $('#st-book').textContent = T('book')
  }
  function labels() {
    $('#st-hint-t').textContent = T('hint'); $('#st-auto').textContent = T('auto'); $('#st-fog').textContent = T('fog'); $('#st-temp').textContent = T('temp')
    renderPins(); renderPanel()
  }
  $('#st-auto').addEventListener('click', autoWipe)
  $('#st-fog').addEventListener('click', steamUp)
  $('#st-book').addEventListener('click', function () {
    if (typeof window.avullBook === 'function') window.avullBook('hammam', 0)
    else { var b = document.getElementById('book'); if (b) b.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }) }
  })
  new MutationObserver(function () { var l = document.documentElement.lang === 'sq' ? 'sq' : 'en'; if (l !== lang) { lang = l; labels() } }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] })

  if ('ResizeObserver' in window) new ResizeObserver(size).observe(stage); else window.addEventListener('resize', size)
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { running = es[0].isIntersecting && !document.hidden; if (running) kick(); else if (raf) { cancelAnimationFrame(raf); raf = 0 } }).observe(stage)
  } else running = true
  document.addEventListener('visibilitychange', function () { if (document.hidden) { running = false; if (raf) { cancelAnimationFrame(raf); raf = 0 } } })
  SPOTS.forEach(function (s) { s.clear = 0; s.found = false })
  makeFog(); size(); labels()
  root.classList.add('is-ready')
})()
