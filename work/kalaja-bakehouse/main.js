// Kalaja Bakehouse demo: EN/SQ, today's bake times, order-ahead basket with NY tax and pickup slots,
// catering estimate, live hours.
;(function () {
  var $ = function (s, r) { return (r || document).querySelector(s) }
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) }
  var pad = function (n) { return String(n).padStart(2, '0') }
  var usd = function (n) { return '$' + n.toFixed(2) }
  var TAX = 0.08875
  // Monday first: [open, close].
  var HOURS = [[6, 19], [6, 19], [6, 19], [6, 19], [6, 20], [7, 20], [7, 16]]
  var PRODUCTS = [
    { id: 'byrek-spinach', img: 'slice', price: 5.5, en: ['Spinach byrek', 'Hand-rolled filo, spinach and feta'], sq: ['Byrek me spinaq', 'Petë me dorë, spinaq dhe djathë'] },
    { id: 'byrek-meat', img: 'trays', price: 6, en: ['Meat byrek', 'Spiced beef and onion'], sq: ['Byrek me mish', 'Mish viçi me qepë'] },
    { id: 'pastries', img: 'display', price: 3.75, en: ['Filled pastries', 'Cream, cheese or chocolate'], sq: ['Pasta të mbushura', 'Me krem, djathë ose çokollatë'] },
    { id: 'baklava', img: 'case', price: 4.5, en: ['Baklava (2 pcs)', 'Walnut and honey syrup'], sq: ['Bakllava (2 copë)', 'Me arra dhe shurup mjalti'] },
    { id: 'bread', img: 'bread', price: 6.5, en: ['Village loaf', 'Slow-proved, baked at dawn'], sq: ['Bukë fshati', 'Brumë i ngadaltë, pjekur në agim'] },
    { id: 'coffee', img: 'cups', price: 3.25, en: ['Coffee', 'Espresso, macchiato or Turkish'], sq: ['Kafe', 'Ekspres, makiato ose turke'] },
  ]
  var BAKES = [['06:00', 'byrek-spinach'], ['08:30', 'bread'], ['11:00', 'byrek-meat'], ['14:00', 'pastries']]
  var T = {
    en: {
      'nav.order': 'Order ahead', 'nav.today': 'Today', 'nav.catering': 'Catering', 'nav.visit': 'Visit',
      'hero.eyebrow': 'Albanian bakery & café · Morris Park, the Bronx', 'hero.title': 'Byrek out of the oven every hour.',
      'hero.lead': 'Hand-rolled byrek, fresh bread and Balkan pastries, baked here since six in the morning. Order ahead and skip the line.',
      'hero.order': 'Order for pickup', 'hero.catering': 'Catering', 'today.title': "Today's bakes", 'order.title': 'Order ahead', 'order.lead': 'Pick it up hot. Pay when you collect.',
      'cat.title': 'Catering', 'cat.lead': 'Trays of byrek, pite and baklava for offices, weddings and family celebrations. Tell us the date and how many people.',
      'f.name': 'Name', 'f.phone': 'Phone', 'f.date': 'Date', 'f.people': 'People', 'f.send': 'Send request',
      'cart.title': 'Your order', 'cart.sub': 'Subtotal', 'cart.tax': 'NY sales tax 8.875%', 'cart.total': 'Total', 'cart.pickup': 'Pickup time', 'cart.place': 'Place order',
      'footer.demo': 'A demo website with a made-up bakery name and prices, designed and built by Joel Kaso. Orders here are a working demo and are not sent anywhere.',
      fresh: 'Fresh from the oven at ', ovenOut: 'Next tray out at ', closedNow: 'Closed now · ovens on at ', bakedAt: 'out of the oven', done: 'baked',
      empty: 'Your basket is empty.', est: function (n, a, b) { return 'About ' + n + ' people: roughly ' + usd(a) + ' to ' + usd(b) + ', delivery in the Bronx included.' },
      err: { empty: 'Add something first.', time: 'Choose a pickup time.', name: 'Write your name.', phone: 'Write a phone number.', date: 'Choose a date at least 2 days from now.', people: 'Catering is for 10 to 500 people.' },
      ok: function (n, t, num) { return 'Order #' + num + ' received, ' + n + '. Ready at ' + t + '. (Demo: nothing is sent or charged.)' },
      catOk: function (n) { return 'Thanks, ' + n + '. We will call you within a day. (Demo: nothing is sent.)' },
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], asap: 'In 20 minutes',
    },
    sq: {
      'nav.order': 'Porosit', 'nav.today': 'Sot', 'nav.catering': 'Katering', 'nav.visit': 'Na gjeni',
      'hero.eyebrow': 'Furrë dhe kafe shqiptare · Morris Park, Bronx', 'hero.title': 'Byrek i nxehtë nga furra çdo orë.',
      'hero.lead': 'Byrek me petë dore, bukë e freskët dhe ëmbëlsira ballkanike, të pjekura këtu që nga ora gjashtë e mëngjesit. Porosit më parë dhe mos prit në radhë.',
      'hero.order': 'Porosit për ta marrë', 'hero.catering': 'Katering', 'today.title': 'Të pjekurat e sotme', 'order.title': 'Porosit më parë', 'order.lead': 'Merre të nxehtë. Paguan kur e merr.',
      'cat.title': 'Katering', 'cat.lead': 'Tava me byrek, pite dhe bakllava për zyra, dasma dhe festa familjare. Na trego datën dhe sa veta jeni.',
      'f.name': 'Emri', 'f.phone': 'Telefoni', 'f.date': 'Data', 'f.people': 'Persona', 'f.send': 'Dërgo kërkesën',
      'cart.title': 'Porosia jote', 'cart.sub': 'Nëntotali', 'cart.tax': 'Taksa e NY 8.875%', 'cart.total': 'Totali', 'cart.pickup': 'Ora e marrjes', 'cart.place': 'Bëj porosinë',
      'footer.demo': 'Website demo me emër furre dhe çmime të shpikura, projektuar dhe ndërtuar nga Joel Kaso. Porositë këtu janë demo dhe nuk dërgohen.',
      fresh: 'E freskët nga furra në ', ovenOut: 'Tava tjetër del në ', closedNow: 'Mbyllur tani · furrat ndizen në ', bakedAt: 'del nga furra', done: 'u poq',
      empty: 'Shporta është bosh.', est: function (n, a, b) { return 'Rreth ' + n + ' veta: afërsisht ' + usd(a) + ' deri ' + usd(b) + ', me dërgesë në Bronx.' },
      err: { empty: 'Shto diçka fillimisht.', time: 'Zgjidh orën e marrjes.', name: 'Shkruaj emrin.', phone: 'Shkruaj numrin e telefonit.', date: 'Zgjidh një datë të paktën 2 ditë nga sot.', people: 'Kateringu është për 10 deri në 500 veta.' },
      ok: function (n, t, num) { return 'Porosia #' + num + ' u mor, ' + n + '. Gati në ' + t + '. (Demo: nuk dërgohet as paguhet asgjë.)' },
      catOk: function (n) { return 'Faleminderit, ' + n + '. Do të telefonojmë brenda një dite. (Demo: nuk dërgohet asgjë.)' },
      days: ['E hënë', 'E martë', 'E mërkurë', 'E enjte', 'E premte', 'E shtunë', 'E diel'], asap: 'Pas 20 minutash',
    },
  }
  var CREDITS = [['Silar', 'CC BY-SA 4.0'], ['Petar Milošević', 'CC BY-SA 4.0'], ['E4024', 'CC BY-SA 4.0'], ['Daderot', 'CC0'], ['Enzo Abramo', 'CC0'], ['Abdulrohmatt', 'CC BY-SA 4.0'], ['Andy Li', 'CC0'], ['Catherine Sharman', 'CC BY 2.0'], ['Bex Walton', 'CC BY 2.0']]
  var lang = 'en'
  try { if (localStorage.getItem('kalaja-lang') === 'sq') lang = 'sq' } catch (e) {}
  var cart = {}
  var t = function (k) { return T[lang][k] }

  // New York time, so the board is right wherever the visitor is.
  function nyNow() {
    var p = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date())
    var g = function (ty) { return (p.find(function (x) { return x.type === ty }) || {}).value }
    return { day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(g('weekday')), min: (Number(g('hour')) % 24) * 60 + Number(g('minute')) }
  }
  function name(p) { return p[lang][0] }

  function renderBoard() {
    var now = nyNow(), box = $('#board'); box.innerHTML = ''
    $('#today-day').textContent = t('days')[now.day]
    BAKES.forEach(function (b) {
      var p = PRODUCTS.find(function (x) { return x.id === b[1] })
      var at = Number(b[0].slice(0, 2)) * 60 + Number(b[0].slice(3))
      var d = document.createElement('div'); d.innerHTML = '<time></time><b></b><small></small>'
      d.children[0].textContent = b[0]; d.children[1].textContent = name(p); d.children[2].textContent = now.min >= at ? t('done') : t('bakedAt')
      box.appendChild(d)
    })
    var h = HOURS[now.day], oven = $('#oven')
    if (now.min < h[0] * 60 || now.min >= h[1] * 60) { oven.textContent = t('closedNow') + pad(HOURS[(now.day + (now.min >= h[1] * 60 ? 1 : 0)) % 7][0]) + ':00'; return }
    var next = BAKES.find(function (b) { return Number(b[0].slice(0, 2)) * 60 + Number(b[0].slice(3)) > now.min })
    oven.textContent = next ? t('ovenOut') + next[0] + ' · ' + name(PRODUCTS.find(function (x) { return x.id === next[1] })) : t('fresh') + BAKES[BAKES.length - 1][0]
  }

  function renderProducts() {
    var box = $('#products'); box.innerHTML = ''
    PRODUCTS.forEach(function (p) {
      var el = document.createElement('article'); el.className = 'prod reveal is-in'
      el.innerHTML = '<img loading="lazy" alt="" /><div class="prod__body"><h3></h3><p></p></div><div class="prod__foot"><span class="prod__price"></span><div class="qty"><button type="button" aria-label="Remove one">−</button><output>0</output><button type="button" aria-label="Add one">+</button></div></div>'
      var img = el.querySelector('img'); img.src = 'img/' + p.img + '-800.webp'; img.alt = name(p)
      el.querySelector('h3').textContent = name(p); el.querySelector('p').textContent = p[lang][1]; el.querySelector('.prod__price').textContent = usd(p.price)
      var out = el.querySelector('output'); out.textContent = cart[p.id] || 0
      var btns = el.querySelectorAll('.qty button')
      btns[0].addEventListener('click', function () { cart[p.id] = Math.max(0, (cart[p.id] || 0) - 1); if (!cart[p.id]) delete cart[p.id]; out.textContent = cart[p.id] || 0; renderCart() })
      btns[1].addEventListener('click', function () { cart[p.id] = Math.min(20, (cart[p.id] || 0) + 1); out.textContent = cart[p.id]; renderCart(); var c = $('#cart-open'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump') })
      box.appendChild(el)
    })
  }

  function renderCart() {
    var ul = $('#cart-items'), sub = 0, count = 0; ul.innerHTML = ''
    Object.keys(cart).forEach(function (id) {
      var p = PRODUCTS.find(function (x) { return x.id === id }), q = cart[id]
      sub += p.price * q; count += q
      var li = document.createElement('li'); li.innerHTML = '<span></span><span></span>'; li.children[0].textContent = q + ' × ' + name(p); li.children[1].textContent = usd(p.price * q); ul.appendChild(li)
    })
    if (!count) ul.innerHTML = '<li class="empty"></li>', ul.firstChild.textContent = t('empty')
    var tax = Math.round(sub * TAX * 100) / 100
    $('#c-sub').textContent = usd(sub); $('#c-tax').textContent = usd(tax); $('#c-total').textContent = usd(sub + tax)
    $('#cart-count').textContent = count
  }

  function fillPickup() {
    var s = $('#c-time'), now = nyNow(), h = HOURS[now.day]; s.innerHTML = ''
    var first = Math.ceil((now.min + 20) / 15) * 15
    for (var m = Math.max(first, h[0] * 60 + 15); m <= h[1] * 60 - 15; m += 15) { var o = document.createElement('option'); o.textContent = pad(Math.floor(m / 60)) + ':' + pad(m % 60); s.appendChild(o) }
    if (!s.options.length) { var nd = HOURS[(now.day + 1) % 7]; for (var m2 = nd[0] * 60 + 30; m2 <= nd[0] * 60 + 180; m2 += 30) { var o2 = document.createElement('option'); o2.textContent = t('days')[(now.day + 1) % 7] + ' ' + pad(Math.floor(m2 / 60)) + ':' + pad(m2 % 60); s.appendChild(o2) } }
  }

  var dlg = $('#cart')
  $('#cart-open').addEventListener('click', function () { fillPickup(); renderCart(); dlg.showModal() })
  $('#cart-close').addEventListener('click', function () { dlg.close() })
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close() })
  var clean = function (s, max) { return String(s).replace(/[<>\u0000-\u001f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max) }
  var last = 0
  $('#c-place').addEventListener('click', function () {
    if (Date.now() - last < 1500) return
    var st = $('#c-status'); $$('[aria-invalid]', dlg).forEach(function (el) { el.removeAttribute('aria-invalid') })
    var fail = function (el, msg) { st.className = 'form-status is-error'; st.textContent = msg; if (el) { el.setAttribute('aria-invalid', 'true'); el.focus() } }
    if (!Object.keys(cart).length) return fail(null, t('err').empty)
    var n = clean($('#c-name').value, 80), ph = clean($('#c-phone').value, 25)
    if (!$('#c-time').value) return fail($('#c-time'), t('err').time)
    if (!n) return fail($('#c-name'), t('err').name)
    if (!/^\+?[\d\s()-]{7,22}$/.test(ph)) return fail($('#c-phone'), t('err').phone)
    last = Date.now()
    st.className = 'form-status is-ok'; st.textContent = t('ok')(n, $('#c-time').value, 100 + Math.floor(Math.random() * 900))
    cart = {}; renderProducts(); renderCart()
  })

  // Catering: about $14 to $18 a head.
  var cf = $('#cat-form')
  var iso = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) }
  var minD = new Date(); minD.setDate(minD.getDate() + 2); cf.elements.date.min = iso(minD)
  function est() { var n = Math.max(10, Math.min(500, Number(cf.elements.people.value) || 10)); $('#cat-est').textContent = t('est')(n, n * 14, n * 18) }
  cf.elements.people.addEventListener('input', est)
  cf.addEventListener('submit', function (e) {
    e.preventDefault()
    var st = $('#cat-status'); $$('[aria-invalid]', cf).forEach(function (el) { el.removeAttribute('aria-invalid') })
    var fail = function (f, msg) { st.className = 'form-status is-error'; st.textContent = msg; cf.elements[f].setAttribute('aria-invalid', 'true'); cf.elements[f].focus() }
    var n = clean(cf.elements.name.value, 80), ppl = Number(cf.elements.people.value)
    if (!n) return fail('name', t('err').name)
    if (!/^\+?[\d\s()-]{7,22}$/.test(clean(cf.elements.phone.value, 25))) return fail('phone', t('err').phone)
    if (!cf.elements.date.value || cf.elements.date.value < cf.elements.date.min) return fail('date', t('err').date)
    if (!(ppl >= 10 && ppl <= 500)) return fail('people', t('err').people)
    if (cf.elements.website.value) return
    st.className = 'form-status is-ok'; st.textContent = t('catOk')(n)
  })

  function renderHours() {
    var ul = $('#hours'), now = nyNow(); ul.innerHTML = ''
    HOURS.forEach(function (h, i) { var li = document.createElement('li'); if (i === now.day) li.className = 'is-today'; li.innerHTML = '<span></span><span></span>'; li.children[0].textContent = t('days')[i]; li.children[1].textContent = pad(h[0]) + ':00–' + pad(h[1]) + ':00'; ul.appendChild(li) })
  }
  function applyLang() {
    document.documentElement.lang = lang
    $$('[data-i18n]').forEach(function (el) { var v = t(el.getAttribute('data-i18n')); if (typeof v === 'string') el.textContent = v })
    $$('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === lang)) })
    renderBoard(); renderProducts(); renderCart(); renderHours(); est()
  }
  $$('[data-lang]').forEach(function (b) { b.addEventListener('click', function () { lang = b.dataset.lang; try { localStorage.setItem('kalaja-lang', lang) } catch (e) {} ; applyLang() }) })

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target) } }) }, { rootMargin: '0px 0px -10% 0px' })
    $$('.reveal').forEach(function (el) { io.observe(el) })
  } else $$('.reveal').forEach(function (el) { el.classList.add('is-in') })
  $('#credits').textContent = 'Photos from Wikimedia Commons: ' + CREDITS.map(function (c) { return c[0] + ' (' + c[1] + ')' }).join(', ') + '.'
  applyLang()
  setInterval(renderBoard, 60000)
})()
