// Sage & Silk demo: build-your-visit basket (time + price add up), booking, live gift voucher, gallery.
;(function () {
  var $ = function (s, r) { return (r || document).querySelector(s) }
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) }
  var pad = function (n) { return String(n).padStart(2, '0') }
  var MENU = {
    Nails: [['Gel manicure', 'Shape, cuticles, gel colour', 45, 32], ['Gel pedicure', 'Soak, scrub, gel colour', 60, 40], ['Nail art (per hand)', 'Lines, chrome, florals', 20, 12], ['Gel removal', 'Gentle, no drilling', 15, 8]],
    'Brows & lashes': [['Brow lamination', 'Set, tint and shape', 45, 45], ['Lash lift and tint', 'Lasts six to eight weeks', 50, 48], ['Brow wax and tint', 'Shape and colour', 25, 22]],
    Facials: [['Signature facial', 'Cleanse, peel, mask and massage', 60, 65], ['Express glow', 'For a lunch break', 30, 38], ['Hydra facial', 'Deep clean and hydration', 75, 95]],
    Massage: [['Back, neck and shoulders', 'Warm oil, firm pressure', 30, 40], ['Full body massage', 'Relaxing or deep tissue', 60, 70], ['Hot stone massage', 'Basalt stones, slow rhythm', 75, 85]],
  }
  // Monday first; null closed.
  var HOURS = [null, [10, 18], [10, 20], [10, 20], [10, 19], [9, 17], [11, 16]]
  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  var CREDITS = [['Avilash behera', 'CC BY-SA 3.0'], ['Park Weggis', 'CC BY-SA 3.0 de'], ['Courtney Rhodes', 'CC BY 2.0'], ['Lelê Breveglieri', 'CC BY 2.0'], ['Wikidenizen', 'CC BY 2.0'], ['Tails Wx', 'CC BY-SA 4.0']]
  var chosen = {}
  var cat = Object.keys(MENU)[0]

  function renderCats() {
    var box = $('#cats'); box.innerHTML = ''
    Object.keys(MENU).forEach(function (c) {
      var b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'tab'); b.textContent = c; b.setAttribute('aria-selected', String(c === cat))
      b.addEventListener('click', function () { cat = c; renderCats(); renderList() }); box.appendChild(b)
    })
  }
  function renderList() {
    var ul = $('#list'); ul.innerHTML = ''
    MENU[cat].forEach(function (t, i) {
      var key = cat + '|' + t[0]
      var li = document.createElement('li'); li.style.animationDelay = i * 50 + 'ms'
      li.innerHTML = '<label><input type="checkbox" /><strong></strong><b></b><small></small></label>'
      var box = li.querySelector('input'); box.checked = !!chosen[key]
      li.querySelector('strong').textContent = t[0]; li.querySelector('b').textContent = '£' + t[3]; li.querySelector('small').textContent = t[1] + ' · ' + t[2] + ' min'
      box.addEventListener('change', function () { if (box.checked) chosen[key] = t; else delete chosen[key]; renderBasket() })
      ul.appendChild(li)
    })
  }
  function totals() { var m = 0, p = 0; Object.keys(chosen).forEach(function (k) { m += chosen[k][2]; p += chosen[k][3] }); return { m: m, p: p } }
  function renderBasket() {
    var ul = $('#basket'), keys = Object.keys(chosen); ul.innerHTML = ''
    if (!keys.length) ul.innerHTML = '<li class="empty">Nothing yet. Tick a treatment.</li>'
    keys.forEach(function (k) { var li = document.createElement('li'); li.innerHTML = '<span></span><span></span>'; li.children[0].textContent = chosen[k][0]; li.children[1].textContent = '£' + chosen[k][3]; ul.appendChild(li) })
    var t = totals()
    $('#total-time').textContent = (t.m >= 60 ? Math.floor(t.m / 60) + ' h ' : '') + (t.m % 60 ? (t.m % 60) + ' min' : t.m ? '' : '0 min')
    $('#total-price').textContent = '£' + t.p
    fillTimes()
  }

  // Booking: times that fit the whole visit before closing.
  var date = $('#b-date')
  var iso = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) }
  var today = new Date(); date.min = iso(today)
  var start = new Date(today); while (!HOURS[(start.getDay() + 6) % 7]) start.setDate(start.getDate() + 1)
  date.value = iso(start)
  function fillTimes() {
    var s = $('#b-time'); s.innerHTML = ''
    var d = new Date(date.value + 'T00:00'), h = HOURS[(d.getDay() + 6) % 7], len = Math.max(30, totals().m)
    var now = new Date(), isToday = date.value === iso(now)
    if (!h) { s.innerHTML = '<option value="">Closed that day</option>'; return }
    for (var m = h[0] * 60; m + len <= h[1] * 60; m += 30) {
      if (isToday && m <= now.getHours() * 60 + now.getMinutes() + 60) continue
      var o = document.createElement('option'); o.textContent = pad(Math.floor(m / 60)) + ':' + pad(m % 60); s.appendChild(o)
    }
    if (!s.options.length) s.innerHTML = '<option value="">No time left that day</option>'
  }
  date.addEventListener('change', fillTimes)
  var clean = function (s, max) { return String(s).replace(/[<>\u0000-\u001f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max) }
  var last = 0
  $('#b-book').addEventListener('click', function () {
    if (Date.now() - last < 1500) return
    var st = $('#b-status'); $$('[aria-invalid]').forEach(function (el) { el.removeAttribute('aria-invalid') })
    var fail = function (el, msg) { st.className = 'form-status is-error'; st.textContent = msg; if (el) { el.setAttribute('aria-invalid', 'true'); el.focus() } }
    if (!Object.keys(chosen).length) return fail(null, 'Tick at least one treatment.')
    if (!$('#b-time').value) return fail(date, 'Choose a day and time when we are open.')
    var name = clean($('#b-name').value, 80), phone = clean($('#b-phone').value, 25)
    if (!name) return fail($('#b-name'), 'Write your name.')
    if (!/^\+?[\d\s()-]{7,22}$/.test(phone)) return fail($('#b-phone'), 'Write a mobile number for the reminder text.')
    last = Date.now()
    var t = totals()
    st.className = 'form-status is-ok'
    st.textContent = 'Booked, ' + name + ': ' + new Date(date.value + 'T00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) + ' at ' + $('#b-time').value + ', ' + $('#total-time').textContent + ', £' + t.p + '.' + (window.sageDesign ? ' Nails: ' + String(window.sageDesign).slice(0, 160) + '.' : '') + ' (Demo: nothing is charged or sent.)'
  })

  // Gift voucher with a live preview.
  var amount = 50
  ;[25, 50, 75, 100, 150].forEach(function (a) {
    var b = document.createElement('button'); b.type = 'button'; b.textContent = '£' + a; b.setAttribute('aria-pressed', String(a === amount))
    b.addEventListener('click', function () { amount = a; $$('#amounts button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)) }); voucher() })
    $('#amounts').appendChild(b)
  })
  function voucher() {
    $('#v-amount').textContent = '£' + amount
    $('#v-to').textContent = clean($('#g-to').value, 40) ? 'For ' + clean($('#g-to').value, 40) : 'For someone special'
    $('#v-msg').textContent = clean($('#g-msg').value, 140) || 'Happy birthday! Treat yourself.'
  }
  $('#g-to').addEventListener('input', voucher); $('#g-msg').addEventListener('input', voucher)
  $('#g-buy').addEventListener('click', function () {
    var code = 'SAGE-' + Math.random().toString(36).slice(2, 6).toUpperCase()
    $('#v-code').textContent = code
    var st = $('#g-status'); st.className = 'form-status is-ok'
    st.textContent = 'Voucher ' + code + ' for £' + amount + ' is ready. (Demo: a live site takes card payment and emails the voucher.)'
  })

  // Hours, gallery, menu, reveals
  var todayIdx = (today.getDay() + 6) % 7
  HOURS.forEach(function (h, i) {
    var li = document.createElement('li'); if (i === todayIdx) li.className = 'is-today'
    li.innerHTML = '<span></span><span></span>'; li.children[0].textContent = DAYS[i]; li.children[1].textContent = h ? pad(h[0]) + ':00–' + pad(h[1]) + ':00' : 'Closed'
    $('#hours').appendChild(li)
  })
  var box = $('#lightbox')
  $$('.m').forEach(function (g) { g.addEventListener('click', function () { var img = $('img', box); img.src = g.dataset.full; img.alt = $('img', g).alt; box.showModal() }) })
  box.addEventListener('click', function (e) { if (e.target === box) box.close() })
  var burger = $('.burger'), mobile = $('#mobile-menu')
  burger.addEventListener('click', function () { var o = burger.getAttribute('aria-expanded') !== 'true'; burger.setAttribute('aria-expanded', String(o)); mobile.hidden = !o })
  $$('a', mobile).forEach(function (a) { a.addEventListener('click', function () { burger.setAttribute('aria-expanded', 'false'); mobile.hidden = true }) })
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target) } }) }, { rootMargin: '0px 0px -10% 0px' })
    $$('.reveal').forEach(function (el) { io.observe(el) })
  } else $$('.reveal').forEach(function (el) { el.classList.add('is-in') })
  $('#credits').textContent = 'Photos from Wikimedia Commons: ' + CREDITS.map(function (c) { return c[0] + ' (' + c[1] + ')' }).join(', ') + '.'
  renderCats(); renderList(); renderBasket()
  // The polish bar (polish.js): loads only when its section scrolls near.
  ;(function () {
    var sec = document.getElementById('polish'); if (!sec) return
    var load = function () { var sc = document.createElement('script'); sc.src = 'polish.js'; document.body.appendChild(sc) }
    if (!('IntersectionObserver' in window)) return load()
    var io2 = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io2.disconnect(); load() } }, { rootMargin: '600px 0px' })
    io2.observe(sec)
  })()
})()
