// Three 3D pieces for the portfolio, plain JS, no libraries, no WebGL (so they also work with hardware acceleration off).
// 1. Wall: the tilted screenshot wall (CSS) pauses its drift while off screen.
// 2. Dome: phone screenshots on a sphere; drag to spin, tap a screen to open that site in the viewer.
// 3. Badge: a name badge on a strap with rope physics; drag and throw it, tap to flip it to a WhatsApp QR code.
// Needs main.js first (window.JK) and qr.js (window.JKQR).
;(function () {
  'use strict'
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)) }
  var f1 = function (n) { return n.toFixed(1) }
  function onView(el, cb) {
    if (!('IntersectionObserver' in window)) return cb(true)
    new IntersectionObserver(function (es) { cb(es[es.length - 1].isIntersecting) }, { rootMargin: '150px 0px' }).observe(el)
  }

  // ---------- 1. Wall ----------
  // Filled from the same list as the work grid (main.js SHOWN), so a hidden site never appears here.
  var wall = document.querySelector('.wall'), wgrid = wall && wall.querySelector('.wall__grid')
  if (wall && wgrid && window.JK && window.JK.work.length) {
    var sites = window.JK.work, html = ''
    for (var c = 0; c < 4; c++) { // 4 columns x 5 screens; consecutive ids keep repeats apart
      html += '<div class="wall__col">'
      for (var r = 0; r < 5; r++) {
        var s = sites[(c * 5 + r) % sites.length]
        html += '<a href="?site=' + s.id + '" data-id="' + s.id + '" tabindex="-1"><img src="img/' + s.id + '-desk-600.webp" width="600" height="375" loading="lazy" decoding="async" alt=""></a>'
      }
      html += '</div>'
    }
    wgrid.innerHTML = html
    wgrid.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-id]')
      if (!a || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return
      e.preventDefault(); window.JK.open(a.dataset.id)
    })
    onView(wall, function (on) { wall.classList.toggle('is-off', !on) })
  }

  // ---------- 2. Dome ----------
  var dome = document.getElementById('dome'), band = document.getElementById('dome-band')
  if (dome && band && window.JK) (function () {
    var sphere = dome.querySelector('.dome__sphere'), list = window.JK.work
    var R = 600, SEG = 28, MAXV = 7, rx = -3, ry = 0, vx = 0, vy = 0
    var drag = null, raf = 0, visible = false, lastMove = 0
    band.hidden = false

    // Columns of tiles (2 units wide, 3 tall), rows offset on every other column like a brick wall.
    function build() {
      var w = dome.clientWidth, h = dome.clientHeight
      SEG = w < 640 ? 18 : w < 1100 ? 24 : 28
      R = Math.round(clamp(Math.min(w * .6, h * 1.5), 330, 860))
      dome.style.setProperty('--R', R + 'px')
      dome.style.setProperty('--u', (180 / SEG).toFixed(4) + 'deg')
      dome.style.setProperty('--ua', (R * Math.PI / SEG).toFixed(2) + 'px')
      var html = '', n = 0, rows = [[-3, 0, 3], [-4.5, -1.5, 1.5, 4.5]]
      for (var c = 0; c < SEG; c++) rows[c % 2].forEach(function (y) {
        var s = list[n++ % list.length]
        html += '<div class="dome__tile" data-id="' + s.id + '" style="--x:' + (c * 2) + ';--y:' + y + '"><img src="img/' + s.id + '-phone.webp" width="390" height="844" alt="" loading="lazy" decoding="async" draggable="false"></div>'
      })
      sphere.innerHTML = html
      apply()
    }
    function apply() { sphere.style.transform = 'translateZ(' + (-R) + 'px) rotateX(' + rx.toFixed(3) + 'deg) rotateY(' + ry.toFixed(3) + 'deg)' }
    function loop() {
      raf = 0
      if (!drag) {
        if (Math.abs(vx) > .005 || Math.abs(vy) > .005) { ry += vx; rx = clamp(rx - vy, -MAXV, MAXV); vx *= .95; vy *= .95 }
        else if (!reduce) ry += .045 // slow drift so it reads as alive
      }
      apply()
      if (visible && (drag || !reduce || Math.abs(vx) > .005 || Math.abs(vy) > .005)) raf = requestAnimationFrame(loop)
    }
    function kick() { if (!raf) raf = requestAnimationFrame(loop) }

    // Content follows the finger: 1 degree of turn = the arc length of 1 degree at the front of the sphere.
    var pxPerDeg = function () { return R * Math.PI / 180 }
    dome.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return
      var tile = e.target.closest && e.target.closest('.dome__tile')
      drag = { x: e.clientX, y: e.clientY, rx: rx, ry: ry, t: e.timeStamp, tile: tile, moved: false }
      vx = vy = 0
      try { dome.setPointerCapture(e.pointerId) } catch (er) {}
      dome.classList.add('is-grab'); kick()
    })
    dome.addEventListener('pointermove', function (e) {
      if (!drag) return
      var dx = e.clientX - drag.x, dy = e.clientY - drag.y
      if (!drag.moved && dx * dx + dy * dy > 49) drag.moved = true
      var k = pxPerDeg(), nry = drag.ry + dx / k, nrx = clamp(drag.rx - dy / k * .5, -MAXV, MAXV)
      var dt = Math.max(1, e.timeStamp - drag.t)
      vx = vx * .5 + clamp((nry - ry) * 16 / dt, -4, 4) * .5
      vy = vy * .5 + clamp((rx - nrx) * 16 / dt, -2, 2) * .5
      ry = nry; rx = nrx; drag.t = lastMove = e.timeStamp
    })
    function end(e) {
      if (!drag) return
      var d = drag; drag = null
      dome.classList.remove('is-grab')
      if (e.type === 'pointercancel') { vx = vy = 0; return kick() } // the page scrolled instead
      if (!d.moved && d.tile) { vx = vy = 0; window.JK.open(d.tile.dataset.id) }
      if (e.timeStamp - lastMove > 90) vx = vy = 0 // finger stopped before letting go: no throw
      kick()
    }
    dome.addEventListener('pointerup', end)
    dome.addEventListener('pointercancel', end)

    var rt = 0
    addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(build, 200) })
    onView(dome, function (on) { visible = on; if (on) kick() })
    build()
  })()

  // ---------- 3. Badge ----------
  var ly = document.getElementById('lanyard'), badge = document.getElementById('badge')
  if (ly && badge) (function () {
    var path = ly.querySelector('.lanyard__strap path'), pin = ly.querySelector('.lanyard__pin')
    var card = badge.querySelector('.badge3d__card'), qr = document.getElementById('badge-qr')
    if (qr && window.JKQR) qr.innerHTML = window.JKQR.svg('https://wa.me/355685727406')

    var N = 10, DT = 1 / 120, G = 2200, DAMP = .993, ITER = 12
    var pts = [], AX = 0, L = 15, H2 = 160, BW = 212
    var yaw = 0, yawV = 0, flipped = false, drag = null, wasDrag = false
    var raf = 0, visible = false, nudged = false, lastT = 0, acc = 0

    // pts[0] is the pin (fixed), pts[1..N] the strap, pts[N] the clip, pts[N+1] the card's centre of mass.
    function setup() {
      var cs = getComputedStyle(ly), rope = parseFloat(cs.getPropertyValue('--rope')) || 150
      BW = badge.offsetWidth; H2 = badge.offsetHeight / 2
      AX = ly.clientWidth / 2; L = rope / N
      pts = []
      for (var i = 0; i <= N; i++) pts.push({ x: AX, y: i * L, px: AX, py: i * L, w: i ? 1 : 0 })
      pts.push({ x: AX, y: rope + H2, px: AX, py: rope + H2, w: .25 }) // 4x heavier than a strap link
      pin.setAttribute('cx', AX); pin.setAttribute('cy', 0)
      ly.classList.add('is-live')
      render()
    }

    function step() {
      var c = pts[N + 1]
      for (var i = 1; i < pts.length; i++) {
        var p = pts[i]
        if (!p.w) continue
        var vx = (p.x - p.px) * DAMP, vy = (p.y - p.py) * DAMP
        p.px = p.x; p.py = p.y; p.x += vx; p.y += vy + G * DT * DT
      }
      if (drag) { c.px = c.x; c.py = c.y; c.x = drag.x; c.y = drag.y }
      for (var k = 0; k < ITER; k++) {
        for (var j = 0; j <= N; j++) {
          var a = pts[j], b = pts[j + 1], rest = j === N ? H2 : L
          var dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy) || 1e-6
          if (j < N && d <= rest) continue // a strap can go slack but never stretches
          var ws = a.w + b.w
          if (!ws) continue
          var m = (d - rest) / d / ws
          a.x += dx * m * a.w; a.y += dy * m * a.w
          b.x -= dx * m * b.w; b.y -= dy * m * b.w
        }
      }
      // Twist: sideways speed spins the card a little; a spring pulls it back to the front (or the back after a tap).
      yawV += ((flipped ? 180 : 0) - yaw) * .0035 + (c.x - c.px) * .025
      yawV *= .955; yaw += yawV
    }

    function render() {
      var d = 'M' + f1(pts[0].x) + ' ' + f1(pts[0].y)
      for (var i = 1; i < N; i++) d += 'Q' + f1(pts[i].x) + ' ' + f1(pts[i].y) + ' ' + f1((pts[i].x + pts[i + 1].x) / 2) + ' ' + f1((pts[i].y + pts[i + 1].y) / 2)
      d += 'L' + f1(pts[N].x) + ' ' + f1(pts[N].y)
      path.setAttribute('d', d)
      var clip = pts[N], c = pts[N + 1], ang = -Math.atan2(c.x - clip.x, c.y - clip.y)
      badge.style.transform = 'translate(' + f1(clip.x - BW / 2) + 'px,' + f1(clip.y) + 'px) rotate(' + ang.toFixed(4) + 'rad)'
      card.style.transform = 'rotateY(' + yaw.toFixed(2) + 'deg)'
      badge.style.setProperty('--sx', f1(50 + 50 * Math.sin(yaw * Math.PI / 180)) + '%')
    }

    function moving() {
      if (drag) return true
      var e = Math.abs(yawV) + Math.abs((flipped ? 180 : 0) - yaw) * .05
      for (var i = 1; i < pts.length; i++) e += Math.abs(pts[i].x - pts[i].px) + Math.abs(pts[i].y - pts[i].py)
      return e > .02
    }
    function frame(t) {
      raf = 0
      acc += Math.min(.05, lastT ? (t - lastT) / 1000 : DT); lastT = t
      while (acc >= DT) { step(); acc -= DT }
      render()
      if (visible && moving()) raf = requestAnimationFrame(frame); else lastT = 0
    }
    function kick() { if (reduce) return render(); if (!raf) raf = requestAnimationFrame(frame) }

    function local(e) { var r = ly.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top } }
    badge.addEventListener('pointerdown', function (e) {
      if (reduce || e.button !== 0) return
      var p = local(e), c = pts[N + 1]
      drag = { ox: c.x - p.x, oy: c.y - p.y, x: c.x, y: c.y, sx: e.clientX, sy: e.clientY, vx: 0, vy: 0, t: e.timeStamp, moved: false }
      c.w = 0
      try { badge.setPointerCapture(e.pointerId) } catch (er) {}
      badge.classList.add('is-grab'); kick()
    })
    badge.addEventListener('pointermove', function (e) {
      if (!drag) return
      var p = local(e), tx = p.x + drag.ox, ty = p.y + drag.oy
      var dx = tx - AX, dy = ty, d = Math.sqrt(dx * dx + dy * dy), max = N * L + H2 // the strap's full reach
      if (d > max) { tx = AX + dx / d * max; ty = dy / d * max }
      var dt = Math.max(1, e.timeStamp - drag.t)
      drag.vx = drag.vx * .5 + (tx - drag.x) / dt * 500; drag.vy = drag.vy * .5 + (ty - drag.y) / dt * 500
      drag.x = tx; drag.y = ty; drag.t = e.timeStamp
      if (!drag.moved && Math.abs(e.clientX - drag.sx) + Math.abs(e.clientY - drag.sy) > 6) drag.moved = true
      kick()
    })
    function release(e) {
      if (!drag) return
      var d = drag, c = pts[N + 1]
      drag = null; c.w = .25; wasDrag = d.moved
      badge.classList.remove('is-grab')
      var still = e.timeStamp - d.t > 90 // held still before letting go: just drop it
      c.px = c.x - (still ? 0 : clamp(d.vx, -2400, 2400)) * DT
      c.py = c.y - (still ? 0 : clamp(d.vy, -2400, 2400)) * DT
      kick()
    }
    badge.addEventListener('pointerup', release)
    badge.addEventListener('pointercancel', release)
    // Tap or Enter/Space flips the badge; a drag that ends on the badge does not.
    badge.addEventListener('click', function () {
      if (wasDrag) { wasDrag = false; return }
      flipped = !flipped
      if (reduce) yaw = flipped ? 180 : 0
      else yawV += flipped ? 6 : -6
      kick()
    })

    var rt = 0
    addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { setup(); kick() }, 200) })
    onView(ly, function (on) {
      visible = on
      if (on && !nudged && !reduce) { nudged = true; pts[N + 1].px -= 7 } // first sight: a small swing so it reads as alive
      if (on) kick()
    })
    setup()
  })()
})()
