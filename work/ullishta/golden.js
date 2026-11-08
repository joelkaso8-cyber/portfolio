/* Golden hour from the terrace. The sun's real path over Dhërmi (40.15° N, 19.64° E) is worked out live for any
   date; drag the sun and the bay's light follows. Each room frames the view its own way, and the booking card is
   filled in with the room and the date. This file sits outside the React root: it waits for hydration, then adds
   its section after "The sea" and a nav link, so React's own markup is never touched before it hydrates. */
(function () {
  'use strict'
  if (document.getElementById('golden-hour')) return
  var LAT = 40.1525, LNG = 19.6361, TZ = 'Europe/Tirane'
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  // ---- Time zone helpers (Albania: CET/CEST) ----
  var fmtParts = null, fmtHM = null
  try {
    fmtParts = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })
    fmtHM = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hourCycle: 'h23', hour: '2-digit', minute: '2-digit' })
  } catch (e) {}
  function parts(ms) {
    if (fmtParts) { var p = {}; fmtParts.formatToParts(new Date(ms)).forEach(function (x) { p[x.type] = x.value }); return { y: +p.year, m: +p.month, d: +p.day, h: +p.hour % 24, mi: +p.minute, s: +p.second } }
    var d = new Date(ms + offsetGuess(ms) * 60000); return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate(), h: d.getUTCHours(), mi: d.getUTCMinutes(), s: d.getUTCSeconds() }
  }
  function offsetGuess(ms) { var m = new Date(ms).getUTCMonth(); return m >= 3 && m <= 9 ? 120 : 60 }
  function tzOff(ms) { if (!fmtParts) return offsetGuess(ms); var p = parts(ms); return Math.round((Date.UTC(p.y, p.m - 1, p.d, p.h, p.mi, p.s) - ms) / 60000) }
  function localMs(y, m, d, minutes) { var g = Date.UTC(y, m - 1, d, 0, 0) + minutes * 60000; return g - tzOff(g - tzOff(g) * 60000) * 60000 }
  function hm(ms) { if (fmtHM) return fmtHM.format(new Date(ms)); var p = parts(ms); return ('0' + p.h).slice(-2) + ':' + ('0' + p.mi).slice(-2) }
  function todayISO() { var p = parts(Date.now()); return p.y + '-' + ('0' + p.m).slice(-2) + '-' + ('0' + p.d).slice(-2) }

  // ---- The sun (low-precision solar position; good to about a minute for times) ----
  var RAD = Math.PI / 180
  function sun(ms) {
    var d = ms / 86400000 - 0.5 + 2440588 - 2451545
    var M = RAD * (357.5291 + 0.98560028 * d)
    var C = RAD * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M))
    var Ls = M + C + RAD * 102.9372 + Math.PI, e = RAD * 23.4397
    var dec = Math.asin(Math.sin(e) * Math.sin(Ls)), ra = Math.atan2(Math.sin(Ls) * Math.cos(e), Math.cos(Ls))
    var H = RAD * (280.16 + 360.9856235 * d) + LNG * RAD - ra, phi = LAT * RAD
    var alt = Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H))
    var az = Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(phi) - Math.tan(dec) * Math.cos(phi))
    return { alt: alt / RAD, az: az / RAD + 180 }
  }
  function crossing(t0, t1, level) {
    var prev = sun(t0).alt, step = 60000
    for (var t = t0 + step; t <= t1; t += step) { var a = sun(t).alt; if (prev >= level && a < level) return t - step + step * (prev - level) / (prev - a); prev = a }
    return null
  }

  // ---- Build the section once React has hydrated ----
  function hydrated() { var m = document.getElementById('main'); return !!m && Object.keys(m).some(function (k) { return k.indexOf('__reactFiber') === 0 || k.indexOf('__reactProps') === 0 }) }
  var tries = 0
  ;(function wait() { if (hydrated() || tries++ > 60) build(); else setTimeout(wait, 120) })()

  function build() {
    if (document.getElementById('golden-hour')) return
    var after = document.getElementById('the-bay'), main = document.getElementById('main')
    if (!main) return
    var sec = document.createElement('section')
    sec.className = 'gh-sec'; sec.id = 'golden-hour'; sec.setAttribute('aria-labelledby', 'gh-title')
    sec.innerHTML =
      '<div class="container">' +
        '<div class="head-split gh-head"><h2 id="gh-title">Golden hour from the terrace</h2><p class="lead">Dhërmi looks west over the Ionian Sea, so the sun goes down into the bay. Pick a date and drag the sun: the times are worked out live for Dhërmi.</p></div>' +
        '<div class="gh">' +
          '<div class="gh__view">' +
            '<div class="gh__stage stock" id="gh-stage"><canvas id="gh-canvas" role="img" aria-label="The bay at Dhërmi from the terrace, lit for the chosen time"></canvas><div class="gh__grip" id="gh-grip" aria-hidden="true"></div></div>' +
            '<div class="gh__scrub">' +
              '<div class="gh__track" id="gh-track" aria-hidden="true"></div>' +
              '<input type="range" id="gh-range" min="0" max="1000" step="1" value="600" aria-label="Time of day">' +
              '<div class="gh__marks" id="gh-marks" aria-hidden="true"></div>' +
            '</div>' +
          '</div>' +
          '<div class="gh__panel stock">' +
            '<p class="gh__phase" id="gh-phase">Golden hour</p>' +
            '<p class="gh__clock"><span id="gh-clock">19:40</span><small id="gh-day"></small></p>' +
            '<p class="gh__note" id="gh-note" aria-live="polite"></p>' +
            '<dl class="gh__facts">' +
              '<div><dt>Sunset</dt><dd id="gh-sunset">–</dd></div>' +
              '<div><dt>Golden hour</dt><dd id="gh-golden">–</dd></div>' +
              '<div><dt>Blue hour</dt><dd id="gh-blue">–</dd></div>' +
            '</dl>' +
            '<div class="gh__date"><label for="gh-date">Your date</label><div class="gh__date-row"><input type="date" id="gh-date"><button type="button" class="gh__chip" id="gh-today">Today</button><button type="button" class="gh__chip" id="gh-play">Play the sunset</button></div></div>' +
            '<p class="gh__open" id="gh-open"></p>' +
            '<div class="gh__rooms" role="group" aria-label="See the view from">' +
              '<button type="button" class="gh__chip" data-room="sea" aria-pressed="true">Sea suite</button>' +
              '<button type="button" class="gh__chip" data-room="garden" aria-pressed="false">Garden room</button>' +
              '<button type="button" class="gh__chip" data-room="twin" aria-pressed="false">Twin room</button>' +
            '</div>' +
            '<p class="gh__room-note" id="gh-room"></p>' +
            '<a class="btn" href="#book" id="gh-ask">Ask for the sea suite</a>' +
          '</div>' +
        '</div>' +
      '</div>'
    var before = document.getElementById('getting-here')
    if (after && after.parentNode === main) main.insertBefore(sec, after.nextSibling)
    else if (before && before.parentNode === main) main.insertBefore(sec, before)
    else main.appendChild(sec)
    // nav links (desktop row and the small-screen menu), after "Days out"
    document.querySelectorAll('.nav__links, .nav__menu ul').forEach(function (ul) {
      if (ul.querySelector('a[href="#golden-hour"]')) return
      var li = document.createElement('li'), a = document.createElement('a')
      a.href = '#golden-hour'; a.textContent = 'Golden hour'; li.appendChild(a)
      var ref = ul.querySelector('a[href="#days-out"]')
      if (ref && ref.parentNode.nextSibling) ul.insertBefore(li, ref.parentNode.nextSibling); else ul.appendChild(li)
    })
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); init(sec) } }, { rootMargin: '400px 0px' })
      io.observe(sec)
    } else init(sec)
  }

  // ---- The piece ----
  function init(sec) {
    function $(id) { return document.getElementById(id) }
    var stage = $('gh-stage'), cv = $('gh-canvas'), ctx = cv.getContext('2d'), grip = $('gh-grip')
    var range = $('gh-range'), track = $('gh-track'), marks = $('gh-marks')
    var elPhase = $('gh-phase'), elClock = $('gh-clock'), elDay = $('gh-day'), elNote = $('gh-note'), elSunset = $('gh-sunset'), elGolden = $('gh-golden'), elBlue = $('gh-blue')
    var elDate = $('gh-date'), btnToday = $('gh-today'), btnPlay = $('gh-play'), elOpen = $('gh-open'), elRoom = $('gh-room'), btnAsk = $('gh-ask')
    var roomBtns = sec.querySelectorAll('[data-room]')

    var ROOMS = {
      sea: { name: 'Sea suite', note: 'Top terrace, with shutters that fold back to the sea. Four-poster bed and a terrace of its own.', ask: 'the sea suite' },
      garden: { name: 'Garden room', note: 'Morning sun and the olive grove outside. Double bed and a desk by the window.', ask: 'the garden room' },
      twin: { name: 'Twin room', note: 'Two single beds, for friends travelling together, and a door to the courtyard.', ask: 'the twin room' }
    }
    var room = 'sea', day = null, t = 0, cw = 1, ch = 1, dpr = 1, T = 0, playing = null

    // ---- One date: sunset and the hours around it ----
    function setDate(iso) {
      var p = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
      if (!p) return
      var y = +p[1], m = +p[2], d = +p[3]
      var noon = localMs(y, m, d, 12 * 60), late = localMs(y, m, d, 23 * 60 + 30)
      var set = crossing(noon, late, -0.833), gold = crossing(noon, late, 6), gEnd = crossing(noon, late, -4), bEnd = crossing(noon, late, -6)
      var rel = day && t ? (t - day.set) : -18 * 60000
      day = { iso: iso, y: y, m: m, d: d, set: set, gold: gold, gEnd: gEnd, bEnd: bEnd, t0: set - 150 * 60000, t1: set + 75 * 60000 }
      t = clamp(day.set + rel, day.t0, day.t1)
      elSunset.textContent = hm(set)
      elGolden.textContent = hm(gold) + '–' + hm(gEnd)
      elBlue.textContent = hm(gEnd) + '–' + hm(bEnd)
      var isToday = iso === todayISO()
      elDay.textContent = isToday ? 'today' : d + ' ' + MONTHS[m - 1].slice(0, 3)
      elOpen.textContent = m >= 5 && m <= 10
        ? 'Open that day: the house is open May to October, and the water stays warm enough to swim.'
        : 'The house is open May to October. The sun still sets at ' + hm(set) + ' that day.'
      paintTrack()
      ask()
      update(true)
    }
    function clamp(v, a, b) { return v < a ? a : v > b ? b : v }
    function frac() { return (t - day.t0) / (day.t1 - day.t0) }
    function pct(ms) { return (clamp((ms - day.t0) / (day.t1 - day.t0), 0, 1) * 100).toFixed(2) + '%' }
    function paintTrack() {
      var g = pct(day.gold), s = pct(day.set), e = pct(day.gEnd), b = pct(day.bEnd)
      track.style.background = 'linear-gradient(90deg, oklch(86% .03 85) 0, oklch(86% .03 85) ' + g + ', oklch(76% .11 70) ' + g + ', oklch(66% .14 45) ' + s + ', oklch(58% .1 30) ' + e + ', oklch(45% .08 260) ' + e + ', oklch(40% .07 262) ' + b + ', oklch(24% .04 265) ' + b + ', oklch(20% .03 265) 100%)'
      function mark(at, txt, cls) { var v = parseFloat(at), tx = v < 12 ? '0' : v > 88 ? '-100%' : '-50%'; return '<span class="' + (cls || '') + '" style="left:' + at + ';transform:translateX(' + tx + ')">' + txt + '</span>' }
      marks.innerHTML = mark(g, 'Golden hour ' + hm(day.gold)) + mark(s, 'Sunset ' + hm(day.set), 'is-set') + mark(b, 'Dark ' + hm(day.bEnd))
    }

    // ---- Light by the sun's altitude ----
    var KEYS = [
      [30, [104, 140, 176], [214, 222, 214], [70, 112, 130], [34, 66, 80], [84, 92, 74], [228, 216, 198], [255, 244, 214], 0.22],
      [12, [110, 140, 172], [230, 220, 192], [80, 112, 124], [36, 60, 70], [88, 88, 66], [234, 210, 174], [255, 232, 180], 0.32],
      [5, [118, 126, 156], [242, 198, 128], [108, 108, 112], [40, 52, 62], [88, 74, 54], [238, 192, 140], [255, 206, 120], 0.55],
      [0, [94, 96, 136], [236, 146, 92], [118, 90, 92], [38, 40, 56], [72, 54, 48], [216, 152, 110], [255, 160, 90], 0.7],
      [-3, [70, 74, 116], [200, 114, 104], [92, 72, 90], [30, 32, 50], [52, 42, 48], [152, 112, 106], [236, 122, 100], 0.42],
      [-5, [44, 54, 96], [118, 104, 140], [56, 62, 92], [22, 26, 44], [36, 36, 48], [98, 94, 112], [150, 112, 150], 0.2],
      [-8, [24, 32, 62], [60, 62, 96], [30, 38, 62], [14, 18, 32], [24, 26, 38], [62, 64, 80], [90, 90, 130], 0.08],
      [-14, [10, 14, 30], [24, 28, 48], [14, 18, 32], [8, 10, 20], [14, 16, 24], [38, 40, 52], [40, 40, 60], 0]
    ]
    function light(alt) {
      var a, b, last = KEYS[KEYS.length - 1]
      if (alt >= KEYS[0][0]) a = b = KEYS[0]
      else if (alt <= last[0]) a = b = last
      else for (var i = 1; i < KEYS.length; i++) if (alt >= KEYS[i][0]) { a = KEYS[i - 1]; b = KEYS[i]; break }
      var k = a === b ? 0 : (a[0] - alt) / (a[0] - b[0])
      function m(i) { return [a[i][0] + (b[i][0] - a[i][0]) * k, a[i][1] + (b[i][1] - a[i][1]) * k, a[i][2] + (b[i][2] - a[i][2]) * k] }
      return { top: m(1), hor: m(2), sea: m(3), near: m(4), land: m(5), fg: m(6), glow: m(7), ga: a[8] + (b[8] - a[8]) * k }
    }
    function rgba(c, a) { return 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + (a === undefined ? 1 : +a.toFixed(3)) + ')' }
    function mix(a, b, k) { return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k] }
    function mul(a, b) { return [a[0] * b[0] / 255, a[1] * b[1] / 255, a[2] * b[2] / 255] }
    function hash(n) { var x = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x) }

    // ---- Scene ----
    var AZ0 = 268, FOV = 96
    function hy() { return ch * 0.56 }
    function sunXY(p) { var ppd = (hy() - 26) / 30; return { x: cw * (0.5 + (p.az - AZ0) / FOV), y: hy() - p.alt * ppd } }

    function draw() {
      var p = sun(t), L = light(p.alt), H0 = hy(), s = sunXY(p)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // sky
      var g = ctx.createLinearGradient(0, 0, 0, H0)
      g.addColorStop(0, rgba(L.top)); g.addColorStop(0.62, rgba(mix(L.top, L.hor, 0.55))); g.addColorStop(1, rgba(L.hor))
      ctx.fillStyle = g; ctx.fillRect(0, 0, cw, H0 + 1)
      // stars
      if (p.alt < -6) {
        var sa = Math.min(1, (-6 - p.alt) / 6)
        for (var i = 0; i < 70; i++) {
          var tw = reduce ? 0.8 : 0.55 + 0.45 * Math.sin(T * 2 + i * 7.3)
          ctx.fillStyle = 'rgba(240,238,228,' + (sa * tw * (0.35 + 0.6 * hash(i * 3.1))).toFixed(3) + ')'
          ctx.fillRect(hash(i) * cw, hash(i + 50) * H0 * 0.8, 1.4, 1.4)
        }
      }
      // glow around the sun (stays on the horizon after it sets)
      var gx = s.x, gy = Math.max(s.y, H0 - 4), gr = cw * (0.32 + 0.25 * Math.max(0, 1 - Math.abs(p.alt) / 12))
      var gg = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr)
      gg.addColorStop(0, rgba(L.glow, L.ga)); gg.addColorStop(0.35, rgba(L.glow, L.ga * 0.35)); gg.addColorStop(1, rgba(L.glow, 0))
      ctx.fillStyle = gg; ctx.fillRect(0, 0, cw, H0 + 1)
      // clouds: thin streaks lit from below near sunset
      var cl = [[0.18, 0.3, 0.2], [0.42, 0.42, 0.26], [0.7, 0.24, 0.18], [0.3, 0.6, 0.3], [0.82, 0.52, 0.16]]
      cl.forEach(function (c, j) {
        var x = cw * c[0] + (reduce ? 0 : Math.sin(T * 0.05 + j) * 12), y = H0 * c[1], w = cw * c[2], h = Math.max(4, ch * 0.016)
        var lit = mix(L.hor, L.glow, 0.5), dark = mix(L.top, [40, 40, 60], 0.25)
        var low = Math.max(0, 1 - Math.abs(p.alt - 1) / 10)
        var body = mix(mix([246, 244, 238], dark, p.alt < -3 ? 0.8 : 0.15), lit, low * 0.85)
        softCloud(x - w * 0.22, y, w * 0.62, h * 2.2, body, 0.5)
        softCloud(x + w * 0.08, y - h * 0.35, w * 0.72, h * 2.6, body, 0.55)
        softCloud(x + w * 0.34, y + h * 0.2, w * 0.5, h * 1.8, body, 0.45)
        if (low > 0.05) softCloud(x + w * 0.04, y + h * 0.7, w * 0.8, h * 1.3, mix(lit, [255, 236, 200], 0.3), 0.55 * low)
      })
      // the sun
      if (p.alt > -1.2 && s.x > -40 && s.x < cw + 40) {
        var r = Math.max(7, cw * 0.013), low2 = clamp(1 - p.alt / 8, 0, 1)
        var col = mix([255, 250, 232], [255, 128, 70], Math.pow(low2, 1.6))
        ctx.save(); ctx.beginPath(); ctx.rect(0, 0, cw, H0); ctx.clip()
        var halo = ctx.createRadialGradient(s.x, s.y, r * 0.6, s.x, s.y, r * 4)
        halo.addColorStop(0, rgba(col, 0.55)); halo.addColorStop(1, rgba(col, 0))
        ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(s.x, s.y, r * 4, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = rgba(col); ctx.beginPath(); ctx.ellipse(s.x, s.y, r, r * (1 - 0.16 * clamp(1 - p.alt / 2, 0, 1)), 0, 0, Math.PI * 2); ctx.fill()
        ctx.restore()
      } else if (s.y < -10) {
        // above the frame: a small marker at the top edge
        ctx.fillStyle = 'rgba(255,248,226,.85)'; ctx.beginPath(); ctx.arc(clamp(s.x, 16, cw - 16), 14, 5, 0, Math.PI * 2); ctx.fill()
      }
      // sea
      var sg = ctx.createLinearGradient(0, H0, 0, ch)
      sg.addColorStop(0, rgba(mix(L.sea, L.hor, 0.35))); sg.addColorStop(0.35, rgba(L.sea)); sg.addColorStop(1, rgba(L.near))
      ctx.fillStyle = sg; ctx.fillRect(0, H0, cw, ch - H0)
      // swell lines
      for (i = 0; i < 70; i++) {
        var f = i / 70, y2 = H0 + (ch - H0) * Math.pow(f, 1.7), len = 6 + f * cw * 0.09
        var x2 = ((hash(i * 1.7) * cw * 1.3 + (reduce ? 0 : T * (6 + f * 18))) % (cw * 1.3)) - cw * 0.15
        ctx.strokeStyle = rgba(mix(L.hor, [255, 255, 255], 0.3), 0.08 + 0.1 * f); ctx.lineWidth = 1 + f * 1.5
        ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 + len, y2); ctx.stroke()
      }
      // the sun's path on the water
      if (p.alt > -2.5 && s.x > -60 && s.x < cw + 60) {
        var power = clamp((p.alt + 2.5) / 2, 0, 1) * clamp(1.15 - p.alt / 40, 0.3, 1)
        var gc = mix([255, 246, 220], L.glow, clamp(1 - p.alt / 10, 0, 1))
        var tick = reduce ? 0 : Math.floor(T * 7)
        for (i = 0; i < 90; i++) {
          f = i / 90; y2 = H0 + 1 + (ch - H0) * Math.pow(f, 1.45)
          var band = (4 + (y2 - H0) * (0.32 + 0.5 * clamp(1 - p.alt / 25, 0, 1)))
          for (var j = 0; j < 2; j++) {
            var hx = hash(i * 9.1 + j * 3.7 + tick * 0.37)
            var w2 = 2 + (y2 - H0) * 0.09 * (0.4 + hash(i + j + tick))
            ctx.fillStyle = rgba(gc, power * (0.25 + 0.6 * hash(i * 2.3 + j + tick * 1.3)))
            ctx.fillRect(s.x + (hx - 0.5) * band * 2 - w2 / 2, y2, w2, 1 + f * 2)
          }
        }
      }
      // horizon: far ridge, then the near hillside with the village
      ctx.fillStyle = rgba(mix(L.land, L.hor, 0.62))
      ctx.beginPath(); ctx.moveTo(cw * 0.87, H0 + 1); ctx.bezierCurveTo(cw * 0.91, H0 - ch * 0.03, cw * 0.95, H0 - ch * 0.055, cw, H0 - ch * 0.06); ctx.lineTo(cw, H0 + 1); ctx.fill()
      var hill = rgba(mix(L.land, L.hor, 0.18))
      ctx.fillStyle = hill
      ctx.beginPath(); ctx.moveTo(cw * 0.9, H0 + ch * 0.035); ctx.bezierCurveTo(cw * 0.93, H0 - ch * 0.02, cw * 0.97, H0 - ch * 0.09, cw * 1.01, H0 - ch * 0.12); ctx.lineTo(cw * 1.01, ch * 0.78); ctx.bezierCurveTo(cw * 0.97, ch * 0.7, cw * 0.93, H0 + ch * 0.06, cw * 0.9, H0 + ch * 0.035); ctx.fill()
      // olive dots on the hill and the lights coming on
      for (i = 0; i < 26; i++) {
        var ox = cw * (0.925 + hash(i * 4.1) * 0.075), oy = H0 + ch * (-0.05 + hash(i * 2.9) * 0.2)
        if (oy < H0 - ch * 0.09 * ((ox / cw - 0.9) / 0.11)) continue
        ctx.fillStyle = rgba(mix(L.land, [20, 24, 18], 0.3), 0.45); ctx.beginPath(); ctx.arc(ox, oy, Math.max(1.5, cw * 0.004), 0, Math.PI * 2); ctx.fill()
      }
      if (p.alt < 0.5) {
        var la = clamp((0.5 - p.alt) / 5, 0, 1)
        for (i = 0; i < 12; i++) {
          var lx = cw * (0.93 + hash(i * 7.7) * 0.065), ly = H0 + ch * (0.0 + hash(i * 5.3) * 0.14)
          var on = hash(i * 1.3) < la * 1.1
          if (!on) continue
          ctx.fillStyle = 'rgba(255,206,130,' + (0.9 * la).toFixed(3) + ')'; ctx.fillRect(lx, ly, 2, 2)
          ctx.fillStyle = 'rgba(255,190,110,' + (0.18 * la).toFixed(3) + ')'; ctx.beginPath(); ctx.arc(lx + 1, ly + 1, 5, 0, Math.PI * 2); ctx.fill()
        }
      }
      // compass mark on the horizon
      ctx.font = '500 ' + Math.max(10, Math.round(cw * 0.012)) + 'px "Hanken Grotesk", system-ui, sans-serif'
      ctx.textAlign = 'center'; ctx.fillStyle = rgba(mix(L.hor, [255, 255, 255], 0.5), 0.65)
      var wx = cw * (0.5 + (270 - AZ0) / FOV); ctx.fillRect(wx - 0.5, H0 + 3, 1, 6); ctx.fillText('W', wx, H0 + 20)
      ctx.textAlign = 'start'
      // the room's own frame
      if (room === 'sea') frameSea(L)
      else if (room === 'garden') frameGarden(L)
      else frameTwin(L)
      // grade
      if (p.alt < 8 && p.alt > -5) { ctx.fillStyle = rgba(L.glow, 0.06 * (1 - Math.abs(p.alt - 1.5) / 6.5)); ctx.fillRect(0, 0, cw, ch) }
      var v = ctx.createRadialGradient(cw / 2, ch * 0.5, Math.min(cw, ch) * 0.4, cw / 2, ch * 0.5, Math.max(cw, ch) * 0.78)
      v.addColorStop(0, 'rgba(20,16,10,0)'); v.addColorStop(1, 'rgba(20,16,10,.28)')
      ctx.fillStyle = v; ctx.fillRect(0, 0, cw, ch)
      // grip follows the sun when it is in the frame
      var gxp = clamp(s.x, 0, cw), gyp = clamp(Math.min(s.y, H0), 8, H0)
      grip.style.transform = 'translate(' + (gxp - 30).toFixed(1) + 'px,' + (gyp - 30).toFixed(1) + 'px)'
    }

    function softCloud(x, y, w, h, col, a) {
      ctx.save(); ctx.translate(x, y); ctx.scale(1, h / w)
      var g = ctx.createRadialGradient(0, 0, 0, 0, 0, w / 2)
      g.addColorStop(0, rgba(col, a)); g.addColorStop(0.5, rgba(col, a * 0.6)); g.addColorStop(1, rgba(col, 0))
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, w / 2, 0, Math.PI * 2); ctx.fill(); ctx.restore()
    }
    function mass(cx, cy, spread, L, seed) {
      var c = mul([50, 58, 42], L.fg)
      for (var i = 0; i < 8; i++) {
        var a = hash(seed + i * 2.1) * Math.PI * 2, d = hash(seed + i * 4.3) * spread * 0.7
        ctx.fillStyle = rgba(c, 0.94); ctx.beginPath()
        ctx.ellipse(cx + Math.cos(a) * d * 1.3, cy + Math.sin(a) * d * 0.7, spread * (0.38 + 0.25 * hash(seed + i)), spread * (0.24 + 0.15 * hash(seed + i * 3)), 0, 0, Math.PI * 2); ctx.fill()
      }
    }
    function stone(L, base) { return mul(base, L.fg) }
    function blocks(x0, y0, w, h, L, seed) {
      ctx.strokeStyle = rgba(mul([150, 136, 116], L.fg), 0.55); ctx.lineWidth = 1
      var rowH = Math.max(10, ch * 0.045), r = 0
      for (var y = y0 + rowH; y < y0 + h; y += rowH, r++) {
        ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + w, y); ctx.stroke()
        for (var x = x0 + (r % 2 ? rowH * 0.9 : 0) + hash(r + seed) * rowH; x < x0 + w; x += rowH * (1.6 + hash(x + r) * 1.2)) { ctx.beginPath(); ctx.moveTo(x, y - rowH); ctx.lineTo(x, y); ctx.stroke() }
      }
    }
    function sway(i) { return reduce ? 0 : Math.sin(T * 0.9 + i) * 0.012 }
    function leaves(cx, cy, n, spread, L, seed, size) {
      var silver = mul([168, 176, 150], L.fg), dark = mul([70, 80, 58], L.fg)
      for (var i = 0; i < n; i++) {
        var a = hash(i * 3.3 + seed) * Math.PI * 2, d = Math.sqrt(hash(i * 5.1 + seed)) * spread
        var x = cx + Math.cos(a) * d * 1.3, y = cy + Math.sin(a) * d * 0.8, ang = hash(i * 1.9 + seed) * Math.PI + sway(seed + i * 0.1) * 8
        ctx.fillStyle = rgba(hash(i * 7.7 + seed) < 0.4 ? silver : dark, 0.95)
        ctx.beginPath(); ctx.ellipse(x, y, size, size * 0.28, ang, 0, Math.PI * 2); ctx.fill()
      }
    }
    function branch(x0, y0, x1, y1, bend, L, seed, n) {
      ctx.strokeStyle = rgba(mul([84, 74, 62], L.fg)); ctx.lineWidth = Math.max(2, cw * 0.004); ctx.lineCap = 'round'
      var mx = (x0 + x1) / 2 + bend, my = (y0 + y1) / 2 + Math.abs(bend) * 0.4
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(mx, my, x1, y1); ctx.stroke()
      for (var i = 0; i < n; i++) {
        var k = (i + 1) / (n + 1), bx = (1 - k) * (1 - k) * x0 + 2 * (1 - k) * k * mx + k * k * x1, by = (1 - k) * (1 - k) * y0 + 2 * (1 - k) * k * my + k * k * y1
        leaves(bx, by + 6, 9, cw * 0.022, L, seed + i * 11, Math.max(5, cw * 0.011))
      }
    }

    function frameSea(L) {
      // stone parapet of the top terrace
      var py = ch * 0.81
      ctx.fillStyle = rgba(stone(L, [206, 194, 172])); ctx.fillRect(0, py, cw, ch - py)
      ctx.fillStyle = rgba(stone(L, [232, 222, 202])); ctx.fillRect(0, py, cw, ch * 0.025)
      ctx.fillStyle = rgba([20, 14, 8], 0.18); ctx.fillRect(0, py + ch * 0.025, cw, 3)
      blocks(0, py + ch * 0.025, cw, ch - py, L, 3)
      // shutters folded back on both sides
      var sw = cw * 0.085, slat = mul([98, 132, 140], L.fg), slatDk = mul([70, 98, 106], L.fg)
      ;[-1, 1].forEach(function (side) {
        var x0 = side < 0 ? 0 : cw, inner = side < 0 ? sw : cw - sw
        ctx.fillStyle = rgba(stone(L, [214, 204, 186])); ctx.fillRect(side < 0 ? sw : cw - sw - cw * 0.018, 0, cw * 0.018, ch)
        ctx.fillStyle = rgba(slat)
        ctx.beginPath(); ctx.moveTo(x0, -ch * 0.04); ctx.lineTo(inner, 0); ctx.lineTo(inner, ch); ctx.lineTo(x0, ch * 1.04); ctx.fill()
        ctx.strokeStyle = rgba(slatDk); ctx.lineWidth = 2
        for (var y = 0; y < ch; y += Math.max(9, ch * 0.028)) { ctx.beginPath(); ctx.moveTo(x0, y - ch * 0.04 * (1 - y / ch)); ctx.lineTo(inner, y); ctx.stroke() }
        ctx.strokeStyle = rgba(mul([60, 84, 92], L.fg)); ctx.lineWidth = 3
        ctx.beginPath(); ctx.moveTo(inner, 0); ctx.lineTo(inner, ch); ctx.stroke()
      })
      // an olive branch hanging in from the grove above
      branch(cw * 0.12, -10, cw * 0.36, ch * 0.13 + sway(1) * ch, cw * 0.04, L, 21, 5)
    }
    function frameGarden(L) {
      // grove floor and the low terrace wall
      var gy = ch * 0.84
      ctx.fillStyle = rgba(stone(L, [176, 168, 138])); ctx.fillRect(0, gy, cw, ch - gy)
      ctx.fillStyle = rgba(stone(L, [150, 150, 112])); ctx.fillRect(0, gy, cw, ch * 0.02)
      blocks(0, gy + ch * 0.02, cw, ch - gy, L, 8)
      // two old olive trunks framing the view
      ;[[0.1, 1], [0.88, -1]].forEach(function (q, i) {
        var x = cw * q[0], w = cw * 0.045
        ctx.fillStyle = rgba(mul([92, 82, 68], L.fg))
        ctx.beginPath(); ctx.moveTo(x - w, ch); ctx.bezierCurveTo(x - w * 1.6, ch * 0.7, x + w * q[1] * 1.4, ch * 0.45, x + q[1] * w * 0.4, ch * 0.18)
        ctx.lineTo(x + q[1] * w * 1.4, ch * 0.2); ctx.bezierCurveTo(x + w * q[1] * 2, ch * 0.5, x + w * 0.6, ch * 0.72, x + w * 1.2, ch); ctx.fill()
        ctx.strokeStyle = rgba(mul([60, 52, 44], L.fg), 0.6); ctx.lineWidth = 2
        ctx.beginPath(); ctx.moveTo(x - w * 0.2, ch); ctx.bezierCurveTo(x - w * 0.6, ch * 0.7, x + q[1] * w, ch * 0.5, x + q[1] * w * 0.8, ch * 0.22); ctx.stroke()
        mass(x + q[1] * w, ch * 0.08, cw * 0.1, L, 40 + i * 30)
        leaves(x + q[1] * w, ch * 0.1, 170, cw * 0.11, L, 40 + i * 30, Math.max(6, cw * 0.012))
      })
      // canopy across the top
      mass(cw * 0.5, -ch * 0.04 + sway(4) * ch, cw * 0.15, L, 90)
      leaves(cw * 0.5, -ch * 0.02 + sway(4) * ch, 140, cw * 0.16, L, 90, Math.max(6, cw * 0.012))
    }
    function frameTwin(L) {
      // the courtyard door: a stone wall with an arched opening onto the view
      var x0 = cw * 0.22, x1 = cw * 0.78, top = ch * 0.16, bot = ch * 0.9, rx = (x1 - x0) / 2
      ctx.fillStyle = rgba(stone(L, [212, 200, 178]))
      ctx.beginPath(); ctx.rect(0, 0, cw, ch)
      ctx.moveTo(x0, bot); ctx.lineTo(x0, top + rx * 0.55); ctx.ellipse(cw / 2, top + rx * 0.55, rx, rx * 0.55, 0, Math.PI, 0); ctx.lineTo(x1, bot); ctx.closePath()
      ctx.fill('evenodd')
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, cw, ch); ctx.moveTo(x0, bot); ctx.lineTo(x0, top + rx * 0.55); ctx.ellipse(cw / 2, top + rx * 0.55, rx, rx * 0.55, 0, Math.PI, 0); ctx.lineTo(x1, bot); ctx.closePath(); ctx.clip('evenodd')
      blocks(0, 0, cw, ch, L, 14); ctx.restore()
      // reveal of the wall's thickness and the threshold
      ctx.fillStyle = rgba(stone(L, [168, 156, 136])); ctx.fillRect(x0, top + rx * 0.55, cw * 0.016, bot - top - rx * 0.55); ctx.fillRect(x1 - cw * 0.016, top + rx * 0.55, cw * 0.016, bot - top - rx * 0.55)
      ctx.fillStyle = rgba(stone(L, [190, 178, 156])); ctx.fillRect(x0 - cw * 0.02, bot, x1 - x0 + cw * 0.04, ch * 0.025)
      ctx.fillStyle = rgba(stone(L, [150, 140, 122])); ctx.fillRect(0, bot + ch * 0.025, cw, ch)
      // the door leaf, open against the wall
      ctx.fillStyle = rgba(mul([96, 70, 50], L.fg))
      ctx.beginPath(); ctx.moveTo(x0 - cw * 0.005, top + rx * 0.5); ctx.lineTo(x0 - cw * 0.12, top + rx * 0.45 + ch * 0.03); ctx.lineTo(x0 - cw * 0.12, bot + ch * 0.02); ctx.lineTo(x0 - cw * 0.005, bot); ctx.fill()
      ctx.strokeStyle = rgba(mul([64, 46, 32], L.fg)); ctx.lineWidth = 2
      for (var i = 1; i < 4; i++) { var xx = x0 - cw * 0.03 * i; ctx.beginPath(); ctx.moveTo(xx, top + rx * 0.5 + ch * 0.008 * i); ctx.lineTo(xx, bot + ch * 0.005 * i); ctx.stroke() }
      // a pot of herbs by the step
      ctx.fillStyle = rgba(mul([176, 102, 70], L.fg)); ctx.beginPath(); ctx.moveTo(x1 + cw * 0.03, bot + ch * 0.02); ctx.lineTo(x1 + cw * 0.09, bot + ch * 0.02); ctx.lineTo(x1 + cw * 0.08, bot - ch * 0.06); ctx.lineTo(x1 + cw * 0.04, bot - ch * 0.06); ctx.fill()
      leaves(x1 + cw * 0.06, bot - ch * 0.09, 24, cw * 0.022, L, 77, Math.max(4, cw * 0.008))
    }

    // ---- Readouts ----
    function phase(alt) {
      if (Math.abs(alt + 0.833) < 0.45) return ['Sunset', 'The sun meets the Ionian Sea.']
      if (alt > 6) return ['Afternoon', 'Warm afternoon light on the bay. Golden hour starts at ' + hm(day.gold) + '.']
      if (alt > -0.833) return ['Golden hour', 'Low, warm light on the terrace and a gold path across the water.']
      if (alt > -4) return ['Golden hour', 'The sun is down; the sky over the bay keeps glowing.']
      if (alt > -6) return ['Blue hour', 'The sea turns silver-blue and the lights come on along the coast.']
      if (alt > -12) return ['Dusk', 'The last light over the water and the first stars.']
      return ['Night', 'Night over the bay.']
    }
    var lastNote = ''
    function update(force) {
      var p = sun(t), ph = phase(p.alt)
      elClock.textContent = hm(t)
      elPhase.textContent = ph[0]
      if (ph[1] !== lastNote) { lastNote = ph[1]; elNote.textContent = ph[1] }
      var v = Math.round(frac() * 1000)
      if (force || +range.value !== v) range.value = v
      range.setAttribute('aria-valuetext', hm(t) + ', ' + ph[0].toLowerCase())
      if (reduce || force) draw()
    }
    function ask() {
      var r = ROOMS[room]
      btnAsk.textContent = 'Ask for ' + r.ask + ' from ' + day.d + ' ' + MONTHS[day.m - 1]
    }
    function setRoom(v) {
      room = v
      roomBtns.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.room === v ? 'true' : 'false') })
      elRoom.textContent = ROOMS[v].note
      if (day) ask()
      draw()
    }

    // ---- Input ----
    range.addEventListener('input', function () { playing = null; t = day.t0 + (day.t1 - day.t0) * (+range.value / 1000); update() })
    function tFromX(clientX) {
      var r = cv.getBoundingClientRect(), x = clientX - r.left, best = t, bd = 1e9
      for (var ms = day.t0; ms <= day.t1; ms += 60000) { var d = Math.abs(sunXY(sun(ms)).x - x); if (d < bd) { bd = d; best = ms } }
      return best
    }
    var dragId = null
    function down(e) {
      if (e.button !== undefined && e.button !== 0) return
      dragId = e.pointerId; playing = null
      try { e.currentTarget.setPointerCapture(e.pointerId) } catch (er) {}
      t = tFromX(e.clientX); update()
    }
    function move(e) { if (dragId === e.pointerId) { t = tFromX(e.clientX); update() } }
    function up(e) { if (dragId === e.pointerId) dragId = null }
    ;[cv, grip].forEach(function (el) { el.addEventListener('pointerdown', down); el.addEventListener('pointermove', move); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up) })

    elDate.min = todayISO()
    elDate.addEventListener('change', function () { if (elDate.value) setDate(elDate.value) })
    btnToday.addEventListener('click', function () { elDate.value = todayISO(); setDate(elDate.value) })
    btnPlay.addEventListener('click', function () {
      if (reduce) { t = day.set; update(); return }
      if (t >= day.t1 - 60000 || t > day.bEnd) t = day.gold - 20 * 60000
      playing = { from: t, start: performance.now() }; kick()
    })
    roomBtns.forEach(function (b) { b.addEventListener('click', function () { setRoom(b.dataset.room) }) })

    // fill the booking card: the room, then the arrival date
    btnAsk.addEventListener('click', function () {
      var radio = document.getElementById('room-' + room)
      if (radio && !radio.checked) radio.click()
      var input = document.querySelector('#book input[name="arrival"]')
      if (input) {
        var setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set
        setter.call(input, day.iso)
        input.dispatchEvent(new Event('input', { bubbles: true })); input.dispatchEvent(new Event('change', { bubbles: true }))
      } else pickInCalendar(day)
    })
    function pickInCalendar(dd) {
      var cal = document.querySelector('#book .cal'); if (!cal) return
      var key = dd.y + '-' + dd.m + '-' + dd.d, want = Date.UTC(dd.y, dd.m - 1, 1), n = 0
      ;(function stepCal() {
        var btn = cal.querySelector('[data-day="' + key + '"]')
        if (btn) { if (!btn.disabled && btn.getAttribute('aria-pressed') !== 'true') btn.click(); return }
        var label = cal.querySelector('.cal__month'), navs = cal.querySelectorAll('.cal__nav')
        var shown = label ? Date.parse('1 ' + label.textContent.trim() + ' UTC') : NaN
        var nav = !isNaN(shown) && shown > want ? navs[0] : navs[navs.length - 1]
        if (!nav || nav.disabled || n++ > 24) return
        nav.click()
        setTimeout(stepCal, 40)
      })()
    }

    // ---- Loop and size ----
    var raf = 0, visible = false, lastT = 0
    function frame(now) {
      raf = 0
      var dt = lastT ? Math.min(0.05, (now - lastT) / 1000) : 1 / 60; lastT = now; T += dt
      if (playing) {
        var span = day.bEnd + 10 * 60000 - playing.from, k = Math.min(1, (now - playing.start) / 14000)
        t = playing.from + span * (k * k * (3 - 2 * k)); update()
        if (k >= 1) playing = null
      }
      draw()
      if (visible) raf = requestAnimationFrame(frame); else lastT = 0
    }
    function kick() { if (!reduce && visible && !raf) raf = requestAnimationFrame(frame) }
    function resize() {
      var r = stage.getBoundingClientRect()
      cw = Math.max(1, r.width); ch = Math.max(1, r.height); dpr = Math.min(2, window.devicePixelRatio || 1)
      cv.width = Math.round(cw * dpr); cv.height = Math.round(ch * dpr)
      if (day) draw()
    }
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(stage); else window.addEventListener('resize', resize)
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) kick() }).observe(stage)
    else visible = true

    resize()
    elDate.value = todayISO()
    setRoom('sea')
    setDate(elDate.value)
    kick()
  }
})()
