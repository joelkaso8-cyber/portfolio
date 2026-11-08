// Kalaja "The oven": turn the oven timer and watch a bake rise and brown through the oven mouth.
// Pick one of today's four bakes; it tells you when the real tray comes out and reserves one from it
// (adds it to the order-ahead basket and sets the pickup time). English and Albanian. Loaded when #oven-window scrolls near.
;(function () {
  var root = document.getElementById('oven-window')
  if (!root || root.dataset.ready) return
  root.dataset.ready = '1'
  var $ = function (s) { return root.querySelector(s) }
  var stage = $('#ov-stage'), canvas = $('#ov-canvas'), ctx = canvas.getContext('2d')
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)

  // Same products, order and bake times as main.js (PRODUCTS / BAKES).
  var BAKES = [
    { id: 'byrek-spinach', at: '06:00', idx: 0, min: 35, en: 'Spinach byrek', sq: 'Byrek me spinaq', kind: 'coil' },
    { id: 'bread', at: '08:30', idx: 4, min: 40, en: 'Village loaf', sq: 'Bukë fshati', kind: 'loaf' },
    { id: 'byrek-meat', at: '11:00', idx: 1, min: 35, en: 'Meat byrek', sq: 'Byrek me mish', kind: 'tray' },
    { id: 'pastries', at: '14:00', idx: 2, min: 18, en: 'Filled pastries', sq: 'Pasta të mbushura', kind: 'pastry' },
  ]
  var TXT = {
    en: { raw: 'Raw dough, going in.', rise: 'Rising…', brown: 'Browning nicely…', gold: 'Golden. Exactly how we take it out.', dark: 'Too dark! That is why someone watches the oven.', next: 'Next tray out at {t} today', tomorrow: 'Next tray tomorrow at {t}', reserve: 'Reserve one from the {t} tray', reserved: 'Added to your order. Pickup set for {t}.', reservedLate: 'Added to your order. Pick a pickup time in the basket.', bake: 'Bake it for me', min: 'min', knob: 'Oven timer' },
    sq: { raw: 'Brumë i gjallë, po futet.', rise: 'Po fryhet…', brown: 'Po skuqet bukur…', gold: 'E artë. Pikërisht kështu e nxjerrim.', dark: 'Shumë e errët! Prandaj dikush e ruan furrën.', next: 'Tava tjetër del sot në {t}', tomorrow: 'Tava tjetër nesër në {t}', reserve: 'Rezervo një nga tava e {t}', reserved: 'U shtua te porosia. Marrja në {t}.', reservedLate: 'U shtua te porosia. Zgjidh orën e marrjes te shporta.', bake: 'Piqe për mua', min: 'min', knob: 'Kohëmatësi i furrës' },
  }
  var lang = document.documentElement.lang === 'sq' ? 'sq' : 'en'
  function T(k, v) { var s = TXT[lang][k]; if (v) Object.keys(v).forEach(function (x) { s = s.split('{' + x + '}').join(v[x]) }); return s }

  var W = 800, H = 500
  var st = { bake: 1, p: 0, shown: 0, auto: null }
  var view = { w: 0, h: 0, k: 1, ox: 0, oy: 0, dpr: 1 }, embers = [], steam = [], running = false, raf = 0, last = 0, clock = 0
  var spots = []; for (var i = 0; i < 40; i++) spots.push({ a: Math.random() * Math.PI * 2, r: Math.random(), s: 0.6 + Math.random() * 1.4 })

  // ---- Colours of the crust as it bakes ----
  function mix(a, b, t) { return a.map(function (v, i) { return v + (b[i] - v) * t }) }
  function rgb(c, a) { return 'rgba(' + c.map(Math.round).join(',') + ',' + (a == null ? 1 : a) + ')' }
  function crust(p, shade) {
    var dough = [236, 218, 186], gold = [214, 150, 72], dark = [96, 54, 26]
    var c = p < 1 ? mix(dough, gold, Math.pow(Math.max(0, p - 0.15) / 0.85, 1.3)) : mix(gold, dark, Math.min(1, (p - 1) / 0.3))
    return shade ? mix(c, [0, 0, 0], shade) : c
  }
  function rise(p) { return Math.min(1, Math.max(0, (p - 0.1) / 0.6)) }

  // ---- Oven ----
  function drawOven(heat, t) {
    // wall and the oven dome in brick
    ctx.fillStyle = '#1d1510'; ctx.fillRect(-500, -500, W + 1000, H + 1000)
    var dome = ctx.createRadialGradient(400, 330, 120, 400, 330, 420)
    dome.addColorStop(0, '#6e3a26'); dome.addColorStop(0.6, '#4a2a1c'); dome.addColorStop(1, '#2a1a12')
    ctx.fillStyle = dome; ctx.beginPath(); ctx.ellipse(400, 360, 380, 330, 0, Math.PI, 0); ctx.lineTo(780, 520); ctx.lineTo(20, 520); ctx.closePath(); ctx.fill()
    // brick courses around the mouth
    ctx.strokeStyle = 'rgba(20,12,8,0.55)'; ctx.lineWidth = 3
    for (var r = 0; r < 3; r++) {
      var rx = 300 + r * 26, ry = 210 + r * 26
      ctx.beginPath(); ctx.ellipse(400, 380, rx, ry, 0, Math.PI, 0); ctx.stroke()
      for (var b = 0; b <= 14; b++) { var a = Math.PI + b / 14 * Math.PI, x1 = 400 + Math.cos(a) * rx, y1 = 380 + Math.sin(a) * ry, x2 = 400 + Math.cos(a) * (rx + 26), y2 = 380 + Math.sin(a) * (ry + 26); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke() }
    }
    // the mouth, glowing inside
    ctx.save(); ctx.beginPath(); ctx.ellipse(400, 380, 300, 210, 0, Math.PI, 0); ctx.lineTo(700, 470); ctx.lineTo(100, 470); ctx.closePath(); ctx.clip()
    var inside = ctx.createLinearGradient(0, 170, 0, 470)
    inside.addColorStop(0, '#2a120a'); inside.addColorStop(1, '#130805')
    ctx.fillStyle = inside; ctx.fillRect(100, 160, 600, 320)
    var flick = 0.85 + 0.15 * Math.sin(t * 9) * Math.sin(t * 3.7)
    var fire = ctx.createRadialGradient(170, 400, 10, 170, 400, 260 + heat * 120)
    fire.addColorStop(0, 'rgba(255,190,90,' + (0.75 * flick).toFixed(3) + ')'); fire.addColorStop(0.35, 'rgba(232,110,50,' + (0.45 * flick * (0.6 + heat * 0.4)).toFixed(3) + ')'); fire.addColorStop(1, 'rgba(200,102,74,0)')
    ctx.fillStyle = fire; ctx.fillRect(100, 160, 600, 320)
    // logs and flames at the back left
    ctx.fillStyle = '#2b1810'; ctx.save(); ctx.translate(165, 420); ctx.rotate(-0.12); ctx.fillRect(-60, -10, 120, 20); ctx.restore(); ctx.save(); ctx.translate(180, 432); ctx.rotate(0.18); ctx.fillRect(-55, -9, 110, 18); ctx.restore()
    for (var f = 0; f < 5; f++) {
      var fx = 130 + f * 18, fh = (40 + 30 * Math.sin(t * 7 + f * 1.7)) * (0.7 + heat * 0.5)
      var fg = ctx.createLinearGradient(0, 420 - fh, 0, 420)
      fg.addColorStop(0, 'rgba(255,220,140,0)'); fg.addColorStop(0.4, 'rgba(255,170,70,0.8)'); fg.addColorStop(1, 'rgba(230,90,40,0.9)')
      ctx.fillStyle = fg; ctx.beginPath(); ctx.moveTo(fx - 12, 420); ctx.quadraticCurveTo(fx - 8 + Math.sin(t * 5 + f) * 6, 420 - fh * 0.6, fx + Math.sin(t * 6 + f) * 5, 420 - fh); ctx.quadraticCurveTo(fx + 10, 420 - fh * 0.5, fx + 12, 420); ctx.fill()
    }
    embers.forEach(function (e) { ctx.fillStyle = 'rgba(255,200,120,' + (1 - e.t / e.life).toFixed(3) + ')'; ctx.fillRect(e.x, e.y, 2, 2) })
    // stone floor
    var floor = ctx.createLinearGradient(0, 400, 0, 470)
    floor.addColorStop(0, '#5a3524'); floor.addColorStop(1, '#2c1a12')
    ctx.fillStyle = floor; ctx.beginPath(); ctx.ellipse(400, 440, 290, 50, 0, 0, Math.PI * 2); ctx.fill()
    ctx.restore()
    // warm light spilling out
    var spill = ctx.createRadialGradient(400, 470, 20, 400, 470, 360)
    spill.addColorStop(0, 'rgba(232,181,98,' + (0.18 + heat * 0.12).toFixed(3) + ')'); spill.addColorStop(1, 'rgba(232,181,98,0)')
    ctx.fillStyle = spill; ctx.fillRect(0, 300, W, 220)
    // the sill
    ctx.fillStyle = '#3a2418'; ctx.fillRect(60, 468, 680, 26); ctx.fillStyle = 'rgba(255,220,170,0.12)'; ctx.fillRect(60, 468, 680, 3)
  }

  // ---- Bakes ----
  function drawLoaf(p) {
    var r = rise(p), w = 250 + 20 * r, h = 52 + 58 * r, x = 400, y = 438
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(x, y + 4, w / 2 + 6, 12, 0, 0, Math.PI * 2); ctx.fill()
    var g = ctx.createLinearGradient(0, y - h, 0, y)
    g.addColorStop(0, rgb(crust(p, 0.12))); g.addColorStop(0.5, rgb(crust(p))); g.addColorStop(1, rgb(crust(p * 0.85, 0.05)))
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - w / 2, y)
    ctx.bezierCurveTo(x - w / 2 - 8, y - h * 0.9, x - w * 0.25, y - h * 1.08, x, y - h * 1.08); ctx.bezierCurveTo(x + w * 0.25, y - h * 1.08, x + w / 2 + 8, y - h * 0.9, x + w / 2, y); ctx.closePath(); ctx.fill()
    // scores open into an "ear" as it rises
    for (var i = -1; i <= 1; i++) {
      var sx = x + i * 66, sy = y - h * 0.95 + Math.abs(i) * h * 0.12, open = 2 + r * 9
      ctx.fillStyle = rgb(mix(crust(p * 0.7), [250, 236, 210], 0.35)); ctx.beginPath(); ctx.ellipse(sx, sy, 30, open / 2, -0.35, 0, Math.PI * 2); ctx.fill()
      ctx.strokeStyle = rgb(crust(p, 0.35)); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(sx, sy - open * 0.3, 30, open / 2, -0.35, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke()
    }
    ctx.fillStyle = 'rgba(255,250,240,' + (0.5 * (1 - Math.min(1, p))).toFixed(3) + ')'
    spots.forEach(function (s, k) { if (k % 3) return; ctx.fillRect(x - w * 0.4 + s.r * w * 0.8, y - h * (0.5 + 0.4 * Math.abs(Math.sin(s.a))), 1.6, 1.6) })
  }
  function drawCoil(p) {
    var r = rise(p), x = 400, y = 425, rx = 190, ry = 58
    ctx.fillStyle = '#5c5f63'; ctx.beginPath(); ctx.ellipse(x, y + 18, rx + 8, ry + 6, 0, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#8a8d91'; ctx.beginPath(); ctx.ellipse(x, y, rx + 8, ry + 4, 0, 0, Math.PI * 2); ctx.fill()
    var lift = 8 * r
    ctx.fillStyle = rgb(crust(p, 0.1)); ctx.beginPath(); ctx.ellipse(x, y - lift, rx, ry, 0, 0, Math.PI * 2); ctx.fill()
    // the spiral of rolled filo
    ctx.strokeStyle = rgb(crust(p, 0.38)); ctx.lineWidth = 3 + r * 2; ctx.beginPath()
    for (var a = 0; a < Math.PI * 9; a += 0.08) { var k = a / (Math.PI * 9), px = x + Math.cos(a) * rx * k * 0.96, py = y - lift + Math.sin(a) * ry * k * 0.96; if (a) ctx.lineTo(px, py); else ctx.moveTo(px, py) }
    ctx.stroke()
    ctx.strokeStyle = rgb(mix(crust(p), [255, 240, 210], 0.35), 0.7); ctx.lineWidth = 1.2; ctx.beginPath()
    for (var b = 0.1; b < Math.PI * 9; b += 0.08) { var k2 = b / (Math.PI * 9), qx = x + Math.cos(b) * rx * k2 * 0.96, qy = y - lift - 2 + Math.sin(b) * ry * k2 * 0.96; if (b > 0.1) ctx.lineTo(qx, qy); else ctx.moveTo(qx, qy) }
    ctx.stroke()
    blisters(x, y - lift, rx, ry, p)
  }
  function drawTray(p) {
    var r = rise(p), x = 400, y = 420
    function quad(dx, dy, w, h) { ctx.beginPath(); ctx.moveTo(x - w + dx, y + dy); ctx.lineTo(x + w + dx - 40, y + dy); ctx.lineTo(x + w + dx, y + h + dy); ctx.lineTo(x - w + dx + 40, y + h + dy); ctx.closePath() }
    ctx.fillStyle = '#5c5f63'; quad(-4, 6, 200, 70); ctx.fill()
    ctx.fillStyle = '#8a8d91'; quad(-4, 0, 200, 64); ctx.fill()
    var lift = 7 * r
    ctx.fillStyle = rgb(crust(p, 0.08)); quad(0, 4 - lift, 188, 56); ctx.fill()
    ctx.save(); quad(0, 4 - lift, 188, 56); ctx.clip()
    ctx.strokeStyle = rgb(crust(p, 0.42)); ctx.lineWidth = 2
    for (var i = -6; i <= 6; i++) { ctx.beginPath(); ctx.moveTo(x + i * 46 - 60, y - lift); ctx.lineTo(x + i * 46 + 30, y + 64 - lift); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x + i * 46 + 60, y - lift); ctx.lineTo(x + i * 46 - 10, y + 64 - lift); ctx.stroke() }
    blisters(x, y + 30 - lift, 180, 30, p)
    ctx.restore()
  }
  function drawPastry(p) {
    var r = rise(p)
    for (var i = 0; i < 5; i++) {
      var x = 230 + i * 85, y = 430 - (i % 2) * 18, s = 0.75 + 0.35 * r
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(x, y + 10, 38 * s, 9, 0, 0, Math.PI * 2); ctx.fill()
      ctx.save(); ctx.translate(x, y); ctx.scale(s, s)
      var g = ctx.createLinearGradient(0, -36, 0, 10)
      g.addColorStop(0, rgb(crust(p, 0.15))); g.addColorStop(1, rgb(crust(p * 0.9)))
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-40, 6); ctx.quadraticCurveTo(-30, -40, 0, -38); ctx.quadraticCurveTo(30, -40, 40, 6); ctx.quadraticCurveTo(0, 16, -40, 6); ctx.fill()
      ctx.strokeStyle = rgb(crust(p, 0.4)); ctx.lineWidth = 1.5
      for (var k = -2; k <= 2; k++) { ctx.beginPath(); ctx.moveTo(k * 12 - 4, -30 + Math.abs(k) * 4); ctx.quadraticCurveTo(k * 14, -12, k * 15 + 3, 6); ctx.stroke() }
      if (p > 0.8 && p < 1.15) { ctx.fillStyle = 'rgba(255,240,200,0.35)'; ctx.beginPath(); ctx.ellipse(-12, -24, 12, 5, -0.4, 0, Math.PI * 2); ctx.fill() }
      ctx.restore()
    }
  }
  function blisters(x, y, rx, ry, p) {
    if (p < 0.55) return
    var a = Math.min(1, (p - 0.55) / 0.5)
    spots.forEach(function (s) {
      var px = x + Math.cos(s.a) * rx * s.r * 0.9, py = y + Math.sin(s.a) * ry * s.r * 0.9
      ctx.fillStyle = rgb(crust(p + 0.18, 0.1), 0.55 * a); ctx.beginPath(); ctx.ellipse(px, py, 5 * s.s, 3 * s.s, 0, 0, Math.PI * 2); ctx.fill()
    })
  }

  // ---- Loop ----
  function frame(now) {
    raf = 0
    var dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60
    last = now; clock += dt
    if (st.auto) { st.p = Math.min(st.auto.to, st.p + dt / 3.2); setKnob(st.p, true); if (st.p >= st.auto.to) st.auto = null }
    st.shown += (st.p - st.shown) * Math.min(1, dt * 6)
    var heat = Math.min(1, st.shown + 0.2)
    if (!reduce && Math.random() < dt * 14) embers.push({ x: 140 + Math.random() * 60, y: 400, vx: 10 + Math.random() * 30, vy: -40 - Math.random() * 60, t: 0, life: 0.8 + Math.random() })
    embers.forEach(function (e) { e.t += dt; e.x += e.vx * dt; e.y += e.vy * dt }); embers = embers.filter(function (e) { return e.t < e.life })
    var b = BAKES[st.bake]
    if (!reduce && st.shown > 0.1 && st.shown < 0.8 && Math.random() < dt * 5) steam.push({ x: 360 + Math.random() * 80, y: b.kind === 'loaf' ? 330 : 400, t: 0 })
    steam.forEach(function (s) { s.t += dt; s.y -= 30 * dt; s.x += Math.sin(s.t * 3) * 10 * dt }); steam = steam.filter(function (s) { return s.t < 1.6 })
    var dpr = view.dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, view.w, view.h)
    ctx.setTransform(dpr * view.k, 0, 0, dpr * view.k, dpr * view.ox, dpr * view.oy)
    drawOven(heat, reduce ? 0 : clock)
    ctx.save(); ctx.beginPath(); ctx.ellipse(400, 380, 300, 210, 0, Math.PI, 0); ctx.lineTo(700, 470); ctx.lineTo(100, 470); ctx.closePath(); ctx.clip()
    if (b.kind === 'loaf') drawLoaf(st.shown); else if (b.kind === 'coil') drawCoil(st.shown); else if (b.kind === 'tray') drawTray(st.shown); else drawPastry(st.shown)
    steam.forEach(function (s) { ctx.fillStyle = 'rgba(255,245,230,' + (0.18 * (1 - s.t / 1.6)).toFixed(3) + ')'; ctx.beginPath(); ctx.arc(s.x, s.y, 10 + s.t * 14, 0, Math.PI * 2); ctx.fill() })
    ctx.restore()
    if (running) raf = requestAnimationFrame(frame)
  }
  function kick() { if (running && !raf) { last = 0; raf = requestAnimationFrame(frame) } }
  function size() {
    var r = stage.getBoundingClientRect()
    view.dpr = Math.min(2, window.devicePixelRatio || 1); view.w = r.width; view.h = r.height
    canvas.width = Math.round(r.width * view.dpr); canvas.height = Math.round(r.height * view.dpr)
    view.k = Math.max(r.width / W, r.height / H) * 1.02; view.ox = (r.width - W * view.k) / 2; view.oy = (r.height - H * view.k) * 0.7
    if (!raf) { var was = running; running = false; frame(performance.now()); running = was; if (running) kick() }
  }

  // ---- The timer knob ----
  var knob = $('#ov-knob'), MAXP = 1.3, MAXDEG = 300
  function setKnob(p, fromAuto) {
    st.p = Math.max(0, Math.min(MAXP, p))
    if (!fromAuto) st.auto = null
    var deg = st.p / MAXP * MAXDEG
    $('#ov-dial').style.transform = 'rotate(' + deg.toFixed(1) + 'deg)'
    var b = BAKES[st.bake], mins = Math.round(st.p * b.min)
    $('#ov-mins').textContent = mins + ' ' + T('min')
    knob.setAttribute('aria-valuenow', mins); knob.setAttribute('aria-valuemax', Math.round(MAXP * b.min)); knob.setAttribute('aria-valuetext', mins + ' ' + T('min'))
    var p2 = st.p, msg = p2 < 0.25 ? T('raw') : p2 < 0.6 ? T('rise') : p2 < 0.9 ? T('brown') : p2 <= 1.1 ? T('gold') : T('dark')
    var s = $('#ov-state'); s.textContent = msg; s.className = 'ov__state' + (p2 > 0.9 && p2 <= 1.1 ? ' is-gold' : p2 > 1.1 ? ' is-dark' : '')
    kick()
  }
  var drag = null
  function knobAngle(e) { var r = knob.getBoundingClientRect(); var a = Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) * 180 / Math.PI; return (a + 360) % 360 }
  knob.addEventListener('pointerdown', function (e) { drag = { last: knobAngle(e) }; try { knob.setPointerCapture(e.pointerId) } catch (er) {} ; knob.focus() })
  knob.addEventListener('pointermove', function (e) {
    if (!drag) return
    var a = knobAngle(e), d = a - drag.last; if (d > 180) d -= 360; if (d < -180) d += 360
    drag.last = a; setKnob(st.p + d / MAXDEG * MAXP)
  })
  knob.addEventListener('pointerup', function () { drag = null }); knob.addEventListener('pointercancel', function () { drag = null })
  knob.addEventListener('keydown', function (e) {
    var step = 1 / BAKES[st.bake].min
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); setKnob(st.p + step) }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); setKnob(st.p - step) }
    if (e.key === 'Home') setKnob(0); if (e.key === 'End') setKnob(MAXP)
  })
  $('#ov-auto').addEventListener('click', function () { st.p = Math.min(st.p, 0.2); st.auto = { to: 1 }; kick() })

  // ---- Real batches and reserving ----
  function nyMinutes() {
    var p = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date())
    var g = function (t) { return Number((p.find(function (x) { return x.type === t }) || {}).value) }
    return (g('hour') % 24) * 60 + g('minute')
  }
  function batchInfo(b) {
    var at = Number(b.at.slice(0, 2)) * 60 + Number(b.at.slice(3)), now = nyMinutes()
    return { today: at > now, at: b.at }
  }
  function renderBake() {
    var b = BAKES[st.bake], info = batchInfo(b)
    $('#ov-name').textContent = b[lang]
    $('#ov-next').textContent = info.today ? T('next', { t: info.at }) : T('tomorrow', { t: info.at })
    $('#ov-reserve').textContent = T('reserve', { t: info.at })
    $('#ov-auto').textContent = T('bake'); knob.setAttribute('aria-label', T('knob'))
    Array.prototype.forEach.call(root.querySelectorAll('[data-bake]'), function (btn) { var k = BAKES[Number(btn.dataset.bake)]; btn.querySelector('span').textContent = k[lang]; btn.querySelector('small').textContent = k.at; btn.setAttribute('aria-pressed', String(Number(btn.dataset.bake) === st.bake)) })
    setKnob(st.p, true)
  }
  Array.prototype.forEach.call(root.querySelectorAll('[data-bake]'), function (btn) {
    btn.addEventListener('click', function () { st.bake = Number(btn.dataset.bake); st.p = 0; st.shown = 0; st.auto = null; renderBake(); $('#ov-msg').textContent = '' })
  })
  $('#ov-reserve').addEventListener('click', function () {
    var b = BAKES[st.bake], card = document.querySelectorAll('#products .prod')[b.idx]
    if (card) card.querySelectorAll('.qty button')[1].click()
    var sel = document.getElementById('c-time'), info = batchInfo(b), ok = false
    if (sel && info.today) Array.prototype.forEach.call(sel.options, function (o) { if (o.textContent === b.at) { sel.value = o.value || o.textContent; ok = true } })
    $('#ov-msg').textContent = ok ? T('reserved', { t: b.at }) : T('reservedLate')
  })
  new MutationObserver(function () { var l = document.documentElement.lang === 'sq' ? 'sq' : 'en'; if (l !== lang) { lang = l; renderBake() } }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] })

  if ('ResizeObserver' in window) new ResizeObserver(size).observe(stage); else window.addEventListener('resize', size)
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { running = es[0].isIntersecting && !document.hidden; if (running) kick(); else if (raf) { cancelAnimationFrame(raf); raf = 0 } }).observe(stage)
  } else running = true
  document.addEventListener('visibilitychange', function () { if (document.hidden) { running = false; if (raf) { cancelAnimationFrame(raf); raf = 0 } } })
  // start on the next bake of the day
  var now = nyMinutes(), nextIdx = BAKES.findIndex(function (b) { return Number(b.at.slice(0, 2)) * 60 + Number(b.at.slice(3)) > now })
  st.bake = nextIdx < 0 ? 1 : nextIdx
  renderBake(); size()
  root.classList.add('is-ready')
})()
