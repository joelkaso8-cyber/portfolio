// Northline Barbers demo: EN/SQ, prices, team with next free slot, 4-step booking (+ WhatsApp booking), gallery,
// FAQ, live hours, cookie choice (the Google map loads only with consent), privacy/terms, header after the film.
;(function () {
  var $ = function (s, r) { return (r || document).querySelector(s) }
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) }
  var pad = function (n) { return String(n).padStart(2, '0') }
  var store = { get: function (k) { try { return localStorage.getItem(k) } catch (e) { return null } }, set: function (k, v) { try { localStorage.setItem(k, v) } catch (e) {} } }
  var WA = '441614960000'

  var T = {
    en: {
      ribbon: 'Demo by Joel Kaso ↗', 'brand.sub': 'Barbers · Est. 2019', 'nav.prices': 'Prices', 'nav.team': 'Barbers', 'nav.work': 'Work', 'nav.find': 'Find us',
      'cta.book': 'Book now', 'cta.chair': 'Book a chair', scroll: 'Scroll',
      'film.eyebrow': 'Northern Quarter · Manchester', 'film.h1b': 'Barbers',
      'film.2': 'Take a <em>seat.</em>', 'film.2s': 'Four leather chairs, coffee on the house, and no one rushing you.',
      'film.3': 'Sharp <em>lines.</em>', 'film.3s': 'Skin fades blended by hand, beards shaped with a straight razor and a hot towel.',
      'film.4': 'Your <em>chair.</em>', 'film.4s': 'Pick your barber and your time in thirty seconds, day or night.',
      ticker: 'SKIN FADE · BEARD SCULPT · HOT TOWEL SHAVE · KIDS CUT · LINE UP · SKIN FADE · BEARD SCULPT · HOT TOWEL SHAVE · KIDS CUT · LINE UP · ',
      'facts.rating': 'sample rating', 'facts.barbers': 'barbers', 'facts.days': 'days a week',
      'prices.title': 'Prices', 'prices.lead': 'Card, cash or Apple Pay. Students get 10% off Monday to Thursday.',
      'shop.eyebrow': 'The shop', 'shop.title': 'Old-school chairs, modern fades',
      'shop.text': 'Four leather chairs, a proper hot-towel steamer and coffee on the house. Walk-ins are welcome when a chair is free; the live board below always shows the next free slot.',
      'team.title': 'Barbers', 'team.lead': 'Choose who cuts you, or take the first free chair.', 'team.next': 'Next free:',
      'book.title': 'Book a chair', 'book.lead': 'Choose a service, a barber, a day and a time. Or send it all on WhatsApp.',
      'step.1': 'Service', 'step.2': 'Barber', 'step.3': 'Time', 'step.4': 'Details', back: 'Back',
      'f.name': 'Name', 'f.phone': 'Mobile / WhatsApp', 'f.confirm': 'Confirm booking', 'f.wa': 'Book via WhatsApp',
      any: 'First free chair', fastest: 'Fastest', min: 'min', today: 'Today', tomorrow: 'Tomorrow', nextweek: 'Next week', taken: 'taken',
      with: 'with', anyBarber: 'the first free barber', at: 'at',
      'err.name': 'Write your name.', 'err.phone': 'Write a mobile number so we can text the confirmation.',
      ok: 'Booked, {name}! {summary}. (Demo: a live site sends this to the shop on Telegram and texts you.)', ok2: 'Booked, {name}. See you soon.',
      'wa.msg': 'Hi Northline, I would like to book: {summary}. Name: {name}',
      'work.title': 'Work', 'work.lead': 'Tap to see it bigger.', 'faq.title': 'Good to know',
      'find.title': 'Find us', 'find.addr': 'Oldham Street, Manchester M1 · 3 min from Piccadilly Gardens', 'find.park': 'Parking: Church Street car park, 2 minutes away. Trams: Market Street.',
      'find.maps': 'Directions in Google Maps', 'map.show': 'Show the map', 'map.note': 'Loads Google Maps, which may set cookies.',
      'open.now': 'Open now · until {t}', 'open.closed': 'Closed now · opens {when}', 'open.at': 'at {t}', 'open.tomorrow': 'tomorrow at {t}',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      'foot.demo': 'A demo website with a made-up shop name, designed and built by Joel Kaso. Bookings here are a working demo and are not sent anywhere.',
      'legal.privacy': 'Privacy policy', 'legal.terms': 'Terms', 'legal.cookies': 'Cookie settings', 'legal.more': 'Read more',
      'cookie.text': 'This site uses no tracking. The map is from Google and can set cookies, so it loads only if you allow it.', 'cookie.yes': 'Accept', 'cookie.no': 'Decline',
      'bar.wa': 'WhatsApp', 'bar.call': 'Call', 'bar.book': 'Book a chair', credits: 'Photos from Wikimedia Commons:', film: 'Film made from these photos.',
    },
    sq: {
      ribbon: 'Demo nga Joel Kaso ↗', 'brand.sub': 'Berberë · që nga 2019', 'nav.prices': 'Çmimet', 'nav.team': 'Berberët', 'nav.work': 'Punët', 'nav.find': 'Na gjej',
      'cta.book': 'Rezervo', 'cta.chair': 'Rezervo një karrige', scroll: 'Rrëshqit',
      'film.eyebrow': 'Northern Quarter · Mançester', 'film.h1b': 'Barbers',
      'film.2': 'Ulu <em>rehat.</em>', 'film.2s': 'Katër karrige lëkure, kafe falas dhe askush nuk të nxiton.',
      'film.3': 'Vija të <em>pastra.</em>', 'film.3s': 'Fade të punuara me dorë, mjekra me brisk dhe peshqir të nxehtë.',
      'film.4': 'Karrigia <em>jote.</em>', 'film.4s': 'Zgjidh berberin dhe orën për tridhjetë sekonda, ditë ose natë.',
      ticker: 'FADE · MJEKËR · RROJE ME BRISK · FËMIJË · KONTURE · FADE · MJEKËR · RROJE ME BRISK · FËMIJË · KONTURE · ',
      'facts.rating': 'vlerësim shembull', 'facts.barbers': 'berberë', 'facts.days': 'ditë në javë',
      'prices.title': 'Çmimet', 'prices.lead': 'Kartë, para në dorë ose Apple Pay. Studentët kanë 10% ulje nga e hëna te e enjtja.',
      'shop.eyebrow': 'Dyqani', 'shop.title': 'Karrige të vjetra, fade moderne',
      'shop.text': 'Katër karrige lëkure, avull për peshqir të nxehtë dhe kafe falas. Mund të vish edhe pa rezervim kur ka karrige të lirë; tabela më poshtë tregon gjithmonë orën e lirë të radhës.',
      'team.title': 'Berberët', 'team.lead': 'Zgjidh kush të qeth, ose merr karrigen e parë të lirë.', 'team.next': 'E lirë:',
      'book.title': 'Rezervo një karrige', 'book.lead': 'Zgjidh shërbimin, berberin, ditën dhe orën. Ose dërgoje gjithçka në WhatsApp.',
      'step.1': 'Shërbimi', 'step.2': 'Berberi', 'step.3': 'Ora', 'step.4': 'Të dhënat', back: 'Mbrapa',
      'f.name': 'Emri', 'f.phone': 'Celular / WhatsApp', 'f.confirm': 'Konfirmo rezervimin', 'f.wa': 'Rezervo në WhatsApp',
      any: 'Karrigia e parë e lirë', fastest: 'Më e shpejta', min: 'min', today: 'Sot', tomorrow: 'Nesër', nextweek: 'Javën tjetër', taken: 'e zënë',
      with: 'me', anyBarber: 'berberin e parë të lirë', at: 'në',
      'err.name': 'Shkruaj emrin.', 'err.phone': 'Shkruaj një numër celulari që të dërgojmë konfirmimin.',
      ok: 'U rezervua, {name}! {summary}. (Demo: faqja e vërtetë ia dërgon dyqanit në Telegram dhe ty me mesazh.)', ok2: 'U rezervua, {name}. Shihemi së shpejti.',
      'wa.msg': 'Përshëndetje Northline, dua të rezervoj: {summary}. Emri: {name}',
      'work.title': 'Punët', 'work.lead': 'Prek për ta parë më të madhe.', 'faq.title': 'Mirë ta dish',
      'find.title': 'Na gjej', 'find.addr': 'Oldham Street, Mançester M1 · 3 minuta nga Piccadilly Gardens', 'find.park': 'Parkimi: Church Street, 2 minuta larg. Tramvaji: Market Street.',
      'find.maps': 'Rruga në Google Maps', 'map.show': 'Shfaq hartën', 'map.note': 'Hap Google Maps, që mund të vendosë cookies.',
      'open.now': 'Hapur tani · deri në {t}', 'open.closed': 'Mbyllur tani · hapet {when}', 'open.at': 'në {t}', 'open.tomorrow': 'nesër në {t}',
      days: ['Hën', 'Mar', 'Mër', 'Enj', 'Pre', 'Sht', 'Die'],
      'foot.demo': 'Faqe demo me emër dyqani të shpikur, e projektuar dhe ndërtuar nga Joel Kaso. Rezervimet këtu janë demo dhe nuk dërgohen askund.',
      'legal.privacy': 'Privatësia', 'legal.terms': 'Kushtet', 'legal.cookies': 'Cookies', 'legal.more': 'Lexo më shumë',
      'cookie.text': 'Kjo faqe nuk ju ndjek. Harta është e Google dhe mund të vendosë cookies, prandaj hapet vetëm me lejen tënde.', 'cookie.yes': 'Prano', 'cookie.no': 'Refuzo',
      'bar.wa': 'WhatsApp', 'bar.call': 'Telefono', 'bar.book': 'Rezervo', credits: 'Fotot nga Wikimedia Commons:', film: 'Filmi u bë nga këto foto.',
    },
  }
  var lang = store.get('nl-lang') || ((navigator.languages || []).some(function (l) { return /^sq/i.test(l) }) ? 'sq' : 'en')
  if (!T[lang]) lang = 'en'
  // Design your cut (fade.js)
  Object.assign(T.en, { 'nav.fade': 'Your cut', 'fade.title': 'Design your cut', 'fade.lead': 'Drag the fade line on the head or use the controls. We tell you what to ask for, who to book and what it costs.' })
  Object.assign(T.sq, { 'nav.fade': 'Prerja jote', 'fade.title': 'Krijo prerjen tënde', 'fade.lead': 'Tërhiq vijën e fade-it në kokë ose përdor kontrollet. Të themi çfarë të kërkosh, me kë të rezervosh dhe sa kushton.' })
  var t = function (k, v) { var s = T[lang][k] != null ? T[lang][k] : T.en[k]; if (v && typeof s === 'string') Object.keys(v).forEach(function (x) { s = s.split('{' + x + '}').join(v[x]) }); return s }

  // [name en, name sq, note en, note sq, minutes, price]
  var SERVICES = [
    ['Skin fade', 'Skin fade', 'Clipper fade to the skin, styled', 'Fade deri te lëkura, me stilim', 30, 24],
    ['Classic cut', 'Prerje klasike', 'Scissors or clippers, wash and style', 'Gërshërë ose makinë, larje dhe stilim', 30, 20],
    ['Beard sculpt', 'Mjekër', 'Shape, line-up and hot towel', 'Formë, konture dhe peshqir i nxehtë', 20, 14],
    ['Cut and beard', 'Prerje dhe mjekër', 'Any cut plus a full beard sculpt', 'Çdo prerje plus mjekër e plotë', 50, 34],
    ['Hot towel shave', 'Rroje me brisk', 'Straight razor, two towels, balm', 'Brisk, dy peshqirë, balsam', 30, 22],
    ['Kids cut (under 12)', 'Fëmijë (nën 12)', 'Any style, with patience', 'Çdo stil, me durim', 20, 14],
  ]
  var BARBERS = [
    ['Dan', 'Fades and line-ups. Ten years on the clippers.', 'Fade dhe konture. Dhjetë vjet me makinë.'],
    ['Arben', 'Scissor work and classic shaves. Speaks Albanian and Italian.', 'Punë me gërshërë dhe rroje klasike. Flet shqip dhe italisht.'],
    ['Leo', 'Beards, textured crops and kids who hate haircuts.', 'Mjekra, prerje me teksturë dhe fëmijë që nuk duan të qethen.'],
  ]
  var FAQ = [
    ['Do I need to book?', 'Duhet të rezervoj?', 'Walk-ins are welcome when a chair is free. Booking guarantees your time.', 'Mund të vish edhe pa rezervim kur ka karrige të lirë. Rezervimi ta siguron orën.'],
    ['How do I pay?', 'Si paguaj?', 'Card, Apple Pay, Google Pay or cash.', 'Me kartë, Apple Pay, Google Pay ose para në dorë.'],
    ['Can I cancel or move my booking?', 'Mund ta anuloj ose ta ndryshoj rezervimin?', 'Yes, free up to 2 hours before. Just message us on WhatsApp.', 'Po, falas deri 2 orë përpara. Na shkruaj në WhatsApp.'],
    ['Do you cut kids?', 'Qethni fëmijë?', 'Yes, from age 3. Leo is very patient.', 'Po, nga mosha 3 vjeç. Leo ka shumë durim.'],
  ]
  var HOURS = [[9, 19], [9, 19], [9, 20], [9, 20], [9, 20], [8, 18], [10, 16]]
  var CREDITS = [['Nenad Stojkovic', 'CC BY 2.0'], ['Wilfredor', 'CC0'], ['Mork', 'Public domain'], ['Joe Mabel', 'CC BY-SA 4.0'], ['Gkbediako', 'CC BY-SA 4.0'], ['Alvinategyeka', 'CC0'], ['Frank Schulenburg', 'CC BY-SA 3.0']]
  var L = function (row, en, sq) { return lang === 'sq' ? row[sq] : row[en] }

  // Header turns solid after the film.
  var bar = $('#top-bar'), film = $('.film')
  function headerState() { bar.classList.toggle('is-solid', window.scrollY > (film.offsetTop + film.offsetHeight - window.innerHeight - 40)) }
  window.addEventListener('scroll', headerState, { passive: true }); headerState()

  // Fake but stable availability: the same on every visit.
  function taken(dayKey, barber, minutes) { var s = dayKey + '|' + barber + '|' + minutes, h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h % 100 < 38 }
  function dayKey(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) }
  function slotsFor(date, barber, length) {
    var h = HOURS[(date.getDay() + 6) % 7], out = [], now = new Date()
    for (var m = h[0] * 60; m + length <= h[1] * 60; m += 15) {
      var at = new Date(date.getFullYear(), date.getMonth(), date.getDate(), Math.floor(m / 60), m % 60)
      var who = barber === 'Any' ? BARBERS.map(function (b) { return b[0] }) : [barber]
      out.push({ m: m, label: pad(Math.floor(m / 60)) + ':' + pad(m % 60), free: at > now && who.some(function (b) { return !taken(dayKey(date), b, m) }) })
    }
    return out
  }
  function nextFree(barber) {
    for (var i = 0; i < 7; i++) {
      var d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + i)
      var s = slotsFor(d, barber, 30).find(function (x) { return x.free })
      if (s) return (i === 0 ? t('today') : i === 1 ? t('tomorrow') : t('days')[(d.getDay() + 6) % 7]) + ' ' + s.label
    }
    return t('nextweek')
  }
  var locale = function () { return lang === 'sq' ? 'sq-AL' : 'en-GB' }

  // ---------- Render everything in the chosen language ----------
  function render() {
    document.documentElement.lang = lang
    $$('[data-i18n]').forEach(function (el) { var v = t(el.dataset.i18n); if (typeof v !== 'string') return; if (/<em>/.test(v)) el.innerHTML = v; else el.textContent = v })
    $$('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === lang)) })
    var pl = $('#price-list'); pl.innerHTML = ''
    SERVICES.forEach(function (s) {
      var li = document.createElement('li'); li.className = 'reveal is-in'; li.innerHTML = '<strong></strong><b></b><span></span>'
      li.children[0].textContent = L(s, 0, 1); li.children[1].textContent = '£' + s[5]; li.children[2].textContent = L(s, 2, 3) + ' · ' + s[4] + ' ' + t('min'); pl.appendChild(li)
    })
    var tl = $('#team-list'); tl.innerHTML = ''
    BARBERS.forEach(function (b) {
      var el = document.createElement('article'); el.className = 'barber reveal is-in'
      el.innerHTML = '<div class="mono"></div><h3></h3><p></p><p class="next"><span></span> <b></b></p>'
      el.querySelector('.mono').textContent = b[0][0]; el.querySelector('h3').textContent = b[0]; el.querySelector('p').textContent = L(b, 1, 2)
      el.querySelector('.next span').textContent = t('team.next'); el.querySelector('.next b').textContent = nextFree(b[0]); tl.appendChild(el)
    })
    var fl = $('#faq-list'); fl.innerHTML = ''
    FAQ.forEach(function (f) { var d = document.createElement('details'); d.innerHTML = '<summary></summary><p></p>'; d.firstChild.textContent = L(f, 0, 1); d.lastChild.textContent = L(f, 2, 3); fl.appendChild(d) })
    renderHours(); buildOptions(); if (state.step === 2 && state.service) renderDays(); show(state.step > 2 ? 0 : state.step)
    $('#credits').textContent = t('credits') + ' ' + CREDITS.map(function (c) { return c[0] + ' (' + c[1] + ')' }).join(', ') + '. ' + t('film')
  }
  $$('[data-lang]').forEach(function (b) { b.addEventListener('click', function () { lang = b.dataset.lang; store.set('nl-lang', lang); render() }) })

  // ---------- Booking ----------
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
  function buildOptions() {
    $('#opt-service').innerHTML = ''; $('#opt-barber').innerHTML = ''
    SERVICES.forEach(function (s) { option($('#opt-service'), L(s, 0, 1), s[4] + ' ' + t('min') + ' · £' + s[5], function () { state.service = s; show(1) }) })
    option($('#opt-barber'), t('any'), t('fastest'), function () { state.barber = 'Any'; renderDays(); show(2) })
    BARBERS.forEach(function (b) { option($('#opt-barber'), b[0], t('team.next') + ' ' + nextFree(b[0]), function () { state.barber = b[0]; renderDays(); show(2) }) })
  }
  function renderDays() {
    var box = $('#days'); box.innerHTML = ''
    for (var i = 0; i < 14; i++) {
      var d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + i)
      var b = document.createElement('button'); b.type = 'button'; b.className = 'day'; b.setAttribute('role', 'option')
      b.innerHTML = '<small></small><b></b><small></small>'
      b.children[0].textContent = i === 0 ? t('today') : t('days')[(d.getDay() + 6) % 7]
      b.children[1].textContent = d.getDate()
      b.children[2].textContent = d.toLocaleString(locale(), { month: 'short' })
      b.disabled = !slotsFor(d, state.barber, state.service[4]).some(function (x) { return x.free })
      b.setAttribute('aria-selected', 'false')
      ;(function (date, btn) { btn.addEventListener('click', function () { state.date = date; $$('.day', box).forEach(function (x) { x.setAttribute('aria-selected', String(x === btn)) }); renderSlots() }) })(d, b)
      box.appendChild(b)
    }
    var firstFree = $('.day:not(:disabled)', box); if (firstFree) firstFree.click()
  }
  function summaryText() {
    return L(state.service, 0, 1) + ' ' + t('with') + ' ' + (state.barber === 'Any' ? t('anyBarber') : state.barber) + ', ' +
      state.date.toLocaleDateString(locale(), { weekday: 'long', day: 'numeric', month: 'long' }) + ' ' + t('at') + ' ' + state.time + ' · £' + state.service[5] +
      (window.northlineCut ? ' · ' + String(window.northlineCut).slice(0, 120) : '')
  }
  function renderSlots() {
    var box = $('#slots'); box.innerHTML = ''
    slotsFor(state.date, state.barber, state.service[4]).forEach(function (s) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'slot'; b.textContent = s.label; b.disabled = !s.free
      b.setAttribute('aria-label', s.label + (s.free ? '' : ', ' + t('taken')))
      b.addEventListener('click', function () { state.time = s.label; $('#summary').textContent = summaryText(); show(3) })
      box.appendChild(b)
    })
  }
  $('#back').addEventListener('click', function () { show(Math.max(0, state.step - 1)) })
  var form = $('#details'), last = 0
  var clean = function (s, max) { return String(s).replace(/<[^>]*>/g, ' ').replace(/[<>\u0000-\u001f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max) }
  function check() {
    $$('[aria-invalid]', form).forEach(function (el) { el.removeAttribute('aria-invalid') })
    var name = clean(form.elements.name.value, 80), phone = clean(form.elements.phone.value, 25)
    var fail = function (f, k) { status.className = 'form-status is-error'; status.textContent = t(k); form.elements[f].setAttribute('aria-invalid', 'true'); form.elements[f].focus(); return null }
    if (name.length < 2) return fail('name', 'err.name')
    if (!/^\+?[\d\s()-]{7,22}$/.test(phone)) return fail('phone', 'err.phone')
    return { name: name, phone: phone }
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault()
    if (Date.now() - last < 3000) return
    var d = check(); if (!d) return
    last = Date.now()
    if (form.elements.website.value) return // honeypot
    var btn = $('#confirm'); btn.disabled = true
    status.className = 'form-status is-ok'; status.textContent = t('ok', { name: d.name, summary: $('#summary').textContent })
    form.reset(); $('#back').hidden = true
    setTimeout(function () { btn.disabled = false; show(0); status.className = 'form-status is-ok'; status.textContent = t('ok2', { name: d.name }) }, 6000)
  })
  $('#wa-book').addEventListener('click', function () {
    var name = clean(form.elements.name.value, 80) || '-'
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(t('wa.msg', { summary: $('#summary').textContent, name: name })), '_blank', 'noopener')
  })

  // ---------- Hours (Manchester time) ----------
  function renderHours() {
    var p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date())
    var g = function (k) { return (p.find(function (x) { return x.type === k }) || {}).value }
    var today = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(g('weekday')), now = Number(g('hour')) % 24 + Number(g('minute')) / 60
    var ul = $('#hours'); ul.innerHTML = ''
    HOURS.forEach(function (h, i) {
      var li = document.createElement('li'); if (i === today) li.className = 'is-today'
      li.innerHTML = '<span></span><span></span>'; li.children[0].textContent = t('days')[i]; li.children[1].textContent = pad(h[0]) + ':00–' + pad(h[1]) + ':00'; ul.appendChild(li)
    })
    var open = now >= HOURS[today][0] && now < HOURS[today][1], st = $('#open-status')
    st.className = 'status' + (open ? ' is-open' : '')
    st.textContent = open ? t('open.now', { t: pad(HOURS[today][1]) + ':00' }) : t('open.closed', { when: now < HOURS[today][0] ? t('open.at', { t: pad(HOURS[today][0]) + ':00' }) : t('open.tomorrow', { t: pad(HOURS[(today + 1) % 7][0]) + ':00' }) })
  }

  // ---------- Cookies and the map ----------
  var banner = $('#cookie')
  function loadMap() {
    var m = $('#map'); if (m.querySelector('iframe')) return
    m.innerHTML = '<iframe title="Map of Oldham Street, Manchester" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Oldham+Street,+Manchester&z=16&output=embed"></iframe>'
  }
  function choose(v) { store.set('nl-cookies', v); banner.hidden = true; if (v === 'yes') loadMap() }
  $('#cookie-yes').addEventListener('click', function () { choose('yes') })
  $('#cookie-no').addEventListener('click', function () { choose('no') })
  $('#cookie-reopen').addEventListener('click', function () { banner.hidden = false })
  $('#map-load').addEventListener('click', function () { choose('yes') })
  var choice = store.get('nl-cookies')
  if (choice === 'yes') loadMap()
  else if (!choice) {
    // Wait until the visitor is past the film, so the banner never covers it.
    var shown = false, showB = function () { if (shown || store.get('nl-cookies')) return; shown = true; banner.hidden = false; window.removeEventListener('scroll', onS) }
    var onS = function () { if (window.scrollY > film.offsetTop + film.offsetHeight - window.innerHeight) showB() }
    window.addEventListener('scroll', onS, { passive: true }); setTimeout(showB, 20000)
  }

  // ---------- Privacy and terms ----------
  var modal = $('#modal')
  var LEGAL = {
    privacy: {
      en: '<p>Demo text for a made-up shop.</p><h3>What we collect</h3><p>When you book: your name, mobile number and the booking details, used only to confirm and manage your appointment.</p><h3>Where it goes</h3><p>Bookings reach the shop on Telegram and are kept in the shop\'s Google Sheet for up to 12 months. We never sell your data.</p><h3>Cookies</h3><p>This site stores only your language and cookie choice. The Google map loads only after you allow it.</p><h3>Your rights</h3><p>Under UK GDPR you can ask to see, correct or delete your data: write to the shop. You can also contact the ICO (ico.org.uk).</p>',
      sq: '<p>Tekst demo për një dyqan të shpikur.</p><h3>Çfarë mbledhim</h3><p>Kur rezervon: emrin, numrin e celularit dhe detajet e rezervimit, vetëm për të konfirmuar takimin.</p><h3>Ku shkojnë</h3><p>Rezervimet i vijnë dyqanit në Telegram dhe ruhen deri në 12 muaj. Nuk i shesim kurrë të dhënat.</p><h3>Cookies</h3><p>Faqja ruan vetëm gjuhën dhe zgjedhjen për cookies. Harta e Google hapet vetëm me lejen tënde.</p><h3>Të drejtat</h3><p>Mund të kërkosh t\'i shohësh, ndryshosh ose fshish të dhënat: shkruaji dyqanit.</p>',
    },
    terms: {
      en: '<p>Demo text for a made-up shop.</p><h3>Bookings</h3><p>Free to cancel or move up to 2 hours before. If you are more than 10 minutes late we may need to shorten or move your cut.</p><h3>Prices</h3><p>Prices on this page are the shop prices; the barber confirms anything extra before starting.</p>',
      sq: '<p>Tekst demo për një dyqan të shpikur.</p><h3>Rezervimet</h3><p>Anulim ose ndryshim falas deri 2 orë përpara. Nëse vonohesh më shumë se 10 minuta, mund të duhet ta shkurtojmë ose ta shtyjmë qethjen.</p><h3>Çmimet</h3><p>Çmimet në faqe janë çmimet e dyqanit; berberi të thotë çdo shtesë para se të fillojë.</p>',
    },
  }
  $$('[data-open]').forEach(function (b) {
    b.addEventListener('click', function () { $('#modal-title').textContent = t(b.dataset.open === 'privacy' ? 'legal.privacy' : 'legal.terms'); $('#modal-body').innerHTML = LEGAL[b.dataset.open][lang]; modal.showModal() })
  })
  $('#modal-close').addEventListener('click', function () { modal.close() })
  modal.addEventListener('click', function (e) { if (e.target === modal) modal.close() })

  // ---------- Gallery and reveals ----------
  var box = $('#lightbox')
  $$('.g').forEach(function (g) { g.addEventListener('click', function () { var img = $('img', box); img.src = g.dataset.full; img.alt = $('img', g).alt; box.showModal() }) })
  box.addEventListener('click', function (e) { if (e.target === box) box.close() })
  render()
  // Design your cut (fade.js): loads only when its section scrolls near.
  var fadeSec = $('#fade')
  if (fadeSec) {
    var loadFade = function () { var sc = document.createElement('script'); sc.src = 'fade.js'; document.body.appendChild(sc) }
    if ('IntersectionObserver' in window) {
      var fdIo = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { fdIo.disconnect(); loadFade() } }, { rootMargin: '600px 0px' })
      fdIo.observe(fadeSec)
    } else loadFade()
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target) } }) }, { rootMargin: '0px 0px -10% 0px' })
    $$('.reveal:not(.is-in)').forEach(function (el) { io.observe(el) })
  } else $$('.reveal').forEach(function (el) { el.classList.add('is-in') })
})()
