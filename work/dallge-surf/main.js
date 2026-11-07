// Dallgë Surf School demo: lessons, a demo surf report, tide-timed booking, hire calculator.
;(function () {
  var $ = function (s, r) { return (r || document).querySelector(s) }
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) }
  var pad = function (n) { return String(n).padStart(2, '0') }
  var LESSONS = [
    { id: 'first', name: 'First wave (beginner)', desc: '2 hours in a small group. Board and wetsuit included.', price: 45, min: 120 },
    { id: 'improver', name: 'Improver', desc: 'Catch green waves, turn and read the sea.', price: 50, min: 120 },
    { id: 'kids', name: 'Kids (7 to 15)', desc: '90 minutes, max 5 kids per coach.', price: 35, min: 90 },
    { id: 'private', name: 'Private lesson', desc: 'One coach just for you, any level.', price: 95, min: 90 },
  ]
  var DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  // Header solid after the film.
  var bar = $('#top-bar'), film = $('.film')
  function headerState() { bar.classList.toggle('is-solid', window.scrollY > (film.offsetTop + film.offsetHeight - window.innerHeight - 40)) }
  window.addEventListener('scroll', headerState, { passive: true }); headerState()

  LESSONS.forEach(function (l) {
    var el = document.createElement('article'); el.className = 'lesson reveal'
    el.innerHTML = '<h3></h3><p></p><b></b><small></small>'
    el.querySelector('h3').textContent = l.name; el.querySelector('p').textContent = l.desc; el.querySelector('b').textContent = '£' + l.price; el.querySelector('small').textContent = 'per person · ' + l.min + ' min'
    $('#lesson-list').appendChild(el)
    var o = document.createElement('option'); o.value = l.id; o.textContent = l.name + ' · £' + l.price; $('#lesson-select').appendChild(o)
  })

  // Stable pseudo-random by date, so the demo report is the same all day.
  function rnd(seed) { var h = 2166136261; for (var i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619); return ((h >>> 0) % 1000) / 1000 }
  var key = function (d) { return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() }
  // High tide drifts about 50 minutes later each day (12 h 25 min cycle).
  function highTide(d) { var days = Math.floor(d.getTime() / 86400000); return ((days * 50 + 312) % 745) / 60 }

  var today = new Date(); today.setHours(0, 0, 0, 0)
  var r = rnd(key(today)), wave = (0.6 + r * 1.6).toFixed(1), period = Math.round(8 + r * 6), wind = Math.round(4 + rnd('w' + key(today)) * 18)
  var score = Math.max(1, Math.min(5, Math.round(wave * 1.4 + period / 6 - wind / 8)))
  var ht = highTide(today), sea = 14 - Math.round(rnd('t' + key(today)) * 4)
  var g = [
    ['Waves', wave + ' m', period + ' s period'], ['Wind', wind + ' mph', wind < 10 ? 'offshore, clean' : 'onshore, choppy'],
    ['High tide', pad(Math.floor(ht)) + ':' + pad(Math.round((ht % 1) * 60)), 'low tide 6 h 12 min later'], ['Sea', sea + ' °C', 'wetsuit 4/3 mm'],
  ]
  g.forEach(function (x, i) {
    var el = document.createElement('div'); el.className = 'gauge'
    el.innerHTML = '<span></span><b></b><small></small>'; el.children[0].textContent = x[0]; el.children[1].textContent = x[1]; el.children[2].textContent = x[2]
    if (i === 0) { var rt = document.createElement('div'); rt.className = 'rating'; rt.setAttribute('aria-label', 'Surf rating ' + score + ' out of 5'); for (var s = 0; s < 5; s++) { var b = document.createElement('i'); if (s < score) b.className = 'on'; rt.appendChild(b) } el.appendChild(rt) }
    $('#gauges').appendChild(el)
  })
  $('#report-day').textContent = 'Fistral Beach · ' + today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

  // Booking: 14 days; two lessons a day, starting about two hours after each high tide, daylight only (7:00 to 19:00).
  var form = $('#book-form'), chosen = { day: null, slot: null }
  function slotsFor(d) {
    var out = [], h = highTide(d)
    ;[h + 2, h + 2 + 12.42, h + 2 - 12.42].forEach(function (s) {
      var start = Math.round(s * 2) / 2
      if (start >= 7 && start <= 17.5) out.push({ start: start, full: rnd('f' + key(d) + start) < 0.25 })
    })
    return out.sort(function (a, b) { return a.start - b.start })
  }
  var hh = function (x) { return pad(Math.floor(x)) + ':' + (x % 1 ? '30' : '00') }
  for (var i = 0; i < 14; i++) {
    var d = new Date(today); d.setDate(d.getDate() + i)
    var b = document.createElement('button'); b.type = 'button'; b.className = 'day'; b.setAttribute('role', 'option'); b.setAttribute('aria-selected', 'false')
    b.innerHTML = '<small></small><b></b><small></small>'; b.children[0].textContent = i === 0 ? 'Today' : DAYS[(d.getDay() + 6) % 7]; b.children[1].textContent = d.getDate(); b.children[2].textContent = d.toLocaleString('en-GB', { month: 'short' })
    ;(function (date, btn) { btn.addEventListener('click', function () { chosen.day = date; chosen.slot = null; $$('.day').forEach(function (x) { x.setAttribute('aria-selected', String(x === btn)) }); renderSlots(); total() }) })(d, b)
    $('#days').appendChild(b)
  }
  function renderSlots() {
    var box = $('#slots'); box.innerHTML = ''
    var list = slotsFor(chosen.day)
    if (!list.length) { box.textContent = 'No lessons this day: the tide is at the wrong time for daylight.'; return }
    list.forEach(function (s) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'slot'; b.disabled = s.full; b.setAttribute('aria-pressed', 'false')
      b.innerHTML = '<b></b><small></small>'; b.children[0].textContent = hh(s.start); b.children[1].textContent = s.full ? 'Full' : 'Mid-tide · spaces left'
      b.addEventListener('click', function () { chosen.slot = s.start; $$('.slot').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)) }); total() })
      box.appendChild(b)
    })
  }
  function lesson() { return LESSONS.find(function (l) { return l.id === form.elements.lesson.value }) }
  function total() { var n = Math.max(1, Math.min(12, Number(form.elements.people.value) || 1)); $('#book-total').textContent = n + ' × £' + lesson().price + ' = £' + n * lesson().price }
  form.addEventListener('input', total)
  $('.day').click()
  var last = 0, clean = function (s, m) { return String(s).replace(/[<>\u0000-\u001f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, m) }
  form.addEventListener('submit', function (e) {
    e.preventDefault()
    if (Date.now() - last < 1500) return
    var st = $('#book-status'); $$('[aria-invalid]', form).forEach(function (el) { el.removeAttribute('aria-invalid') })
    var fail = function (el, m) { st.className = 'form-status is-error'; st.textContent = m; if (el) { el.setAttribute('aria-invalid', 'true'); el.focus() } }
    if (chosen.slot === null) return fail(null, 'Choose a lesson time.')
    var name = clean(form.elements.name.value, 80)
    if (!name) return fail(form.elements.name, 'Write your name.')
    if (!/^\+?[\d\s()-]{7,22}$/.test(clean(form.elements.phone.value, 25))) return fail(form.elements.phone, 'Write a mobile number for the 7 a.m. surf check text.')
    last = Date.now()
    if (form.elements.website.value) return
    st.className = 'form-status is-ok'
    st.textContent = 'Booked, ' + name + ': ' + lesson().name + ', ' + chosen.day.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) + ' at ' + hh(chosen.slot) + '. (Demo: nothing is sent.)'
  })

  // Hire calculator
  function seg(box, name, opts) {
    opts.forEach(function (o, i) { var l = document.createElement('label'); l.innerHTML = '<input type="radio" /><span></span>'; l.firstChild.name = name; l.firstChild.value = o[1]; l.firstChild.checked = i === 1; l.lastChild.textContent = o[0] + (o[1] ? ' · £' + o[1] : ''); $(box).appendChild(l) })
  }
  seg('#h-board', 'board', [['None', 0], ['Soft-top', 15], ['Fibreglass', 20]])
  seg('#h-suit', 'suit', [['None', 0], ['Summer', 10], ['Winter', 12]])
  var hf = $('#hire-form')
  function hire() {
    var days = Number(hf.elements.days.value), perDay = Number(hf.elements.board.value) + Number(hf.elements.suit.value)
    var sum = perDay * days * (days >= 5 ? 0.8 : 1)
    $('#h-days-out').textContent = days
    $('#hire-total').textContent = perDay ? '£' + sum.toFixed(0) + (days >= 5 ? ' (20% week discount)' : '') : 'Pick a board or a wetsuit'
  }
  hf.addEventListener('input', hire); hire()

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target) } }) }, { rootMargin: '0px 0px -10% 0px' })
    $$('.reveal').forEach(function (el) { io.observe(el) })
  } else $$('.reveal').forEach(function (el) { el.classList.add('is-in') })
})()
