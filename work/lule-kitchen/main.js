// Lule Balkan Kitchen demo: scroll film header, EN/SQ, menu tabs, live opening status, booking (+ WhatsApp), gallery,
// FAQ, cookie choice (the Google map loads only with consent), privacy/terms.
;(function () {
  var $ = function (s, r) { return (r || document).querySelector(s) }
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) }

  var T = {
    en: {
      ribbon: 'Demo by Joel Kaso ↗', scroll: 'Scroll', 'film.h1b': 'Balkan Kitchen',
      'film.2': 'Fire <em>first.</em>', 'film.2s': 'The clay oven is lit at seven every morning, before the first tray of byrek goes in.',
      'film.3': 'Then the <em>grill.</em>', 'film.3s': 'Qofte, lamb and peppers over real wood charcoal, the way it is done back home.',
      'film.4': 'Then your <em>table.</em>', 'book.wa': 'Book via WhatsApp',
      'wa.msg': 'Hello Lule, I would like to book a table for {g} on {d} at {t}. Name: {n}. {x}',
      'faq.title': 'Good to know', 'visit.park': 'Street parking after 6:30pm; Finsbury Park car park is 5 minutes away.', 'visit.maps': 'Directions in Google Maps',
      'map.show': 'Show the map', 'map.note': 'Loads Google Maps, which may set cookies.',
      'legal.privacy': 'Privacy policy', 'legal.terms': 'Terms', 'legal.cookies': 'Cookie settings', 'legal.more': 'Read more',
      'cookie.text': 'This site uses no tracking. The map is from Google and can set cookies, so it loads only if you allow it.', 'cookie.yes': 'Accept', 'cookie.no': 'Decline',
      'bar.wa': 'WhatsApp', 'bar.call': 'Call', film: 'Film: "Grilled entrecote" by Georges Seguin (Okki), CC BY-SA 4.0, and "Oven 01" by Yurii-mr, CC BY-SA 4.0, via Wikimedia Commons; cut and graded.',
      faq: [['Do you have vegetarian dishes?', 'Yes: everything marked "veg" on the menu, and we can make most meze vegan.'], ['Can I bring a birthday cake?', 'Of course. Tell us in the booking notes and we keep it in the fridge and bring it out with candles.'], ['Do you take walk-ins?', 'Yes, when a table is free. On Friday and Saturday evenings it is best to book.'], ['How do I pay?', 'Card, Apple Pay, Google Pay or cash. We add no service charge; tips go to the kitchen team.']],
      privacy: '<p>Demo text for a made-up restaurant.</p><h3>What we collect</h3><p>When you book: your name, mobile number, date, time, number of guests and any notes, used only to manage your booking.</p><h3>Where it goes</h3><p>Bookings reach the restaurant on Telegram and are kept in its Google Sheet for up to 12 months. We never sell your data.</p><h3>Cookies</h3><p>This site stores only your language and cookie choice. The Google map loads only after you allow it.</p><h3>Your rights</h3><p>Under UK GDPR you can ask to see, correct or delete your data: write to the restaurant. You can also contact the ICO (ico.org.uk).</p>',
      terms: '<p>Demo text for a made-up restaurant.</p><h3>Bookings</h3><p>A request is confirmed when we text you back. We hold the table for 15 minutes.</p><h3>Groups</h3><p>Groups of 10 or more may need a deposit, which we tell you about before confirming.</p><h3>Allergies</h3><p>Our kitchen uses nuts, gluten, dairy and sesame. Tell us about allergies when you book.</p>',
      'nav.menu': 'Menu', 'nav.story': 'Our story', 'nav.gallery': 'Gallery', 'nav.visit': 'Visit', 'nav.book': 'Book a table',
      'hero.eyebrow': 'Green Lanes · North London', 'hero.title': "Grandmother's table, in the middle of London",
      'hero.lead': 'Wood-fired byrek, charcoal grill and slow-baked tavë from the Balkans, made fresh every morning.',
      'hero.book': 'Book a table', 'hero.menu': 'See the menu',
      'strip.rating': 'Google rating (sample)', 'strip.dishes': 'dishes, made in house', 'strip.hours': 'open every day',
      'menu.title': 'The menu', 'menu.lead': 'Prices include VAT. Tell us about any allergies when you book.',
      'menu.meze': 'Meze', 'menu.grill': 'Grill', 'menu.oven': 'From the oven', 'menu.sweet': 'Sweets',
      'story.eyebrow': 'Since 2016', 'story.title': 'A family kitchen that moved to London',
      'story.p1': 'Lule started as Sunday lunch for friends: one long table, one tray of byrek, too many people. Now it is twelve tables on Green Lanes, and the byrek still comes out of the oven every hour.',
      'story.p2': 'Everything is cooked from scratch: the filo is rolled by hand, the yoghurt is strained here, and the grill runs on charcoal.',
      'gallery.title': 'From our kitchen', 'gallery.lead': 'Tap a photo to see it bigger.',
      'reviews.title': 'What guests say', 'reviews.lead': 'Sample reviews for this demo.',
      'book.title': 'Book a table', 'book.lead': 'We confirm every booking by text within the hour. For groups over 10, call us.',
      'book.call': 'Call', 'book.date': 'Date', 'book.time': 'Time', 'book.guests': 'Guests', 'book.name': 'Name', 'book.phone': 'Mobile',
      'book.notes': 'Notes (allergies, birthday…)', 'book.send': 'Request the table',
      'visit.title': 'Find us', 'visit.tube': '5 min from Manor House station',
      'footer.demo': 'A demo website with a made-up restaurant name, designed and built by Joel Kaso.',
      open: 'Open now · until ', closed: 'Closed now · opens at ', veg: 'veg',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      err: { date: 'Choose a date from today on.', time: 'Choose a time.', name: 'Write your name.', phone: 'Write a mobile number we can text.' },
      ok: function (d) { return 'Thank you, ' + d.name + '! Table for ' + d.guests + ' on ' + d.date + ' at ' + d.time + ' requested. (Demo: on a live site this goes straight to the restaurant.)' },
    },
    sq: {
      ribbon: 'Demo nga Joel Kaso ↗', scroll: 'Rrëshqit', 'film.h1b': 'Balkan Kitchen',
      'film.2': 'Në fillim <em>zjarri.</em>', 'film.2s': 'Furra prej balte ndizet në shtatë çdo mëngjes, para se të futet tava e parë me byrek.',
      'film.3': 'Pastaj <em>zgara.</em>', 'film.3s': 'Qofte, mish qengji dhe speca mbi qymyr druri, si në shtëpi.',
      'film.4': 'Pastaj <em>tryeza.</em>', 'book.wa': 'Rezervo në WhatsApp',
      'wa.msg': 'Përshëndetje Lule, dua të rezervoj tavolinë për {g} më {d} në {t}. Emri: {n}. {x}',
      'faq.title': 'Mirë ta dini', 'visit.park': 'Parkim në rrugë pas orës 18:30; parkimi Finsbury Park është 5 minuta larg.', 'visit.maps': 'Rruga në Google Maps',
      'map.show': 'Shfaq hartën', 'map.note': 'Hap Google Maps, që mund të vendosë cookies.',
      'legal.privacy': 'Privatësia', 'legal.terms': 'Kushtet', 'legal.cookies': 'Cookies', 'legal.more': 'Lexo më shumë',
      'cookie.text': 'Kjo faqe nuk ju ndjek. Harta është e Google dhe mund të vendosë cookies, prandaj hapet vetëm me lejen tuaj.', 'cookie.yes': 'Prano', 'cookie.no': 'Refuzo',
      'bar.wa': 'WhatsApp', 'bar.call': 'Telefono', film: 'Filmi: "Grilled entrecote" nga Georges Seguin (Okki), CC BY-SA 4.0, dhe "Oven 01" nga Yurii-mr, CC BY-SA 4.0, nga Wikimedia Commons; i prerë dhe i ngjyrosur.',
      faq: [['Keni pjata vegjetariane?', 'Po: gjithçka me shenjën "vegjetarian" në menu, dhe shumicën e mezeve i bëjmë edhe vegane.'], ['Mund të sjell tortë ditëlindjeje?', 'Sigurisht. Shkruajeni te shënimet e rezervimit; e mbajmë në frigorifer dhe e sjellim me qirinj.'], ['Pranoni pa rezervim?', 'Po, kur ka tavolinë të lirë. Të premten dhe të shtunën në mbrëmje është më mirë të rezervoni.'], ['Si paguaj?', 'Me kartë, Apple Pay, Google Pay ose para në dorë. Nuk shtojmë tarifë shërbimi; bakshishi shkon te kuzhina.']],
      privacy: '<p>Tekst demo për një restorant të shpikur.</p><h3>Çfarë mbledhim</h3><p>Kur rezervoni: emrin, celularin, datën, orën, numrin e personave dhe shënimet, vetëm për rezervimin.</p><h3>Ku shkojnë</h3><p>Rezervimet i vijnë restorantit në Telegram dhe ruhen deri në 12 muaj. Nuk i shesim kurrë të dhënat.</p><h3>Cookies</h3><p>Faqja ruan vetëm gjuhën dhe zgjedhjen për cookies. Harta e Google hapet vetëm me lejen tuaj.</p><h3>Të drejtat</h3><p>Mund të kërkoni t\'i shihni, ndryshoni ose fshini të dhënat tuaja: shkruajini restorantit.</p>',
      terms: '<p>Tekst demo për një restorant të shpikur.</p><h3>Rezervimet</h3><p>Kërkesa konfirmohet kur ju kthejmë mesazh. Tavolinën e mbajmë 15 minuta.</p><h3>Grupet</h3><p>Për grupe me 10 veta ose më shumë mund të duhet parapagim, që jua themi para konfirmimit.</p><h3>Alergjitë</h3><p>Në kuzhinë përdorim arra, gluten, qumësht dhe susam. Na tregoni për alergjitë kur rezervoni.</p>',
      'nav.menu': 'Menuja', 'nav.story': 'Historia', 'nav.gallery': 'Galeria', 'nav.visit': 'Na gjeni', 'nav.book': 'Rezervo tavolinë',
      'hero.eyebrow': 'Green Lanes · Londra e Veriut', 'hero.title': 'Tryeza e gjyshes, në mes të Londrës',
      'hero.lead': 'Byrek në furrë me dru, zgarë me qymyr dhe tavë e pjekur ngadalë nga Ballkani, gatuar çdo mëngjes.',
      'hero.book': 'Rezervo tavolinë', 'hero.menu': 'Shiko menunë',
      'strip.rating': 'vlerësim në Google (shembull)', 'strip.dishes': 'pjata, të gjitha shtëpie', 'strip.hours': 'hapur çdo ditë',
      'menu.title': 'Menuja', 'menu.lead': 'Çmimet përfshijnë TVSH. Na tregoni për alergjitë kur rezervoni.',
      'menu.meze': 'Meze', 'menu.grill': 'Zgara', 'menu.oven': 'Nga furra', 'menu.sweet': 'Ëmbëlsira',
      'story.eyebrow': 'Që nga 2016', 'story.title': 'Një kuzhinë familjare që erdhi në Londër',
      'story.p1': 'Lule nisi si drekë të dielave për miqtë: një tryezë e gjatë, një tavë byrek, shumë njerëz. Sot janë dymbëdhjetë tavolina në Green Lanes, dhe byreku del ende nga furra çdo orë.',
      'story.p2': 'Çdo gjë gatuhet nga e para: petët hapen me dorë, kosi kullohet këtu dhe zgara punon me qymyr.',
      'gallery.title': 'Nga kuzhina jonë', 'gallery.lead': 'Prek një foto për ta parë më të madhe.',
      'reviews.title': 'Çfarë thonë mysafirët', 'reviews.lead': 'Komente shembull për këtë demo.',
      'book.title': 'Rezervo tavolinë', 'book.lead': 'Çdo rezervim e konfirmojmë me mesazh brenda një ore. Për grupe mbi 10 veta, na telefononi.',
      'book.call': 'Telefon', 'book.date': 'Data', 'book.time': 'Ora', 'book.guests': 'Persona', 'book.name': 'Emri', 'book.phone': 'Celulari',
      'book.notes': 'Shënime (alergji, ditëlindje…)', 'book.send': 'Kërko tavolinën',
      'visit.title': 'Na gjeni', 'visit.tube': '5 min nga stacioni Manor House',
      'footer.demo': 'Website demo me emër restoranti të shpikur, projektuar dhe ndërtuar nga Joel Kaso.',
      open: 'Hapur tani · deri në ', closed: 'Mbyllur tani · hapet në ', veg: 'vegjetarian',
      days: ['E hënë', 'E martë', 'E mërkurë', 'E enjte', 'E premte', 'E shtunë', 'E diel'],
      err: { date: 'Zgjidhni një datë nga sot e tutje.', time: 'Zgjidhni orën.', name: 'Shkruani emrin.', phone: 'Shkruani një numër celulari.' },
      ok: function (d) { return 'Faleminderit, ' + d.name + '! Tavolinë për ' + d.guests + ' më ' + d.date + ' në ' + d.time + '. (Demo: në faqen e vërtetë kjo shkon direkt te restoranti.)' },
    },
  }
  var MENU = {
    meze: { photo: 'meze', items: [
      ['Meze plate for two', 'Pickled peppers, white cheese, tarator, olives, warm bread', 14.5, 1],
      ['Fërgesë', 'Peppers, tomato and cottage cheese baked in clay', 8.5, 1],
      ['Village salad', 'Tomato, cucumber, onion, olives and feta', 7, 1],
      ['Speca të mbushura', 'Peppers stuffed with rice and herbs', 8, 1],
    ] },
    grill: { photo: 'grill', items: [
      ['Mixed grill', 'Qofte, chicken skewers, lamb chops, chips and salad', 22],
      ['Qofte', 'Hand-rolled beef and lamb meatballs from the charcoal', 13.5],
      ['Chicken skewers', 'Marinated in yoghurt and oregano', 14],
      ['Grilled vegetables', 'Aubergine, courgette and peppers with garlic oil', 10, 1],
    ] },
    oven: { photo: 'byrek', items: [
      ['Byrek me spinaq', 'Hand-rolled filo with spinach and white cheese', 9, 1],
      ['Byrek me djathë', 'Hand-rolled filo with white cheese', 9, 1],
      ['Byrek me mish', 'Hand-rolled filo with spiced minced beef', 10],
      ['Tavë kosi', 'Lamb and rice baked in yoghurt', 16.5],
      ['Pite me kungull', 'Sweet pumpkin pie, the Sunday special', 8.5, 1],
    ] },
    sweet: { photo: 'baklava', items: [
      ['Baklava', 'Walnut and pistachio, soaked in honey syrup', 6.5, 1],
      ['Trileçe', 'Three-milk sponge with caramel', 7, 1],
      ['Kadaif', 'Shredded pastry with walnuts', 6.5, 1],
      ['Turkish coffee', 'Served with a piece of lokum', 3, 1],
    ] },
  }
  // Pre-order from the kitchen belt (belt/belt.js, source in src/lule-kitchen-belt).
  Object.assign(T.en, { 'pre.title': 'Dishes for your table', 'pre.note': 'We start cooking them when you arrive.', 'pre.total': 'Pre-order total', 'pre.remove': 'Remove one', 'pre.msg': 'Pre-order: ', 'pre.ok': ' Your dishes: ' })
  Object.assign(T.sq, { 'pre.title': 'Pjatat për tavolinën', 'pre.note': 'I nisim t\'i gatuajmë sapo të vini.', 'pre.total': 'Totali i porosisë', 'pre.remove': 'Hiq një', 'pre.msg': 'Porosi paraprake: ', 'pre.ok': ' Pjatat: ' })
  // Opening hours, Monday first: [open, close] in 24h, London time.
  var HOURS = [[12, 23], [12, 23], [12, 23], [12, 23], [12, 24], [11, 24], [11, 22]]
  var CREDITS = [
    ['Leeturtle', 'CC BY-SA 4.0'], ['Minja Klarić', 'CC BY-SA 4.0'], ['Kultigin', 'Public domain'], ['Maksym Kozlenko', 'CC BY-SA 4.0'],
    ['Andy Li', 'CC0'], ['Kevin Rechts', 'CC BY-SA 2.0'], ['Antti T. Nissinen', 'CC BY 2.0'], ['Premeditated Chaos', 'CC BY-SA 4.0'],
  ]

  var lang = 'en'
  try { if (localStorage.getItem('lule-lang') === 'sq') lang = 'sq' } catch (e) {}
  var tab = 'meze'
  var guests = 2

  function t(k) { return T[lang][k] }
  function hhmm(h) { return (h === 24 ? '00' : String(h).padStart(2, '0')) + ':00' }

  function londonNow() {
    var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date())
    var get = function (type) { return (parts.find(function (p) { return p.type === type }) || {}).value }
    var day = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(get('weekday'))
    return { day: day, hour: Number(get('hour')) % 24 + Number(get('minute')) / 60 }
  }

  function renderMenu() {
    var data = MENU[tab]
    $('#menu-list').innerHTML = ''
    data.items.forEach(function (it, i) {
      var el = document.createElement('div')
      el.className = 'dish'
      el.style.animationDelay = i * 60 + 'ms'
      var h = document.createElement('h3')
      h.textContent = it[0]
      if (it[3]) { var tag = document.createElement('span'); tag.className = 'tag'; tag.textContent = t('veg'); h.appendChild(tag) }
      var p = document.createElement('p'); p.textContent = it[1]
      var price = document.createElement('span'); price.className = 'price'; price.textContent = '£' + it[2].toFixed(2)
      el.appendChild(h); el.appendChild(price); el.appendChild(p)
      $('#menu-list').appendChild(el)
    })
    var img = $('#menu-photo')
    img.style.opacity = 0
    setTimeout(function () { img.src = 'img/' + data.photo + '-800.webp'; img.onload = function () { img.style.opacity = 1 } }, 200)
  }

  function renderHours() {
    var now = londonNow()
    var body = $('#hours')
    body.innerHTML = ''
    HOURS.forEach(function (h, i) {
      var tr = document.createElement('tr')
      if (i === now.day) tr.className = 'is-today'
      tr.innerHTML = '<td></td><td></td>'
      tr.children[0].textContent = t('days')[i]
      tr.children[1].textContent = hhmm(h[0]) + '–' + hhmm(h[1])
      body.appendChild(tr)
    })
    var today = HOURS[now.day]
    var open = now.hour >= today[0] && now.hour < today[1]
    var status = $('#open-status')
    status.className = 'status' + (open ? ' is-open' : '')
    status.textContent = open ? t('open') + hhmm(today[1]) : t('closed') + hhmm(now.hour < today[0] ? today[0] : HOURS[(now.day + 1) % 7][0])
  }

  function applyLang() {
    document.documentElement.lang = lang
    $$('[data-i18n]').forEach(function (el) { var v = t(el.getAttribute('data-i18n')); if (typeof v !== 'string') return; if (/<em>/.test(v)) el.innerHTML = v; else el.textContent = v })
    $$('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang)) })
    renderMenu(); renderHours(); renderFaq(); renderPre()
    window.dispatchEvent(new CustomEvent('lule:lang', { detail: lang }))
    $('#credits').textContent = 'Photos from Wikimedia Commons: ' + CREDITS.map(function (c) { return c[0] + ' (' + c[1] + ')' }).join(', ') + '. ' + t('film')
  }

  // Language
  $$('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { lang = b.getAttribute('data-lang'); try { localStorage.setItem('lule-lang', lang) } catch (e) {} ; applyLang() })
  })
  // Mobile menu
  var burger = $('.burger'), mobile = $('#mobile-menu')
  burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') !== 'true'
    burger.setAttribute('aria-expanded', String(open)); mobile.hidden = !open
  })
  $$('a', mobile).forEach(function (a) { a.addEventListener('click', function () { burger.setAttribute('aria-expanded', 'false'); mobile.hidden = true }) })
  // Tabs
  $$('[role="tab"]').forEach(function (b) {
    b.addEventListener('click', function () {
      tab = b.getAttribute('data-tab')
      $$('[role="tab"]').forEach(function (x) { x.setAttribute('aria-selected', String(x === b)) })
      renderMenu()
    })
  })
  // Lightbox
  var box = $('#lightbox')
  $$('.g').forEach(function (g) {
    g.addEventListener('click', function () { var img = $('img', box); img.src = g.getAttribute('data-full'); img.alt = $('img', g).alt; box.showModal() })
  })
  box.addEventListener('click', function (e) { if (e.target === box) box.close() })

  // Booking form
  var form = $('#book-form')
  var dateInput = form.elements.date
  var pad = function (n) { return String(n).padStart(2, '0') }
  var todayIso = function () { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) }
  dateInput.min = todayIso()
  dateInput.value = todayIso()
  function fillTimes() {
    var sel = form.elements.time
    var d = dateInput.value ? new Date(dateInput.value + 'T00:00') : new Date()
    var h = HOURS[(d.getDay() + 6) % 7]
    var isToday = dateInput.value === todayIso()
    var nowH = new Date().getHours() + new Date().getMinutes() / 60
    sel.innerHTML = ''
    for (var x = h[0]; x <= h[1] - 1.5; x += 0.5) {
      if (isToday && x <= nowH + 0.5) continue
      var o = document.createElement('option')
      o.textContent = pad(Math.floor(x)) + ':' + (x % 1 ? '30' : '00')
      sel.appendChild(o)
    }
    if (!sel.options.length) { var none = document.createElement('option'); none.value = ''; none.textContent = '—'; sel.appendChild(none) }
  }
  dateInput.addEventListener('change', fillTimes)
  fillTimes()
  var chips = $('#guest-chips')
  for (var g = 1; g <= 8; g++) {
    var b = document.createElement('button')
    b.type = 'button'; b.textContent = g === 8 ? '8+' : g; b.setAttribute('aria-pressed', String(g === guests)); b.dataset.n = g
    b.addEventListener('click', function (e) {
      guests = Number(e.currentTarget.dataset.n)
      $$('button', chips).forEach(function (x) { x.setAttribute('aria-pressed', String(Number(x.dataset.n) === guests)) })
    })
    chips.appendChild(b)
  }
  var clean = function (s, max) { return String(s).replace(/<[^>]*>/g, ' ').replace(/[<>\u0000-\u001f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max) }
  var last = 0
  form.addEventListener('submit', function (e) {
    e.preventDefault()
    if (Date.now() - last < 1500) return
    var status = $('#book-status')
    $$('[aria-invalid]', form).forEach(function (el) { el.removeAttribute('aria-invalid') })
    var fail = function (field, msg) { status.className = 'form-status is-error'; status.textContent = msg; form.elements[field].setAttribute('aria-invalid', 'true'); form.elements[field].focus() }
    var data = { date: dateInput.value, time: form.elements.time.value, name: clean(form.elements.name.value, 80), phone: clean(form.elements.phone.value, 25), guests: guests === 8 ? '8+' : guests }
    if (!data.date || data.date < todayIso()) return fail('date', t('err').date)
    if (!data.time) return fail('time', t('err').time)
    if (!data.name) return fail('name', t('err').name)
    if (!/^\+?[\d\s()-]{7,22}$/.test(data.phone)) return fail('phone', t('err').phone)
    last = Date.now()
    if (form.elements.website.value) { status.className = 'form-status is-ok'; status.textContent = t('ok')(data); return }
    var sb = $('#book-send'); sb.disabled = true; setTimeout(function () { sb.disabled = false }, 4000)
    status.className = 'form-status is-ok'
    status.textContent = t('ok')(data)
    if (pre.length) status.textContent += t('pre.ok') + preText() + '.'
    form.reset(); dateInput.value = todayIso(); fillTimes()
    pre = []; renderPre()
  })

  // Book via WhatsApp: the same details, written out as a message.
  $('#wa-book').addEventListener('click', function () {
    var f = function (k, v) { return t('wa.msg').split('{' + k + '}').join(v) }
    var msg = t('wa.msg').replace('{g}', guests === 8 ? '8+' : guests).replace('{d}', dateInput.value || '-').replace('{t}', form.elements.time.value || '-').replace('{n}', clean(form.elements.name.value, 80) || '-').replace('{x}', (pre.length ? t('pre.msg') + preText() + '. ' : '') + clean(form.elements.notes.value, 300))
    window.open('https://wa.me/442079460000?text=' + encodeURIComponent(msg.trim()), '_blank', 'noopener')
  })

  // Pre-order: dishes added on the kitchen belt go into the booking request and the WhatsApp message.
  var pre = []
  function preName(p) { return clean(p.names[lang] || p.names.en, 60) }
  function preText() { return pre.map(function (p) { return p.q + '× ' + preName(p) }).join(', ') }
  function renderPre() {
    var box = $('#preorder'), ul = $('#preorder-list'), total = 0, count = 0
    if (!box) return
    ul.innerHTML = ''
    pre.forEach(function (p) {
      total += p.price * p.q; count += p.q
      var li = document.createElement('li')
      li.innerHTML = '<span></span><b></b><button type="button" class="preorder__rm">−</button>'
      li.children[0].textContent = p.q + ' × ' + preName(p)
      li.children[1].textContent = '£' + (p.price * p.q).toFixed(2)
      li.children[2].setAttribute('aria-label', t('pre.remove') + ': ' + preName(p))
      li.children[2].addEventListener('click', function () { p.q--; if (p.q < 1) pre.splice(pre.indexOf(p), 1); renderPre() })
      ul.appendChild(li)
    })
    $('#preorder-total').textContent = '£' + total.toFixed(2)
    box.hidden = !count
    window.dispatchEvent(new CustomEvent('lule:preorder-count', { detail: count }))
  }
  window.addEventListener('lule:preorder', function (e) {
    var d = e.detail || {}
    if (typeof d.id !== 'string' || !d.names) return
    var hit = pre.find(function (p) { return p.id === d.id })
    if (hit) hit.q = Math.min(hit.q + 1, 20)
    else pre.push({ id: d.id, names: { en: String(d.names.en || ''), sq: String(d.names.sq || d.names.en || '') }, price: Math.max(0, Number(d.price) || 0), q: 1 })
    renderPre()
  })
  window.addEventListener('lule:belt-ready', renderPre)

  // FAQ
  function renderFaq() {
    var box = $('#faq-list'); box.innerHTML = ''
    t('faq').forEach(function (q) { var d = document.createElement('details'); d.innerHTML = '<summary></summary><p></p>'; d.firstChild.textContent = q[0]; d.lastChild.textContent = q[1]; box.appendChild(d) })
  }

  // Header turns solid after the film.
  var bar = $('#top-bar'), film = $('.film')
  function headerState() { bar.classList.toggle('is-solid', window.scrollY > (film.offsetTop + film.offsetHeight - window.innerHeight - 40)) }
  window.addEventListener('scroll', headerState, { passive: true }); headerState()

  // Cookies: nothing is tracked; the Google map loads only with consent.
  var store = { get: function (k) { try { return localStorage.getItem(k) } catch (e) { return null } }, set: function (k, v) { try { localStorage.setItem(k, v) } catch (e) {} } }
  var banner = $('#cookie')
  function loadMap() { var m = $('#map'); if (m.querySelector('iframe')) return; m.innerHTML = '<iframe title="Map of Green Lanes, London" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Green+Lanes,+London+N4&z=15&output=embed"></iframe>' }
  function choose(v) { store.set('lule-cookies', v); banner.hidden = true; if (v === 'yes') loadMap() }
  $('#cookie-yes').addEventListener('click', function () { choose('yes') })
  $('#cookie-no').addEventListener('click', function () { choose('no') })
  $('#cookie-reopen').addEventListener('click', function () { banner.hidden = false })
  $('#map-load').addEventListener('click', function () { choose('yes') })
  var choice = store.get('lule-cookies')
  if (choice === 'yes') loadMap()
  else if (!choice) {
    var shown = false, showB = function () { if (shown || store.get('lule-cookies')) return; shown = true; banner.hidden = false; window.removeEventListener('scroll', onS) }
    var onS = function () { if (window.scrollY > film.offsetTop + film.offsetHeight - window.innerHeight) showB() }
    window.addEventListener('scroll', onS, { passive: true }); setTimeout(showB, 20000)
  }

  // Privacy and terms
  var modal = $('#modal')
  $$('[data-open]').forEach(function (b) {
    b.addEventListener('click', function () { $('#modal-title').textContent = t(b.dataset.open === 'privacy' ? 'legal.privacy' : 'legal.terms'); $('#modal-body').innerHTML = t(b.dataset.open); modal.showModal() })
  })
  $('#modal-close').addEventListener('click', function () { modal.close() })
  modal.addEventListener('click', function (e) { if (e.target === modal) modal.close() })

  // Scroll reveals
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target) } })
    }, { rootMargin: '0px 0px -10% 0px' })
    $$('.reveal').forEach(function (el) { io.observe(el) })
  } else $$('.reveal').forEach(function (el) { el.classList.add('is-in') })

  // Kitchen belt: React bundle built from src/lule-kitchen-belt. Loads only when it scrolls near.
  var beltEl = $('#lule-belt')
  if (beltEl) {
    var loadBelt = function () {
      var link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'belt/belt.css'
      link.onload = link.onerror = function () { import('./belt/belt.js').catch(function () { beltEl.hidden = true }) }
      document.head.appendChild(link)
    }
    if ('IntersectionObserver' in window) {
      var bio = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { bio.disconnect(); loadBelt() } }, { rootMargin: '400px 0px' })
      bio.observe(beltEl)
    } else loadBelt()
  }

  applyLang()
  setInterval(renderHours, 60000)
})()
