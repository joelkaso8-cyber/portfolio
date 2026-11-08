// Shkumë Car Wash demo: live open status and wait time, wash menu priced by vehicle size with add-ons,
// Unlimited Club calculator, detail booking with day and time slots, hours (Detroit time).
;(function () {
  var $ = function (s, r) { return (r || document).querySelector(s) }
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) }
  var usd = function (n) { return '$' + (n % 1 ? n.toFixed(2) : n) }
  var pad = function (n) { return String(n).padStart(2, '0') }
  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  var SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  var HOURS = [[7, 20], [7, 20], [7, 20], [7, 20], [7, 20], [7, 20], [8, 18]]
  var h12 = function (h) { var hh = Math.floor(h), m = Math.round((h - hh) * 60); return (hh % 12 || 12) + (m ? ':' + pad(m) : '') + (hh < 12 ? ' am' : ' pm') }

  var SIZES = [['car', 'Car', 0], ['suv', 'SUV', 3], ['truck', 'Truck / van', 5]]
  var FEATURES = ['Pre-soak and soft-cloth wash', 'Spot-free rinse and power dry', 'Underbody salt flush', 'Triple foam polish', 'Hot carnauba wax', 'Tire shine', 'Rain repellent on glass']
  var WASHES = [
    { id: 'express', name: 'Express', price: 12, has: 2, club: 25 },
    { id: 'deluxe', name: 'Deluxe', price: 18, has: 4, club: 32 },
    { id: 'ultimate', name: 'Ultimate', price: 25, has: 7, club: 40, tag: 'Most picked' },
  ]
  var ADDONS = [['towel', 'Hand towel dry', 5], ['mats', 'Floor mat shampoo', 6], ['pet', 'Pet hair vacuum', 10], ['air', 'Interior air freshener', 2]]
  var SERVICES = [
    { id: 'int', name: 'Interior refresh', price: 89, hrs: 1.5, note: 'Vacuum, steam seats and mats, wipe every surface, glass.' },
    { id: 'full', name: 'Full detail', price: 169, hrs: 3, note: 'Interior refresh plus clay bar, hand wax and wheel deep clean.' },
    { id: 'cer', name: 'Ceramic coat', price: 449, hrs: 7, note: 'Paint correction and a 2-year ceramic coat. Drop off at 8 am, pick up at 3 pm.' },
  ]

  // Detroit time
  var parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Detroit', weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date())
  var get = function (t) { return (parts.find(function (x) { return x.type === t }) || {}).value }
  var today = SHORT.indexOf(get('weekday')); if (today < 0) today = 0
  var nowH = Number(get('hour')) % 24 + Number(get('minute')) / 60
  var base = new Date(Number(get('year')), Number(get('month')) - 1, Number(get('day')))

  // Header turns solid once you are past the film.
  var bar = $('#top-bar'), film = $('.film')
  function headerState() { bar.classList.toggle('is-solid', window.scrollY > (film.offsetTop + film.offsetHeight - window.innerHeight - 40)) }
  window.addEventListener('scroll', headerState, { passive: true }); headerState()

  // Live status and an estimated wait from the usual traffic at this hour.
  var open = nowH >= HOURS[today][0] && nowH < HOURS[today][1], st = $('#open-status')
  st.className = 'status' + (open ? ' is-open' : '')
  st.textContent = open ? 'Open now · until ' + h12(HOURS[today][1]) : 'Closed now · opens ' + (nowH < HOURS[today][0] ? 'at ' + h12(HOURS[today][0]) : 'tomorrow at ' + h12(HOURS[(today + 1) % 7][0]))
  var busy = function (h, d) { var w = d >= 5 ? 1.6 : 1; return Math.round(w * (3 + 9 * Math.exp(-Math.pow(h - 12.5, 2) / 3) + 7 * Math.exp(-Math.pow(h - 17.3, 2) / 1.2))) }
  $('#wait').textContent = open ? 'Wait right now: about ' + busy(nowH, today) + ' min' : 'Quietest time tomorrow: before 9 am'

  // Wash menu
  var size = 'car', pick = 'ultimate', extras = {}
  SIZES.forEach(function (s, i) {
    var l = document.createElement('label'); l.innerHTML = '<input type="radio" name="size" /><span></span>'
    l.firstChild.value = s[0]; l.firstChild.checked = i === 0; l.lastChild.textContent = s[1]
    l.firstChild.addEventListener('change', function () { size = s[0]; renderWashes(); total(); club() })
    $('#size').appendChild(l)
  })
  var add = function () { return SIZES.find(function (s) { return s[0] === size })[2] }
  function renderWashes() {
    var box = $('#wash-list'); box.innerHTML = ''
    WASHES.forEach(function (w) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'wash reveal is-in'; b.setAttribute('aria-pressed', String(w.id === pick))
      b.innerHTML = (w.tag ? '<span class="wash__tag"></span>' : '') + '<span class="wash__name"></span><span class="wash__price"></span><ul></ul><span class="wash__pick"></span>'
      if (w.tag) b.querySelector('.wash__tag').textContent = w.tag
      b.querySelector('.wash__name').textContent = w.name
      b.querySelector('.wash__price').innerHTML = '<span></span> <small>per wash</small>'; b.querySelector('.wash__price span').textContent = usd(w.price + add())
      FEATURES.forEach(function (f, i) { var li = document.createElement('li'); li.textContent = f; if (i >= w.has) li.className = 'no'; b.querySelector('ul').appendChild(li) })
      b.querySelector('.wash__pick').textContent = w.id === pick ? 'Selected' : 'Choose ' + w.name
      b.addEventListener('click', function () { pick = w.id; renderWashes(); total(); club() })
      box.appendChild(b)
    })
  }
  ADDONS.forEach(function (a) {
    var l = document.createElement('label'); l.className = 'check'; l.innerHTML = '<input type="checkbox" /> <span></span><small></small>'
    l.querySelector('span').textContent = a[1]; l.querySelector('small').textContent = '+' + usd(a[2])
    l.firstChild.addEventListener('change', function (e) { extras[a[0]] = e.target.checked; total() })
    $('#addons').appendChild(l)
  })
  function total() {
    var w = WASHES.find(function (x) { return x.id === pick }), t = w.price + add(), n = 0
    ADDONS.forEach(function (a) { if (extras[a[0]]) { t += a[2]; n++ } })
    $('#w-total').textContent = usd(t)
    $('#w-note').textContent = w.name + ' · ' + SIZES.find(function (s) { return s[0] === size })[1] + (n ? ' · ' + n + ' add-on' + (n > 1 ? 's' : '') : '')
  }

  // Unlimited Club
  WASHES.forEach(function (w) {
    var l = document.createElement('label'); l.innerHTML = '<input type="radio" name="plan" /><span></span>'
    l.firstChild.value = w.id; l.lastChild.textContent = w.name
    l.firstChild.addEventListener('change', function () { pick = w.id; renderWashes(); total(); club() })
    $('#club-plan').appendChild(l)
  })
  function club() {
    $$('#club-plan input').forEach(function (i) { i.checked = i.value === pick })
    var w = WASHES.find(function (x) { return x.id === pick }), n = Number($('#club-range').value), fam = $('#club-family').checked
    var cars = fam ? 2 : 1, perWash = (w.price + add()) * n * cars, monthly = (w.club + add() * 2) * cars - (fam ? 10 : 0)
    $('#club-n').textContent = n
    $('#c-pay').textContent = usd(perWash); $('#c-club').textContent = usd(monthly)
    var max = Math.max(perWash, monthly)
    $('#bar-pay').style.width = (perWash / max) * 100 + '%'; $('#bar-club').style.width = (monthly / max) * 100 + '%'
    var even = Math.ceil(monthly / cars / (w.price + add()))
    var v = $('#c-verdict')
    if (perWash > monthly) { v.innerHTML = 'You save <b></b> a month. The club pays for itself after <b></b> washes.'; v.querySelectorAll('b')[0].textContent = usd(perWash - monthly); v.querySelectorAll('b')[1].textContent = even }
    else v.textContent = 'At ' + n + ' wash' + (n > 1 ? 'es' : '') + ' a month, paying per wash is cheaper. The club wins from ' + even + ' washes a month.'
  }
  $('#club-range').addEventListener('input', club)
  $('#club-family').addEventListener('change', club)
  $('#club-go').addEventListener('click', function () {
    var w = WASHES.find(function (x) { return x.id === pick })
    var s = $('#club-status'); s.className = 'form-status is-ok'
    s.textContent = 'Welcome to the ' + w.name + ' club at ' + $('#c-club').textContent + ' a month. Your windshield tag is fitted on your first visit. (Demo: no card is charged.)'
  })

  // Detail booking
  var seed = function (s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0 } return h }
  var svc = 'full', date = null, time = null
  SERVICES.forEach(function (s, i) {
    var l = document.createElement('label'); l.className = 'svc'
    l.innerHTML = '<input type="radio" name="svc" /><span><b></b><em></em><small></small></span>'
    l.firstChild.value = s.id; l.firstChild.checked = s.id === svc
    l.querySelector('b').textContent = s.name + ' · ' + (s.hrs >= 7 ? 'all day' : s.hrs + ' h'); l.querySelector('em').textContent = usd(s.price); l.querySelector('small').textContent = s.note
    l.firstChild.addEventListener('change', function () { svc = s.id; time = null; renderSlots(); summary() })
    $('#services').appendChild(l)
  })
  var days = []
  for (var k = 1; k <= 7; k++) { var d = new Date(base); d.setDate(base.getDate() + k); days.push(d) }
  var wd = function (d) { return (d.getDay() + 6) % 7 }
  days.forEach(function (d) {
    var b = document.createElement('button'); b.type = 'button'
    b.innerHTML = '<span></span><b></b>'; b.children[0].textContent = SHORT[wd(d)]; b.children[1].textContent = d.getDate()
    var closed = wd(d) === 6
    b.disabled = closed; b.setAttribute('aria-label', DAYS[wd(d)] + ' ' + d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) + (closed ? ', no detailing on Sundays' : ''))
    b.addEventListener('click', function () { date = d; time = null; $$('#dates button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)) }); renderSlots(); summary() })
    $('#dates').appendChild(b)
  })
  function renderSlots() {
    var box = $('#slots'); box.innerHTML = ''
    if (!date) { box.innerHTML = '<p class="none">Pick a day first.</p>'; return }
    var s = SERVICES.find(function (x) { return x.id === svc }), list = []
    if (s.hrs >= 7) list = [8]; else for (var h = 8; h + s.hrs <= 17; h += 0.5) list.push(h)
    var key = date.toDateString(), any = false
    list.forEach(function (h) {
      var taken = seed(key + h) % 100 < 38
      var b = document.createElement('button'); b.type = 'button'; b.textContent = h12(h); b.disabled = taken
      b.setAttribute('aria-pressed', String(time === h)); if (!taken) any = true
      b.addEventListener('click', function () { time = h; renderSlots(); summary() })
      box.appendChild(b)
    })
    if (!any) box.innerHTML = '<p class="none">Fully booked that day. Try another day.</p>'
  }
  function summary() {
    var s = SERVICES.find(function (x) { return x.id === svc })
    $('#b-summary').textContent = date && time !== null ? s.name + ' on ' + date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) + ' at ' + h12(time) + ', ready by ' + h12(Math.min(17, time + s.hrs)) + ' · ' + usd(s.price) : ''
  }
  renderSlots()
  var form = $('#book-form'), lastSend = 0
  var clean = function (s, m) { return String(s).replace(/[<>\u0000-\u001f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, m) }
  form.addEventListener('submit', function (e) {
    e.preventDefault()
    if (Date.now() - lastSend < 1500) return
    var out = $('#book-status'); $$('[aria-invalid]', form).forEach(function (el) { el.removeAttribute('aria-invalid') })
    var bad = function (m) { out.className = 'form-status is-error'; out.textContent = m }
    var fail = function (f, m) { bad(m); form.elements[f].setAttribute('aria-invalid', 'true'); form.elements[f].focus() }
    if (!date) return bad('Pick a day.')
    if (time === null) return bad('Pick a time.')
    if (!clean(form.elements.name.value, 80)) return fail('name', 'Write your name.')
    if (clean(form.elements.phone.value, 20).replace(/\D/g, '').length < 10) return fail('phone', 'Write a 10-digit mobile number so we can text you.')
    lastSend = Date.now()
    if (form.elements.website.value) return
    var ref = 'SH-' + (seed(date.toDateString() + time + form.elements.name.value) % 90000 + 10000)
    out.className = 'form-status is-ok'
    out.textContent = 'Booked. ' + $('#b-summary').textContent + '. Reference ' + ref + '. (Demo: nothing is sent.)'
    form.elements.name.value = form.elements.phone.value = form.elements.car.value = form.elements.plate.value = ''
  })

  // Hours
  HOURS.forEach(function (h, i) {
    var li = document.createElement('li'); if (i === today) li.className = 'is-today'
    li.innerHTML = '<span></span><span></span>'; li.children[0].textContent = DAYS[i]; li.children[1].textContent = h12(h[0]) + ' – ' + h12(h[1]); $('#hours').appendChild(li)
  })

  renderWashes(); total(); club()

  // Wash it yourself (wash.js): loads only when its section scrolls near.
  var diy = $('#diy')
  if (diy) {
    var loadDiy = function () { var sc = document.createElement('script'); sc.src = 'wash.js'; document.body.appendChild(sc) }
    if ('IntersectionObserver' in window) {
      var diyIo = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { diyIo.disconnect(); loadDiy() } }, { rootMargin: '600px 0px' })
      diyIo.observe(diy)
    } else loadDiy()
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target) } }) }, { rootMargin: '0px 0px -10% 0px' })
    $$('.reveal').forEach(function (el) { io.observe(el) })
  } else $$('.reveal').forEach(function (el) { el.classList.add('is-in') })
})()
