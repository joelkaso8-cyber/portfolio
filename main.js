// Joel Kaso portfolio: work grid with filters, EN/SQ, scroll motion, contact form that opens an email.
;(function () {
  var $ = function (s, r) { return (r || document).querySelector(s) }
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) }
  var EMAIL = 'joelkaso8@gmail.com'

  var WORK = [
    { id: 'ura-coffee', film: true, name: 'Ura Coffee Roasters', cat: 'food', tag: 'demo', where: { en: 'Coffee roastery · Glasgow, UK', sq: 'Furrë kafeje · Glasgow, Skoci' },
      chips: { en: ['Espresso film that plays as you scroll', 'Bean shop with bag', 'Subscription builder', 'Live café hours'], sq: ['Film espreso që luan me scroll', 'Dyqan kafeje me shportë', 'Abonim', 'Orari live'] } },
    { id: 'dallge-surf', film: true, name: 'Dallgë Surf School', cat: 'local', tag: 'demo', where: { en: 'Surf school · Newquay, Cornwall', sq: 'Shkollë surfi · Newquay, Angli' },
      chips: { en: ['Drone film that flies as you scroll', 'Tide-timed booking', 'Surf report', 'Hire calculator'], sq: ['Film me dron që fluturon me scroll', 'Rezervim sipas baticës', 'Raporti i valëve', 'Llogaritës qiraje'] } },
    { id: 'vreshta-estate', film: true, name: 'Vreshta Estate', cat: 'food', tag: 'demo', where: { en: 'Winery · Paso Robles, California', sq: 'Kantinë vere · Paso Robles, Kaliforni' },
      chips: { en: ['Vineyard flight as you scroll', '21+ age check', 'Tasting booking', 'Wine shop and club'], sq: ['Fluturim mbi vreshta me scroll', 'Kontroll moshe 21+', 'Rezervim degustimi', 'Dyqan vere dhe klub'] } },
    { id: 'kaso-ervehe', name: 'Hotel Kaso Ervehe', cat: 'stay', tag: 'client', where: { en: 'Family hotel · Përmet, Albania', sq: 'Hotel familjar · Përmet, Shqipëri' },
      chips: { en: ['Scroll film hero', 'Booking calendar', 'EN / SQ', 'Route on Google Maps', 'Bookings to Telegram'], sq: ['Film me scroll', 'Kalendar rezervimi', 'EN / SQ', 'Rruga në Google Maps', 'Rezervime në Telegram'] } },
    { id: 'lule-kitchen', name: 'Lule Balkan Kitchen', cat: 'food', tag: 'demo', where: { en: 'Restaurant · London, UK', sq: 'Restorant · Londër, Angli' },
      chips: { en: ['Menu with tabs', 'Table booking', 'Live opening hours', 'EN / SQ', 'Photo lightbox'], sq: ['Menu me kategori', 'Rezervim tavoline', 'Orari live', 'EN / SQ', 'Galeri'] } },
    { id: 'northline-barbers', name: 'Northline Barbers', cat: 'local', tag: 'demo', where: { en: 'Barber shop · Manchester, UK', sq: 'Berberi · Mançester, Angli' },
      chips: { en: ['4-step booking', 'Live free slots', 'Price list', 'Team with next free time'], sq: ['Rezervim në 4 hapa', 'Orare të lira live', 'Lista e çmimeve', 'Ekipi me orën e lirë'] } },
    { id: 'kala-build', name: 'Kala Build & Renovate', cat: 'local', tag: 'demo', where: { en: 'Renovation company · Birmingham, UK', sq: 'Kompani rinovimi · Birmingham, Angli' },
      chips: { en: ['Before / after slider', 'Price estimator', 'Postcode check', 'Quote form'], sq: ['Para / pas me rrëshqitje', 'Llogaritës çmimi', 'Kontroll i zonës', 'Formular oferte'] } },
    { id: 'aurelia-dental', name: 'Aurelia Dental Studio', cat: 'local', tag: 'demo', where: { en: 'Dental clinic · Leeds, UK', sq: 'Klinikë dentare · Lids, Angli' },
      chips: { en: ['Clear price list', 'Monthly payment calculator', 'Online booking', 'Next free appointment'], sq: ['Çmime të qarta', 'Llogaritës pagese mujore', 'Rezervim online', 'Takimi i lirë i radhës'] } },
    { id: 'sage-silk-beauty', name: 'Sage & Silk', cat: 'local', tag: 'demo', where: { en: 'Beauty studio · Bristol, UK', sq: 'Studio bukurie · Bristol, Angli' },
      chips: { en: ['Build your visit', 'Time and price add up', 'Gift voucher designer', 'Photo lightbox'], sq: ['Ndërto vizitën', 'Koha dhe çmimi mblidhen', 'Kupon dhurate', 'Galeri'] } },
    { id: 'kalaja-bakehouse', name: 'Kalaja Bakehouse', cat: 'food', tag: 'demo', where: { en: 'Albanian bakery · Bronx, New York', sq: 'Furrë shqiptare · Bronx, Nju Jork' },
      chips: { en: ['Order ahead with a basket', 'Pickup times', "Today's bake times", 'Catering estimate', 'EN / SQ'], sq: ['Porosi me shportë', 'Ora e marrjes', 'Oraret e furrës sot', 'Llogaritje kateringu', 'EN / SQ'] } },
    { id: 'ullishta', name: 'Ullishta', cat: 'stay', tag: 'concept', where: { en: 'Boutique hotel concept', sq: 'Koncept hoteli boutique' },
      chips: { en: ['Photo slideshow', 'Scroll motion', 'Booking calendar'], sq: ['Slideshow fotosh', 'Lëvizje me scroll', 'Kalendar rezervimi'] } },
    { id: 'vjosa-rafting', film: true, name: 'Vjosa Rafting', cat: 'local', tag: 'project', where: { en: 'Rafting trips · Vjosa river, Albania', sq: 'Rafting · lumi Vjosa, Shqipëri' },
      chips: { en: ['Video hero', 'River photo backgrounds', 'Built for phones'], sq: ['Video në hyrje', 'Sfonde me lumin', 'E ndërtuar për telefon'] } },
    { id: 'brolin-tattoo', film: true, name: 'Brolin Tattoo', cat: 'local', tag: 'project', where: { en: 'Tattoo studio', sq: 'Studio tatuazhesh' },
      chips: { en: ['Ink film hero', 'Work gallery', 'Dark editorial look'], sq: ['Film me bojë në hyrje', 'Galeri punësh', 'Pamje e errët editoriale'] } },
  ]
  var TAGS = { client: { en: 'Client', sq: 'Klient' }, demo: { en: 'Demo', sq: 'Demo' }, concept: { en: 'Concept', sq: 'Koncept' }, project: { en: 'Project', sq: 'Projekt' } }

  var T = {
    en: {
      'nav.work': 'Work', 'nav.services': 'Services', 'nav.process': 'Process', 'nav.contact': 'Contact',
      'hero.eyebrow': 'Web design & development · Albania → UK, EU, USA', 'hero.t1': 'Websites that', 'hero.t2': 'bring customers in.',
      'hero.lead': 'I design and build fast, good-looking websites for hotels, restaurants and local businesses, with booking, WhatsApp and two languages built in.',
      'hero.work': 'See the work', 'hero.quote': 'Get a quote',
      'work.title': 'Selected work', 'work.all': 'All', 'work.stay': 'Hotels', 'work.food': 'Food', 'work.local': 'Local services', 'work.film': 'Scroll film', open: 'Open the site →',
      'services.title': 'What you get', 'services.lead': 'Every site is designed for your business, not a template, and it is yours: no monthly lock-in.',
      'plan1.name': 'One-page site', 'plan1.for': 'For cafés, barbers and trades that need to be found and contacted.',
      'plan2.name': 'Business site with booking', 'plan2.for': 'For restaurants, salons and clinics that take bookings every day.',
      'plan3.name': 'Hotel & guesthouse', 'plan3.for': 'For places that want direct bookings instead of paying commission.',
      'plan.ask': 'Ask for a price', 'plan.popular': 'Most asked for',
      'plan1.items': ['Designed for phones first', 'WhatsApp and call buttons', 'Google Maps and opening hours', 'Ready in about a week'],
      'plan2.items': ['Everything in the one-page site', 'Online booking with a calendar', 'Menu or price list you can edit', 'Two languages', 'Google listing set up'],
      'plan3.items': ['Rooms, prices and photo slides', 'Direct booking requests to WhatsApp or Telegram', 'Blocked dates you control', 'Guest page with Wi-Fi and tips'],
      'process.title': 'How it works', 's1.t': 'Call', 's1.p': '20 minutes about your business and your customers.', 's2.t': 'Design', 's2.p': 'You see the first version within a week, on your phone.',
      's3.t': 'Build', 's3.p': 'Booking, WhatsApp, maps and languages, tested on every screen.', 's4.t': 'Live', 's4.p': 'Your own domain, Google listing and a short video on how to edit it.',
      'contact.title': "Let's build yours", 'contact.lead': 'Tell me about your business. I reply within a day, in English or Albanian.',
      'f.name': 'Name', 'f.business': 'Business', 'f.email': 'Email', 'f.msg': 'What do you need?', 'f.send': 'Send',
      'footer.note': 'Demo sites use made-up business names. Photos on demos: Wikimedia Commons, credited on each site.',
      err: { name: 'Write your name.', email: 'Write a full email address.' }, ok: 'Your email app is opening with the message ready. Press send there.',
      subject: 'Website enquiry', 'viewer.open': 'Open in new tab ↗',
      'offer.tag': 'Launch offer', 'offer.t1': 'A full website for', 'offer.cta': 'Claim a spot',
      'offer.text': 'For my first 10 clients only (usually €800–1,200). Phone and desktop design, booking or orders, WhatsApp, map, two languages and Google setup.',
    },
    sq: {
      'nav.work': 'Punët', 'nav.services': 'Shërbimet', 'nav.process': 'Si punoj', 'nav.contact': 'Kontakt',
      'hero.eyebrow': 'Dizajn dhe ndërtim websitesh · Shqipëri → Angli, BE, SHBA', 'hero.t1': 'Website që', 'hero.t2': 'sjellin klientë.',
      'hero.lead': 'Projektoj dhe ndërtoj website të shpejta dhe të bukura për hotele, restorante dhe biznese lokale, me rezervim, WhatsApp dhe dy gjuhë.',
      'hero.work': 'Shiko punët', 'hero.quote': 'Kërko ofertë',
      'work.title': 'Punë të zgjedhura', 'work.all': 'Të gjitha', 'work.stay': 'Hotele', 'work.food': 'Ushqim', 'work.local': 'Shërbime lokale', 'work.film': 'Film me scroll', open: 'Hap faqen →',
      'services.title': 'Çfarë merr', 'services.lead': 'Çdo faqe bëhet për biznesin tënd, jo nga shablloni, dhe është e jotja: pa pagesa mujore të detyruara.',
      'plan1.name': 'Faqe me një seksion', 'plan1.for': 'Për kafene, berberë dhe mjeshtër që duan të gjenden dhe të kontaktohen.',
      'plan2.name': 'Faqe biznesi me rezervim', 'plan2.for': 'Për restorante, sallone dhe klinika që marrin rezervime çdo ditë.',
      'plan3.name': 'Hotel dhe guesthouse', 'plan3.for': 'Për vende që duan rezervime direkte në vend të komisioneve.',
      'plan.ask': 'Pyet për çmimin', 'plan.popular': 'Më e kërkuara',
      'plan1.items': ['E projektuar fillimisht për telefon', 'Butona WhatsApp dhe telefon', 'Google Maps dhe orari', 'Gati për rreth një javë'],
      'plan2.items': ['Gjithçka nga faqja me një seksion', 'Rezervim online me kalendar', 'Menu ose çmime që i ndryshon vetë', 'Dy gjuhë', 'Profili në Google i rregulluar'],
      'plan3.items': ['Dhoma, çmime dhe foto', 'Kërkesa rezervimi direkt në WhatsApp ose Telegram', 'Data të zëna që i kontrollon vetë', 'Faqe për mysafirët me Wi-Fi dhe këshilla'],
      'process.title': 'Si punoj', 's1.t': 'Telefonatë', 's1.p': '20 minuta për biznesin dhe klientët e tu.', 's2.t': 'Dizajni', 's2.p': 'Versionin e parë e sheh brenda një jave, në telefon.',
      's3.t': 'Ndërtimi', 's3.p': 'Rezervim, WhatsApp, harta dhe gjuhë, të testuara në çdo ekran.', 's4.t': 'Online', 's4.p': 'Domain-i yt, profili në Google dhe një video e shkurtër si ta ndryshosh.',
      'contact.title': 'Le ta ndërtojmë tëndin', 'contact.lead': 'Më trego për biznesin tënd. Përgjigjem brenda një dite, shqip ose anglisht.',
      'f.name': 'Emri', 'f.business': 'Biznesi', 'f.email': 'Email', 'f.msg': 'Çfarë të duhet?', 'f.send': 'Dërgo',
      'footer.note': 'Faqet demo kanë emra biznesesh të shpikur. Fotot e demove: Wikimedia Commons, të përmendura në secilën faqe.',
      err: { name: 'Shkruaj emrin.', email: 'Shkruaj një email të plotë.' }, ok: 'Po hapet aplikacioni i emailit me mesazhin gati. Shtyp Dërgo atje.',
      subject: 'Kërkesë për website', 'viewer.open': 'Hap në skedë të re ↗',
      'offer.tag': 'Ofertë fillimi', 'offer.t1': 'Një website i plotë për', 'offer.cta': 'Rezervo një vend',
      'offer.text': 'Vetëm për 10 klientët e mi të parë (zakonisht 800–1.200 €). Dizajn për telefon dhe kompjuter, rezervim ose porosi, WhatsApp, hartë, dy gjuhë dhe vendosja në Google.',
    },
  }

  var lang = 'en'
  try { var st = localStorage.getItem('jk-lang'); if (st === 'sq' || st === 'en') lang = st; else if ((navigator.languages || []).some(function (l) { return /^sq/i.test(l) })) lang = 'sq' } catch (e) {}
  var filter = 'all'
  var matches = function (w) { return filter === 'all' || (filter === 'film' ? !!w.film : w.cat === filter) }

  function renderWork() {
    var grid = $('#work-grid'); grid.innerHTML = ''
    WORK.forEach(function (w, i) {
      var a = document.createElement('a')
      a.className = 'item reveal' + (!matches(w) ? ' is-hidden' : '')
      a.href = 'work/' + w.id + '/index.html'; a.target = '_blank'; a.rel = 'noopener noreferrer'
      a.style.transitionDelay = (i % 2) * 90 + 'ms'
      a.innerHTML = '<div class="item__shot"><img class="desk" loading="lazy" alt=""><img class="phone" loading="lazy" alt=""></div>' +
        '<div class="item__meta"><h3></h3><span class="tag"></span></div><p class="item__where"></p><ul class="chips"></ul><span class="item__open"></span>'
      var imgs = a.querySelectorAll('img')
      imgs[0].src = 'img/' + w.id + '-desk.webp'; imgs[0].alt = w.name + ', desktop'
      imgs[0].srcset = 'img/' + w.id + '-desk-600.webp 600w, img/' + w.id + '-desk.webp 1200w'
      imgs[0].sizes = '(min-width: 900px) 45vw, 92vw'
      imgs[1].src = 'img/' + w.id + '-phone.webp'; imgs[1].alt = w.name + ', phone'
      a.querySelector('h3').textContent = w.name
      var tag = a.querySelector('.tag'); tag.textContent = TAGS[w.tag][lang]; tag.classList.add('tag--' + w.tag)
      if (w.film) { var fb = document.createElement('span'); fb.className = 'film-badge'; fb.textContent = lang === 'sq' ? '▶ Film me scroll' : '▶ Scroll film'; a.querySelector('.item__shot').appendChild(fb) }
      a.querySelector('.item__where').textContent = w.where[lang]
      w.chips[lang].forEach(function (c) { var li = document.createElement('li'); li.textContent = c; a.querySelector('.chips').appendChild(li) })
      a.querySelector('.item__open').textContent = T[lang].open
      a.addEventListener('click', function (e) {
        // Ctrl/Cmd/Shift-click or middle-click still opens a real new tab.
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        openViewer(w)
      })
      grid.appendChild(a)
    })
    observe()
  }

  function applyLang() {
    document.documentElement.lang = lang
    $$('[data-i18n]').forEach(function (el) { var v = T[lang][el.getAttribute('data-i18n')]; if (typeof v === 'string') el.textContent = v })
    $$('[data-list]').forEach(function (ul) {
      ul.innerHTML = ''
      T[lang][ul.getAttribute('data-list')].forEach(function (x) { var li = document.createElement('li'); li.textContent = x; ul.appendChild(li) })
    })
    $$('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang)) })
    renderWork()
  }
  $$('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { lang = b.getAttribute('data-lang'); try { localStorage.setItem('jk-lang', lang) } catch (e) {} ; applyLang() })
  })
  $$('.filters button').forEach(function (b) {
    b.addEventListener('click', function () {
      filter = b.dataset.f
      $$('.filters button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)) })
      $$('.item').forEach(function (el, i) { el.classList.toggle('is-hidden', !matches(WORK[i])) })
    })
  })

  // Scroll motion: reveals, plus the hero screenshots drifting apart as you scroll.
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target) } })
  }, { rootMargin: '0px 0px -8% 0px' }) : null
  function observe() { $$('.reveal:not(.is-in)').forEach(function (el) { if (io) io.observe(el); else el.classList.add('is-in') }) }
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  var s1 = $('.s1'), s2 = $('.s2'), s3 = $('.s3'), ticking = false
  window.addEventListener('scroll', function () {
    if (reduce || ticking) return
    ticking = true
    requestAnimationFrame(function () {
      var y = Math.min(window.scrollY, 900)
      s1.style.transform = 'translate3d(0,' + (-y * 0.12) + 'px,0)'
      s2.style.transform = 'translate3d(' + (-y * 0.04) + 'px,' + (y * 0.06) + 'px,0)'
      s3.style.transform = 'translate3d(0,' + (-y * 0.22) + 'px,0)'
      ticking = false
    })
  }, { passive: true })

  // Contact: opens the visitor's email app with the message ready (no server needed).
  var form = $('#contact-form'), status = $('#contact-status')
  var clean = function (s, max) { return String(s).replace(/[<>\u0000-\u0008\u000b-\u001f]/g, ' ').trim().slice(0, max) }
  form.addEventListener('submit', function (e) {
    e.preventDefault()
    $$('[aria-invalid]', form).forEach(function (el) { el.removeAttribute('aria-invalid') })
    var name = clean(form.elements.name.value, 80), email = clean(form.elements.email.value, 120)
    var fail = function (f, msg) { status.className = 'form-status is-error'; status.textContent = msg; form.elements[f].setAttribute('aria-invalid', 'true'); form.elements[f].focus() }
    if (!name) return fail('name', T[lang].err.name)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('email', T[lang].err.email)
    if (form.elements.website.value) return
    var body = name + (form.elements.business.value ? ' · ' + clean(form.elements.business.value, 100) : '') + '\n' + email + '\n\n' + clean(form.elements.msg.value, 1000)
    status.className = 'form-status is-ok'; status.textContent = T[lang].ok
    window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(T[lang].subject + ': ' + name) + '&body=' + encodeURIComponent(body)
  })

  // Site viewer: the project opens full screen inside the portfolio (this also works where new tabs are blocked).
  var viewer = $('#viewer'), frame = $('#viewer-frame')
  function setMode(mode) {
    viewer.classList.toggle('is-phone', mode === 'phone')
    $$('[data-mode]', viewer).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.mode === mode)) })
  }
  function openViewer(w) {
    var url = 'work/' + w.id + '/index.html'
    $('#viewer-title').textContent = w.name
    $('#viewer-open').href = url
    frame.src = url
    setMode('desk')
    viewer.showModal()
    document.body.style.overflow = 'hidden'
  }
  function closeViewer() { viewer.close() }
  viewer.addEventListener('close', function () { frame.src = 'about:blank'; document.body.style.overflow = '' })
  $('#viewer-close').addEventListener('click', closeViewer)
  $$('[data-mode]', viewer).forEach(function (b) { b.addEventListener('click', function () { setMode(b.dataset.mode) }) })
  // Inside the viewer the demo's "back to the portfolio" ribbon closes the viewer instead.
  frame.addEventListener('load', function () {
    try {
      var ribbon = frame.contentDocument && frame.contentDocument.querySelector('.demo-ribbon')
      if (ribbon) ribbon.addEventListener('click', function (e) { e.preventDefault(); closeViewer() })
    } catch (e) {}
  })

  $('#year').textContent = new Date().getFullYear()
  applyLang()
})()
