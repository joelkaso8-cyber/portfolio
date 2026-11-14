// Ura Coffee Roasters demo: the full café menu (sections, diet filters, prices, + to order) and the booking card
// (a table or a pick-up order, day, time from the opening hours, guests or items). The card writes the WhatsApp
// message live, so the visitor sees exactly what the café would receive before sending it.
;(function () {
  var $ = function (s, r) { return (r || document).querySelector(s) }
  var gbp = function (n) { return '£' + n.toFixed(2) }
  var pad = function (n) { return String(n).padStart(2, '0') }
  var hh = function (h) { return pad(Math.floor(h)) + ':' + pad(Math.round((h % 1) * 60)) }
  var HOURS = window.URA_HOURS || [[7.5, 17], [7.5, 17], [7.5, 17], [7.5, 17], [7.5, 18], [8.5, 18], [9.5, 16]] // Mon..Sun
  var WA = '' // Ura is made up, so wa.me opens with no number and WhatsApp asks who to send to. A real site puts the café's number here.
  var waUrl = function (text) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(text) }

  // ---------- Menu ----------
  var CATS = [['all', 'All'], ['coffee', 'Coffee'], ['other', 'Not coffee'], ['bakery', 'Bakery'], ['brunch', 'Brunch']]
  var DIETS = [['VG', 'Vegan'], ['GF', 'Gluten-free']]
  var MENU = [
    { id: 'espresso', cat: 'coffee', name: 'Espresso', note: 'House Espresso, 30 ml', price: 2.6, tags: ['VG', 'GF'] },
    { id: 'flat', cat: 'coffee', name: 'Flat white', note: 'Double shot, 160 ml', price: 3.3, tags: ['V', 'GF'], milk: true },
    { id: 'capp', cat: 'coffee', name: 'Cappuccino', note: '180 ml, cocoa on request', price: 3.4, tags: ['V', 'GF'], milk: true },
    { id: 'latte', cat: 'coffee', name: 'Latte', note: '300 ml', price: 3.5, tags: ['V', 'GF'], milk: true },
    { id: 'v60', cat: 'coffee', name: 'V60 pour-over', note: 'This week: Kayon Mountain, Ethiopia', price: 4.2, tags: ['VG', 'GF'] },
    { id: 'iced', cat: 'coffee', name: 'Iced oat latte', note: 'Over ice, oat milk', price: 3.8, tags: ['VG', 'GF'] },
    { id: 'choc', cat: 'other', name: 'Hot chocolate', note: '70% dark, steamed milk', price: 3.4, tags: ['V', 'GF'], milk: true },
    { id: 'chai', cat: 'other', name: 'Chai latte', note: 'Spiced black tea', price: 3.4, tags: ['V', 'GF'], milk: true },
    { id: 'tea', cat: 'other', name: 'Loose-leaf tea', note: 'Breakfast, Earl Grey or mint', price: 2.8, tags: ['VG', 'GF'] },
    { id: 'oj', cat: 'other', name: 'Fresh orange juice', note: 'Squeezed to order', price: 3.2, tags: ['VG', 'GF'] },
    { id: 'croissant', cat: 'bakery', name: 'Butter croissant', note: 'Baked this morning', price: 2.6, tags: ['V'] },
    { id: 'almond', cat: 'bakery', name: 'Almond croissant', note: 'Frangipane, flaked almonds', price: 3.2, tags: ['V', 'N'] },
    { id: 'bun', cat: 'bakery', name: 'Cardamom bun', note: 'Our bestseller', price: 3.1, tags: ['V'] },
    { id: 'banana', cat: 'bakery', name: 'Banana bread', note: 'With walnuts', price: 3, tags: ['VG', 'N'] },
    { id: 'cake', cat: 'bakery', name: 'Chocolate olive-oil cake', note: 'No flour', price: 3.6, tags: ['V', 'GF'] },
    { id: 'toast', cat: 'brunch', name: 'Sourdough toast', note: 'Butter and house jam', price: 3.5, tags: ['V'] },
    { id: 'avo', cat: 'brunch', name: 'Avocado on sourdough', note: 'Chilli, lime, seeds. GF bread +£1', price: 7.5, tags: ['VG'] },
    { id: 'roll', cat: 'brunch', name: 'Bacon roll', note: 'Ayrshire bacon, brown sauce', price: 5.2, tags: [] },
    { id: 'granola', cat: 'brunch', name: 'Granola bowl', note: 'Yoghurt, berries, honey', price: 5.8, tags: ['V', 'N'] }
  ]
  var TAGS = { V: 'Vegetarian', VG: 'Vegan', GF: 'Gluten-free', N: 'Contains nuts' }
  var cat = 'all', diets = []
  var order = {} // id -> quantity, for pick-up

  function tabs(box, list, isOn, onClick) {
    box.textContent = ''
    list.forEach(function (x) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'tab'; b.textContent = x[1]; b.dataset.k = x[0]
      b.setAttribute('aria-pressed', String(isOn(x[0])))
      b.addEventListener('click', function () { onClick(x[0]); Array.prototype.forEach.call(box.children, function (c) { c.setAttribute('aria-pressed', String(isOn(c.dataset.k))) }); renderMenu() })
      box.appendChild(b)
    })
  }
  function renderMenu() {
    var ul = $('#carte-list'); ul.textContent = ''
    var shown = MENU.filter(function (m) { return (cat === 'all' || m.cat === cat) && diets.every(function (d) { return m.tags.indexOf(d) >= 0 }) })
    shown.forEach(function (m) {
      var li = document.createElement('li'); li.className = 'dish'
      li.innerHTML = '<div class="dish__text"><p class="dish__name"><span></span><span class="dish__tags"></span></p><p class="dish__note"></p></div><span class="dish__price"></span><button type="button" class="dish__add"><span aria-hidden="true">+</span></button>'
      li.querySelector('.dish__name span').textContent = m.name
      m.tags.forEach(function (t) { var a = document.createElement('abbr'); a.title = TAGS[t]; a.textContent = t; li.querySelector('.dish__tags').appendChild(a) })
      li.querySelector('.dish__note').textContent = m.note + (m.milk ? ' · oat or skimmed free' : '')
      li.querySelector('.dish__price').textContent = gbp(m.price)
      var add = li.querySelector('.dish__add'); add.setAttribute('aria-label', 'Add ' + m.name + ' to a pick-up order')
      if (order[m.id]) { add.classList.add('is-in'); add.querySelector('span').textContent = order[m.id] }
      add.addEventListener('click', function () { addItem(m.id, add) })
      ul.appendChild(li)
    })
    if (!shown.length) { var li = document.createElement('li'); li.className = 'dish dish--none'; li.textContent = 'Nothing matches both filters. Ask us: we can often adapt a dish.'; ul.appendChild(li) }
  }
  tabs($('#carte-cats'), CATS, function (k) { return k === cat }, function (k) { cat = k })
  tabs($('#carte-diet'), DIETS, function (k) { return diets.indexOf(k) >= 0 }, function (k) { var i = diets.indexOf(k); if (i >= 0) diets.splice(i, 1); else diets.push(k) })

  // A small note slides up after an add, with a link down to the order.
  var toast = document.createElement('a'); toast.className = 'added'; toast.href = '#book'; toast.hidden = true; document.body.appendChild(toast)
  var toastT = 0
  function addItem(id, btn) {
    order[id] = (order[id] || 0) + 1
    if (mode !== 'pickup') setMode('pickup')
    renderMenu(); renderCard()
    var count = Object.keys(order).reduce(function (s, k) { return s + order[k] }, 0)
    toast.textContent = 'Added to your pick-up order (' + count + ') · Review and send ↓'
    toast.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { toast.hidden = true }, 3800)
    if (btn) { var again = $('#carte-list [aria-label="' + btn.getAttribute('aria-label') + '"]'); if (again) again.focus() }
  }
  toast.addEventListener('click', function () { toast.hidden = true })

  // ---------- Booking card ----------
  var form = $('#book'), mode = 'table', dayOff = 0, time = null, guests = 2
  var glasgowNow = function () {
    var p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date())
    var g = function (t) { return (p.find(function (x) { return x.type === t }) || {}).value }
    return { day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(g('weekday')), h: Number(g('hour')) % 24 + Number(g('minute')) / 60 }
  }
  var dayDate = function (off) { var d = new Date(); d.setDate(d.getDate() + off); return d }
  var dayName = function (off) { return off === 0 ? 'Today' : off === 1 ? 'Tomorrow' : dayDate(off).toLocaleDateString('en-GB', { weekday: 'long' }) }
  var dayShort = function (off) { return dayDate(off).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) }
  // Times every 30 minutes: a table until an hour before closing, a pick-up until 15 minutes before. Today starts 30 minutes from now.
  function slots() {
    var now = glasgowNow(), d = (now.day + dayOff) % 7, h = HOURS[d], out = []
    var last = h[1] - (mode === 'table' ? 1 : 0.25), from = h[0] + (mode === 'pickup' ? 0.25 : 0)
    for (var t = from; t <= last + 1e-9; t += 0.5) if (dayOff > 0 || t >= now.h + 0.5) out.push(t)
    return out
  }
  function seg(box, name, list, val, onPick) {
    box.textContent = ''
    list.forEach(function (o) {
      var l = document.createElement('label'); l.innerHTML = '<input type="radio" /><span></span>'
      var inp = l.firstChild; inp.name = name; inp.value = o[0]; inp.checked = String(o[0]) === String(val)
      l.lastChild.innerHTML = ''; l.lastChild.append(o[1]); if (o[2]) { var sm = document.createElement('small'); sm.textContent = o[2]; l.lastChild.appendChild(sm) }
      inp.addEventListener('change', function () { onPick(o[0]) })
      box.appendChild(l)
    })
  }
  function setMode(m) { mode = m; seg($('#bk-mode'), 'bkmode', [['table', 'Book a table'], ['pickup', 'Order ahead']], mode, setMode); renderTimes(); renderCard() }
  function renderTimes() {
    var list = slots(), box = $('#bk-time'), closed = $('#bk-closed')
    // Nothing left today: move to tomorrow by itself.
    if (!list.length && dayOff === 0) { dayOff = 1; renderDays(); list = slots() }
    if (time === null || list.indexOf(time) < 0) time = list[0]
    box.textContent = ''
    list.forEach(function (t) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'time'; b.textContent = hh(t); b.setAttribute('role', 'radio')
      b.setAttribute('aria-checked', String(t === time)); b.tabIndex = t === time ? 0 : -1
      b.addEventListener('click', function () { time = t; renderTimes(); renderCard(); box.querySelector('[aria-checked="true"]').focus() })
      box.appendChild(b)
    })
    closed.hidden = list.length > 0; closed.textContent = 'We are closed then. Pick another day.'
    $('#bk-time-l').textContent = mode === 'table' ? 'Time' : 'Pick-up time'
    var on = box.querySelector('[aria-checked="true"]'); if (on && on.scrollIntoView && box.scrollWidth > box.clientWidth) box.scrollLeft = on.offsetLeft - 8
  }
  // Arrow keys move along the time chips.
  $('#bk-time').addEventListener('keydown', function (e) {
    var list = slots(), i = list.indexOf(time), k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]
    if (!k || i < 0) return
    e.preventDefault(); time = list[Math.max(0, Math.min(list.length - 1, i + k))]; renderTimes(); renderCard(); $('#bk-time [aria-checked="true"]').focus()
  })
  function renderDays() { seg($('#bk-day'), 'bkday', [0, 1, 2].map(function (o) { return [o, dayName(o), dayShort(o)] }), dayOff, function (o) { dayOff = +o; renderTimes(); renderCard() }) }

  function itemsList() { return Object.keys(order).filter(function (k) { return order[k] > 0 }).map(function (k) { return { m: MENU.find(function (x) { return x.id === k }), q: order[k] } }) }
  function renderCard() {
    $('#bk-guests').hidden = mode !== 'table'
    $('#bk-order').hidden = mode !== 'pickup'
    $('#bk-n').textContent = guests; $('#bk-minus').disabled = guests <= 1; $('#bk-plus').disabled = guests >= 8
    var items = itemsList(), ul = $('#bk-items'), total = 0
    ul.textContent = ''
    items.forEach(function (it) {
      total += it.m.price * it.q
      var li = document.createElement('li')
      li.innerHTML = '<span class="bk__item"></span><span class="mini"><button type="button" aria-label="">−</button><b></b><button type="button" aria-label="">+</button></span><span class="bk__price"></span>'
      li.querySelector('.bk__item').textContent = it.m.name
      li.querySelector('b').textContent = it.q
      li.querySelector('.bk__price').textContent = gbp(it.m.price * it.q)
      var bs = li.querySelectorAll('button')
      bs[0].setAttribute('aria-label', 'One ' + it.m.name + ' fewer'); bs[1].setAttribute('aria-label', 'One more ' + it.m.name)
      bs[0].addEventListener('click', function () { order[it.m.id]--; if (!order[it.m.id]) delete order[it.m.id]; renderMenu(); renderCard() })
      bs[1].addEventListener('click', function () { order[it.m.id]++; renderMenu(); renderCard() })
      ul.appendChild(li)
    })
    $('#bk-empty').hidden = items.length > 0
    var q = $('#bk-quick'); q.textContent = ''
    if (!items.length) ['flat', 'latte', 'croissant', 'bun'].forEach(function (id) {
      var m = MENU.find(function (x) { return x.id === id }), b = document.createElement('button'); b.type = 'button'; b.className = 'tab'; b.textContent = '+ ' + m.name
      b.addEventListener('click', function () { addItem(id) }); q.appendChild(b)
    })
    $('#bk-sum').textContent = items.length ? 'Total ' + gbp(total) + ', paid when you collect' : ''
    // The message the café receives.
    var name = $('#bk-name').value.replace(/[<>\u0000-\u001f]/g, ' ').trim().slice(0, 40)
    var when = dayName(dayOff) + ' (' + dayShort(dayOff) + ') at ' + (time != null ? hh(time) : '?')
    var msg = mode === 'table'
      ? 'Hi Ura! Could I book a table for ' + guests + ' ' + (guests === 1 ? 'person' : 'people') + ', ' + when + '?'
      : 'Hi Ura! A pick-up order for ' + when + ':\n' + (items.length ? items.map(function (it) { return '• ' + it.q + ' × ' + it.m.name }).join('\n') + '\nTotal ' + gbp(total) : '(I will add what I want)')
    if (name) msg += '\nName: ' + name
    $('#bk-msg').textContent = msg
    var go = $('#bk-go'); go.href = waUrl(msg)
    go.querySelector('span').textContent = mode === 'table' ? 'Request the table on WhatsApp' : 'Send the order on WhatsApp'
    go.classList.toggle('is-off', time == null || (mode === 'pickup' && !items.length))
  }
  $('#bk-minus').addEventListener('click', function () { guests = Math.max(1, guests - 1); renderCard() })
  $('#bk-plus').addEventListener('click', function () { guests = Math.min(8, guests + 1); renderCard() })
  $('#bk-name').addEventListener('input', renderCard)
  form.addEventListener('submit', function (e) { e.preventDefault() })
  $('#bk-go').addEventListener('click', function (e) {
    if (mode === 'pickup' && !itemsList().length) { e.preventDefault(); var f = $('#bk-quick button'); if (f) f.focus() }
  })
  $('#visit-wa').href = waUrl('Hi Ura! Quick question: ')

  renderMenu(); renderDays(); setMode('table')
})()
