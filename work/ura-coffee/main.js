// Ura Coffee Roasters demo: brew-method picker, bean shop with a bag, subscription builder, live café hours, wholesale form.
;(function () {
  var $ = function (s, r) { return (r || document).querySelector(s) }
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) }
  var gbp = function (n) { return '£' + n.toFixed(2) }
  var pad = function (n) { return String(n).padStart(2, '0') }
  var BEANS = [
    { id: 'kayon', name: 'Kayon Mountain', short: 'Kayon', origin: 'Ethiopia · washed', notes: ['jasmine', 'peach', 'black tea'], roast: 0.2, price: 12.5 },
    { id: 'huila', name: 'La Esperanza', short: 'Esperanza', origin: 'Colombia · Huila', notes: ['red apple', 'caramel', 'cocoa'], roast: 0.5, price: 11 },
    { id: 'ura', name: 'Ura House Espresso', short: 'House', origin: 'Brazil + Guatemala', notes: ['dark chocolate', 'hazelnut', 'treacle'], roast: 0.78, price: 10 },
  ]
  var GRINDS = { beans: 'Whole beans', espresso: 'Espresso grind', filter: 'Filter grind', moka: 'Moka grind' }
  // How you brew decides the beans and the grind. Photos are stills from the film.
  var RITUALS = [
    { id: 'espresso', name: 'Espresso', img: 'media/ritual-espresso.jpg', alt: 'Espresso running from a portafilter into a cup', bean: 'ura', grind: 'espresso', why: 'Chocolate and hazelnut, thick crema, strong enough for milk.' },
    { id: 'pourover', name: 'Pour-over', img: 'media/ritual-pourover.jpg', alt: 'Hot water poured slowly over coffee in a paper filter', bean: 'kayon', grind: 'filter', why: 'Light and floral, like jasmine tea. Best brewed slowly.' },
    { id: 'moka', name: 'Moka pot', img: 'media/ritual-moka.jpg', alt: 'Coffee bubbling up in a moka pot on the stove', bean: 'huila', grind: 'moka', why: 'Sweet caramel and red apple, round on the stove top.' },
  ]
  var HOURS = [[7.5, 17], [7.5, 17], [7.5, 17], [7.5, 17], [7.5, 18], [8.5, 18], [9.5, 16]]
  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  var hh = function (h) { return pad(Math.floor(h)) + ':' + (h % 1 ? '30' : '00') }
  var bag = {}

  // Header turns solid once you are past the film.
  var bar = $('#top-bar'), film = $('.film')
  function headerState() { bar.classList.toggle('is-solid', window.scrollY > (film.offsetTop + film.offsetHeight - window.innerHeight - 40)) }
  window.addEventListener('scroll', headerState, { passive: true }); headerState()

  // Beans
  BEANS.forEach(function (b) {
    var el = document.createElement('article'); el.className = 'bean reveal'
    el.innerHTML = '<p class="bean__origin"></p><h3></h3><ul class="bean__notes"></ul><div class="roast"><span>Roast: light to dark</span><div class="roast__bar"><i></i></div></div><div class="bean__foot"><span class="bean__price"></span><button class="btn" type="button">Add 250 g</button></div>'
    el.querySelector('.bean__origin').textContent = b.origin; el.querySelector('h3').textContent = b.name
    b.notes.forEach(function (n) { var li = document.createElement('li'); li.textContent = n; el.querySelector('.bean__notes').appendChild(li) })
    el.querySelector('.roast__bar i').style.left = b.roast * 100 + '%'
    el.querySelector('.bean__price').textContent = gbp(b.price)
    el.querySelector('button').setAttribute('aria-label', 'Add ' + b.name + ' to your bag')
    el.querySelector('button').addEventListener('click', function () {
      addToBag(b.id, 'beans')
    })
    $('#bean-list').appendChild(el)
  })
  function addToBag(id, grind) {
    var key = id + '|' + grind
    bag[key] = (bag[key] || 0) + 1; renderBag()
    var btn = $('#bag-open'); btn.classList.remove('bump'); void btn.offsetWidth; btn.classList.add('bump')
  }
  function renderBag() {
    var ul = $('#bag-items'), total = 0, count = 0; ul.innerHTML = ''
    Object.keys(bag).forEach(function (key) {
      var k = key.split('|'), b = BEANS.find(function (x) { return x.id === k[0] }), q = bag[key]; total += b.price * q; count += q
      var li = document.createElement('li'); li.innerHTML = '<span><span></span><small></small></span><span></span>'
      li.children[0].children[0].textContent = q + ' × ' + b.name + ', 250 g'; li.children[0].children[1].textContent = GRINDS[k[1]] || ''
      li.children[1].textContent = gbp(b.price * q); ul.appendChild(li)
    })
    if (!count) ul.innerHTML = '<li>Your bag is empty.</li>'
    $('#bag-total').textContent = gbp(total); $('#bag-count').textContent = count
    $('#bag-ship').textContent = total >= 30 ? 'Free UK delivery.' : total ? gbp(30 - total) + ' more for free delivery (otherwise £3.95).' : ''
  }
  var dlg = $('#bag')
  $('#bag-open').addEventListener('click', function () { renderBag(); dlg.showModal() })
  $('#bag-close').addEventListener('click', function () { dlg.close() })
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close() })
  $('#bag-pay').addEventListener('click', function () {
    var st = $('#bag-status')
    if (!Object.keys(bag).length) { st.className = 'form-status is-error'; st.textContent = 'Add some beans first.'; return }
    st.className = 'form-status is-ok'; st.textContent = 'Order placed. Roasted Tuesday, posted Wednesday. (Demo: nothing is charged.)'
    bag = {}; renderBag()
  })

  // Pick your ritual: one choice (a radio group), the match underneath with one-tap add to bag.
  var pick = 'espresso'
  RITUALS.forEach(function (r, i) {
    var card = document.createElement('button')
    card.type = 'button'; card.className = 'ritual-card reveal'; card.setAttribute('role', 'radio'); card.dataset.id = r.id
    card.innerHTML = '<img width="600" height="450" loading="lazy" decoding="async" /><h3></h3><p></p><span class="tick" aria-hidden="true">✓</span>'
    card.querySelector('img').src = r.img; card.querySelector('img').alt = r.alt
    card.querySelector('h3').textContent = r.name
    card.querySelector('p').textContent = BEANS.find(function (b) { return b.id === r.bean }).name + ' · ' + GRINDS[r.grind]
    card.addEventListener('click', function () { pick = r.id; renderRitual() })
    card.addEventListener('keydown', function (e) {
      var d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]
      if (!d) return
      e.preventDefault(); pick = RITUALS[(i + d + RITUALS.length) % RITUALS.length].id; renderRitual()
      $('.ritual-card[data-id="' + pick + '"]').focus()
    })
    $('#ritual-list').appendChild(card)
  })
  function renderRitual() {
    var r = RITUALS.find(function (x) { return x.id === pick }), b = BEANS.find(function (x) { return x.id === r.bean })
    $$('.ritual-card').forEach(function (c) { var on = c.dataset.id === pick; c.setAttribute('aria-checked', String(on)); c.tabIndex = on ? 0 : -1 })
    var m = $('#ritual-match')
    m.innerHTML = '<div class="match__what"><b></b><span></span></div><div class="match__buy"><strong></strong><button class="btn" type="button"></button></div>'
    m.querySelector('b').textContent = b.name + ' · ' + GRINDS[r.grind]
    m.querySelector('span').textContent = r.why
    m.querySelector('strong').textContent = gbp(b.price)
    var add = m.querySelector('button'); add.textContent = 'Add 250 g to bag'
    add.addEventListener('click', function () { addToBag(b.id, r.grind); add.textContent = 'Added ✓'; setTimeout(function () { add.textContent = 'Add 250 g to bag' }, 1600) })
  }
  renderRitual()

  // Subscription builder
  function seg(box, name, opts, checked) {
    opts.forEach(function (o, i) {
      var l = document.createElement('label'); l.innerHTML = '<input type="radio" /><span></span>'
      l.firstChild.name = name; l.firstChild.value = o[0]; l.firstChild.checked = i === checked; l.lastChild.textContent = o[1]
      $(box).appendChild(l)
    })
  }
  seg('#sub-coffee', 'coffee', BEANS.map(function (b) { return [b.id, b.short] }), 2)
  seg('#sub-grind', 'grind', [['beans', 'Whole beans'], ['espresso', 'Espresso'], ['filter', 'Filter']], 0)
  seg('#sub-size', 'size', [['250', '250 g'], ['1000', '1 kg']], 0)
  seg('#sub-every', 'every', [['1', '1 week'], ['2', '2 weeks'], ['4', '4 weeks']], 1)
  var sub = $('#sub-form')
  function price() {
    var b = BEANS.find(function (x) { return x.id === sub.elements.coffee.value })
    var base = sub.elements.size.value === '1000' ? b.price * 3.4 : b.price
    var p = base * 0.85
    $('#sub-price').textContent = gbp(p)
    $('#sub-note').textContent = 'You save ' + gbp(base - p) + ' a bag · ' + gbp(p * 4 / Number(sub.elements.every.value)) + ' a month'
  }
  sub.addEventListener('change', price); price()
  $('#sub-go').addEventListener('click', function () {
    var st = $('#sub-status'); st.className = 'form-status is-ok'
    st.textContent = 'Subscription ready: ' + $('#sub-price').textContent + ' every ' + sub.elements.every.value + ' week(s). (Demo: a live site takes card details here.)'
  })

  // Café hours, Glasgow time
  var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date())
  var get = function (t) { return (parts.find(function (x) { return x.type === t }) || {}).value }
  var day = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(get('weekday')), now = Number(get('hour')) % 24 + Number(get('minute')) / 60
  HOURS.forEach(function (h, i) {
    var li = document.createElement('li'); if (i === day) li.className = 'is-today'
    li.innerHTML = '<span></span><span></span>'; li.children[0].textContent = DAYS[i]; li.children[1].textContent = hh(h[0]) + '–' + hh(h[1]); $('#hours').appendChild(li)
  })
  var open = now >= HOURS[day][0] && now < HOURS[day][1], st = $('#open-status')
  st.className = 'status' + (open ? ' is-open' : '')
  st.textContent = open ? 'Open now · until ' + hh(HOURS[day][1]) : 'Closed now · opens ' + (now < HOURS[day][0] ? 'at ' + hh(HOURS[day][0]) : 'tomorrow at ' + hh(HOURS[(day + 1) % 7][0]))

  // Wholesale form
  var ws = $('#ws-form'), last = 0
  var clean = function (s, m) { return String(s).replace(/[<>\u0000-\u001f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, m) }
  ws.addEventListener('submit', function (e) {
    e.preventDefault()
    if (Date.now() - last < 1500) return
    var out = $('#ws-status'); $$('[aria-invalid]', ws).forEach(function (el) { el.removeAttribute('aria-invalid') })
    var fail = function (f, m) { out.className = 'form-status is-error'; out.textContent = m; ws.elements[f].setAttribute('aria-invalid', 'true'); ws.elements[f].focus() }
    if (!clean(ws.elements.name.value, 80)) return fail('name', 'Write your name.')
    if (!clean(ws.elements.biz.value, 100)) return fail('biz', 'Write the business name.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(ws.elements.email.value, 120))) return fail('email', 'Write a full email address.')
    last = Date.now()
    if (ws.elements.website.value) return
    out.className = 'form-status is-ok'; out.textContent = 'Thanks. We will send prices and a sample box. (Demo: nothing is sent.)'
  })

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target) } }) }, { rootMargin: '0px 0px -10% 0px' })
    $$('.reveal').forEach(function (el) { io.observe(el) })
  } else $$('.reveal').forEach(function (el) { el.classList.add('is-in') })

  // Café menu: pour animation built with React from src/ura-coffee-menu. Loads only when it scrolls near.
  var pm = $('#pour-menu')
  if (pm) {
    var loadMenu = function () {
      var link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'pour-menu/pour-menu.css'
      link.onload = link.onerror = function () { import('./pour-menu/pour-menu.js').catch(function () { $('#menu').hidden = true }) }
      document.head.appendChild(link)
    }
    if ('IntersectionObserver' in window) {
      var mio = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { mio.disconnect(); loadMenu() } }, { rootMargin: '400px 0px' })
      mio.observe(pm)
    } else loadMenu()
  }
  renderBag()
})()
