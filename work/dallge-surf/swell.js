// Dallgë "Read the sea": a cross-section of Fistral where swell rolls in, grows over the sandbar and breaks.
// Wave height, period and wind change the sea live; it says which lesson those conditions suit.
// Starts from today's surf report (window.dallgeReport from main.js). Loaded when #swell scrolls near.
;(function () {
  var root = document.getElementById('swell')
  if (!root || root.dataset.ready) return
  root.dataset.ready = '1'
  var $ = function (s) { return root.querySelector(s) }
  var stage = $('#sw-stage'), canvas = $('#sw-canvas'), ctx = canvas.getContext('2d')
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)

  // World: 1000 x 440 units. Shore at x = 170, open sea to the right. 830 units ~ 300 m.
  var W = 1000, H = 400, SEA = 252, SHORE = 170, MPU = 300 / 830, VS = 21, G = 9.81, STEP = 4
  var LESSONS = {
    first: { name: 'First wave', price: 45 }, improver: { name: 'Improver', price: 50 },
    kids: { name: 'Kids', price: 35 }, private: { name: 'Private lesson', price: 95 },
  }
  var rep = window.dallgeReport || { wave: 1.1, period: 10, wind: 8 }
  var cond = { h: rep.wave, t: rep.period, w: rep.wind, dir: rep.wind < 10 ? 'off' : 'on' }
  var cols = [], breakX = -1, view = { w: 0, h: 0, k: 1, ox: 0, oy: 0, dpr: 1 }
  var running = false, raf = 0, last = 0, time = 0, surfer = { n: null, fade: 0 }, spray = [], foamDots = []

  function depth(x) { return Math.max(0, (x - SHORE) * (12 / (W - SHORE))) }
  function bed(x) { return SEA + depth(x) * 10 }
  // Phase along the bottom, using the shallow-water slowdown (Eckart's approximation of the dispersion relation).
  function build() {
    var w = 2 * Math.PI / cond.t, k0 = w * w / G, phase = 0
    cols = []; breakX = -1
    for (var x = W; x >= SHORE; x -= STEP) {
      var d = depth(x), k = d > 0.05 ? k0 / Math.sqrt(Math.tanh(k0 * d)) : k0 / Math.sqrt(Math.tanh(k0 * 0.05))
      phase += k * MPU * STEP
      var ks = Math.min(2.4, Math.pow(12 / Math.max(d, 0.25), 0.25))
      var hh = cond.h * ks, broken = false
      if (d > 0 && hh > 0.78 * d) { hh = 0.78 * d; broken = true; if (breakX < 0) breakX = x }
      if (d <= 0) { hh = 0; broken = true }
      cols.push({ x: x, d: d, k: k, phase: phase, h: hh, broken: broken })
    }
    foamDots = []
    for (var i = 0; i < 160; i++) foamDots.push({ u: Math.random(), o: Math.random() * Math.PI * 2, r: 0.8 + Math.random() * 2.2 })
  }
  function omega() { return 2 * Math.PI / cond.t }
  function chopAmp() { return cond.dir === 'on' ? cond.w / 30 * 3.2 : cond.w / 30 * 0.8 }
  function surf(c, t) {
    var th = c.phase - omega() * t, a = c.h / 2 * VS
    var sharp = Math.min(0.45, c.k * MPU * a * 0.9 + (c.broken ? 0.15 : 0))
    var y = a * (Math.cos(th) + sharp * Math.cos(2 * th))
    y += chopAmp() * Math.sin(c.x * 0.19 + t * 5.3) * Math.sin(c.x * 0.047 - t * 1.7)
    return SEA - y
  }

  // ---- What these conditions are good for ----
  function verdict() {
    var score = Math.max(1, Math.min(5, Math.round(cond.h * 1.4 + cond.t / 6 - cond.w / 8)))
    var pick, line
    if (cond.h > 2.4 || cond.w > 24) { pick = 'private'; line = 'Big and wild. Group lessons move to the sheltered end of the bay; only private lessons with a coach.' }
    else if (cond.h >= 1.4) { pick = 'improver'; line = 'Green waves with real push: an Improver day.' }
    else if (cond.h >= 0.6) { pick = 'first'; line = 'Friendly whitewater on the inside: perfect for your First wave.' }
    else { pick = 'kids'; line = 'Small and gentle: ideal for Kids lessons and nervous first-timers.' }
    var extra = []
    if (cond.dir === 'on' && cond.w >= 12) extra.push('Onshore wind makes it choppy.')
    if (cond.dir === 'off' && cond.w >= 4) extra.push('Offshore wind holds the faces up clean.')
    if (cond.t >= 12) extra.push('Long-period swell arrives in sets, with more power than it looks.')
    return { score: score, pick: pick, text: line + (extra.length ? ' ' + extra.join(' ') : ''), flag: pick === 'private' ? 'red' : 'ok' }
  }
  function renderUi() {
    $('#sw-h-out').textContent = cond.h.toFixed(1) + ' m'
    $('#sw-t-out').textContent = cond.t + ' s'
    $('#sw-w-out').textContent = cond.w + ' mph'
    Array.prototype.forEach.call(root.querySelectorAll('[data-dir]'), function (b) { b.setAttribute('aria-pressed', String(b.dataset.dir === cond.dir)) })
    var v = verdict()
    var bars = $('#sw-rating'); bars.innerHTML = ''; bars.setAttribute('aria-label', 'Surf rating ' + v.score + ' out of 5')
    for (var i = 0; i < 5; i++) { var b = document.createElement('i'); if (i < v.score) b.className = 'on'; bars.appendChild(b) }
    $('#sw-text').textContent = v.text
    var btn = $('#sw-book'), l = LESSONS[v.pick]
    btn.textContent = 'Book ' + l.name + ' · £' + l.price; btn.dataset.lesson = v.pick
  }
  function setFrom(inputs) {
    cond.h = Number($('#sw-h').value); cond.t = Number($('#sw-t').value); cond.w = Number($('#sw-w').value)
    build(); renderUi(); kick()
  }

  // ---- Drawing ----
  function sky(t) {
    var g = ctx.createLinearGradient(0, 0, 0, SEA)
    g.addColorStop(0, '#0d2a31'); g.addColorStop(0.55, '#245058'); g.addColorStop(0.9, '#e79a7c'); g.addColorStop(1, '#ffc0a0')
    ctx.fillStyle = g; ctx.fillRect(-1000, -1000, W + 2000, SEA + 1000)
    var sx = 780, sy = 196
    var sg = ctx.createRadialGradient(sx, sy, 4, sx, sy, 160)
    sg.addColorStop(0, 'rgba(255,214,180,0.95)'); sg.addColorStop(0.12, 'rgba(255,170,130,0.55)'); sg.addColorStop(1, 'rgba(255,143,107,0)')
    ctx.fillStyle = sg; ctx.fillRect(sx - 170, sy - 170, 340, 340)
    ctx.fillStyle = '#ffe2c8'; ctx.beginPath(); ctx.arc(sx, sy, 15, 0, Math.PI * 2); ctx.fill()
    // the open sea behind the waves, seen in the troughs
    var far = ctx.createLinearGradient(0, SEA - 8, 0, SEA + 70)
    far.addColorStop(0, '#2f7f80'); far.addColorStop(0.15, '#1b5b62'); far.addColorStop(1, '#0f3d44')
    ctx.fillStyle = far; ctx.fillRect(-1000, SEA - 8, W + 2000, 300)
    ctx.fillStyle = 'rgba(255,190,150,0.35)'; ctx.fillRect(700, SEA - 8, 160, 2)
    // headland on the horizon
    ctx.fillStyle = '#123840'; ctx.beginPath(); ctx.moveTo(860, SEA - 26); ctx.quadraticCurveTo(900, SEA - 58, 960, SEA - 50); ctx.lineTo(1100, SEA - 44); ctx.lineTo(1100, SEA - 20); ctx.lineTo(860, SEA - 20); ctx.fill()
    // clouds drift with the wind
    var drift = (cond.dir === 'off' ? 1 : -1) * cond.w * 0.9
    ctx.fillStyle = 'rgba(255,214,196,0.09)'
    ;[[180, 70, 70], [520, 46, 90], [820, 92, 60], [380, 120, 50]].forEach(function (c, i) {
      var x = ((c[0] + drift * t + i * 37) % 1300 + 1300) % 1300 - 150
      ctx.beginPath(); ctx.ellipse(x, c[1], c[2], c[2] * 0.22, 0, 0, Math.PI * 2); ctx.ellipse(x + c[2] * 0.5, c[1] - 6, c[2] * 0.55, c[2] * 0.2, 0, 0, Math.PI * 2); ctx.fill()
    })
  }
  function sea(t) {
    var pts = cols.map(function (c) { return [c.x, surf(c, t)] })
    // water body, between the surface and the seabed
    ctx.beginPath(); ctx.moveTo(W + 20, pts[0][1])
    pts.forEach(function (p) { ctx.lineTo(p[0], p[1]) })
    ctx.lineTo(SHORE, bed(SHORE)); ctx.lineTo(W + 20, bed(W + 20)); ctx.closePath()
    var g = ctx.createLinearGradient(0, SEA - 40, 0, 440)
    g.addColorStop(0, '#2b8e8a'); g.addColorStop(0.18, '#156069'); g.addColorStop(0.6, '#0c3b43'); g.addColorStop(1, '#082a30')
    ctx.fillStyle = g; ctx.fill()
    // sun glitter on the faces
    ctx.save(); ctx.clip()
    ctx.globalCompositeOperation = 'lighter'
    for (var i = 0; i < pts.length; i += 2) {
      var p = pts[i], dx = Math.abs(p[0] - 780)
      if (dx > 260) continue
      var a = (1 - dx / 260) * 0.35 * (0.5 + 0.5 * Math.sin(p[0] * 0.9 + t * 6))
      ctx.fillStyle = 'rgba(255,190,150,' + a.toFixed(3) + ')'; ctx.fillRect(p[0], p[1] + 2, 3, 1.6)
    }
    // light rays under the surface
    ctx.globalCompositeOperation = 'source-over'
    for (var r = 0; r < 6; r++) {
      var rx = 300 + r * 120 + Math.sin(t * 0.4 + r) * 20
      var rg = ctx.createLinearGradient(rx, SEA, rx - 60, 430)
      rg.addColorStop(0, 'rgba(159,224,212,0.08)'); rg.addColorStop(1, 'rgba(159,224,212,0)')
      ctx.fillStyle = rg; ctx.beginPath(); ctx.moveTo(rx - 10, SEA); ctx.lineTo(rx + 14, SEA); ctx.lineTo(rx - 40, 440); ctx.lineTo(rx - 90, 440); ctx.fill()
    }
    ctx.restore()
    // surface line
    ctx.strokeStyle = 'rgba(159,224,212,0.65)'; ctx.lineWidth = 1.6; ctx.beginPath()
    pts.forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]) }); ctx.stroke()
    return pts
  }
  function foam(t, pts) {
    // whitewater riding each broken crest towards the beach
    cols.forEach(function (c, i) {
      if (!c.broken || c.d <= 0) return
      var th = c.phase - omega() * t, crest = Math.cos(th)
      var intensity = Math.max(0, crest - 0.15) * Math.min(1, c.h / 0.6 + 0.2)
      if (intensity <= 0.02) return
      var y = pts[i][1]
      ctx.fillStyle = 'rgba(238,247,245,' + Math.min(0.9, intensity).toFixed(3) + ')'
      ctx.beginPath(); ctx.ellipse(c.x, y - 1, STEP * 1.6, 2 + intensity * c.h * 7, 0, 0, Math.PI * 2); ctx.fill()
      if (Math.sin(th) > 0 && intensity > 0.4) { ctx.fillStyle = 'rgba(238,247,245,0.25)'; ctx.fillRect(c.x - 2, y, 4, 6 + intensity * 16) }
    })
    // lingering foam patches on the inside
    if (breakX > 0) {
      foamDots.forEach(function (f) {
        var x = SHORE + (breakX - SHORE) * f.u
        var idx = Math.round((W - x) / STEP), c = cols[idx]; if (!c) return
        var y = pts[idx][1] + 2 + Math.sin(f.o + t * 1.3) * 1.5
        ctx.fillStyle = 'rgba(238,247,245,' + (0.35 + 0.25 * Math.sin(f.o + t)).toFixed(3) + ')'
        ctx.beginPath(); ctx.arc(x, y, f.r, 0, Math.PI * 2); ctx.fill()
      })
    }
    // spray blown off the crests by offshore wind
    if (cond.dir === 'off' && cond.w > 6 && !reduce && Math.random() < cond.w / 30) {
      var cand = cols.filter(function (c) { return c.d > 0.5 && Math.cos(c.phase - omega() * t) > 0.97 && c.h > 0.5 })
      if (cand.length) { var c = cand[Math.floor(Math.random() * cand.length)]; spray.push({ x: c.x, y: surf(c, t) - 2, vx: 30 + cond.w * 3, vy: -20 - Math.random() * 20, t: 0 }) }
    }
    spray.forEach(function (s) { ctx.fillStyle = 'rgba(238,247,245,' + (0.6 * (1 - s.t / 0.9)).toFixed(3) + ')'; ctx.fillRect(s.x, s.y, 2, 2) })
  }
  function beach(t) {
    // seabed in cross-section
    ctx.beginPath(); ctx.moveTo(-200, 214); ctx.lineTo(SHORE - 60, 236); ctx.lineTo(SHORE, SEA)
    ctx.lineTo(W + 20, bed(W + 20)); ctx.lineTo(W + 20, 600); ctx.lineTo(-200, 600); ctx.closePath()
    var g = ctx.createLinearGradient(0, 214, 0, 440)
    g.addColorStop(0, '#d9b98f'); g.addColorStop(0.25, '#a98a66'); g.addColorStop(1, '#5c4a37')
    ctx.fillStyle = g; ctx.fill()
    // swash running up and down the sand
    var run = Math.sin(omega() * t) * (6 + cond.h * 14)
    ctx.fillStyle = 'rgba(159,224,212,0.5)'; ctx.beginPath(); ctx.moveTo(SHORE + 10, SEA - 1); ctx.lineTo(SHORE - 40 - run, 238 - run * 0.15); ctx.lineTo(SHORE - 30 - run, 240 - run * 0.15); ctx.lineTo(SHORE + 10, SEA + 2); ctx.fill()
    ctx.fillStyle = 'rgba(238,247,245,0.8)'; ctx.fillRect(SHORE - 42 - run, 236 - run * 0.15, 8, 2)
  }
  function flag(t) {
    var v = verdict(), x = 70, y0 = 222, dirSign = cond.dir === 'off' ? 1 : -1, len = 34
    ctx.strokeStyle = '#eef7f5'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y0 - 70); ctx.stroke()
    var wave = Math.min(1, cond.w / 18), segs = 8
    function strip(yOff, color) {
      ctx.fillStyle = color; ctx.beginPath()
      for (var i = 0; i <= segs; i++) { var u = i / segs, fx = x + dirSign * u * len * (0.4 + 0.6 * wave), fy = y0 - 70 + yOff + Math.sin(u * 5 - t * (4 + cond.w * 0.3)) * 3 * u * wave + (1 - wave) * u * 18; i ? ctx.lineTo(fx, fy) : ctx.moveTo(fx, fy) }
      for (var j = segs; j >= 0; j--) { var w2 = j / segs, gx = x + dirSign * w2 * len * (0.4 + 0.6 * wave), gy = y0 - 70 + yOff + 9 + Math.sin(w2 * 5 - t * (4 + cond.w * 0.3)) * 3 * w2 * wave + (1 - wave) * w2 * 18; ctx.lineTo(gx, gy) }
      ctx.fill()
    }
    if (v.flag === 'red') { strip(0, '#e5533d'); strip(9, '#e5533d') } else { strip(0, '#e5533d'); strip(9, '#f2c94c') }
  }
  function drawSurfer(t, pts) {
    if (breakX < 0 || cond.h < 0.3 || cond.h > 2.4 || cond.w > 24) { surfer.n = null; return }
    var w = omega()
    // follow one crest until it reaches the beach, then catch the next one
    function crestX(n) { var target = 2 * Math.PI * n + w * t; for (var i = 1; i < cols.length; i++) { if (cols[i - 1].phase - 0 <= target && cols[i].phase >= target) return cols[i].x } return null }
    if (surfer.n === null) { var start = cols.find(function (c) { return c.x <= breakX }) || cols[0]; surfer.n = Math.floor((start.phase - w * t) / (2 * Math.PI)); surfer.fade = 0 }
    var xc = crestX(surfer.n)
    if (xc === null || xc < SHORE + 40) { surfer.n -= 1; surfer.fade = 0; xc = crestX(surfer.n) }
    if (xc === null) return
    if (xc > breakX + 60) { surfer.fade = Math.max(0, surfer.fade - 0.05); }
    else surfer.fade = Math.min(1, surfer.fade + 0.04)
    var prone = cond.h < 0.6, x = xc - (prone ? 6 : 16), i = Math.round((W - x) / STEP); if (!cols[i]) return
    var y = pts[i][1], y2 = pts[Math.min(cols.length - 1, i + 2)][1], ang = Math.atan2(y2 - y, -2 * STEP)
    ctx.save(); ctx.globalAlpha = surfer.fade; ctx.translate(x, y - 2); ctx.rotate(ang * 0.8)
    ctx.fillStyle = '#ff8f6b'; ctx.beginPath(); ctx.ellipse(0, 0, 15, 2.6, 0, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = '#0b1d22'; ctx.fillStyle = '#0b1d22'; ctx.lineWidth = 2.4; ctx.lineCap = 'round'
    if (prone) {
      ctx.beginPath(); ctx.moveTo(-10, -3); ctx.lineTo(8, -4); ctx.stroke(); ctx.beginPath(); ctx.arc(11, -5, 2.6, 0, Math.PI * 2); ctx.fill()
    } else {
      ctx.beginPath(); ctx.moveTo(-6, -2); ctx.lineTo(-3, -9); ctx.lineTo(0, -16); ctx.moveTo(6, -2); ctx.lineTo(3, -9); ctx.lineTo(0, -16)
      ctx.moveTo(0, -16); ctx.lineTo(1, -24); ctx.moveTo(1, -21); ctx.lineTo(-9, -18); ctx.moveTo(1, -21); ctx.lineTo(10, -23); ctx.stroke()
      ctx.beginPath(); ctx.arc(2, -27.5, 3, 0, Math.PI * 2); ctx.fill()
    }
    ctx.restore()
    if (!reduce && surfer.fade > 0.5 && Math.random() < 0.6) spray.push({ x: x + 12, y: y - 3, vx: 25 + Math.random() * 30, vy: -30 - Math.random() * 30, t: 0 })
  }

  // ---- Loop ----
  function frame(now) {
    raf = 0
    var dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60
    last = now
    time += reduce ? dt * 0.35 : dt
    for (var i = spray.length - 1; i >= 0; i--) { var s = spray[i]; s.t += dt; s.vy += 90 * dt; s.x += s.vx * dt; s.y += s.vy * dt; if (s.t > 0.9) spray.splice(i, 1) }
    var dpr = view.dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, view.w, view.h)
    ctx.setTransform(dpr * view.k, 0, 0, dpr * view.k, dpr * view.ox, dpr * view.oy)
    sky(time); beach(time)
    var pts = sea(time)
    foam(time, pts); drawSurfer(time, pts); flag(time)
    if (running) raf = requestAnimationFrame(frame)
  }
  function kick() { if (running && !raf) { last = 0; raf = requestAnimationFrame(frame) } }
  function size() {
    var r = stage.getBoundingClientRect()
    view.dpr = Math.min(2, window.devicePixelRatio || 1); view.w = r.width; view.h = r.height
    canvas.width = Math.round(r.width * view.dpr); canvas.height = Math.round(r.height * view.dpr)
    // keep the beach and the break in view on narrow screens: show at least 620 units wide
    view.k = Math.max(r.width / W, Math.min(r.height / H, r.width / 480))
    // on narrow screens frame the surf zone (beach, sandbar and break), not the open sea
    var visible = r.width / view.k, x0 = Math.max(0, Math.min(W - visible, 300 - visible / 2))
    view.ox = -x0 * view.k
    view.oy = (r.height - H * view.k) / 2
    if (!raf) frame(performance.now())
  }

  // ---- Controls ----
  ;['#sw-h', '#sw-t', '#sw-w'].forEach(function (id) { $(id).addEventListener('input', setFrom) })
  Array.prototype.forEach.call(root.querySelectorAll('[data-dir]'), function (b) { b.addEventListener('click', function () { cond.dir = b.dataset.dir; build(); renderUi() }) })
  $('#sw-today').addEventListener('click', function () {
    $('#sw-h').value = rep.wave; $('#sw-t').value = rep.period; $('#sw-w').value = rep.wind; cond.dir = rep.wind < 10 ? 'off' : 'on'; setFrom()
  })
  $('#sw-book').addEventListener('click', function () {
    var sel = document.getElementById('lesson-select')
    if (sel) { sel.value = this.dataset.lesson; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })) }
    var book = document.getElementById('book'); if (book) book.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
  })
  $('#sw-h').value = cond.h; $('#sw-t').value = cond.t; $('#sw-w').value = cond.w

  if ('ResizeObserver' in window) new ResizeObserver(size).observe(stage); else window.addEventListener('resize', size)
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { running = es[0].isIntersecting && !document.hidden; if (running) kick(); else if (raf) { cancelAnimationFrame(raf); raf = 0 } }).observe(stage)
  } else running = true
  document.addEventListener('visibilitychange', function () { if (document.hidden) { running = false; if (raf) { cancelAnimationFrame(raf); raf = 0 } } })
  build(); renderUi(); size()
  root.classList.add('is-ready')
})()
