// Joel Kaso portfolio: work grid with filters, EN/SQ, scroll motion, contact form that opens an email.
;(function () {
  var $ = function (s, r) { return (r || document).querySelector(s) }
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) }
  var EMAIL = 'joelkaso8@gmail.com'

  var WORK = [
    { id: 'avull-hammam', film: true, name: 'Avull Hammam & Spa', cat: 'local', tag: 'demo', where: { en: 'Hammam and spa · Stockbridge, Edinburgh', sq: 'Hammam dhe spa · Stockbridge, Edinburgh' },
      chips: { en: ['Candle film that plays as you scroll', '4-step booking with calendar and live slots', 'Find-your-ritual quiz', 'Gift voucher you can save', 'Quiet-times chart'], sq: ['Film qiriri që luan me scroll', 'Rezervim në 4 hapa me kalendar dhe orare', 'Kuiz për ritualin', 'Kupon dhuratë që ruhet', 'Grafik i orëve të qeta'] } },
    { id: 'ura-coffee', film: true, name: 'Ura Coffee Roasters', cat: 'food', tag: 'demo', where: { en: 'Coffee roastery · Glasgow, UK', sq: 'Furrë kafeje · Glasgow, Skoci' },
      chips: { en: ['Espresso film that plays as you scroll', 'Bean shop with bag', 'Subscription builder', 'Live café hours'], sq: ['Film espreso që luan me scroll', 'Dyqan kafeje me shportë', 'Abonim', 'Orari live'] } },
    { id: 'dallge-surf', film: true, name: 'Dallgë Surf School', cat: 'local', tag: 'demo', where: { en: 'Surf school · Newquay, Cornwall', sq: 'Shkollë surfi · Newquay, Angli' },
      chips: { en: ['Drone film that flies as you scroll', 'Tide-timed booking', 'Surf report', 'Hire calculator'], sq: ['Film me dron që fluturon me scroll', 'Rezervim sipas baticës', 'Raporti i valëve', 'Llogaritës qiraje'] } },
    { id: 'vreshta-estate', film: true, name: 'Vreshta Estate', cat: 'food', tag: 'demo', where: { en: 'Winery · Paso Robles, California', sq: 'Kantinë vere · Paso Robles, Kaliforni' },
      chips: { en: ['Vineyard flight as you scroll', '21+ age check', 'Tasting booking', 'Wine shop and club'], sq: ['Fluturim mbi vreshta me scroll', 'Kontroll moshe 21+', 'Rezervim degustimi', 'Dyqan vere dhe klub'] } },
    { id: 'grusht-boxing', film: true, name: 'Grusht Boxing Club', cat: 'local', tag: 'demo', where: { en: 'Boxing gym · Hackney, London', sq: 'Palestër boksi · Hackney, Londër' },
      chips: { en: ['Training film that plays as you scroll', 'Class timetable with booking', 'Round timer with bell', 'Membership calculator'], sq: ['Film stërvitjeje me scroll', 'Orari i klasave me rezervim', 'Kohëmatës raundesh me zile', 'Llogaritës anëtarësimi'] } },
    { id: 'shkume-carwash', film: true, name: 'Shkumë Car Wash', cat: 'local', tag: 'demo', where: { en: 'Car wash · Sterling Heights, Michigan', sq: 'Larje makinash · Sterling Heights, Miçigan' },
      chips: { en: ['Drive-through film as you scroll', 'Prices by vehicle size', 'Unlimited club calculator', 'Detail booking with time slots'], sq: ['Film larjeje me scroll', 'Çmime sipas makinës', 'Llogaritës abonimi', 'Rezervim me orare'] } },
    { id: 'pranvera-flowers', film: true, name: 'Pranvera Flowers', cat: 'local', tag: 'demo', where: { en: 'Flower studio · Clifton, Bristol', sq: 'Studio lulesh · Clifton, Bristol' },
      chips: { en: ['Rose that opens as you scroll', 'Bouquet builder with live preview', 'Same-day delivery check', 'Workshop booking'], sq: ['Trëndafil që çelet me scroll', 'Ndërto buqetën me pamje live', 'Kontroll dorëzimi të njëjtën ditë', 'Rezervim punëtorish'] } },
    { id: 'lule-kitchen', film: true, name: 'Lule Balkan Kitchen', cat: 'food', tag: 'demo', where: { en: 'Restaurant · London, UK', sq: 'Restorant · Londër, Angli' },
      chips: { en: ['Wood-fire film as you scroll', 'Menu with tabs', 'Table booking + WhatsApp', 'EN / SQ'], sq: ['Film me zjarr druri me scroll', 'Menu me kategori', 'Rezervim tavoline + WhatsApp', 'EN / SQ'] } },
    { id: 'northline-barbers', film: true, name: 'Northline Barbers', cat: 'local', tag: 'demo', where: { en: 'Barber shop · Manchester, UK', sq: 'Berberi · Mançester, Angli' },
      chips: { en: ['Barber film that plays as you scroll', '4-step booking with live free slots', 'Book via WhatsApp', 'EN / SQ'], sq: ['Film berberie me scroll', 'Rezervim në 4 hapa me orare të lira', 'Rezervo në WhatsApp', 'EN / SQ'] } },
    { id: 'kaso-ervehe', name: 'Hotel Kaso Ervehe', cat: 'stay', tag: 'client', where: { en: 'Family hotel · Përmet, Albania', sq: 'Hotel familjar · Përmet, Shqipëri' },
      chips: { en: ['Scroll film hero', 'Booking calendar', 'EN / SQ', 'Route on Google Maps', 'Bookings to Telegram'], sq: ['Film me scroll', 'Kalendar rezervimi', 'EN / SQ', 'Rruga në Google Maps', 'Rezervime në Telegram'] } },
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
      'nav.work': 'Work', 'nav.services': 'Services', 'nav.process': 'Process', 'nav.faq': 'FAQ', 'nav.contact': 'Contact',
      'hero.eyebrow': 'Web design & development · Albania → UK, EU, USA', 'hero.t1': 'Websites that', 'hero.t2': 'bring customers in.',
      'hero.lead': 'I design and build fast, custom websites for hotels, restaurants and local businesses, with direct booking, WhatsApp and two languages built in.',
      'plan.launch': 'launch price', 'viewer.want': 'I want a site like this', 'want.msg': "Hi Joel, I'd like a website like {name}.",
      'q.title': 'Quick quote', 'q.type': 'Your business', 'q.need': 'What you need', 'q.price': 'Launch price', 'q.send': 'Send on WhatsApp',
      'q.note': 'Everything you pick is included. One payment, no monthly fees.',
      'q.types': { stay: 'Hotel or guesthouse', food: 'Restaurant or café', beauty: 'Salon or barber', clinic: 'Clinic', trade: 'Trade or other' },
      'q.needs': { booking: 'Online booking', wa: 'WhatsApp button', menu: 'Menu or price list', langs: 'English and Albanian', gallery: 'Photo gallery', vouchers: 'Gift vouchers', google: 'Google Business Profile' },
      'q.msg': "Hi Joel, I'd like a quote for my {type}. I need: {needs}.",
      'hero.work': 'See the work', 'hero.quote': 'Get a quote',
      'work.title': 'Selected work', 'work.all': 'All', 'work.stay': 'Hotels', 'work.food': 'Food', 'work.local': 'Local services', 'work.film': 'Scroll film', open: 'Open the site →',
      'services.title': 'What you get', 'services.lead': 'Every site is designed for your business, not a template, and it is yours: no monthly lock-in.',
      'plan1.name': 'One-page site', 'plan1.for': 'For cafés, barbers and trades that need to be found and contacted.',
      'plan2.name': 'Business site with booking', 'plan2.for': 'For restaurants, salons and clinics that take bookings every day.',
      'plan3.name': 'Hotel & guesthouse', 'plan3.for': 'For places that want direct bookings instead of paying commission.',
      'plan.ask': 'Start with this', 'plan.popular': 'Most asked for',
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
      'offer.text': 'For my first 10 clients only (usually €800–1,200). Phone and desktop design, direct booking or orders, WhatsApp, map, two languages and Google Business Profile setup.',
      'faq.title': 'Common questions', 'faq.lead': 'Everything you need to know before we start.',
      'faq.q1': 'Are there any monthly fees after the site goes live?', 'faq.a1': 'No monthly lock-in with me. You pay once for the design and build, and the website is 100% yours. Your only ongoing cost is your annual domain name (around €10–15/year).',
      'faq.q2': 'How long does it take from start to finish?', 'faq.a2': 'Most websites go live within 1 to 2 weeks. You will see the first working version on your phone within 7 days of our initial call.',
      'faq.q3': 'Can I change prices, photos, or menus myself later?', 'faq.a3': 'Yes. When we launch, I send you a short video showing you exactly how to update your text, prices, and photos in minutes—no technical skills needed.',
      'faq.q4': 'How do bookings and orders reach me?', 'faq.a4': "However is easiest for you. Requests can go straight to your WhatsApp pre-filled with the customer's details, to your email, or into a booking calendar.",
      'faq.q5': 'How does payment work?', 'faq.a5': '50% to start the design, and the remaining 50% only when the website is finished, tested, and ready to go live.',
    },
    sq: {
      'nav.work': 'Punët', 'nav.services': 'Shërbimet', 'nav.process': 'Si punoj', 'nav.faq': 'Pyetje', 'nav.contact': 'Kontakt',
      'plan.launch': 'çmim fillimi', 'viewer.want': 'Dua një faqe si kjo', 'want.msg': 'Përshëndetje Joel, dua një faqe si {name}.',
      'q.title': 'Ofertë e shpejtë', 'q.type': 'Biznesi yt', 'q.need': 'Çfarë të duhet', 'q.price': 'Çmim fillimi', 'q.send': 'Dërgo në WhatsApp',
      'q.note': 'Gjithçka që zgjedh përfshihet. Një pagesë, pa pagesa mujore.',
      'q.types': { stay: 'Hotel ose bujtinë', food: 'Restorant ose kafene', beauty: 'Sallon ose berber', clinic: 'Klinikë', trade: 'Zanat ose tjetër' },
      'q.needs': { booking: 'Rezervim online', wa: 'Buton WhatsApp', menu: 'Menu ose çmime', langs: 'Anglisht dhe shqip', gallery: 'Galeri fotosh', vouchers: 'Kupona dhuratë', google: 'Profili në Google' },
      'q.msg': 'Përshëndetje Joel, dua një ofertë për biznesin tim ({type}). Më duhet: {needs}.',
      'hero.eyebrow': 'Dizajn dhe ndërtim websitesh · Shqipëri → Angli, BE, SHBA', 'hero.t1': 'Website që', 'hero.t2': 'sjellin klientë.',
      'hero.lead': 'Projektoj dhe ndërtoj website të shpejta, të bëra posaçërisht, për hotele, restorante dhe biznese lokale, me rezervim direkt, WhatsApp dhe dy gjuhë.',
      'hero.work': 'Shiko punët', 'hero.quote': 'Kërko ofertë',
      'work.title': 'Punë të zgjedhura', 'work.all': 'Të gjitha', 'work.stay': 'Hotele', 'work.food': 'Ushqim', 'work.local': 'Shërbime lokale', 'work.film': 'Film me scroll', open: 'Hap faqen →',
      'services.title': 'Çfarë merr', 'services.lead': 'Çdo faqe bëhet për biznesin tënd, jo nga shablloni, dhe është e jotja: pa pagesa mujore të detyruara.',
      'plan1.name': 'Faqe me një seksion', 'plan1.for': 'Për kafene, berberë dhe mjeshtër që duan të gjenden dhe të kontaktohen.',
      'plan2.name': 'Faqe biznesi me rezervim', 'plan2.for': 'Për restorante, sallone dhe klinika që marrin rezervime çdo ditë.',
      'plan3.name': 'Hotel dhe guesthouse', 'plan3.for': 'Për vende që duan rezervime direkte në vend të komisioneve.',
      'plan.ask': 'Fillo me këtë', 'plan.popular': 'Më e kërkuara',
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
      'offer.text': 'Vetëm për 10 klientët e mi të parë (zakonisht 800–1.200 €). Dizajn për telefon dhe kompjuter, rezervim ose porosi, WhatsApp, hartë, dy gjuhë dhe profili i biznesit në Google.',
      'faq.title': 'Pyetje të shpeshta', 'faq.lead': 'Gjithçka që duhet të dish para se të fillojmë.',
      'faq.q1': 'A ka pagesa mujore pasi faqja del online?', 'faq.a1': 'Me mua nuk ka pagesa mujore të detyruara. Paguan një herë për dizajnin dhe ndërtimin, dhe faqja është 100% e jotja. E vetmja kosto e vazhdueshme është domain-i çdo vit (rreth 10–15 € në vit).',
      'faq.q2': 'Sa zgjat nga fillimi deri në fund?', 'faq.a2': 'Shumica e faqeve dalin online brenda 1 deri 2 javësh. Versionin e parë që funksionon e sheh në telefon brenda 7 ditëve nga telefonata e parë.',
      'faq.q3': 'A mund t\'i ndryshoj vetë çmimet, fotot ose menunë më vonë?', 'faq.a3': 'Po. Kur e nisim, të dërgoj një video të shkurtër që të tregon saktësisht si t\'i ndryshosh tekstet, çmimet dhe fotot për pak minuta, pa njohuri teknike.',
      'faq.q4': 'Si më vijnë rezervimet dhe porositë?', 'faq.a4': 'Si të të vijë më lehtë. Kërkesat mund të shkojnë direkt në WhatsApp-in tënd me të dhënat e klientit të plotësuara, në email, ose në një kalendar rezervimesh.',
      'faq.q5': 'Si bëhet pagesa?', 'faq.a5': '50% për të nisur dizajnin, dhe 50% e mbetur vetëm kur faqja është mbaruar, testuar dhe gati për të dalë online.',
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
  viewer.addEventListener('close', function () {
    frame.src = 'about:blank'; document.body.style.overflow = ''
    if (/[?&]site=/.test(location.search)) history.replaceState(null, '', location.pathname + location.hash)
  })
  // Direct links: portfolio/?site=<id> opens the portfolio with that site already showing in the viewer.
  // Opening a site from the grid puts the same link in the address bar, so it can be copied and shared.
  var openViewerBase = openViewer
  openViewer = function (w) {
    openViewerBase(w)
    try { history.replaceState(null, '', location.pathname + '?site=' + w.id + location.hash) } catch (e) {}
  }
  function openFromLink() {
    var m = location.search.match(/[?&]site=([a-z0-9-]+)/i), w = m && WORK.find(function (x) { return x.id === m[1].toLowerCase() })
    if (w) openViewer(w)
  }
  $('#viewer-close').addEventListener('click', closeViewer)
  $$('[data-mode]', viewer).forEach(function (b) { b.addEventListener('click', function () { setMode(b.dataset.mode) }) })
  // Inside the viewer the demo's "back to the portfolio" ribbon closes the viewer instead.
  frame.addEventListener('load', function () {
    try {
      var ribbon = frame.contentDocument && frame.contentDocument.querySelector('.demo-ribbon, .demo-tag')
      if (ribbon) ribbon.addEventListener('click', function (e) { e.preventDefault(); closeViewer() })
    } catch (e) {}
  })

  // Quick quote: pick a business type and features; the message opens in WhatsApp ready to send.
  var Q = { type: 'food', needs: ['booking', 'wa', 'langs'] }
  var USUAL = { stay: 1200, food: 1000, beauty: 1000, clinic: 1000, trade: 800 }
  function renderQuote() {
    var types = T[lang]['q.types'], needs = T[lang]['q.needs']
    var tb = $('#q-type'), nb = $('#q-need'); tb.innerHTML = ''; nb.innerHTML = ''
    Object.keys(types).forEach(function (k) {
      var b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'radio'); b.textContent = types[k]; b.setAttribute('aria-checked', String(k === Q.type))
      b.addEventListener('click', function () { Q.type = k; renderQuote() }); tb.appendChild(b)
    })
    Object.keys(needs).forEach(function (k) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = needs[k]; b.setAttribute('aria-pressed', String(Q.needs.indexOf(k) >= 0))
      b.addEventListener('click', function () { var i = Q.needs.indexOf(k); if (i >= 0) Q.needs.splice(i, 1); else Q.needs.push(k); renderQuote() }); nb.appendChild(b)
    })
    var usual = Q.type === 'trade' && Q.needs.indexOf('booking') >= 0 ? 1000 : USUAL[Q.type]
    $('#q-usual').textContent = '€' + usual.toLocaleString('en-GB')
    var list = Object.keys(needs).filter(function (k) { return Q.needs.indexOf(k) >= 0 }).map(function (k) { return needs[k] })
    var msg = T[lang]['q.msg'].replace('{type}', types[Q.type].toLowerCase()).replace('{needs}', list.length ? list.join(', ') : '—')
    $('#q-send').href = 'https://wa.me/355685727406?text=' + encodeURIComponent(msg)
  }
  // "Start with this" on a plan picks that business type in the quick quote.
  $$('[data-quote]').forEach(function (a) { a.addEventListener('click', function () { Q.type = a.dataset.quote; renderQuote() }) })
  var baseApply = applyLang
  applyLang = function () { baseApply(); renderQuote() }

  // "I want a site like this" in the viewer: closes it and starts the message in the contact form.
  $('#viewer-want').addEventListener('click', function (e) {
    e.preventDefault()
    var name = $('#viewer-title').textContent
    closeViewer()
    form.elements.msg.value = T[lang]['want.msg'].replace('{name}', name)
    $('#contact').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    setTimeout(function () { form.elements.name.focus({ preventScroll: true }) }, 500)
  })

  $('#year').textContent = new Date().getFullYear()
  applyLang()
  openFromLink()
})()
