// Northline Barbers demo: prices, team with next free slot, a 4-step booking flow, gallery, live hours.
;(function () {
  var $ = function (s, r) { return (r || document).querySelector(s) }
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) }
  var pad = function (n) { return String(n).padStart(2, '0') }

  var SERVICES = [
    ['Skin fade', 'Clipper fade to the skin, styled', 30, 24],
    ['Classic cut', 'Scissors or clippers, wash and style', 30, 20],
    ['Beard sculpt', 'Shape, line-up and hot towel', 20, 14],
    ['Cut and beard', 'Any cut plus a full beard sculpt', 50, 34],
    ['Hot towel shave', 'Straight razor, two towels, balm', 30, 22],
    ['Kids cut (under 12)', 'Any style, with patience', 20, 14],
  ]
  var BARBERS = [
    ['Dan', 'Fades and line-ups. Ten years on the clippers.'],
    ['Arben', 'Scissor work and classic shaves. Speaks Albanian and Italian.'],
    ['Leo', 'Beards, textured crops and kids who hate haircuts.'],
  ]
  // Monday first: [open, close].
  var HOURS = [[9, 19], [9, 19], [9, 20], [9, 20], [9, 20], [8, 18], [10, 16]]
  var DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  var CREDITS = [['Nenad Stojkovic', 'CC BY 2.0'], ['Wilfredor', 'CC0'], ['Mork', 'Public domain'], ['Joe Mabel', 'CC BY-SA 4.0'], ['Gkbediako', 'CC BY-SA 4.0'], ['Alvinategyeka', 'CC0'], ['Frank Schulenburg', 'CC BY-SA 3.0']]

  // Fake but stable availability: a slot is taken when this hash says so, the same on every visit.
  function taken(dayKey, barber, minutes) {
    var s = dayKey + '|' + barber + '|' + minutes, h = 0
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
    return h % 100 < 38
  }
  function dayKey(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) }
  function slotsFor(date, barber, length) {
    var h = HOURS[(date.getDay() + 6) % 7], out = [], now = new Date()
    for (var m = h[0] * 60; m + length <= h[1] * 60; m += 15) {
      var at = new Date(date.getFullYear(), date.getMonth(), date.getDate(), Math.floor(m / 60), m % 60)
      var who = barber === 'Any' ? BARBERS.map(function (b) { return b[0] }) : [barber]
      var free = at > now && who.some(function (b) { return !taken(dayKey(date), b, m) })
      out.push({ m: m, label: pad(Math.floor(m / 60)) + ':' + pad(m % 60), free: free })
    }
    return out
  }
  function nextFree(barber) {
    for (var i = 0; i < 7; i++) {
      var d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + i)
      var s = slotsFor(d, barber, 30).find(function (x) { return x.free })
      if (s) return (i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : DAYS[(d.getDay() + 6) % 7]) + ' ' + s.label
    }
    return 'Next week'
  }

  // Prices and team
  SERVICES.forEach(function (s) {
    var li = document.createElement('li'); li.className = 'reveal'
    li.innerHTML = '<strong></strong><b></b><span></span>'
    li.children[0].textContent = s[0]; li.children[1].textContent = '£' + s[3]; li.children[2].textContent = s[1] + ' · ' + s[2] + ' min'
    $('#price-list').appendChild(li)
  })
  BARBERS.forEach(function (b) {
    var el = document.createElement('article'); el.className = 'barber reveal'
    el.innerHTML = '<div class="mono"></div><h3></h3><p></p><p class="next">Next free: <b></b></p>'
    el.querySelector('.mono').textContent = b[0][0]; el.querySelector('h3').textContent = b[0]; el.querySelector('p').textContent = b[1]
    el.querySelector('.next b').textContent = nextFree(b[0])
    $('#team-list').appendChild(el)
  })

  // Booking flow
  var state = { step: 0, service: null, barber: null, date: null, time: null }
  var status = $('#status')
  function show(step) {
    state.step = step
    $$('.pane').forEach(function (p) { p.hidden = Number(p.dataset.pane) !== step })
    $$('.steps li').forEach(function (li, i) { li.className = i === step ? 'is-on' : i < step ? 'is-done' : '' })
    $('#back').hidden = step === 0
    status.textContent = ''; status.className = 'form-status'
    var first = $('.pane[data-pane="' + step + '"] button, .pane[data-pane="' + step + '"] input')
    if (first && step > 0) first.focus({ preventScroll: true })
  }
  function option(parent, title, sub, onPick) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'opt'
    b.innerHTML = '<strong></strong><span></span>'; b.children[0].textContent = title; b.children[1].textContent = sub
    b.addEventListener('click', onPick); parent.appendChild(b)
  }
  SERVICES.forEach(function (s) { option($('#opt-service'), s[0], s[2] + ' min · £' + s[3], function () { state.service = s; show(1) }) })
  option($('#opt-barber'), 'First free chair', 'Fastest', function () { state.barber = 'Any'; renderDays(); show(2) })
  BARBERS.forEach(function (b) { option($('#opt-barber'), b[0], 'Next free: ' + nextFree(b[0]), function () { state.barber = b[0]; renderDays(); show(2) }) })

  function renderDays() {
    var box = $('#days'); box.innerHTML = ''
    for (var i = 0; i < 14; i++) {
      var d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + i)
      var b = document.createElement('button'); b.type = 'button'; b.className = 'day'; b.setAttribute('role', 'option')
      b.innerHTML = '<small></small><b></b><small></small>'
      b.children[0].textContent = i === 0 ? 'Today' : DAYS[(d.getDay() + 6) % 7]
      b.children[1].textContent = d.getDate()
      b.children[2].textContent = d.toLocaleString('en-GB', { month: 'short' })
      var free = slotsFor(d, state.barber, state.service[2]).some(function (x) { return x.free })
      b.disabled = !free
      b.setAttribute('aria-selected', 'false')
      ;(function (date, btn) { btn.addEventListener('click', function () { state.date = date; $$('.day', box).forEach(function (x) { x.setAttribute('aria-selected', String(x === btn)) }); renderSlots() }) })(d, b)
      box.appendChild(b)
    }
    var firstFree = $('.day:not(:disabled)', box)
    if (firstFree) firstFree.click()
  }
  function renderSlots() {
    var box = $('#slots'); box.innerHTML = ''
    slotsFor(state.date, state.barber, state.service[2]).forEach(function (s) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'slot'; b.textContent = s.label; b.disabled = !s.free
      b.setAttribute('aria-label', s.label + (s.free ? '' : ', taken'))
      b.addEventListener('click', function () {
        state.time = s.label
        $('#summary').textContent = state.service[0] + ' with ' + (state.barber === 'Any' ? 'the first free barber' : state.barber) + ', ' +
          state.date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) + ' at ' + s.label + ' · £' + state.service[3]
        show(3)
      })
      box.appendChild(b)
    })
  }
  $('#back').addEventListener('click', function () { show(Math.max(0, state.step - 1)) })
  var form = $('#details'), last = 0
  var clean = function (s, max) { return String(s).replace(/[<>\u0000-\u001f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max) }
  form.addEventListener('submit', function (e) {
    e.preventDefault()
    if (Date.now() - last < 1500) return
    $$('[aria-invalid]', form).forEach(function (el) { el.removeAttribute('aria-invalid') })
    var name = clean(form.elements.name.value, 80), phone = clean(form.elements.phone.value, 25)
    var fail = function (f, msg) { status.className = 'form-status is-error'; status.textContent = msg; form.elements[f].setAttribute('aria-invalid', 'true'); form.elements[f].focus() }
    if (!name) return fail('name', 'Write your name.')
    if (!/^\+?[\d\s()-]{7,22}$/.test(phone)) return fail('phone', 'Write a mobile number so we can text the confirmation.')
    last = Date.now()
    status.className = 'form-status is-ok'
    status.textContent = 'Booked, ' + name + '! ' + $('#summary').textContent + '. (Demo: a live site texts this to you and the shop.)'
    form.reset()
    $('#back').hidden = true
    setTimeout(function () { show(0); status.className = 'form-status is-ok'; status.textContent = 'Booked, ' + name + '. See you soon.' }, 6000)
  })

  // Hours
  var today = (new Date().getDay() + 6) % 7
  HOURS.forEach(function (h, i) {
    var li = document.createElement('li'); if (i === today) li.className = 'is-today'
    li.innerHTML = '<span></span><span></span>'; li.children[0].textContent = DAYS[i]; li.children[1].textContent = pad(h[0]) + ':00–' + pad(h[1]) + ':00'
    $('#hours').appendChild(li)
  })

  // Menu, lightbox, reveals, credits
  var burger = $('.burger'), mobile = $('#mobile-menu')
  burger.addEventListener('click', function () { var o = burger.getAttribute('aria-expanded') !== 'true'; burger.setAttribute('aria-expanded', String(o)); mobile.hidden = !o })
  $$('a', mobile).forEach(function (a) { a.addEventListener('click', function () { burger.setAttribute('aria-expanded', 'false'); mobile.hidden = true }) })
  var box = $('#lightbox')
  $$('.g').forEach(function (g) { g.addEventListener('click', function () { var img = $('img', box); img.src = g.dataset.full; img.alt = $('img', g).alt; box.showModal() }) })
  box.addEventListener('click', function (e) { if (e.target === box) box.close() })
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target) } }) }, { rootMargin: '0px 0px -10% 0px' })
    $$('.reveal').forEach(function (el) { io.observe(el) })
  } else $$('.reveal').forEach(function (el) { el.classList.add('is-in') })
  $('#credits').textContent = 'Photos from Wikimedia Commons: ' + CREDITS.map(function (c) { return c[0] + ' (' + c[1] + ')' }).join(', ') + '.'
  show(0)
})()
