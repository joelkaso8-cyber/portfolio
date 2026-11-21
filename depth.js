// Two 3D pieces for the portfolio, plain JS, no libraries, no WebGL (so they also work with hardware acceleration off).
// 1. Wall: the tilted screenshot wall (CSS) pauses its drift while off screen.
// 2. Phone: Hotel Kaso Ervehe on a phone, still; a mouse adds a small tilt. Nothing listens on touch, so scrolling is never caught.
// Needs main.js first (window.JK).
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

  // ---------- 2. Phone ----------
  // Rests at a slight angle (style.css). Mouse only: tilts up to 5 degrees toward the pointer, eases back on leave.
  // Off on touch screens and with reduced motion: no listeners at all there.
  var phone = document.querySelector('.phone3d')
  if (phone && !reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var MAX = 5, tf = 0
    phone.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return
      var r = phone.getBoundingClientRect()
      var dx = clamp((e.clientX - r.left) / r.width * 2 - 1, -1, 1), dy = clamp((e.clientY - r.top) / r.height * 2 - 1, -1, 1)
      cancelAnimationFrame(tf)
      tf = requestAnimationFrame(function () {
        phone.classList.add('is-tilt')
        phone.style.setProperty('--ry', f1(dx * MAX) + 'deg')
        phone.style.setProperty('--rx', f1(-dy * MAX) + 'deg')
      })
    })
    phone.addEventListener('pointerleave', function () {
      cancelAnimationFrame(tf)
      phone.classList.remove('is-tilt') // back to the slow 0.7 s ease-out
      phone.style.removeProperty('--ry'); phone.style.removeProperty('--rx')
    })
  }
})()
