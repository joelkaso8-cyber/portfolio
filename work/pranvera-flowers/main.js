// Pranvera Flowers demo: bouquet builder with a live drawn preview, ready-made bouquets, basket with card message
// and delivery day, same-day cutoff countdown, postcode delivery check, workshop booking, studio hours (London time).
;(function () {
  var $ = function (s, r) { return (r || document).querySelector(s) }
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) }
  var gbp = function (n) { return '£' + n.toFixed(2) }
  var pad = function (n) { return String(n).padStart(2, '0') }
  var NS = 'http://www.w3.org/2000/svg'
  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  var SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  var HOURS = [[9, 18], [9, 18], [9, 18], [9, 18], [9, 18], [9, 18], [10, 16]]
  var CUTOFF = 13

  // [id, name, note, price per stem, colour, darker centre, radius]
  var STEMS = [
    ['rose', 'Garden rose', 'Somerset, scented', 4.5, '#d79bb4', '#a8657f', 15],
    ['peony', 'Peony', 'Cornwall, in bud', 6, '#e7bcc8', '#c98b9c', 18],
    ['ranunculus', 'Ranunculus', 'Apricot, many petals', 3.5, '#e6c39d', '#b98d63', 12],
    ['tulip', 'Tulip', 'Cream, Dutch-grown', 2.5, '#eee0c9', '#c8b08a', 12],
    ['lisianthus', 'Lisianthus', 'Soft lilac', 3, '#b8a5cc', '#8a77a0', 11],
    ['euc', 'Eucalyptus', 'Silver-green, fragrant', 2, '#8fa58a', '#6c8268', 10],
  ]
  var WRAPS = [['kraft', 'Kraft paper', 0], ['linen', 'Linen wrap', 6], ['vase', 'Glass vase', 18]]
  var PRESETS = [
    { id: 'clifton', name: 'The Clifton', note: 'Roses, apricot ranunculus and eucalyptus.', price: 45, mix: { rose: 6, ranunculus: 5, euc: 5 }, wrap: 'kraft' },
    { id: 'cloud', name: 'Peony Cloud', note: 'Peonies in bud with lilac lisianthus.', price: 58, mix: { peony: 5, lisianthus: 5, euc: 3 }, wrap: 'linen' },
    { id: 'somerset', name: 'Wild Somerset', note: 'Cream tulips, ranunculus and loose greenery.', price: 39, mix: { tulip: 7, ranunculus: 4, lisianthus: 3, euc: 6 }, wrap: 'kraft' },
    { id: 'roses', name: 'Just Roses', note: 'Twelve garden roses, nothing else needed.', price: 55, mix: { rose: 12 }, wrap: 'vase' },
  ]

  // London time, recomputed on demand so the countdown stays right.
  function london() {
    var p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false }).formatToParts(new Date())
    var g = function (t) { return (p.find(function (x) { return x.type === t }) || {}).value }
    return { day: Math.max(0, SHORT.indexOf(g('weekday'))), h: Number(g('hour')) % 24, m: Number(g('minute')), s: Number(g('second')), iso: g('year') + '-' + g('month') + '-' + g('day') }
  }
  var L = london(), nowH = L.h + L.m / 60

  // Header turns solid once you are past the film.
  var bar = $('#top-bar'), film = $('.film')
  function headerState() { bar.classList.toggle('is-solid', window.scrollY > (film.offsetTop + film.offsetHeight - window.innerHeight - 40)) }
  window.addEventListener('scroll', headerState, { passive: true }); headerState()

  // Drawing: each stem sits on a sunflower spiral, so any mix looks hand-tied.
  function el(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e }
  function bloom(g, s, x, y, r, i) {
    var b = el('g', { class: 'bloom', transform: 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')' }, g)
    b.style.animationDelay = Math.min(i * 25, 600) + 'ms'
    var c = s[4], d = s[5], k
    if (s[0] === 'euc') { for (k = 0; k < 5; k++) { var a = k * 72 * Math.PI / 180; el('circle', { cx: (Math.cos(a) * r * .55).toFixed(1), cy: (Math.sin(a) * r * .55).toFixed(1), r: (r * .42).toFixed(1), fill: k % 2 ? c : d }, b) } return }
    if (s[0] === 'lisianthus') { for (k = 0; k < 5; k++) { var a2 = k * 72 * Math.PI / 180; el('circle', { cx: (Math.cos(a2) * r * .5).toFixed(1), cy: (Math.sin(a2) * r * .5).toFixed(1), r: (r * .55).toFixed(1), fill: c }, b) } el('circle', { r: (r * .28).toFixed(1), fill: '#e6dc9a' }, b); return }
    if (s[0] === 'tulip') { el('path', { d: 'M' + (-r * .8) + ' ' + (-r * .3) + 'Q' + (-r * .9) + ' ' + r + ' 0 ' + r + 'Q' + (r * .9) + ' ' + r + ' ' + (r * .8) + ' ' + (-r * .3) + 'L' + (r * .35) + ' 0L0 ' + (-r * .8) + 'L' + (-r * .35) + ' 0Z', fill: c }, b); el('path', { d: 'M0 ' + (-r * .8) + 'L0 ' + r * .7, stroke: d, 'stroke-width': 1.2, fill: 'none', opacity: .6 }, b); return }
    el('circle', { r: r, fill: c }, b)
    if (s[0] === 'peony') { for (k = 0; k < 7; k++) { var a3 = k * 51 * Math.PI / 180; el('circle', { cx: (Math.cos(a3) * r * .45).toFixed(1), cy: (Math.sin(a3) * r * .45).toFixed(1), r: (r * .45).toFixed(1), fill: k % 2 ? c : '#f1cfd8' }, b) } el('circle', { r: r * .3, fill: d, opacity: .55 }, b); return }
    var rings = s[0] === 'ranunculus' ? 4 : 3
    for (k = 1; k <= rings; k++) el('circle', { r: (r * (1 - k / (rings + 1))).toFixed(1), fill: 'none', stroke: d, 'stroke-width': s[0] === 'rose' ? 1.6 : 1, opacity: .7 }, b)
    if (s[0] === 'rose') el('path', { d: 'M0 0m-3 0a3 3 0 1 1 3 3', stroke: d, 'stroke-width': 1.6, fill: 'none' }, b)
  }
  function draw(svg, mix, wrap, small) {
    while (svg.firstChild) svg.removeChild(svg.firstChild)
    // Mix the stems round-robin so colours spread through the bouquet.
    var lists = STEMS.map(function (s) { var a = []; for (var q = 0; q < (mix[s[0]] || 0); q++) a.push(s); return a }), order = []
    while (lists.some(function (l) { return l.length })) lists.forEach(function (l) { if (l.length) order.push(l.shift()) })
    var n = order.length
    if (wrap === 'vase') { el('path', { d: 'M-46 30L-38 104L38 104L46 30Z', fill: 'rgba(200,220,215,.10)', stroke: 'rgba(220,235,230,.35)', 'stroke-width': 1.5 }, svg); el('path', { d: 'M-40 70L40 70', stroke: 'rgba(147,173,127,.35)', 'stroke-width': 1 }, svg) }
    else if (n) el('path', { d: 'M-70 -10L0 108L70 -10Q0 30 -70 -10Z', fill: wrap === 'linen' ? '#cfc6b4' : '#a8835a', opacity: .9 }, svg)
    if (!n) { var t = el('text', { x: 0, y: 4, 'text-anchor': 'middle', fill: '#979387', 'font-size': small ? 12 : 10, 'font-family': 'Jost, sans-serif' }, svg); t.textContent = 'Add some stems'; return }
    var spread = Math.min(80, 16 + 13 * Math.sqrt(n)), cScale = spread / Math.sqrt(n + 0.5)
    // Greenery ring behind the flowers.
    for (var k = 0; k < 14; k++) { var a = k / 14 * Math.PI * 2; el('ellipse', { cx: (Math.cos(a) * (spread + 4)).toFixed(1), cy: (Math.sin(a) * (spread + 4) - 12).toFixed(1), rx: 14, ry: 6, fill: k % 2 ? '#6c8268' : '#56694f', transform: 'rotate(' + (a * 180 / Math.PI).toFixed(0) + ' ' + (Math.cos(a) * (spread + 4)).toFixed(1) + ' ' + (Math.sin(a) * (spread + 4) - 12).toFixed(1) + ')' }, svg) }
    var g = el('g', {}, svg)
    order.forEach(function (s, i) {
      var rr = cScale * Math.sqrt(i + 0.5), th = i * 2.39996
      bloom(g, s, Math.cos(th) * rr, Math.sin(th) * rr - 12, s[6] * (n > 24 ? .85 : 1), small ? 0 : i)
    })
  }

  // Basket
  var bag = []
  try { bag = JSON.parse(localStorage.getItem('pranvera-bag') || '[]') || [] } catch (e) {}
  var saveBag = function () { try { localStorage.setItem('pranvera-bag', JSON.stringify(bag)) } catch (e) {} }
  function addToBag(item) { bag.push(item); saveBag(); renderBag(); var b = $('#bag-open'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump') }
  function renderBag() {
    var ul = $('#bag-items'), total = 0; ul.innerHTML = ''
    bag.forEach(function (it, i) {
      total += it.price
      var li = document.createElement('li'); li.innerHTML = '<span><b></b><small></small></span><span></span><button type="button">×</button>'
      li.querySelector('b').textContent = it.name; li.querySelector('small').textContent = it.detail; li.children[1].textContent = gbp(it.price)
      li.querySelector('button').setAttribute('aria-label', 'Remove ' + it.name)
      li.querySelector('button').addEventListener('click', function () { bag.splice(i, 1); saveBag(); renderBag() })
      ul.appendChild(li)
    })
    if (!bag.length) ul.innerHTML = '<li>Your basket is empty.</li>'
    $('#bag-count').textContent = bag.length
    $('#bag-total').textContent = gbp(total)
  }

  // Builder
  var mix = { rose: 5, ranunculus: 4, euc: 4 }, wrap = 'kraft'
  STEMS.forEach(function (s) {
    var li = document.createElement('li'); li.className = 'stem'
    li.innerHTML = '<span class="stem__dot"></span><span><b></b><small></small></span><span class="stem__price"></span><span class="qty"><button type="button">−</button><output>0</output><button type="button">+</button></span>'
    li.querySelector('.stem__dot').style.background = s[4]
    li.querySelector('b').textContent = s[1]; li.querySelector('small').textContent = s[2]; li.querySelector('.stem__price').textContent = gbp(s[3]) + ' a stem'
    var bs = li.querySelectorAll('button'); bs[0].setAttribute('aria-label', 'One less ' + s[1]); bs[1].setAttribute('aria-label', 'One more ' + s[1])
    bs[0].addEventListener('click', function () { mix[s[0]] = Math.max(0, (mix[s[0]] || 0) - 1); build() })
    bs[1].addEventListener('click', function () { var n = Object.keys(mix).reduce(function (a, k) { return a + mix[k] }, 0); if (n >= 40) { status('A hand-tied bouquet holds up to 40 stems.', true); return } mix[s[0]] = (mix[s[0]] || 0) + 1; build() })
    li.dataset.id = s[0]
    $('#stems').appendChild(li)
  })
  WRAPS.forEach(function (w) {
    var l = document.createElement('label'); l.innerHTML = '<input type="radio" name="wrap" /><span></span>'
    l.firstChild.value = w[0]; l.firstChild.checked = w[0] === wrap; l.lastChild.textContent = w[1] + (w[2] ? ' +£' + w[2] : '')
    l.firstChild.addEventListener('change', function () { wrap = w[0]; build() })
    $('#wrap').appendChild(l)
  })
  function status(m, bad) { var s = $('#b-status'); s.className = 'form-status ' + (bad ? 'is-error' : 'is-ok'); s.textContent = m }
  function priceOf(m, w) { var p = 0, n = 0; STEMS.forEach(function (s) { p += (m[s[0]] || 0) * s[3]; n += m[s[0]] || 0 }); return { n: n, p: n ? p + 8 + WRAPS.find(function (x) { return x[0] === w })[2] : 0 } }
  function build() {
    $$('#stems .stem').forEach(function (li) { li.querySelector('output').textContent = mix[li.dataset.id] || 0 })
    var r = priceOf(mix, wrap)
    $('#b-price').textContent = gbp(r.p)
    $('#b-note').textContent = r.n ? r.n + ' stems · includes £8 for greenery, tying and a card' : 'Add at least 5 stems'
    $('#b-count').textContent = r.n ? r.n + ' stems, ' + WRAPS.find(function (x) { return x[0] === wrap })[1].toLowerCase() : ''
    draw($('#posy'), mix, wrap, false)
    $('#b-status').textContent = ''
  }
  $('#b-add').addEventListener('click', function () {
    var r = priceOf(mix, wrap)
    if (r.n < 5) return status('Add at least 5 stems first.', true)
    var parts = STEMS.filter(function (s) { return mix[s[0]] }).map(function (s) { return mix[s[0]] + ' ' + s[1].toLowerCase() })
    addToBag({ name: 'Your bouquet', detail: parts.join(', '), price: r.p })
    status('Added to your basket.')
  })
  $('#b-clear').addEventListener('click', function () { mix = {}; build() })
  build()

  // Shop
  PRESETS.forEach(function (p) {
    var a = document.createElement('article'); a.className = 'item reveal'
    a.innerHTML = '<svg viewBox="-110 -110 220 220" aria-hidden="true"></svg><h3></h3><p></p><div class="item__foot"><span class="item__price"></span><button class="btn btn--sm" type="button">Add</button></div>'
    a.querySelector('h3').textContent = p.name; a.querySelector('p').textContent = p.note; a.querySelector('.item__price').textContent = gbp(p.price)
    a.querySelector('button').setAttribute('aria-label', 'Add ' + p.name + ' to your basket')
    a.querySelector('button').addEventListener('click', function () { addToBag({ name: p.name, detail: p.note, price: p.price }) })
    draw(a.querySelector('svg'), p.mix, p.wrap, true)
    $('#shop-list').appendChild(a)
  })

  // Same-day cutoff countdown
  function cutoff() {
    var t = london(), left = (CUTOFF * 3600) - (t.h * 3600 + t.m * 60 + t.s), out = $('#cutoff')
    if (t.day === 6) { out.textContent = 'No deliveries on Sundays. Order now for Monday morning, or visit the studio until 4pm.'; return }
    if (left > 0) { var h = Math.floor(left / 3600), m = Math.floor(left % 3600 / 60); out.innerHTML = 'Order in <b></b> for same-day delivery in Bristol.'; out.querySelector('b').textContent = (h ? h + 'h ' : '') + m + 'm' }
    else out.textContent = 'Same-day delivery is closed for today. Order now and it goes out ' + (t.day === 5 ? 'on Monday morning.' : 'tomorrow morning.')
  }
  cutoff(); setInterval(cutoff, 20000)

  // Postcode check
  $('#pc-form').addEventListener('submit', function (e) {
    e.preventDefault()
    var raw = $('#pc').value.toUpperCase().replace(/[^A-Z0-9]/g, ''), out = $('#pc-out'), zones = $$('.zones li')
    zones.forEach(function (z) { z.classList.remove('is-hit') })
    var m = raw.match(/^([A-Z]{1,2})(\d{1,2})[A-Z]?(\d[A-Z]{2})?$/)
    out.className = 'pc__out'
    if (!m) { out.className = 'pc__out is-error'; out.textContent = 'That does not look like a UK postcode. Try something like BS8 4AA.'; $('#pc').setAttribute('aria-invalid', 'true'); return }
    $('#pc').removeAttribute('aria-invalid')
    var area = m[1], d = Number(m[2]), zone = area !== 'BS' ? 2 : d <= 16 ? 0 : 1
    zones[zone].classList.add('is-hit')
    var t = london(), before = t.day !== 6 && t.h < CUTOFF
    var msg = zone === 2 ? 'Outside Bristol: tracked courier, <b>next day</b>, £8.95.' : (before ? 'Yes. <b>Same day</b> if you order in the next ' + (CUTOFF - t.h - (t.m ? 1 : 0)) + 'h ' + ((60 - t.m) % 60) + 'm.' : 'We deliver there. Order now for <b>' + (t.day >= 5 ? 'Monday' : 'tomorrow') + '</b>.') + (zone === 0 ? ' Delivery £6.' : ' Delivery £9.')
    out.innerHTML = msg
  })

  // Basket dialog
  var dlg = $('#bag'), dateIn = $('#bag-date')
  function minDate() { var t = london(), d = new Date(t.iso + 'T12:00:00'); if (t.h >= CUTOFF) d.setDate(d.getDate() + 1); if (d.getDay() === 0) d.setDate(d.getDate() + 1); return d }
  var iso = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) }
  $('#bag-open').addEventListener('click', function () { renderBag(); var md = iso(minDate()); dateIn.min = md; if (!dateIn.value || dateIn.value < md) dateIn.value = md; dlg.showModal() })
  $('#bag-close').addEventListener('click', function () { dlg.close() })
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close() })
  $('#bag-msg').addEventListener('input', function (e) { $('#msg-left').textContent = (160 - e.target.value.length) + ' left' })
  $('#bag-pay').addEventListener('click', function () {
    var st = $('#bag-status'); st.className = 'form-status is-error'
    if (!bag.length) { st.textContent = 'Your basket is empty.'; return }
    var d = new Date(dateIn.value + 'T12:00:00')
    if (!dateIn.value || isNaN(d)) { st.textContent = 'Pick a delivery day.'; return }
    if (dateIn.value < dateIn.min) { st.textContent = 'The earliest delivery is ' + new Date(dateIn.min + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) + '.'; return }
    if (d.getDay() === 0) { st.textContent = 'We do not deliver on Sundays. Pick another day.'; return }
    st.className = 'form-status is-ok'
    st.textContent = 'Order placed for ' + d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) + '. We text you a photo before it leaves. (Demo: nothing is charged.)'
    bag = []; saveBag(); renderBag(); $('#bag-msg').value = ''; $('#msg-left').textContent = '160 left'
  })

  // Workshops: the next four dates from today.
  // [name, weekday (Mon = 0), time]
  var WS = [['Hand-tied bouquet', 3, '18:30'], ['Seasonal wreath', 5, '10:30'], ['Table centrepiece', 2, '18:30'], ['Dried flower posy', 5, '14:00']]
  var mineWs = {}
  var start = new Date(L.iso + 'T12:00:00')
  function nextDay(from, dow, skip) { var d = new Date(from); d.setDate(d.getDate() + 1 + skip * 7); while (((d.getDay() + 6) % 7) !== dow) d.setDate(d.getDate() + 1); return d }
  var dates = WS.map(function (w, i) { return { w: w, d: nextDay(start, w[1], i >= 2 ? 1 : 0) } }).sort(function (a, b) { return a.d - b.d })
  function renderWs() {
    var ul = $('#ws-list'); ul.innerHTML = ''
    dates.forEach(function (x, i) {
      var key = x.d.toDateString(), left = 2 + ((x.d.getDate() * 7 + i * 3) % 7) - (mineWs[key] ? 1 : 0)
      var li = document.createElement('li'); if (mineWs[key]) li.className = 'is-mine'
      li.innerHTML = '<span class="ws__date"><b></b><span></span></span><span class="ws__name"><b></b><small></small></span><button class="btn btn--sm" type="button"></button>'
      li.querySelector('.ws__date b').textContent = x.d.getDate()
      li.querySelector('.ws__date span').textContent = x.d.toLocaleDateString('en-GB', { month: 'short' })
      li.querySelector('.ws__name b').textContent = x.w[0]
      li.querySelector('.ws__name small').textContent = x.d.toLocaleDateString('en-GB', { weekday: 'long' }) + ' ' + x.w[2] + ' · £65 · ' + (mineWs[key] ? 'you are booked in' : left + ' seats left')
      var b = li.querySelector('button'); b.textContent = mineWs[key] ? 'Cancel' : 'Book a seat'
      if (mineWs[key]) b.className = 'btn btn--sm btn--ghost'
      b.setAttribute('aria-label', (mineWs[key] ? 'Cancel ' : 'Book ') + x.w[0] + ' on ' + x.d.toDateString())
      b.addEventListener('click', function () { if (mineWs[key]) delete mineWs[key]; else mineWs[key] = 1; renderWs() })
      ul.appendChild(li)
    })
  }
  renderWs()

  // Studio hours
  HOURS.forEach(function (h, i) {
    var li = document.createElement('li'); if (i === L.day) li.className = 'is-today'
    li.innerHTML = '<span></span><span></span>'; li.children[0].textContent = DAYS[i]; li.children[1].textContent = pad(h[0]) + ':00–' + pad(h[1]) + ':00'; $('#hours').appendChild(li)
  })
  var open = nowH >= HOURS[L.day][0] && nowH < HOURS[L.day][1], st = $('#open-status')
  st.className = 'status' + (open ? ' is-open' : '')
  st.textContent = open ? 'Open now · until ' + pad(HOURS[L.day][1]) + ':00' : 'Closed now · opens ' + (nowH < HOURS[L.day][0] ? 'at ' + pad(HOURS[L.day][0]) + ':00' : 'tomorrow at ' + pad(HOURS[(L.day + 1) % 7][0]) + ':00')

  renderBag()
  // In season (season.js): loads only when its section scrolls near.
  var seasonSec = $('#season')
  if (seasonSec) {
    var loadSeason = function () { var sc = document.createElement('script'); sc.src = 'season.js'; document.body.appendChild(sc) }
    if ('IntersectionObserver' in window) {
      var snIo = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { snIo.disconnect(); loadSeason() } }, { rootMargin: '600px 0px' })
      snIo.observe(seasonSec)
    } else loadSeason()
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target) } }) }, { rootMargin: '0px 0px -10% 0px' })
    $$('.reveal').forEach(function (e) { io.observe(e) })
  } else $$('.reveal').forEach(function (e) { e.classList.add('is-in') })
})()
