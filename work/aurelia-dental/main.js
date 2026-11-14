// Aurelia Dental Studio demo: price list, monthly payment calculator, booking with clinic hours, next free slot.
;(function () {
  var $ = function (s, r) { return (r || document).querySelector(s) }
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) }
  var pad = function (n) { return String(n).padStart(2, '0') }
  var gbp = function (n) { return '£' + n.toLocaleString('en-GB', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }) }

  // name, description, price, "from" price?, can be financed?
  var TREATMENTS = [
    ['New patient exam', 'Full check-up, X-rays and a written plan', 65],
    ['Hygiene clean', '45 minutes with our hygienist', 75],
    ['White filling', 'Tooth-coloured composite', 120, true],
    ['Teeth whitening', 'Custom trays and home kit', 350, false, true],
    ['Composite bonding', 'Per tooth, shape and close gaps', 250, true],
    ['Invisalign', 'Clear aligners, full course', 2800, true, true],
    ['Dental implant', 'Implant, abutment and crown', 2400, true, true],
    ['Crown', 'Porcelain, made in a UK lab', 650, true, true],
    ['Emergency appointment', 'Same day, pain relief first', 85],
  ]
  // Monday first: [open, close]; null = closed.
  var HOURS = [[8, 18], [8, 18], [8, 20], [8, 18], [8, 17], [9, 13], null]
  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  var CREDITS = [['Harrison Keely', 'CC BY 4.0'], ['U.S. Air Force, Jessi Roth', 'Public domain'], ['AuliRaha', 'CC BY-SA 4.0'], ['Ptrump16', 'CC BY-SA 4.0'], ['IrfanDP', 'CC BY-SA 4.0']]

  TREATMENTS.forEach(function (t) {
    var el = document.createElement('article'); el.className = 't reveal'
    el.innerHTML = '<h3></h3><p></p><b></b>'
    el.children[0].textContent = t[0]; el.children[1].textContent = t[1]; el.children[2].textContent = (t[3] ? 'from ' : '') + gbp(t[2])
    $('#treat-list').appendChild(el)
    var o = document.createElement('option'); o.textContent = t[0]; $('#reason').appendChild(o)
  })

  // Finance: 0% up to 12 months, 9.9% APR beyond (standard amortisation).
  var calc = $('#calc'), sel = $('#calc-t')
  TREATMENTS.filter(function (t) { return t[4] }).forEach(function (t) { var o = document.createElement('option'); o.value = t[2]; o.textContent = t[0] + ' (' + gbp(t[2]) + ')'; sel.appendChild(o) })
  ;[6, 12, 24, 36].forEach(function (m, i) {
    var l = document.createElement('label'); l.innerHTML = '<input type="radio" name="m" /><span></span>'
    l.firstChild.value = m; l.firstChild.checked = m === 12; l.lastChild.textContent = m + ' mo'
    $('#calc-m').appendChild(l)
  })
  function monthly() {
    var p = Number(sel.value), m = Number(calc.elements.m.value)
    var pay, note
    if (m <= 12) { pay = p / m; note = '0% interest · total ' + gbp(p) }
    else { var r = Math.pow(1.099, 1 / 12) - 1; pay = p * r / (1 - Math.pow(1 + r, -m)); note = '9.9% APR · total ' + gbp(Math.round(pay * m * 100) / 100) }
    $('#calc-out').textContent = gbp(Math.round(pay * 100) / 100) + ' / month'
    $('#calc-note').textContent = note
  }
  calc.addEventListener('change', monthly)
  monthly()

  // Booking: weekdays and Saturday morning, 30-minute slots, nothing in the past, from tomorrow.
  var form = $('#book-form'), date = form.elements.date
  var iso = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) }
  var tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1)
  date.min = iso(tomorrow)
  function hoursFor(d) { return HOURS[(d.getDay() + 6) % 7] }
  function nextOpenDay(from) { var d = new Date(from); for (var i = 0; i < 8; i++) { if (hoursFor(d)) return d; d.setDate(d.getDate() + 1) } return d }
  date.value = iso(nextOpenDay(tomorrow))
  function fillTimes() {
    var s = form.elements.time; s.innerHTML = ''
    var d = date.value ? new Date(date.value + 'T00:00') : null, h = d && hoursFor(d)
    if (!h) { var o = document.createElement('option'); o.value = ''; o.textContent = 'Closed that day'; s.appendChild(o); return }
    for (var m = h[0] * 60; m + 30 <= h[1] * 60; m += 30) { var op = document.createElement('option'); op.textContent = pad(Math.floor(m / 60)) + ':' + pad(m % 60); s.appendChild(op) }
  }
  date.addEventListener('change', fillTimes)
  fillTimes()
  var nd = nextOpenDay(tomorrow)
  $('#next-slot').textContent = 'Next new patient appointment: ' + nd.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) + ', ' + pad(hoursFor(nd)[0]) + ':30'

  var status = $('#book-status'), last = 0
  var clean = function (s, max) { return String(s).replace(/[<>\u0000-\u001f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max) }
  form.addEventListener('submit', function (e) {
    e.preventDefault()
    if (Date.now() - last < 1500) return
    $$('[aria-invalid]', form).forEach(function (el) { el.removeAttribute('aria-invalid') })
    var fail = function (f, msg) { status.className = 'form-status is-error'; status.textContent = msg; form.elements[f].setAttribute('aria-invalid', 'true'); form.elements[f].focus() }
    var name = clean(form.elements.name.value, 80), phone = clean(form.elements.phone.value, 25), email = clean(form.elements.email.value, 120)
    if (!date.value || date.value < date.min || !form.elements.time.value) return fail('date', 'Choose a day when the clinic is open (Monday to Saturday).')
    if (!name) return fail('name', 'Write your full name.')
    if (!/^\+?[\d\s()-]{7,22}$/.test(phone)) return fail('phone', 'Write a mobile number so we can text a reminder.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('email', 'Write a full email address.')
    last = Date.now()
    var d = new Date(date.value + 'T00:00')
    status.className = 'form-status is-ok'
    status.textContent = 'Thank you, ' + name.split(' ')[0] + '. ' + form.elements.reason.value + ' requested for ' + d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) + ' at ' + form.elements.time.value + '. (Demo: a live site confirms by text and email.)'
    form.reset(); date.value = iso(nextOpenDay(tomorrow)); fillTimes()
  })

  var today = (new Date().getDay() + 6) % 7
  HOURS.forEach(function (h, i) {
    var li = document.createElement('li'); if (i === today) li.className = 'is-today'
    li.innerHTML = '<span></span><span></span>'; li.children[0].textContent = DAYS[i]; li.children[1].textContent = h ? pad(h[0]) + ':00–' + pad(h[1]) + ':00' : 'Closed'
    $('#hours').appendChild(li)
  })

  var burger = $('.burger'), mobile = $('#mobile-menu')
  burger.addEventListener('click', function () { var o = burger.getAttribute('aria-expanded') !== 'true'; burger.setAttribute('aria-expanded', String(o)); mobile.hidden = !o })
  $$('a', mobile).forEach(function (a) { a.addEventListener('click', function () { burger.setAttribute('aria-expanded', 'false'); mobile.hidden = true }) })
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target) } }) }, { rootMargin: '0px 0px -10% 0px' })
    $$('.reveal').forEach(function (el) { io.observe(el) })
  } else $$('.reveal').forEach(function (el) { el.classList.add('is-in') })
  $('#credits').textContent = 'Photos from Wikimedia Commons: ' + CREDITS.map(function (c) { return c[0] + ' (' + c[1] + ')' }).join(', ') + '.'
})()
