// Kala Build & Renovate demo: count-up stats, before/after slider, project filter, price guide,
// postcode check, quote form.
;(function () {
  var $ = function (s, r) { return (r || document).querySelector(s) }
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) }
  var CREDITS = [['Shixart1985', 'CC BY 2.0'], ['Celestin bonaventure', 'CC BY-SA 4.0'], ['DeluxeBath', 'CC BY-SA 4.0'], ['Bart Everson', 'CC BY 2.0'], ['Infrogmation of New Orleans', 'CC BY 2.0']]
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Menu
  var burger = $('.burger'), mobile = $('#mobile-menu')
  burger.addEventListener('click', function () { var o = burger.getAttribute('aria-expanded') !== 'true'; burger.setAttribute('aria-expanded', String(o)); mobile.hidden = !o })
  $$('a', mobile).forEach(function (a) { a.addEventListener('click', function () { burger.setAttribute('aria-expanded', 'false'); mobile.hidden = true }) })

  // Count-up stats
  $$('[data-count]').forEach(function (el) {
    var end = Number(el.dataset.count)
    if (reduce) { el.textContent = end; return }
    var t0 = performance.now()
    ;(function tick(now) { var p = Math.min(1, (now - t0) / 1600); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick) })(t0)
  })

  // Before/after: the range input sits over the image, so drag, tap and arrow keys all work.
  var compare = $('#compare'), range = $('input', compare)
  range.addEventListener('input', function () { compare.style.setProperty('--pos', range.value + '%') })

  // Project filter
  $$('.filters button').forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.dataset.f
      $$('.filters button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)) })
      $$('.p').forEach(function (p) { p.classList.toggle('is-hidden', f !== 'all' && p.dataset.cat !== f) })
    })
  })

  // Price guide: £ per m² by room, times the finish level; a ±15% range, rounded to £250.
  var BASE = { kitchen: 950, bath: 1350, house: 520 }
  var MIN = { kitchen: 7500, bath: 5500, house: 18000 }
  var calc = $('#calc')
  var gbp = function (n) { return '£' + (Math.round(n / 250) * 250).toLocaleString('en-GB') }
  function estimate() {
    var room = calc.elements.room.value, size = Number(calc.elements.size.value), finish = Number(calc.elements.finish.value)
    var mid = Math.max(MIN[room], BASE[room] * size) * finish
    $('#size-out').textContent = size + ' m²'
    $('#calc-out').textContent = gbp(mid * 0.85) + ' – ' + gbp(mid * 1.15)
    var weeks = room === 'bath' ? 2 + Math.round(size / 8) : room === 'kitchen' ? 3 + Math.round(size / 8) : 5 + Math.round(size / 10)
    $('#calc-weeks').textContent = 'About ' + weeks + ' weeks on site (demo figures)'
    var jobSel = $('#quote-form').elements.job
    jobSel.value = room === 'kitchen' ? 'Kitchen' : room === 'bath' ? 'Bathroom' : 'Full renovation'
  }
  calc.addEventListener('input', estimate)
  estimate()

  // Postcode: Birmingham (B) and Solihull areas, plus a few nearby districts.
  var COVER = /^(B\d{1,2}|CV7|CV8|WS9|WS14|DY8|DY9)$/
  function checkPc() {
    var raw = $('#pc').value.toUpperCase().replace(/[^A-Z0-9 ]/g, '').trim()
    var out = $('#pc-out')
    // "B13 9RD" or "B139RD": the district is everything before the last three characters.
    var compact = raw.replace(/\s/g, '')
    var district = raw.indexOf(' ') > 0 ? raw.split(' ')[0] : compact.length >= 5 ? compact.slice(0, -3) : compact
    if (!/^[A-Z]{1,2}\d/.test(district)) { out.className = 'pc-out is-no'; out.textContent = 'Write a UK postcode, like B13 9RD.'; return }
    var yes = COVER.test(district)
    out.className = 'pc-out ' + (yes ? 'is-yes' : 'is-no')
    out.textContent = yes ? 'Yes, we work in ' + district + '. Free survey within the week.' : 'Not in ' + district + ' yet, but send the form and we will tell you who we trust nearby.'
  }
  $('#pc-check').addEventListener('click', checkPc)
  $('#pc').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); checkPc() } })

  // Quote form
  var form = $('#quote-form'), status = $('#quote-status'), last = 0
  var clean = function (s, max) { return String(s).replace(/[<>\u0000-\u001f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max) }
  form.addEventListener('submit', function (e) {
    e.preventDefault()
    if (Date.now() - last < 1500) return
    $$('[aria-invalid]', form).forEach(function (el) { el.removeAttribute('aria-invalid') })
    var d = { name: clean(form.elements.name.value, 80), phone: clean(form.elements.phone.value, 25), email: clean(form.elements.email.value, 120) }
    var fail = function (f, msg) { status.className = 'form-status is-error'; status.textContent = msg; form.elements[f].setAttribute('aria-invalid', 'true'); form.elements[f].focus() }
    if (!d.name) return fail('name', 'Write your name.')
    if (!/^\+?[\d\s()-]{7,22}$/.test(d.phone)) return fail('phone', 'Write a phone number.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return fail('email', 'Write a full email, like name@example.com.')
    last = Date.now()
    status.className = 'form-status is-ok'
    status.textContent = 'Thanks, ' + d.name + '. Request received for: ' + form.elements.job.value + '. (Demo: on a live site this goes to the office and you get a copy by email.)'
    form.reset(); estimate()
  })

  // Reveals and credits
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target) } }) }, { rootMargin: '0px 0px -10% 0px' })
    $$('.reveal').forEach(function (el) { io.observe(el) })
  } else $$('.reveal').forEach(function (el) { el.classList.add('is-in') })
  $('#credits').textContent = 'Photos from Wikimedia Commons: ' + CREDITS.map(function (c) { return c[0] + ' (' + c[1] + ')' }).join(', ') + '.'
  // See it built (rebuild.js): loads only when its section scrolls near.
  ;(function () {
    var sec = document.getElementById('rebuild'); if (!sec) return
    var load = function () { var sc = document.createElement('script'); sc.src = 'rebuild.js'; document.body.appendChild(sc) }
    if (!('IntersectionObserver' in window)) return load()
    var io2 = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io2.disconnect(); load() } }, { rootMargin: '600px 0px' })
    io2.observe(sec)
  })()
})()
