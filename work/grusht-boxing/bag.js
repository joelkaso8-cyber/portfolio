// Grusht heavy bag: punch a hanging bag that really swings, coach-called combos and a 30-second round.
// Loaded by main.js when the #bag section scrolls near. No libraries, no sound files.
;(function () {
  var root = document.getElementById('bag')
  if (!root || root.dataset.ready) return
  root.dataset.ready = '1'
  var $ = function (s) { return root.querySelector(s) }
  var $$ = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)) }
  var canvas = $('#hb-canvas'), stage = $('#hb-stage'), ctx = canvas.getContext('2d')
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)
  var C = { bone: '#e7e1d4', brass: '#c9a35f', brassHi: '#dbb876', leather: '#26231f', leatherHi: '#4b453e', line: '#35322d' }
  var NAMES = { 1: 'Jab', 2: 'Cross', 3: 'Lead hook', 4: 'Rear hook', 5: 'Lead uppercut', 6: 'Rear uppercut' }
  var COMBOS = ['1-2', '1-1-2', '1-2-3', '2-3-2', '1-2-5', '3-2', '1-2-3-2', '5-6', '1-6-3-2', '1-1', '2-3', '1-2-1-2']

  // World units: the stage is drawn in a 600 x 560 box, scaled to fit.
  var W = 600, H = 560, PX = 300, PY = 22, L = 262, BW = 150, BH = 300, VX = 300, VY = 290, EYE = 900
  var s = { ax: 0, vx: 0, az: 0, vz: 0, tw: 0, vtw: 0, lift: 0, vlift: 0, dent: 0, vdent: 0, dx: 0, dy: 0, shake: 0 }
  var gloves = { '-1': { t0: -9, n: 0, tx: 0, ty: 0 }, '1': { t0: -9, n: 0, tx: 0, ty: 0 } }
  var rings = [], dust = [], view = { w: 0, h: 0, k: 1, ox: 0, oy: 0, dpr: 1 }
  var stats = { punches: 0, combos: 0, swing: 0, times: [] }
  var round = null, running = false, raf = 0, last = 0, hinted = false

  // Punch numbers: where they land on the bag (bag-local units) and how they move it.
  var HITS = {
    1: { x: -22, y: -46, vz: 0.4, vx: 0.05, tw: 0.2, lift: 0, p: 0.55 },
    2: { x: 18, y: -36, vz: 0.6, vx: -0.06, tw: -0.25, lift: 0, p: 0.8 },
    3: { x: -BW / 2 + 12, y: -26, vz: 0.12, vx: 0.55, tw: 2.4, lift: 0, p: 0.85 },
    4: { x: BW / 2 - 12, y: -16, vz: 0.12, vx: -0.62, tw: -2.7, lift: 0, p: 0.95 },
    5: { x: -22, y: 92, vz: 0.22, vx: 0.08, tw: 0.4, lift: 120, p: 0.7 },
    6: { x: 22, y: 100, vz: 0.28, vx: -0.08, tw: -0.4, lift: 150, p: 0.85 },
  }

  // ---- Sound (made in the browser) ----
  var ac = null, noise = null, sound = true
  function audio() {
    if (!sound) return null
    try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === 'suspended') ac.resume(); return ac } catch (e) { return null }
  }
  function thud(power) {
    var a = audio(); if (!a) return
    try {
      var t = a.currentTime
      if (!noise) { noise = a.createBuffer(1, Math.floor(a.sampleRate * 0.25), a.sampleRate); var d = noise.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3) }
      var n = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain()
      n.buffer = noise; f.type = 'lowpass'; f.frequency.value = 320 + power * 380
      g.gain.setValueAtTime(0.9 * power, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.22)
      n.connect(f).connect(g).connect(a.destination); n.start(t)
      var o = a.createOscillator(), og = a.createGain()
      o.frequency.setValueAtTime(100, t); o.frequency.exponentialRampToValueAtTime(46, t + 0.16)
      og.gain.setValueAtTime(0.75 * power, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.2)
      o.connect(og).connect(a.destination); o.start(t); o.stop(t + 0.22)
      for (var k = 0; k < 3; k++) {
        var c = a.createOscillator(), cg = a.createGain(), ct = t + 0.04 + k * 0.05 + Math.random() * 0.02
        c.type = 'triangle'; c.frequency.value = 2300 + Math.random() * 1900
        cg.gain.setValueAtTime(0.035 * power, ct); cg.gain.exponentialRampToValueAtTime(0.0001, ct + 0.06)
        c.connect(cg).connect(a.destination); c.start(ct); c.stop(ct + 0.08)
      }
    } catch (e) {}
  }
  function bell(times) {
    var a = audio(); if (!a) return
    try {
      for (var k = 0; k < times; k++) {
        var t = a.currentTime + k * 0.32
        ;[1, 2.76, 5.4].forEach(function (m, j) {
          var o = a.createOscillator(), g = a.createGain()
          o.frequency.value = 820 * m
          g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.3 / (j + 1), t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.3 - j * 0.3)
          o.connect(g).connect(a.destination); o.start(t); o.stop(t + 1.4)
        })
      }
    } catch (e) {}
  }

  // ---- Geometry ----
  function project(x, y, z) { var k = EYE / (EYE + z); return { x: VX + (x - VX) * k, y: VY + (y - VY) * k, k: k } }
  function bagPose() {
    var z = L * Math.sin(s.az)
    var wx = PX + L * Math.sin(s.ax) * Math.cos(s.az)
    var wy = PY + L * Math.cos(s.ax) * Math.cos(s.az) - s.lift
    var p = project(wx, wy, z)
    return { x: p.x, y: p.y, k: p.k, a: s.ax }
  }
  function toWorld(cx, cy) { return { x: (cx - view.ox) / view.k, y: (cy - view.oy) / view.k } }
  function local(b, lx, ly) { var c = Math.cos(b.a), sn = Math.sin(b.a); return { x: b.x + (lx * c - ly * sn) * b.k, y: b.y + (lx * sn + ly * c) * b.k } }
  var REST = { '-1': { x: 168, y: 498 }, '1': { x: 438, y: 512 } }

  // ---- Punching ----
  function punch(n) {
    n = Number(n)
    if (!HITS[n]) return
    var side = n % 2 ? -1 : 1, g = gloves[side], h = HITS[n]
    g.t0 = performance.now(); g.n = n; g.hit = false
    var b = bagPose(), p = local(b, h.x, h.y)
    g.tx = p.x; g.ty = p.y
    stats.punches++; stats.times.push(Date.now())
    if (round && round.live) round.punches++
    if (!hinted) { hinted = true; var hint = $('#hb-hint'); if (hint) hint.hidden = true }
    callCheck(n)
    flashPad(n)
    renderStats()
    kick()
  }
  function land(n) {
    var h = HITS[n], f = reduce ? 0.45 : 0.7
    s.vz += h.vz * f; s.vx += h.vx * f; s.vtw += h.tw * f; s.vlift += h.lift * f
    s.dx = h.x; s.dy = h.y; s.vdent += 9 * h.p; s.shake = reduce ? 0 : 3 + 5 * h.p
    var b = bagPose(), p = local(b, h.x, h.y)
    rings.push({ x: p.x, y: p.y, t: 0, k: b.k })
    if (!reduce) for (var i = 0; i < 10; i++) dust.push({ x: p.x, y: p.y, vx: (Math.random() - 0.5) * 140, vy: -Math.random() * 120 - 20, life: 0.8 + Math.random() * 0.6, t: 0, r: 0.8 + Math.random() * 1.6 })
    thud(h.p)
  }
  function pickByPoint(cx, cy) {
    var w = toWorld(cx, cy), b = bagPose(), half = (BW / 2) * b.k
    var dx = w.x - b.x
    if (Math.abs(dx) <= half * 1.05) return w.y > b.y + BH * b.k * 0.18 ? (dx < 0 ? 5 : 6) : (dx < 0 ? 1 : 2)
    return dx < 0 ? 3 : 4
  }

  // ---- Coach calls and the round ----
  function renderCall() {
    var box = $('#hb-call')
    if (!round) { box.innerHTML = ''; return }
    if (!round.live) { box.innerHTML = '<span class="hb__count"></span>'; box.firstChild.textContent = round.label; return }
    box.innerHTML = ''
    round.call.forEach(function (n, i) {
      var c = document.createElement('span')
      c.className = 'hb__chip' + (i < round.step ? ' is-done' : '') + (i === round.step ? ' is-next' : '')
      c.textContent = n
      c.title = NAMES[n]
      box.appendChild(c)
    })
    if (round.good) { var g = document.createElement('span'); g.className = 'hb__good'; g.textContent = 'Good'; box.appendChild(g) }
  }
  function nextCall() {
    if (!round || !round.live) return
    var pick
    do { pick = COMBOS[Math.floor(Math.random() * COMBOS.length)] } while (pick === round.last && COMBOS.length > 1)
    round.last = pick; round.call = pick.split('-').map(Number); round.step = 0; round.good = false; round.callAt = performance.now()
    renderCall()
  }
  function callCheck(n) {
    if (!round || !round.live || !round.call) return
    if (n === round.call[round.step]) {
      round.step++
      if (round.step === round.call.length) {
        round.combos++; stats.combos++; round.good = true
        renderCall(); renderStats()
        clearTimeout(round.nextT); round.nextT = setTimeout(nextCall, 520)
        return
      }
    } else round.step = n === round.call[0] ? 1 : 0
    renderCall()
  }
  function startRound() {
    if (round) { endRound(true); return }
    audio()
    round = { live: false, punches: 0, combos: 0, label: '3', timers: [] }
    $('#hb-round').textContent = 'Stop the round'
    $('#hb-result').textContent = ''
    $('#hb-clock').hidden = false
    renderCall()
    ;['2', '1'].forEach(function (l, i) { round.timers.push(setTimeout(function () { if (round) { round.label = l; renderCall() } }, (i + 1) * 650)) })
    round.timers.push(setTimeout(function () {
      if (!round) return
      round.live = true; round.start = performance.now(); round.end = round.start + 30000
      bell(1); nextCall(); kick()
    }, 1950))
  }
  function endRound(stopped) {
    if (!round) return
    round.timers.forEach(clearTimeout); clearTimeout(round.nextT)
    var r = round
    round = null
    $('#hb-round').textContent = 'Start a 30-second round'
    $('#hb-clock').hidden = true
    renderCall()
    var out = $('#hb-result')
    if (stopped || !r.live) { out.className = 'form-status'; out.textContent = 'Round stopped.'; return }
    bell(3)
    var ppm = Math.round(r.punches * 2)
    var best = readBest(), isBest = !best || r.punches + r.combos * 3 > best.p + best.c * 3
    if (isBest) writeBest({ p: r.punches, c: r.combos })
    out.className = 'form-status is-ok'
    out.textContent = 'Round over: ' + r.punches + ' punches, ' + r.combos + (r.combos === 1 ? ' combo' : ' combos') + ', ' + ppm + ' a minute. ' + (isBest ? 'Your best round yet. ' : '') + 'Want a coach to check your guard? '
    var a = document.createElement('a'); a.href = '#trial'; a.textContent = 'Book a free class'
    out.appendChild(a)
    renderStats()
  }
  function readBest() { try { return JSON.parse(localStorage.getItem('grusht-bag-best') || 'null') } catch (e) { return null } }
  function writeBest(b) { try { localStorage.setItem('grusht-bag-best', JSON.stringify(b)) } catch (e) {} }

  // ---- Stats and pads ----
  function renderStats() {
    var now = Date.now()
    stats.times = stats.times.filter(function (t) { return now - t < 10000 })
    var ppm = round && round.live ? Math.round(round.punches / Math.max(1, (performance.now() - round.start) / 60000)) : stats.times.length > 1 ? stats.times.length * 6 : 0
    $('#hb-punches').textContent = stats.punches
    $('#hb-combos').textContent = stats.combos
    $('#hb-ppm').textContent = ppm
    $('#hb-swing').textContent = Math.round(stats.swing) + '°'
    var best = readBest()
    $('#hb-best').textContent = best ? 'Your best round: ' + best.p + ' punches, ' + best.c + (best.c === 1 ? ' combo.' : ' combos.') : ''
  }
  function flashPad(n) {
    var b = root.querySelector('[data-p="' + n + '"]'); if (!b) return
    b.classList.remove('is-hit'); void b.offsetWidth; b.classList.add('is-hit')
  }

  // ---- Simulation ----
  function step(dt) {
    var w2 = 8.2, damp = 0.85
    s.vx += (-w2 * Math.sin(s.ax) - damp * s.vx) * dt; s.ax += s.vx * dt
    s.vz += (-w2 * Math.sin(s.az) - damp * s.vz) * dt; s.az += s.vz * dt
    s.vtw += (-60 * s.tw - 3.2 * s.vtw) * dt; s.tw += s.vtw * dt
    s.vlift += (-90 * s.lift - 9 * s.vlift) * dt; s.lift += s.vlift * dt
    s.vdent += (-420 * s.dent - 22 * s.vdent) * dt; s.dent += s.vdent * dt
    s.shake *= Math.exp(-14 * dt)
    var sw = Math.max(Math.abs(s.ax), Math.abs(s.az)) * 180 / Math.PI
    if (sw > stats.swing + 0.5) { stats.swing = sw; $('#hb-swing').textContent = Math.round(sw) + '°' }
    for (var i = rings.length - 1; i >= 0; i--) { rings[i].t += dt; if (rings[i].t > 0.45) rings.splice(i, 1) }
    for (var j = dust.length - 1; j >= 0; j--) { var d = dust[j]; d.t += dt; d.vy += 60 * dt; d.vx *= Math.exp(-1.5 * dt); d.x += d.vx * dt; d.y += d.vy * dt; if (d.t > d.life) dust.splice(j, 1) }
    var now = performance.now()
    ;['-1', '1'].forEach(function (k) { var g = gloves[k]; if (!g.hit && g.n && now - g.t0 >= 75) { g.hit = true; land(g.n) } })
    if (round && round.live) {
      var left = Math.max(0, round.end - now)
      $('#hb-time').textContent = '0:' + String(Math.ceil(left / 1000)).padStart(2, '0')
      $('#hb-bar').style.transform = 'scaleX(' + (left / 30000).toFixed(4) + ')'
      if (round.call && !round.good && now - round.callAt > 4200) nextCall()
      if (left <= 0) endRound(false)
    }
  }
  function busy() {
    var now = performance.now()
    return (round && round.live) || Math.abs(s.vx) + Math.abs(s.vz) + Math.abs(s.vtw) + Math.abs(s.vlift) + Math.abs(s.vdent) > 0.004 ||
      Math.abs(s.ax) + Math.abs(s.az) + Math.abs(s.tw) + Math.abs(s.lift) + Math.abs(s.dent) > 0.002 || rings.length || dust.length ||
      now - gloves['-1'].t0 < 300 || now - gloves['1'].t0 < 300
  }

  // ---- Drawing ----
  function rr(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath() }
  function drawRoom() {
    var g = ctx.createRadialGradient(300, -40, 20, 300, 160, 520)
    g.addColorStop(0, 'rgba(219,184,118,0.20)'); g.addColorStop(0.45, 'rgba(219,184,118,0.06)'); g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g; ctx.fillRect(-200, -100, W + 400, H + 200)
    // light cone from the lamp
    ctx.save(); ctx.globalCompositeOperation = 'lighter'
    var cone = ctx.createLinearGradient(0, 0, 0, H)
    cone.addColorStop(0, 'rgba(238,234,226,0.10)'); cone.addColorStop(1, 'rgba(238,234,226,0)')
    ctx.fillStyle = cone; ctx.beginPath(); ctx.moveTo(270, 0); ctx.lineTo(330, 0); ctx.lineTo(520, H); ctx.lineTo(80, H); ctx.closePath(); ctx.fill(); ctx.restore()
    // floor line
    var f = ctx.createLinearGradient(0, 470, 0, H)
    f.addColorStop(0, 'rgba(0,0,0,0)'); f.addColorStop(1, 'rgba(0,0,0,0.45)')
    ctx.fillStyle = f; ctx.fillRect(-200, 470, W + 400, 200)
    // ceiling beam
    ctx.fillStyle = '#0b0a09'; ctx.fillRect(-200, 0, W + 400, 14)
    ctx.fillStyle = C.line; ctx.fillRect(-200, 13, W + 400, 2)
    ctx.fillStyle = '#3c3830'; rr(PX - 22, 8, 44, 16, 4); ctx.fill()
  }
  function drawShadow(b) {
    var x = VX + (b.x - VX) * 1.15, w = BW * 0.95 * b.k, hgt = 18 * b.k
    var g = ctx.createRadialGradient(x, 532, 4, x, 532, w)
    g.addColorStop(0, 'rgba(0,0,0,0.55)'); g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, 532, w, hgt, 0, 0, Math.PI * 2); ctx.fill()
  }
  function drawChain(b) {
    var top = local(b, 0, -BH / 2 - 34)
    var x0 = PX, y0 = 24, n = 9
    for (var i = 0; i < n; i++) {
      var t = (i + 0.5) / n, x = x0 + (top.x - x0) * t, y = y0 + (top.y - y0) * t
      ctx.save(); ctx.translate(x, y); ctx.rotate(Math.atan2(top.x - x0, top.y - y0) * -1)
      ctx.lineWidth = 3.2; ctx.strokeStyle = i % 2 ? '#8a8172' : '#b9b09f'
      ctx.beginPath()
      if (i % 2) ctx.ellipse(0, 0, 2.2, 8.5, 0, 0, Math.PI * 2)
      else ctx.ellipse(0, 0, 5.5, 8.5, 0, 0, Math.PI * 2)
      ctx.stroke(); ctx.restore()
    }
    // swivel ring and straps
    ctx.strokeStyle = C.brass; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(top.x, top.y, 7 * b.k, 0, Math.PI * 2); ctx.stroke()
    ctx.strokeStyle = '#1c1a17'; ctx.lineWidth = 4 * b.k
    ;[-0.42, -0.14, 0.14, 0.42].forEach(function (f) {
      var e = local(b, f * BW, -BH / 2 + 4)
      ctx.beginPath(); ctx.moveTo(top.x, top.y + 5); ctx.lineTo(e.x, e.y); ctx.stroke()
    })
  }
  function drawBag(b) {
    ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.a); ctx.scale(b.k, b.k)
    var hw = BW / 2, hh = BH / 2, cap = 16
    // body
    ctx.beginPath()
    ctx.moveTo(-hw, -hh + cap); ctx.ellipse(0, -hh + cap, hw, cap, 0, Math.PI, 0)
    ctx.lineTo(hw, hh - cap); ctx.ellipse(0, hh - cap, hw, cap, 0, 0, Math.PI); ctx.closePath()
    var g = ctx.createLinearGradient(-hw, 0, hw, 0)
    var sh = Math.sin(s.tw) * 0.18
    g.addColorStop(0, '#100f0d'); g.addColorStop(Math.max(0.05, 0.28 + sh), C.leatherHi); g.addColorStop(Math.max(0.1, 0.42 + sh), C.leather); g.addColorStop(1, '#0c0b0a')
    ctx.fillStyle = g; ctx.fill()
    ctx.save(); ctx.clip()
    // seams turn with the twist
    for (var i = 0; i < 6; i++) {
      var th = i * Math.PI / 3 + s.tw, c = Math.cos(th)
      if (c <= 0.05) continue
      var x = hw * Math.sin(th)
      ctx.strokeStyle = 'rgba(231,225,212,' + (0.08 + 0.12 * c).toFixed(3) + ')'; ctx.lineWidth = 1.2
      ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(x, -hh + cap * 1.6); ctx.lineTo(x, hh - cap * 1.6); ctx.stroke(); ctx.setLineDash([])
    }
    // brass bands
    ;[-hh + 46, hh - 46].forEach(function (y) {
      var bg = ctx.createLinearGradient(-hw, 0, hw, 0)
      bg.addColorStop(0, '#5a4826'); bg.addColorStop(0.32 + sh, C.brassHi); bg.addColorStop(0.55 + sh, C.brass); bg.addColorStop(1, '#4a3b1f')
      ctx.fillStyle = bg; ctx.fillRect(-hw, y - 7, BW, 14)
    })
    // name on the bag, turning with it
    var face = Math.cos(s.tw)
    if (face > 0.1) {
      ctx.save(); ctx.translate(hw * Math.sin(s.tw) * 0.9, 6); ctx.scale(face, 1)
      ctx.fillStyle = 'rgba(231,225,212,' + (0.85 * face).toFixed(3) + ')'
      ctx.font = '400 40px Anton, Impact, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.save(); ctx.rotate(-Math.PI / 2); ctx.fillText('GRUSHT', 0, 0); ctx.restore()
      ctx.restore()
    }
    // dent where the last punch landed
    if (s.dent > 0.01) {
      var dg = ctx.createRadialGradient(s.dx, s.dy, 2, s.dx, s.dy, 30 + 20 * s.dent)
      dg.addColorStop(0, 'rgba(0,0,0,' + Math.min(0.75, s.dent * 0.6).toFixed(3) + ')'); dg.addColorStop(0.7, 'rgba(0,0,0,' + Math.min(0.3, s.dent * 0.2).toFixed(3) + ')'); dg.addColorStop(1, 'rgba(255,240,210,0)')
      ctx.fillStyle = dg; ctx.beginPath(); ctx.ellipse(s.dx, s.dy, 34 + 14 * s.dent, 28 + 10 * s.dent, 0, 0, Math.PI * 2); ctx.fill()
    }
    // lamp highlight from above
    var hl = ctx.createLinearGradient(0, -hh, 0, -hh + 120)
    hl.addColorStop(0, 'rgba(238,234,226,0.16)'); hl.addColorStop(1, 'rgba(238,234,226,0)')
    ctx.fillStyle = hl; ctx.fillRect(-hw, -hh, BW, 120)
    ctx.restore()
    // top cap
    ctx.fillStyle = '#3a352f'; ctx.beginPath(); ctx.ellipse(0, -hh + cap, hw, cap, 0, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = 'rgba(201,163,95,0.6)'; ctx.lineWidth = 1.5; ctx.stroke()
    ctx.restore()
  }
  function drawGlove(side, now) {
    var g = gloves[side], rest = REST[side], t = (now - g.t0) / 1000, x = rest.x, y = rest.y, sc = 1, ang = side * -0.12
    var bob = reduce ? 0 : Math.sin(now / 420 + (side > 0 ? 1.4 : 0)) * 4
    y += bob
    if (t >= 0 && t < 0.26 && g.n) {
      var out = t < 0.075 ? 1 - Math.pow(1 - t / 0.075, 3) : 1 - Math.pow((t - 0.075) / 0.185, 2)
      out = Math.max(0, Math.min(1, out))
      var hook = g.n === 3 || g.n === 4, upper = g.n === 5 || g.n === 6
      var mx = rest.x + (g.tx - rest.x) * out, my = rest.y + (g.ty - rest.y) * out
      if (hook) mx += side * Math.sin(out * Math.PI) * 120
      if (upper) my += Math.sin(out * Math.PI) * 50
      x = mx; y = my; sc = 1 - 0.38 * out; ang = side * (hook ? -1.1 : -0.12) * out + (upper ? side * 0.6 * out : 0)
    }
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(sc * side, sc)
    // shadow
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(6, 18, 52, 58, 0, 0, Math.PI * 2); ctx.fill()
    // glove body
    var gg = ctx.createRadialGradient(-14, -24, 6, 0, 0, 70)
    gg.addColorStop(0, '#fbf8f1'); gg.addColorStop(0.55, C.bone); gg.addColorStop(1, '#a9a191')
    ctx.fillStyle = gg; ctx.beginPath(); ctx.ellipse(0, -6, 46, 54, 0, 0, Math.PI * 2); ctx.fill()
    // thumb
    ctx.fillStyle = '#d8d1c2'; ctx.beginPath(); ctx.ellipse(-36, 6, 15, 26, -0.35, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = 'rgba(0,0,0,0.18)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(-36, 6, 15, 26, -0.35, 0.2, 2.2); ctx.stroke()
    // knuckle seam
    ctx.strokeStyle = 'rgba(0,0,0,0.14)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(2, -22, 34, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke()
    // brass cuff
    var cg = ctx.createLinearGradient(-36, 0, 36, 0)
    cg.addColorStop(0, '#6b5528'); cg.addColorStop(0.4, C.brassHi); cg.addColorStop(1, '#5d4a24')
    ctx.fillStyle = cg; rr(-34, 38, 68, 34, 8); ctx.fill()
    ctx.fillStyle = 'rgba(18,17,16,0.8)'; ctx.font = '400 15px Anton, Impact, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.save(); ctx.scale(side, 1); ctx.fillText('G', 0, 56); ctx.restore()
    ctx.restore()
  }
  function draw(now) {
    var dpr = view.dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, view.w, view.h)
    var sx = s.shake ? (Math.random() - 0.5) * s.shake : 0, sy = s.shake ? (Math.random() - 0.5) * s.shake : 0
    ctx.setTransform(dpr * view.k, 0, 0, dpr * view.k, dpr * (view.ox + sx), dpr * (view.oy + sy))
    var b = bagPose()
    drawRoom(); drawShadow(b); drawChain(b); drawBag(b)
    rings.forEach(function (r) {
      var p = r.t / 0.45
      ctx.strokeStyle = 'rgba(219,184,118,' + (0.7 * (1 - p)).toFixed(3) + ')'; ctx.lineWidth = 3 * (1 - p) + 0.5
      ctx.beginPath(); ctx.ellipse(r.x, r.y, (14 + 60 * p) * r.k, (10 + 44 * p) * r.k, 0, 0, Math.PI * 2); ctx.stroke()
    })
    dust.forEach(function (d) { ctx.fillStyle = 'rgba(238,234,226,' + (0.6 * (1 - d.t / d.life)).toFixed(3) + ')'; ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill() })
    drawGlove('-1', now); drawGlove('1', now)
  }

  // ---- Loop, sizing, visibility ----
  function frame(now) {
    raf = 0
    var dt = last ? Math.min(0.033, (now - last) / 1000) : 1 / 60
    last = now
    var n = Math.max(1, Math.ceil(dt / 0.008)), h = dt / n
    for (var i = 0; i < n; i++) step(h)
    draw(now)
    if (running && busy()) raf = requestAnimationFrame(frame)
    else { last = 0; draw(now) }
  }
  function kick() { if (!raf && running) { last = 0; raf = requestAnimationFrame(frame) } else if (!running) draw(performance.now()) }
  function size() {
    var r = stage.getBoundingClientRect()
    view.dpr = Math.min(2, window.devicePixelRatio || 1); view.w = r.width; view.h = r.height
    canvas.width = Math.round(r.width * view.dpr); canvas.height = Math.round(r.height * view.dpr)
    // On narrow screens crop the empty sides (keep 400 of the 600 units) so the bag stays big.
    view.k = Math.min(r.height / H, r.width / 400); view.ox = (r.width - W * view.k) / 2; view.oy = (r.height - H * view.k) / 2
    draw(performance.now())
  }

  // ---- Input ----
  stage.addEventListener('pointerdown', function (e) {
    if (e.button !== 0) return
    var r = stage.getBoundingClientRect()
    audio()
    punch(pickByPoint(e.clientX - r.left, e.clientY - r.top))
  })
  root.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey || /input|select|textarea/i.test(e.target.tagName)) return
    if (/^[1-6]$/.test(e.key)) { e.preventDefault(); audio(); punch(e.key) }
  })
  $$('[data-p]').forEach(function (b) { b.addEventListener('click', function () { audio(); punch(b.dataset.p) }) })
  $('#hb-round').addEventListener('click', startRound)
  var sb = $('#hb-sound')
  sb.addEventListener('click', function () { sound = !sound; sb.setAttribute('aria-pressed', String(sound)); sb.textContent = sound ? 'Sound on' : 'Sound off' })

  if ('ResizeObserver' in window) new ResizeObserver(size).observe(stage)
  else window.addEventListener('resize', size)
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      running = es[0].isIntersecting && !document.hidden
      if (running) kick()
      else if (raf) { cancelAnimationFrame(raf); raf = 0; last = 0 }
    }).observe(stage)
  } else running = true
  document.addEventListener('visibilitychange', function () { if (document.hidden && raf) { cancelAnimationFrame(raf); raf = 0; last = 0 } })
  if (document.fonts && document.fonts.load) document.fonts.load('40px Anton').then(function () { draw(performance.now()) }, function () {})
  size(); renderStats()
  root.classList.add('is-ready')
})()
