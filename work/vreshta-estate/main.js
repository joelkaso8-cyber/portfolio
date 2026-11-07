// Vreshta Estate demo: 21+ age check, tasting booking, wine shop with a 6-bottle discount, wine club.
;(function () {
  var $ = function (s, r) { return (r || document).querySelector(s) }
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) }
  var usd = function (n) { return '$' + n.toFixed(0) }
  var pad = function (n) { return String(n).padStart(2, '0') }
  var FLIGHTS = [['Estate flight', 'Five current releases, from rosé to Syrah.', 30], ['Reserve flight', 'Six library and reserve wines with a cheese board.', 55], ['Barrel room tour', 'Walk the cellar with our winemaker, taste from the barrel.', 85]]
  var WINES = [
    { id: 'rose', name: 'Hill Rosé', desc: 'Grenache rosé · strawberry, salt', price: 28, c: '#d98c86' },
    { id: 'gsm', name: 'Three Rows GSM', desc: 'Grenache, Syrah, Mourvèdre', price: 42, c: '#6b1f2b' },
    { id: 'syrah', name: 'Limestone Syrah', desc: 'Blackberry, pepper, olive', price: 48, c: '#4a1420' },
    { id: 'white', name: 'Golden Hour White', desc: 'Roussanne, Viognier · apricot', price: 34, c: '#d8c06e' },
  ]
  var NO_SHIP = ['Utah']
  var STATES = ['Alabama', 'Arizona', 'California', 'Colorado', 'Delaware', 'Florida', 'Georgia', 'Illinois', 'Massachusetts', 'Mississippi', 'Nevada', 'New York', 'Oregon', 'Texas', 'Utah', 'Washington']
  var GATE_KEY = 'vreshta-21'

  // Age check: once per browser.
  var gate = $('#gate'), ok = false
  try { ok = localStorage.getItem(GATE_KEY) === 'yes' } catch (e) {}
  if (!ok) gate.showModal()
  gate.addEventListener('cancel', function (e) { e.preventDefault() })
  $('#gate-yes').addEventListener('click', function () { try { localStorage.setItem(GATE_KEY, 'yes') } catch (e) {} ; gate.close() })
  $('#gate-no').addEventListener('click', function () { var s = $('#gate-status'); s.className = 'form-status is-error'; s.textContent = 'Sorry, you must be 21 or older to visit.' })

  var bar = $('#top-bar'), film = $('.film')
  function headerState() { bar.classList.toggle('is-solid', window.scrollY > (film.offsetTop + film.offsetHeight - window.innerHeight - 40)) }
  window.addEventListener('scroll', headerState, { passive: true }); headerState()

  // Tasting booking: Thursday to Monday, 11:00 to 15:30 every 90 minutes.
  var tf = $('#tasting-form'), time = null
  FLIGHTS.forEach(function (f, i) {
    var l = document.createElement('label'); l.className = 'flight'
    l.innerHTML = '<input type="radio" name="flight" /><div><h3></h3><b></b><p></p></div>'
    l.querySelector('input').value = i; l.querySelector('input').checked = i === 0
    l.querySelector('h3').textContent = f[0]; l.querySelector('b').textContent = usd(f[2]); l.querySelector('p').textContent = f[1] + ' Per person.'
    $('#flights').appendChild(l)
  })
  var iso = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) }
  var open = function (d) { return [4, 5, 6, 0, 1].indexOf(d.getDay()) >= 0 }
  var d0 = new Date(); d0.setDate(d0.getDate() + 1); while (!open(d0)) d0.setDate(d0.getDate() + 1)
  tf.elements.date.min = iso(new Date()); tf.elements.date.value = iso(d0)
  function renderTimes() {
    var box = $('#times'); box.innerHTML = ''; time = null
    var d = new Date(tf.elements.date.value + 'T00:00')
    if (!tf.elements.date.value || !open(d)) { box.textContent = 'Tuesday and Wednesday by appointment: email us.'; return }
    ;['11:00', '12:30', '14:00', '15:30'].forEach(function (t, i) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = t; b.setAttribute('aria-pressed', 'false')
      b.disabled = (d.getDate() + i) % 5 === 0
      b.addEventListener('click', function () { time = t; $$('#times button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)) }) })
      box.appendChild(b)
    })
  }
  function total() { var g = Math.max(1, Math.min(8, Number(tf.elements.guests.value) || 1)), f = FLIGHTS[Number(tf.elements.flight.value)]; $('#t-total').textContent = g + ' × ' + usd(f[2]) + ' = ' + usd(g * f[2]) }
  tf.elements.date.addEventListener('change', renderTimes)
  tf.addEventListener('input', total)
  renderTimes(); total()
  var clean = function (s, m) { return String(s).replace(/[<>\u0000-\u001f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, m) }
  var last = 0
  tf.addEventListener('submit', function (e) {
    e.preventDefault()
    if (Date.now() - last < 1500) return
    var st = $('#t-status'); $$('[aria-invalid]', tf).forEach(function (el) { el.removeAttribute('aria-invalid') })
    var fail = function (el, m) { st.className = 'form-status is-error'; st.textContent = m; if (el) { el.setAttribute('aria-invalid', 'true'); el.focus() } }
    if (!time) return fail(null, 'Choose a time.')
    var name = clean(tf.elements.name.value, 80)
    if (!name) return fail(tf.elements.name, 'Write your name.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(tf.elements.email.value, 120))) return fail(tf.elements.email, 'Write a full email address.')
    last = Date.now()
    if (tf.elements.website.value) return
    st.className = 'form-status is-ok'
    st.textContent = 'Reserved, ' + name + ': ' + FLIGHTS[Number(tf.elements.flight.value)][0] + ', ' + new Date(tf.elements.date.value + 'T00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) + ' at ' + time + '. (Demo: nothing is sent.)'
  })

  // Wine shop
  var cart = {}
  WINES.forEach(function (w) {
    var el = document.createElement('article'); el.className = 'wine reveal'
    el.innerHTML = '<div class="bottle" aria-hidden="true"></div><h3></h3><p></p><div class="wine__foot"><b></b><button class="btn" type="button">Add</button></div>'
    el.querySelector('.bottle').style.setProperty('--c', w.c)
    el.querySelector('h3').textContent = w.name; el.querySelector('p').textContent = w.desc; el.querySelector('b').textContent = usd(w.price)
    var btn = el.querySelector('button'); btn.setAttribute('aria-label', 'Add ' + w.name + ' to cart')
    btn.addEventListener('click', function () { cart[w.id] = (cart[w.id] || 0) + 1; renderCart(); var c = $('#cart-open'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump') })
    $('#wine-list').appendChild(el)
  })
  STATES.forEach(function (s) { var o = document.createElement('option'); o.textContent = s; $('#c-state').appendChild(o) })
  function renderCart() {
    var ul = $('#cart-items'), sub = 0, n = 0; ul.innerHTML = ''
    Object.keys(cart).forEach(function (id) {
      var w = WINES.find(function (x) { return x.id === id }), q = cart[id]; sub += w.price * q; n += q
      var li = document.createElement('li'); li.innerHTML = '<span></span><span></span>'; li.children[0].textContent = q + ' × ' + w.name; li.children[1].textContent = usd(w.price * q); ul.appendChild(li)
    })
    if (!n) ul.innerHTML = '<li>Your cart is empty.</li>'
    var disc = n >= 6 ? sub * 0.1 : 0
    $('#c-sub').textContent = usd(sub); $('#c-disc').textContent = disc ? '−' + usd(disc) : (n ? (6 - n) + ' more for 10% off' : '$0'); $('#c-total').textContent = usd(sub - disc)
    $('#cart-count').textContent = n
  }
  var cd = $('#cart')
  $('#cart-open').addEventListener('click', function () { renderCart(); cd.showModal() })
  $('#cart-close').addEventListener('click', function () { cd.close() })
  cd.addEventListener('click', function (e) { if (e.target === cd) cd.close() })
  $('#c-pay').addEventListener('click', function () {
    var st = $('#c-status'), state = $('#c-state').value
    if (!Object.keys(cart).length) { st.className = 'form-status is-error'; st.textContent = 'Add a bottle first.'; return }
    if (!state) { st.className = 'form-status is-error'; st.textContent = 'Choose the state we ship to.'; return }
    if (NO_SHIP.indexOf(state) >= 0) { st.className = 'form-status is-error'; st.textContent = 'Sorry, state law does not let us ship wine to ' + state + '.'; return }
    st.className = 'form-status is-ok'; st.textContent = 'Order placed. An adult (21+) must sign for delivery. (Demo: nothing is charged.)'
    cart = {}; renderCart()
  })

  // Wine club
  var TIERS = [['Terrace', '3 bottles twice a year', ['10% off all wine', '2 free tastings a visit'], 120], ['Hillside', '6 bottles twice a year', ['15% off all wine', '4 free tastings a visit', 'Release party invites'], 230, true], ['Old Vine', '12 bottles twice a year', ['20% off all wine', 'Free barrel room tours', 'Library wines'], 440]]
  TIERS.forEach(function (t) {
    var el = document.createElement('article'); el.className = 'tier reveal' + (t[4] ? ' tier--main' : '')
    el.innerHTML = '<h3></h3><b></b><ul></ul><button class="btn" type="button">Join</button>'
    el.querySelector('h3').textContent = t[0]; el.querySelector('b').textContent = '~' + usd(t[3]) + ' a shipment · ' + t[1]
    t[2].forEach(function (x) { var li = document.createElement('li'); li.textContent = x; el.querySelector('ul').appendChild(li) })
    el.querySelector('button').addEventListener('click', function () { var s = $('#club-status'); s.className = 'form-status is-ok'; s.textContent = 'Welcome to the ' + t[0] + ' club. (Demo: a live site asks for card and shipping details here.)' })
    $('#tiers').appendChild(el)
  })

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target) } }) }, { rootMargin: '0px 0px -10% 0px' })
    $$('.reveal').forEach(function (el) { io.observe(el) })
  } else $$('.reveal').forEach(function (el) { el.classList.add('is-in') })
  renderCart()
})()
