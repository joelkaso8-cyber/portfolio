// Joel Kaso portfolio: work grid, EN/SQ, hero demo, savings slider, quote configurator, QR in the viewer, FAQ, contact form.
;(function () {
  var $ = function (s, r) { return (r || document).querySelector(s) }
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) }
  var EMAIL = 'joelkaso8@gmail.com'
  var BASE = 'https://joelkaso8-cyber.github.io/portfolio/'

  var WORK = [
    { id: 'kripe-taverna', name: 'Kripë Fish Taverna', cat: 'food', tag: 'demo', where: { en: 'Fish taverna · Himarë, Albania', sq: 'Tavernë peshku · Himarë, Shqipëri' },
      chips: { en: ['Painted-boat design', 'Today’s catch with kilos left', 'Hold a fish for your table', 'Book on WhatsApp', 'EN / SQ'], sq: ['Dizajn si barkë e lyer', 'Peshku i sotëm me kilogramët që mbeten', 'Mbaj një peshk për tavolinën', 'Rezervo në WhatsApp', 'EN / SQ'] } },
    { id: 'avull-hammam', film: true, name: 'Avull Hammam & Spa', cat: 'local', tag: 'demo', where: { en: 'Hammam and spa · Stockbridge, Edinburgh', sq: 'Hammam dhe spa · Stockbridge, Edinburgh' },
      chips: { en: ['Candle film that plays as you scroll', '4-step booking with calendar and live slots', 'Find-your-ritual quiz', 'Gift voucher you can save', 'Quiet-times chart'], sq: ['Film qiriri që luan me scroll', 'Rezervim në 4 hapa me kalendar dhe orare', 'Kuiz për ritualin', 'Kupon dhuratë që ruhet', 'Grafik i orëve të qeta'] } },
    { id: 'ura-coffee', film: true, name: 'Ura Coffee Roasters', cat: 'food', tag: 'demo', where: { en: 'Coffee roastery · Glasgow, UK', sq: 'Furrë kafeje · Glasgow, Skoci' },
      chips: { en: ['Espresso film that plays as you scroll', 'Bean shop with bag', 'Subscription builder', 'Live café hours'], sq: ['Film espreso që luan me scroll', 'Dyqan kafeje me shportë', 'Abonim', 'Orari live'] } },
    { id: 'balte-studio', film: true, name: 'Baltë Studio', cat: 'local', tag: 'demo', where: { en: 'Pottery studio · Tirana, Albania', sq: 'Studio qeramike · Tiranë, Shqipëri' },
      chips: { en: ['Clay film that plays as you scroll', 'Class booking on WhatsApp', 'Fanned photo gallery', 'Live opening hours', 'EN / SQ'], sq: ['Film balte që luan me scroll', 'Rezervim kursesh në WhatsApp', 'Galeri fotosh si freskore', 'Orari live', 'EN / SQ'] } },
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
  // Only these show in the portfolio. The other sites stay in work/; add an id here to show it again.
  var SHOWN = ['kripe-taverna', 'ura-coffee', 'balte-studio', 'lule-kitchen', 'kaso-ervehe', 'vjosa-rafting']
  WORK = WORK.filter(function (w) { return SHOWN.indexOf(w.id) !== -1 })
  var TAGS = { client: { en: 'Client', sq: 'Klient' }, demo: { en: 'Demo', sq: 'Demo' }, concept: { en: 'Concept', sq: 'Koncept' }, project: { en: 'Project', sq: 'Projekt' } }

  // Every visible text in both languages. index.html carries the English copy; data-i18n keys point here.
  var T = {
    en: {
      skip: 'Skip to content', title: 'Joel Kaso · Websites for small businesses',
      desc: 'Joel Kaso designs and builds fast, custom websites with direct booking, WhatsApp and English/Albanian, for hotels, restaurants and local businesses. From €400.',
      'nav.status': 'Available for 2 projects this month', 'nav.work': 'Work', 'nav.services': 'Services', 'nav.process': 'Process', 'nav.faq': 'FAQ', 'nav.contact': 'Contact',
      'hero.eyebrow': 'Web design & engineering studio · Albania → UK, EU & USA', 'hero.t1': 'Websites that turn visitors into', 'hero.t2': 'direct paying customers.',
      'hero.lead': 'Custom, fast websites for hotels, restaurants and local businesses, with a direct booking calendar, WhatsApp, two languages and no monthly platform lock-in.',
      'hero.quote': 'Get a quote', 'hero.work': 'See the work', 'hero.scroll': 'Scroll',
      'proof.1t': 'Fast on phones', 'proof.1p': 'hand-built, no page builders', 'proof.2t': '0% commission', 'proof.2p': 'on bookings that come direct', 'proof.3t': '7–14 days', 'proof.3p': 'from first call to live site',
      'roi.label': 'Your bookings a month', 'roi.pre': 'You keep about', 'roi.post': 'a month when those bookings come direct.',
      'roi.note': 'Worked out with an average booking of €100 and an 18% platform commission.', 'roi.vt': '{n} bookings a month, about {x} kept',
      'sim.aria': 'Try a live example', 'sim.hint': 'A working demo. Tap two choices, then the green button.',
      sim: {
        hotel: { url: 'kaso-ervehe.al', img: 'img/kaso-ervehe-desk-600.webp', title: 'Book a room in Përmet', l1: 'Check-in', l2: 'Nights', o2: ['1', '2', '3'], cta: 'Book on WhatsApp', toast: "Demo: your booking request just reached the hotel's WhatsApp and Telegram, with 0% commission." },
        coffee: { url: 'ura-coffee.co.uk', img: 'img/ura-coffee-desk-600.webp', title: 'Order fresh beans', l1: 'Beans', o1: ['Ethiopia', 'Colombia', 'House blend'], l2: 'Bag', o2: ['250 g', '1 kg'], cta: 'Order on WhatsApp', toast: "Demo: your order went straight to the roastery's WhatsApp, with no delivery-app cut." },
        food: { url: 'lule-kitchen.co.uk', img: 'img/lule-kitchen-desk-600.webp', title: 'Book a table tonight', l1: 'Guests', o1: ['2', '4', '6'], l2: 'Time', o2: ['19:00', '20:00', '21:00'], cta: 'Reserve on WhatsApp', toast: "Demo: your table request reached the restaurant's WhatsApp in seconds, with no booking fees." }
      },
      days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      'offer.tag': 'Launch offer', 'offer.t1': 'A full website for', 'offer.cta': 'Claim a spot',
      'offer.text': 'For my first 10 clients only (usually €800–1,200). Phone and desktop design, direct booking or orders, WhatsApp, map, two languages and Google Business Profile setup.',
      'case.tag': 'Featured case study', 'case.title': 'Hotel Kaso Ervehe, Përmet', 'case.lead': "My family's hotel in Përmet was my first real project. Here is what changed.",
      'case.alt': 'Home page of the Hotel Kaso Ervehe website', 'case.pt': 'The problem', 'case.pp': 'Up to 18% of every stay went to booking platforms as commission.',
      'case.st': 'The solution', 'case.items': ['A fast site of its own, in English and Albanian', 'A direct booking calendar', 'Booking alerts on Telegram', 'The route on Google Maps'],
      'case.s1': 'guest rating on Booking.com', 'case.s2': 'commission on direct reservations', 'case.s3': 'guests book in English or Albanian', 'case.cta': 'Open the hotel site in the live preview',
      'cmp.tag': 'Why custom', 'cmp.title': 'Built for you, or rented from a template', 'cmp.c0': 'What matters', 'cmp.c1': 'A custom site by Joel Kaso', 'cmp.c2': 'WordPress, Wix or an agency template',
      'cmp.r1': 'Speed', 'cmp.r1a': 'Hand-built and light, with no plugins. Tested with Google PageSpeed before it goes live.', 'cmp.r1b': 'Heavy themes and plugins often take 3 to 6 seconds to open on a phone.',
      'cmp.r2': 'Monthly fees', 'cmp.r2a': '€0 a month to me. You own the code and pay only for your domain, about €10–15 a year.', 'cmp.r2b': 'Often €30–100 a month for plugins, hosting and maintenance.',
      'cmp.r3': 'Security', 'cmp.r3a': 'No database and no plugins, so there is far less to attack and nothing to keep updating.', 'cmp.r3b': 'Plugins need constant updates, and an old one is a common way in.',
      'cmp.r4': 'Enquiries', 'cmp.r4a': 'Bookings and messages reach your WhatsApp or Telegram within seconds.', 'cmp.r4b': 'A generic contact form that often ends up in spam.',
      'work.tag': 'Live sites', 'work.title': 'Selected work', 'work.all': 'All', 'work.stay': 'Hotels & stays', 'work.food': 'Restaurants & food', 'work.local': 'Local services', 'work.film': 'Scroll film experiences',
      'cta.work': 'Get a site like these', open: 'Open the site →', shot: ', website screenshot', film: '▶ Scroll film',
      'services.tag': 'Packages', 'services.title': 'What you get', 'services.lead': 'Every site is designed for your business, not a template, and it is yours: no monthly lock-in.',
      'plan1.name': 'One-page site', 'plan1.for': 'For cafés, barbers and trades that need to be found and contacted.',
      'plan2.name': 'Business site with booking', 'plan2.for': 'For restaurants, salons and clinics that take bookings every day.',
      'plan3.name': 'Hotel & guesthouse', 'plan3.for': 'For places that want direct bookings instead of paying commission.',
      'plan.ask': 'Start with this', 'plan.popular': 'Most asked for', 'plan.launch': 'launch price',
      'plan1.items': ['Designed for phones first', 'WhatsApp and call buttons', 'Google Maps and opening hours', 'Ready in about a week'],
      'plan2.items': ['Everything in the one-page site', 'Online booking with a calendar', 'Menu or price list you can edit', 'Two languages', 'Google listing set up'],
      'plan3.items': ['Rooms, prices and photo slides', 'Direct booking requests to WhatsApp or Telegram', 'Blocked dates you control', 'Guest page with Wi-Fi and tips'],
      'q.tag': 'Quick quote', 'q.title': 'Plan your site in three steps', 'q.lead': 'Pick your business and what you need. You get the price and the timing straight away, and one tap sends it to me.',
      'q.s1': 'Your business', 'q.s2': 'Features', 'q.s3': 'Summary', 'q.type': 'What kind of business is it?', 'q.need': 'What should the site do?', 'q.sum': 'Your project',
      'q.d1': 'Business', 'q.d2': 'Features', 'q.d3': 'Estimated turnaround', 'q.d5': 'In the style of', 'q.price': 'Launch price',
      'q.note': 'Everything you pick is included. One payment, no monthly fees. 50% to start, 50% when it is ready.',
      'q.send': 'Send spec on WhatsApp', 'q.copy': 'Copy project brief', 'q.back': 'Back', 'q.next': 'Next',
      'q.copied': 'Copied. Paste it into an email or a message to me.', 'q.copyfail': 'Copying is blocked in this browser. Use the WhatsApp button instead.',
      'q.days': '{a}–{b} days', 'q.save': 'You save {x}',
      'q.types': { stay: 'Hotel or guesthouse', food: 'Restaurant or bar', beauty: 'Salon or clinic', trade: 'Local trade', other: 'Something else' },
      'q.needs': { booking: 'Direct booking system', wa: 'WhatsApp ordering', langs: 'English and Albanian', menu: 'Menu or price list you edit', google: 'Google Business Profile and local SEO', gallery: 'Photo gallery with lightbox', vouchers: 'Gift vouchers' },
      'q.msg': "Hi Joel, I'd like a website for my {type}.\nFeatures: {needs}.{like}\nEstimated turnaround: {time}. Launch price: €400.", 'q.like': '\nIn the style of: {name}.',
      'process.tag': 'How it works', 'process.title': 'From a call to a live site',
      's1.d': '20 minutes', 's1.t': 'Call', 's1.p': 'We talk about your business and your customers.',
      's2.d': 'Within 7 days', 's2.t': 'First look on your phone', 's2.p': 'You see a working first version on your own phone.',
      's3.d': 'Week two', 's3.t': 'Full build and polish', 's3.p': 'Booking, WhatsApp, maps and languages, tested on every screen.',
      's4.d': 'Launch day', 's4.t': 'Live, with a video guide', 's4.p': 'Your own domain, Google listing and a short video on how to edit it.',
      'g.title': 'You pay the second half only when it is ready', 'g.text': '50% deposit to start the work. The other 50% only when the site is tested, approved by you and ready to go live.',
      'about.tag': 'About', 'about.title': 'Who builds your site',
      'about.p1': "I'm Joel, a web designer from Albania. I build fast, good-looking websites for hotels, restaurants and local businesses. I do the design, the code and the setup myself, so you talk to one person.",
      'about.items': ['I reply within a day, in English or Albanian', 'Fixed price: 50% to start, 50% when it is finished', 'The site is yours, with no monthly fees'],
      'faq.tag': 'FAQ', 'faq.title': 'Common questions', 'faq.lead': 'Everything you need to know before we start.',
      'faq.q1': 'Are there any monthly fees after the site goes live?', 'faq.a1': 'No monthly lock-in with me. You pay once for the design and build, and the website is 100% yours. Your only ongoing cost is your annual domain name (around €10–15/year).',
      'faq.q2': 'How long does it take from start to finish?', 'faq.a2': 'Most websites go live within 1 to 2 weeks. You will see the first working version on your phone within 7 days of our initial call.',
      'faq.q3': 'Can I change prices, photos, or menus myself later?', 'faq.a3': 'Yes. When we launch, I send you a short video showing you exactly how to update your text, prices, and photos in minutes—no technical skills needed.',
      'faq.q4': 'How do bookings and orders reach me?', 'faq.a4': "However is easiest for you. Requests can go straight to your WhatsApp pre-filled with the customer's details, to your email, or into a booking calendar.",
      'faq.q5': 'How does payment work?', 'faq.a5': '50% to start the design, and the remaining 50% only when the website is finished, tested, and ready to go live.',
      'faq.q6': 'Who owns the domain and the website?', 'faq.a6': 'You do. The domain is registered in your name and the code is handed over to you, so you can move it or change designer whenever you like.',
      'contact.tag': 'Contact', 'contact.title': "Let's build yours", 'contact.lead': 'Tell me about your business. I reply within a day, in English or Albanian.',
      'f.name': 'Name', 'f.business': 'Business (optional)', 'f.email': 'Email', 'f.msg': 'What do you need?', 'f.send': 'Send',
      'f.note': 'Your message goes to my email through FormSubmit. I use it only to reply.',
      err: { name: 'Write your name.', email: 'Write a full email address.', rate: 'Too many messages in a short time. Wait a minute, or write to me on WhatsApp.' },
      ok: 'Your email app is opening with the message ready. Press send there.', sent: 'Thanks, your message is sent. I reply within a day.', sending: 'Sending…', subject: 'Website enquiry',
      'footer.note': 'Demo sites use made-up business names. Photos on demos: Wikimedia Commons, credited on each site.', 'footer.privacy': 'Privacy policy', 'footer.top': 'Back to top ↑',
      'viewer.desk': 'Desktop', 'viewer.phone': 'Phone', 'viewer.qr': 'Try it on your phone', 'viewer.qrhint': 'Point your phone camera at the code to open this site on your own phone.',
      'viewer.want': 'I want a site like this', 'viewer.open': 'Open in new tab ↗', 'wa.msg': "Hi Joel, I'd like a website."
    },
    sq: {
      skip: 'Kalo te përmbajtja', title: 'Joel Kaso · Website për biznese të vogla',
      desc: 'Joel Kaso projekton dhe ndërton website të shpejta me rezervim direkt, WhatsApp dhe dy gjuhë, për hotele, restorante dhe biznese lokale. Nga 400 €.',
      'nav.status': 'Vende të lira për 2 projekte këtë muaj', 'nav.work': 'Punët', 'nav.services': 'Shërbimet', 'nav.process': 'Si punoj', 'nav.faq': 'Pyetje', 'nav.contact': 'Kontakt',
      'hero.eyebrow': 'Studio dizajni dhe ndërtimi web · Shqipëri → Angli, BE dhe SHBA', 'hero.t1': 'Website që i kthejnë vizitorët në', 'hero.t2': 'klientë direkt dhe të rregullt.',
      'hero.lead': 'Website të shpejta, të bëra posaçërisht për hotele, restorante dhe biznese lokale, me kalendar rezervimi direkt, WhatsApp, dy gjuhë dhe pa pagesa mujore për platforma.',
      'hero.quote': 'Kërko ofertë', 'hero.work': 'Shiko punët', 'hero.scroll': 'Rrëshqit poshtë',
      'proof.1t': 'E shpejtë në telefon', 'proof.1p': 'e shkruar me kod, pa shabllone', 'proof.2t': '0% komision', 'proof.2p': 'për rezervimet që vijnë direkt', 'proof.3t': '7–14 ditë', 'proof.3p': 'nga telefonata e parë te faqja online',
      'roi.label': 'Rezervimet e tua në muaj', 'roi.pre': 'Mban rreth', 'roi.post': 'në muaj kur këto rezervime vijnë direkt.',
      'roi.note': 'Llogaritur me një rezervim mesatar 100 € dhe komision 18% të platformave.', 'roi.vt': '{n} rezervime në muaj, rreth {x} të mbajtura',
      'sim.aria': 'Provo një shembull', 'sim.hint': 'Një demo që funksionon. Prek dy zgjedhje, pastaj butonin jeshil.',
      sim: {
        hotel: { url: 'kaso-ervehe.al', img: 'img/kaso-ervehe-desk-600.webp', title: 'Rezervo një dhomë në Përmet', l1: 'Mbërritja', l2: 'Netë', o2: ['1', '2', '3'], cta: 'Rezervo në WhatsApp', toast: 'Demo: kërkesa për rezervim sapo arriti në WhatsApp dhe Telegram të hotelit, me 0% komision.' },
        coffee: { url: 'ura-coffee.co.uk', img: 'img/ura-coffee-desk-600.webp', title: 'Porosit kafe të freskët', l1: 'Kokrrat', o1: ['Etiopi', 'Kolumbi', 'Përzierja e shtëpisë'], l2: 'Paketimi', o2: ['250 g', '1 kg'], cta: 'Porosit në WhatsApp', toast: 'Demo: porosia shkoi direkt në WhatsApp të furrës së kafesë, pa komision aplikacioni.' },
        food: { url: 'lule-kitchen.co.uk', img: 'img/lule-kitchen-desk-600.webp', title: 'Rezervo një tavolinë sonte', l1: 'Persona', o1: ['2', '4', '6'], l2: 'Ora', o2: ['19:00', '20:00', '21:00'], cta: 'Rezervo në WhatsApp', toast: 'Demo: kërkesa për tavolinë arriti në WhatsApp të restorantit për pak sekonda, pa tarifa rezervimi.' }
      },
      days: ['Die', 'Hën', 'Mar', 'Mër', 'Enj', 'Pre', 'Sht'],
      'offer.tag': 'Ofertë fillimi', 'offer.t1': 'Një website i plotë për', 'offer.cta': 'Rezervo një vend',
      'offer.text': 'Vetëm për 10 klientët e mi të parë (zakonisht 800–1.200 €). Dizajn për telefon dhe kompjuter, rezervim direkt ose porosi, WhatsApp, hartë, dy gjuhë dhe profili i biznesit në Google.',
      'case.tag': 'Projekt i veçantë', 'case.title': 'Hotel Kaso Ervehe, Përmet', 'case.lead': 'Hoteli i familjes sime në Përmet ishte projekti im i parë real. Ja çfarë ndryshoi.',
      'case.alt': 'Faqja kryesore e website-it të Hotel Kaso Ervehe', 'case.pt': 'Problemi', 'case.pp': 'Deri në 18% e çdo qëndrimi shkonte si komision te platformat e rezervimit.',
      'case.st': 'Zgjidhja', 'case.items': ['Një faqe e shpejtë e vetja, në anglisht dhe shqip', 'Kalendar rezervimi direkt', 'Njoftime rezervimesh në Telegram', 'Rruga në Google Maps'],
      'case.s1': 'vlerësim i mysafirëve në Booking.com', 'case.s2': 'komision për rezervimet direkte', 'case.s3': 'mysafirët rezervojnë në anglisht ose shqip', 'case.cta': 'Hap faqen e hotelit në pamjen live',
      'cmp.tag': 'Pse me porosi', 'cmp.title': 'E ndërtuar për ty, apo e marrë me qira nga një shabllon', 'cmp.c0': 'Çfarë ka rëndësi', 'cmp.c1': 'Faqe me porosi nga Joel Kaso', 'cmp.c2': 'WordPress, Wix ose shabllon agjencie',
      'cmp.r1': 'Shpejtësia', 'cmp.r1a': 'E ndërtuar me dorë dhe e lehtë, pa plugin. E testuar me Google PageSpeed para se të dalë online.', 'cmp.r1b': 'Temat dhe plugin-et e rënda shpesh hapen për 3 deri 6 sekonda në telefon.',
      'cmp.r2': 'Pagesat mujore', 'cmp.r2a': '0 € në muaj për mua. Kodi është yti dhe paguan vetëm domain-in, rreth 10–15 € në vit.', 'cmp.r2b': 'Shpesh 30–100 € në muaj për plugin, hosting dhe mirëmbajtje.',
      'cmp.r3': 'Siguria', 'cmp.r3a': "Pa bazë të dhënash dhe pa plugin, ndaj ka shumë më pak për t'u sulmuar dhe asgjë për t'u përditësuar.", 'cmp.r3b': 'Plugin-et duan përditësime të vazhdueshme, dhe një i vjetër është një derë e zakonshme për sulme.',
      'cmp.r4': 'Kërkesat', 'cmp.r4a': 'Rezervimet dhe mesazhet të vijnë në WhatsApp ose Telegram për pak sekonda.', 'cmp.r4b': 'Një formular i zakonshëm që shpesh përfundon te spam-i.',
      'work.tag': 'Faqe online', 'work.title': 'Punë të zgjedhura', 'work.all': 'Të gjitha', 'work.stay': 'Hotele dhe akomodime', 'work.food': 'Restorante dhe ushqim', 'work.local': 'Shërbime lokale', 'work.film': 'Filma me scroll',
      'cta.work': 'Dua një faqe si këto', open: 'Hap faqen →', shot: ', pamje e faqes', film: '▶ Film me scroll',
      'services.tag': 'Paketat', 'services.title': 'Çfarë merr', 'services.lead': 'Çdo faqe bëhet për biznesin tënd, jo nga shablloni, dhe është e jotja: pa pagesa mujore të detyruara.',
      'plan1.name': 'Website me një faqe', 'plan1.for': 'Për kafene, berberë dhe mjeshtër që duan të gjenden dhe të kontaktohen.',
      'plan2.name': 'Faqe biznesi me rezervim', 'plan2.for': 'Për restorante, sallone dhe klinika që marrin rezervime çdo ditë.',
      'plan3.name': 'Hotel dhe bujtinë', 'plan3.for': 'Për vende që duan rezervime direkte në vend të komisioneve.',
      'plan.ask': 'Fillo me këtë', 'plan.popular': 'Më e kërkuara', 'plan.launch': 'çmim fillimi',
      'plan1.items': ['E projektuar fillimisht për telefon', 'Butona WhatsApp dhe telefon', 'Google Maps dhe orari', 'Gati për rreth një javë'],
      'plan2.items': ['Gjithçka nga website-i me një faqe', 'Rezervim online me kalendar', 'Menu ose çmime që i ndryshon vetë', 'Dy gjuhë', 'Profili në Google i rregulluar'],
      'plan3.items': ['Dhoma, çmime dhe foto', 'Kërkesa rezervimi direkt në WhatsApp ose Telegram', 'Data të zëna që i kontrollon vetë', 'Faqe për mysafirët me Wi-Fi dhe këshilla'],
      'q.tag': 'Ofertë e shpejtë', 'q.title': 'Planifiko faqen në tre hapa', 'q.lead': "Zgjidh biznesin dhe çfarë të duhet. Çmimin dhe kohën i sheh menjëherë, dhe me një prekje m'i dërgon mua.",
      'q.s1': 'Biznesi yt', 'q.s2': 'Funksionet', 'q.s3': 'Përmbledhja', 'q.type': 'Çfarë lloj biznesi ke?', 'q.need': 'Çfarë duhet të bëjë faqja?', 'q.sum': 'Projekti yt',
      'q.d1': 'Biznesi', 'q.d2': 'Funksionet', 'q.d3': 'Koha e përafërt', 'q.d5': 'Në stilin e', 'q.price': 'Çmim fillimi',
      'q.note': 'Gjithçka që zgjedh përfshihet. Një pagesë, pa pagesa mujore. 50% në fillim, 50% kur është gati.',
      'q.send': 'Dërgo projektin në WhatsApp', 'q.copy': 'Kopjo përmbledhjen', 'q.back': 'Prapa', 'q.next': 'Vazhdo',
      'q.copied': 'U kopjua. Ngjite në një email ose mesazh për mua.', 'q.copyfail': 'Kopjimi është i bllokuar në këtë shfletues. Përdor butonin WhatsApp.',
      'q.days': '{a}–{b} ditë', 'q.save': 'Kursen {x}',
      'q.types': { stay: 'Hotel ose bujtinë', food: 'Restorant ose bar', beauty: 'Sallon ose klinikë', trade: 'Zanat lokal', other: 'Diçka tjetër' },
      'q.needs': { booking: 'Sistem rezervimi direkt', wa: 'Porosi në WhatsApp', langs: 'Anglisht dhe shqip', menu: 'Menu ose çmime që i ndryshon vetë', google: 'Profili në Google dhe SEO lokale', gallery: 'Galeri fotosh', vouchers: 'Kupona dhuratë' },
      'q.msg': 'Përshëndetje Joel, dua një website për biznesin tim ({type}).\nFunksionet: {needs}.{like}\nKoha e përafërt: {time}. Çmimi i fillimit: 400 €.', 'q.like': '\nNë stilin e: {name}.',
      'process.tag': 'Si punoj', 'process.title': 'Nga telefonata te faqja online',
      's1.d': '20 minuta', 's1.t': 'Telefonatë', 's1.p': 'Flasim për biznesin dhe klientët e tu.',
      's2.d': 'Brenda 7 ditëve', 's2.t': 'Pamja e parë në telefon', 's2.p': 'Versionin e parë që funksionon e sheh në telefonin tënd.',
      's3.d': 'Java e dytë', 's3.t': 'Ndërtimi i plotë', 's3.p': 'Rezervim, WhatsApp, harta dhe gjuhë, të testuara në çdo ekran.',
      's4.d': 'Dita e nisjes', 's4.t': 'Online, me video udhëzuese', 's4.p': 'Domain-i yt, profili në Google dhe një video e shkurtër si ta ndryshosh.',
      'g.title': 'Gjysmën e dytë e paguan vetëm kur faqja është gati', 'g.text': '50% paradhënie për të nisur punën. 50% e tjetër vetëm kur faqja është testuar, e miratuar nga ti dhe gati për të dalë online.',
      'about.tag': 'Rreth meje', 'about.title': 'Kush e ndërton faqen tënde',
      'about.p1': 'Jam Joel, dizajner web nga Shqipëria. Ndërtoj faqe të shpejta dhe të bukura për hotele, restorante dhe biznese lokale. Dizajnin, kodin dhe konfigurimin i bëj vetë, ndaj flet me një person të vetëm.',
      'about.items': ['Përgjigje brenda një dite, në anglisht ose shqip', 'Çmim fiks: 50% në fillim, 50% kur përfundon', 'Faqja është e jotja, pa pagesa mujore'],
      'faq.tag': 'Pyetje', 'faq.title': 'Pyetje të shpeshta', 'faq.lead': 'Gjithçka që duhet të dish para se të fillojmë.',
      'faq.q1': 'A ka pagesa mujore pasi faqja del online?', 'faq.a1': 'Me mua nuk ka pagesa mujore të detyruara. Paguan një herë për dizajnin dhe ndërtimin, dhe faqja është 100% e jotja. E vetmja kosto e vazhdueshme është domain-i çdo vit (rreth 10–15 € në vit).',
      'faq.q2': 'Sa zgjat nga fillimi deri në fund?', 'faq.a2': 'Shumica e faqeve dalin online brenda 1 deri 2 javësh. Versionin e parë që funksionon e sheh në telefon brenda 7 ditëve nga telefonata e parë.',
      'faq.q3': "A mund t'i ndryshoj vetë çmimet, fotot ose menunë më vonë?", 'faq.a3': "Po. Kur e nisim, të dërgoj një video të shkurtër që të tregon saktësisht si t'i ndryshosh tekstet, çmimet dhe fotot për pak minuta, pa njohuri teknike.",
      'faq.q4': 'Si më vijnë rezervimet dhe porositë?', 'faq.a4': 'Si të të vijë më lehtë. Kërkesat mund të shkojnë direkt në WhatsApp-in tënd me të dhënat e klientit të plotësuara, në email, ose në një kalendar rezervimesh.',
      'faq.q5': 'Si bëhet pagesa?', 'faq.a5': '50% për të nisur dizajnin, dhe 50% e mbetur vetëm kur faqja është mbaruar, testuar dhe gati për të dalë online.',
      'faq.q6': 'Kujt i përket domain-i dhe faqja?', 'faq.a6': 'Ty. Domain-i regjistrohet në emrin tënd dhe kodi të dorëzohet ty, ndaj mund ta lëvizësh ose të ndryshosh dizajner kur të duash.',
      'contact.tag': 'Kontakt', 'contact.title': 'Le ta ndërtojmë tëndin', 'contact.lead': 'Më trego për biznesin tënd. Përgjigjem brenda një dite, shqip ose anglisht.',
      'f.name': 'Emri', 'f.business': 'Biznesi (jo i detyrueshëm)', 'f.email': 'Email', 'f.msg': 'Çfarë të duhet?', 'f.send': 'Dërgo',
      'f.note': "Mesazhi shkon në emailin tim përmes FormSubmit. E përdor vetëm për t'u përgjigjur.",
      err: { name: 'Shkruaj emrin.', email: 'Shkruaj një email të plotë.', rate: 'Shumë mesazhe në pak kohë. Prit një minutë, ose më shkruaj në WhatsApp.' },
      ok: 'Po hapet aplikacioni i emailit me mesazhin gati. Shtyp Dërgo atje.', sent: 'Faleminderit, mesazhi u dërgua. Përgjigjem brenda një dite.', sending: 'Po dërgohet…', subject: 'Kërkesë për website',
      'footer.note': 'Faqet demo kanë emra biznesesh të shpikur. Fotot e demove: Wikimedia Commons, të përmendura në secilën faqe.', 'footer.privacy': 'Politika e privatësisë', 'footer.top': 'Kthehu lart ↑',
      'viewer.desk': 'Kompjuter', 'viewer.phone': 'Telefon', 'viewer.qr': 'Provoje në telefon', 'viewer.qrhint': 'Drejtoje kamerën e telefonit te kodi për ta hapur këtë faqe në telefonin tënd.',
      'viewer.want': 'Dua një faqe si kjo', 'viewer.open': 'Hap në skedë të re ↗', 'wa.msg': 'Përshëndetje Joel, dua një website.'
    }
  }

  var lang = 'en'
  try { var st = localStorage.getItem('jk-lang'); if (st === 'sq' || st === 'en') lang = st; else if ((navigator.languages || []).some(function (l) { return /^sq/i.test(l) })) lang = 'sq' } catch (e) {}
  // ?lang=sq or ?lang=en in the address wins, so each language has its own link for Google and for sharing.
  var ql = (location.search.match(/[?&]lang=(en|sq)\b/) || [])[1]; if (ql) lang = ql
  var pageUrl = function () { return location.pathname + (lang === 'sq' ? '?lang=sq' : '') + location.hash }
  var t = function (k) { return T[lang][k] }
  var money = function (n) { return lang === 'sq' ? n.toLocaleString('de-DE') + ' €' : '€' + n.toLocaleString('en-GB') }
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  var filter = 'all'
  var matches = function (w) { return filter === 'all' || (filter === 'film' ? !!w.film : w.cat === filter) }

  // Cursor spotlight on cards (mouse screens only).
  function spot(el) {
    if (!fine || el.dataset.spot) return
    el.dataset.spot = '1'
    el.addEventListener('pointermove', function (e) { var r = el.getBoundingClientRect(); el.style.setProperty('--mx', (e.clientX - r.left) + 'px'); el.style.setProperty('--my', (e.clientY - r.top) + 'px') })
  }

  function renderWork() {
    var grid = $('#work-grid'); grid.innerHTML = ''
    WORK.forEach(function (w, i) {
      var a = document.createElement('a')
      a.className = 'item spot reveal' + (!matches(w) ? ' is-hidden' : '')
      a.href = 'work/' + w.id + '/index.html'; a.target = '_blank'; a.rel = 'noopener noreferrer'
      a.style.transitionDelay = (i % 2) * 90 + 'ms'
      a.innerHTML = '<div class="item__shot"><img class="desk" loading="lazy" decoding="async" alt=""><img class="phone" loading="lazy" decoding="async" alt=""></div>' +
        '<div class="item__meta"><h3></h3><span class="badge"></span></div><p class="item__where"></p><ul class="chips"></ul><span class="item__open"></span>'
      var imgs = a.querySelectorAll('img')
      imgs[0].width = 1200; imgs[0].height = 750; imgs[1].width = 390; imgs[1].height = 844
      imgs[0].src = 'img/' + w.id + '-desk.webp'; imgs[0].alt = w.name + t('shot')
      imgs[0].srcset = 'img/' + w.id + '-desk-600.webp 600w, img/' + w.id + '-desk.webp 1200w'
      imgs[0].sizes = '(min-width: 900px) 45vw, 92vw'
      imgs[1].srcset = 'img/' + w.id + '-phone-260.webp 260w, img/' + w.id + '-phone.webp 390w'; imgs[1].sizes = '(min-width: 900px) 10vw, 21vw'
      imgs[1].src = 'img/' + w.id + '-phone.webp' // alt stays empty: the desktop shot already names the site
      a.querySelector('h3').textContent = w.name
      var tag = a.querySelector('.badge'); tag.textContent = TAGS[w.tag][lang]; tag.classList.add('badge--' + w.tag)
      if (w.film) { var fb = document.createElement('span'); fb.className = 'film-badge'; fb.textContent = t('film'); a.querySelector('.item__shot').appendChild(fb) }
      a.querySelector('.item__where').textContent = w.where[lang]
      w.chips[lang].forEach(function (c) { var li = document.createElement('li'); li.textContent = c; a.querySelector('.chips').appendChild(li) })
      a.querySelector('.item__open').textContent = t('open')
      a.addEventListener('click', function (e) {
        // Ctrl/Cmd/Shift-click or middle-click still opens a real new tab.
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        openViewer(w)
      })
      spot(a)
      grid.appendChild(a)
    })
    observe()
  }

  function setAttr(sel, attr, val) { var el = $(sel); if (el) el.setAttribute(attr, val) }
  function applyLang() {
    var tt = T[lang], url = BASE + (lang === 'sq' ? '?lang=sq' : '')
    document.documentElement.lang = lang
    document.title = tt.title
    ;['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]'].forEach(function (s) { setAttr(s, 'content', tt.desc) })
    ;['meta[property="og:title"]', 'meta[name="twitter:title"]'].forEach(function (s) { setAttr(s, 'content', tt.title) })
    setAttr('link[rel="canonical"]', 'href', url); setAttr('meta[property="og:url"]', 'content', url)
    $$('[data-wa]').forEach(function (a) { a.href = 'https://wa.me/355685727406?text=' + encodeURIComponent(tt['wa.msg']) })
    $$('[data-privacy]').forEach(function (a) { a.setAttribute('href', 'privacy.html' + (lang === 'sq' ? '#sq' : '')) })
    $$('[data-i18n]').forEach(function (el) { var v = tt[el.getAttribute('data-i18n')]; if (typeof v === 'string') el.textContent = v })
    $$('[data-i18n-alt]').forEach(function (el) { el.alt = tt[el.getAttribute('data-i18n-alt')] })
    $$('[data-i18n-aria]').forEach(function (el) { el.setAttribute('aria-label', tt[el.getAttribute('data-i18n-aria')]) })
    $$('[data-list]').forEach(function (ul) {
      ul.innerHTML = ''
      tt[ul.getAttribute('data-list')].forEach(function (x) { var li = document.createElement('li'); li.textContent = x; ul.appendChild(li) })
    })
    $$('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang)) })
    renderWork(); renderSim(); renderRoi(); buildOpts(); renderQuote()
  }

  $$('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { lang = b.getAttribute('data-lang'); try { localStorage.setItem('jk-lang', lang); history.replaceState(null, '', pageUrl()) } catch (e) {} ; applyLang() })
  })
  $$('.filters button').forEach(function (b) {
    b.addEventListener('click', function () {
      filter = b.dataset.f
      $$('.filters button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)) })
      $$('.item').forEach(function (el, i) { el.classList.toggle('is-hidden', !matches(WORK[i])) })
    })
  })
  $$('.spot').forEach(spot)

  // Scroll reveals.
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target) } })
  }, { rootMargin: '0px 0px -8% 0px' }) : null
  function observe() { $$('.reveal:not(.is-in)').forEach(function (el) { if (io) io.observe(el); else el.classList.add('is-in') }) }

  // Hero demo: three small working sites inside a device. Pick two options, press the button, see what the owner would receive.
  var SIMK = 'hotel', simSel = [null, null], toastTimer = 0
  function nextDays() {
    var out = [], d = new Date()
    for (var i = 1; i <= 3; i++) { var x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i); out.push(t('days')[x.getDay()] + ' ' + x.getDate()) }
    return out
  }
  function fillChips(box, list, n) {
    var act = document.activeElement, keep = act && act.parentNode === box ? act.dataset.i : null // the chips are rebuilt, so focus goes back afterwards
    box.textContent = ''
    list.forEach(function (x, i) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.dataset.i = i; b.textContent = x
      b.setAttribute('aria-pressed', String(simSel[n] === i))
      b.addEventListener('click', function () { simSel[n] = i; renderSim() })
      box.appendChild(b)
    })
    if (keep !== null) { var again = box.querySelector('[data-i="' + keep + '"]'); if (again) again.focus() }
  }
  function renderSim() {
    var s = t('sim')[SIMK], img = $('#sim-img')
    $('#sim-url').textContent = s.url
    if (img.getAttribute('src') !== s.img) img.src = s.img
    $('#sim-title').textContent = s.title; $('#sim-l1').textContent = s.l1; $('#sim-l2').textContent = s.l2; $('#sim-cta-t').textContent = s.cta
    fillChips($('#sim-o1'), SIMK === 'hotel' ? nextDays() : s.o1, 0)
    fillChips($('#sim-o2'), s.o2, 1)
    $('#sim-cta').disabled = simSel[0] === null || simSel[1] === null
    $$('[data-sim]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.sim === SIMK)) })
  }
  $$('[data-sim]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.dataset.sim === SIMK) return
      SIMK = b.dataset.sim; simSel = [null, null]
      var scr = $('#sim-screen'); scr.classList.remove('is-swap'); void scr.offsetWidth; scr.classList.add('is-swap')
      $('#sim-toast').classList.remove('is-on')
      renderSim()
    })
  })
  $('#sim-cta').addEventListener('click', function () {
    var toast = $('#sim-toast')
    toast.textContent = t('sim')[SIMK].toast; toast.classList.add('is-on')
    clearTimeout(toastTimer)
    toastTimer = setTimeout(function () { toast.classList.remove('is-on') }, 4500)
  })
  // 3D tilt that follows the mouse.
  var tilt = $('#sim-tilt')
  if (fine && !reduce) {
    tilt.addEventListener('pointermove', function (e) {
      var r = tilt.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5
      tilt.style.setProperty('--ry', (x * 10).toFixed(2) + 'deg'); tilt.style.setProperty('--rx', (-y * 8).toFixed(2) + 'deg')
    })
    tilt.addEventListener('pointerleave', function () { tilt.style.setProperty('--ry', '0deg'); tilt.style.setProperty('--rx', '0deg') })
  }

  // Savings slider: bookings a month × €100 average × 18% commission.
  var roiR = $('#roi-range')
  function roiSave(n) { return Math.round(n * 100 * 0.18) }
  function renderRoi(animate) {
    var n = +roiR.value, x = money(roiSave(n)), out = $('#roi-save')
    $('#roi-n').textContent = n; out.textContent = x
    roiR.style.setProperty('--p', ((n - roiR.min) / (roiR.max - roiR.min) * 100).toFixed(1) + '%')
    roiR.setAttribute('aria-valuetext', t('roi.vt').replace('{n}', n).replace('{x}', x))
    if (animate && !reduce) { out.classList.remove('pop'); void out.offsetWidth; out.classList.add('pop') }
  }
  roiR.addEventListener('input', function () { renderRoi(true) })

  // FAQ accordion.
  $$('#acc button').forEach(function (b) {
    b.addEventListener('click', function () {
      var open = b.getAttribute('aria-expanded') !== 'true'
      b.setAttribute('aria-expanded', String(open)); b.closest('.acc__item').classList.toggle('is-open', open)
    })
  })

  // Contact: sent to my inbox through FormSubmit (no server of my own). If that fails, the visitor's email app opens with the message ready, so no message is lost.
  var ENDPOINT = 'https://formsubmit.co/ajax/' + EMAIL
  var form = $('#contact-form'), status = $('#contact-status')
  var clean = function (s, max) { return String(s).replace(/[<>\u0000-\u0008\u000b-\u001f]/g, ' ').trim().slice(0, max) }
  var VALID = { name: function (v) { return !!clean(v, 80) }, email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(v, 120)) } }
  function fieldErr(f, msg) {
    var el = form.elements[f], box = $('#e-' + f)
    if (msg) { el.setAttribute('aria-invalid', 'true'); box.textContent = msg } else { el.removeAttribute('aria-invalid'); box.textContent = '' }
  }
  // Errors clear as soon as the field is fixed.
  ;['name', 'email'].forEach(function (f) { form.elements[f].addEventListener('input', function () { if (form.elements[f].hasAttribute('aria-invalid') && VALID[f](form.elements[f].value)) fieldErr(f, '') }) })
  form.addEventListener('submit', function (e) {
    e.preventDefault()
    fieldErr('name', ''); fieldErr('email', ''); status.className = 'form-status'; status.textContent = ''
    var name = clean(form.elements.name.value, 80), email = clean(form.elements.email.value, 120)
    if (!VALID.name(name)) { fieldErr('name', t('err').name); return form.elements.name.focus() }
    if (!VALID.email(email)) { fieldErr('email', t('err').email); return form.elements.email.focus() }
    if (form.elements.website.value) return
    var business = clean(form.elements.business.value, 100), msg = clean(form.elements.msg.value, 1000)
    // Rate limit: at most 3 messages in 10 minutes and 30 seconds between two, counted in this browser.
    // shortcut: a bot that ignores JavaScript is not stopped here, only by FormSubmit's own filter; move to a server function if spam arrives.
    var now = Date.now(), sent = []
    try { sent = JSON.parse(localStorage.getItem('jk-sent') || '[]').filter(function (x) { return now - x < 600000 }) } catch (e) {}
    if (sent.length >= 3 || (sent.length && now - sent[sent.length - 1] < 30000)) { status.className = 'form-status is-error'; status.textContent = t('err').rate; return }
    try { localStorage.setItem('jk-sent', JSON.stringify(sent.concat(now))) } catch (e) {}
    var btn = form.querySelector('button[type="submit"]'), subject = t('subject') + ': ' + name
    var viaMail = function () {
      status.className = 'form-status is-ok'; status.textContent = t('ok')
      window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(name + (business ? ' · ' + business : '') + '\n' + email + '\n\n' + msg)
    }
    btn.disabled = true; btn.textContent = t('sending')
    fetch(ENDPOINT, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ name: name, business: business, email: email, message: msg, _subject: subject, _captcha: 'false', _template: 'table' })
    }).then(function (r) { return r.json() })
      .then(function (j) {
        if (String(j.success) !== 'true') throw new Error('not sent')
        status.className = 'form-status is-ok'; status.textContent = t('sent'); form.reset()
      })
      .catch(viaMail)
      .then(function () { btn.disabled = false; btn.textContent = t('f.send') })
  })

  // Site viewer: the project opens full screen inside the portfolio (this also works where new tabs are blocked).
  var viewer = $('#viewer'), frame = $('#viewer-frame'), viewing = null
  var qrBtn = $('#viewer-qr-btn'), qrBox = $('#viewer-qr')
  function setMode(mode) {
    viewer.classList.toggle('is-phone', mode === 'phone')
    $$('[data-mode]', viewer).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.mode === mode)) })
  }
  // QR code of the open site, made in this page (qr.js), so a visitor can try it on a real phone.
  function setQr(open) {
    qrBox.hidden = !open; qrBtn.setAttribute('aria-expanded', String(open))
    if (open && viewing && window.JKQR) $('#viewer-qr-svg').innerHTML = window.JKQR.svg(new URL('work/' + viewing.id + '/', location.href).href)
  }
  qrBtn.addEventListener('click', function () { setQr(qrBox.hidden) })
  function openViewer(w) {
    var url = 'work/' + w.id + '/index.html'
    viewing = w
    $('#viewer-title').textContent = w.name
    $('#viewer-open').href = url
    frame.contentWindow.location.replace(new URL(url, location.href).href) // replace, not src: the preview must not add its own Back steps
    setMode('desk'); setQr(false)
    viewer.showModal()
    document.body.style.overflow = 'hidden'
  }
  function closeViewer() { viewer.close() }
  viewer.addEventListener('close', function () {
    document.body.style.overflow = ''
    var blank = function () { frame.contentWindow.location.replace('about:blank') }
    if (!(history.state && history.state.site)) return blank() // closed with Back: already on the portfolio entry
    // Closed with the button: step back to the portfolio entry first, then empty the preview (loading a page in it would cancel the step back).
    history.back()
    setTimeout(function () {
      if (viewer.open) return // another site was opened meanwhile
      // shortcut: if the browser ignored back(), only the address is fixed and one later Back press does nothing.
      if (history.state && history.state.site) history.replaceState(null, '', pageUrl())
      blank()
    }, 400)
  })
  // Direct links: portfolio/?site=<id> opens the portfolio with that site already showing in the viewer.
  // Opening a site from the grid puts the same link in the address bar, so it can be copied and shared.
  var openViewerBase = openViewer
  openViewer = function (w) {
    openViewerBase(w)
    // The portfolio stays one step back in history, so the browser's Back button closes the site instead of leaving the portfolio.
    try { history.replaceState(null, '', pageUrl()); history.pushState({ site: w.id }, '', location.pathname + '?site=' + w.id + location.hash) } catch (e) {}
  }
  window.addEventListener('popstate', function () {
    var id = history.state && history.state.site, w = id && WORK.find(function (x) { return x.id === id })
    if (w && !viewer.open) openViewerBase(w) // Forward: show the site again
    else if (!w && viewer.open) viewer.close() // Back: return to the portfolio
  })
  function openFromLink() {
    var m = location.search.match(/[?&]site=([a-z0-9-]+)/i), w = m && WORK.find(function (x) { return x.id === m[1].toLowerCase() })
    if (w) openViewer(w)
  }
  $('#viewer-close').addEventListener('click', closeViewer)
  $$('[data-mode]', viewer).forEach(function (b) { b.addEventListener('click', function () { setMode(b.dataset.mode) }) })
  // Case study button opens the hotel in the same viewer.
  $$('[data-open]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var w = WORK.find(function (x) { return x.id === a.dataset.open })
      if (!w || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return
      e.preventDefault(); openViewer(w)
    })
  })
  // Inside the viewer the demo's "back to the portfolio" ribbon closes the viewer instead.
  frame.addEventListener('load', function () {
    try {
      var ribbon = frame.contentDocument && frame.contentDocument.querySelector('.demo-ribbon, .demo-tag')
      if (ribbon) ribbon.addEventListener('click', function (e) { e.preventDefault(); closeViewer() })
      // Links inside the previewed site replace its page instead of adding Back steps, so one Back always returns to the portfolio.
      var win = frame.contentWindow
      win.document.addEventListener('click', function (e) {
        var a = e.target.closest && e.target.closest('a[href]')
        if (!a || e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || a.target === '_blank' || a.hasAttribute('download') || a.origin !== location.origin) return
        e.preventDefault()
        if (a.pathname === win.location.pathname && a.search === win.location.search) { // a section of the same page: just scroll there
          var el = a.hash.length > 1 && win.document.getElementById(decodeURIComponent(a.hash.slice(1)))
          if (el) el.scrollIntoView(); else win.scrollTo(0, 0)
        } else win.location.replace(a.href)
      })
    } catch (e) {}
  })

  // Quote configurator: business, features, then a summary with price, timing and one-tap WhatsApp.
  var Q = { type: 'food', needs: ['booking', 'wa', 'langs'], like: '' }, step = 1
  var USUAL = { stay: 1200, food: 1000, beauty: 1000, trade: 800, other: 800 }
  var WEIGHT = { booking: 2, wa: 0, langs: 1, menu: 1, google: 1, gallery: 0, vouchers: 2 } // extra build days per feature
  var CHECK = '<i aria-hidden="true"><svg class="ico"><use href="#i-check"/></svg></i>'
  function quoteFacts() {
    var needs = t('q.needs'), list = Object.keys(needs).filter(function (k) { return Q.needs.indexOf(k) >= 0 }).map(function (k) { return needs[k] })
    var lo = 6 + Q.needs.reduce(function (s, k) { return s + (WEIGHT[k] || 0) }, 0), hi = Math.min(14, lo + 3)
    lo = Math.min(lo, hi - 2)
    var usual = Q.type === 'trade' && Q.needs.indexOf('booking') >= 0 ? 1000 : USUAL[Q.type]
    return { type: t('q.types')[Q.type], list: list, time: t('q.days').replace('{a}', lo).replace('{b}', hi), usual: usual }
  }
  function quoteText(f) {
    return t('q.msg').replace('{type}', f.type.toLowerCase()).replace('{needs}', f.list.length ? f.list.join(', ') : '—')
      .replace('{like}', Q.like ? t('q.like').replace('{name}', Q.like) : '').replace('{time}', f.time)
  }
  function optButton(k, label, onClick) {
    var b = document.createElement('button'), s = document.createElement('span')
    b.type = 'button'; b.className = 'opt'; b.dataset.k = k; b.innerHTML = CHECK; s.textContent = label; b.appendChild(s)
    b.addEventListener('click', onClick); return b
  }
  // Built once per language; clicks only change aria-pressed, so keyboard focus stays where it was.
  function buildOpts() {
    var tb = $('#q-type'), nb = $('#q-need'), types = t('q.types'), needs = t('q.needs')
    tb.textContent = ''; nb.textContent = ''
    Object.keys(types).forEach(function (k) { tb.appendChild(optButton(k, types[k], function () { Q.type = k; renderQuote() })) })
    Object.keys(needs).forEach(function (k) { nb.appendChild(optButton(k, needs[k], function () { var i = Q.needs.indexOf(k); if (i >= 0) Q.needs.splice(i, 1); else Q.needs.push(k); renderQuote() })) })
  }
  function renderQuote() {
    $$('#q-type .opt').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.k === Q.type)) })
    $$('#q-need .opt').forEach(function (b) { b.setAttribute('aria-pressed', String(Q.needs.indexOf(b.dataset.k) >= 0)) })
    var f = quoteFacts()
    $('#q-o-type').textContent = f.type
    $('#q-o-needs').textContent = f.list.length ? f.list.join(', ') : '—'
    $('#q-o-time').textContent = f.time
    $('#q-like-row').hidden = !Q.like; $('#q-o-like').textContent = Q.like
    $('#q-usual').textContent = money(f.usual)
    $('#q-save').textContent = t('q.save').replace('{x}', money(f.usual - 400))
    $('#q-send').href = 'https://wa.me/355685727406?text=' + encodeURIComponent(quoteText(f))
    $$('.cfg__steps button').forEach(function (b) {
      var n = +b.dataset.step
      if (n === step) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current')
      b.classList.toggle('is-done', n < step)
    })
    $$('.cfg__panel').forEach(function (p) { p.hidden = +p.dataset.panel !== step })
    $('#q-back').disabled = step === 1
    $('#q-next').hidden = step === 3
    $('.cfg__bar i').style.setProperty('--s', (step / 3).toFixed(3))
  }
  function goStep(n, focus) {
    step = Math.max(1, Math.min(3, n)); $('#q-status').textContent = ''; renderQuote()
    if (focus) { var h = $('.cfg__panel[data-panel="' + step + '"] h3'); h.tabIndex = -1; h.focus({ preventScroll: true }) }
  }
  $$('.cfg__steps button').forEach(function (b) { b.addEventListener('click', function () { goStep(+b.dataset.step, true) }) })
  $('#q-next').addEventListener('click', function () { goStep(step + 1, true) })
  $('#q-back').addEventListener('click', function () { goStep(step - 1, true) })
  $('#q-copy').addEventListener('click', function () {
    var text = quoteText(quoteFacts()), out = $('#q-status')
    var done = function () { out.className = 'form-status is-ok'; out.textContent = t('q.copied') }
    var fail = function () {
      // Older browsers: copy through a hidden text box.
      var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;left:-9999px'
      document.body.appendChild(ta); ta.select()
      var ok = false; try { ok = document.execCommand('copy') } catch (e) {}
      ta.remove()
      if (ok) done(); else { out.className = 'form-status is-error'; out.textContent = t('q.copyfail') }
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fail); else fail()
  })
  // "Start with this" on a plan picks that business type and moves on to the features.
  $$('[data-quote]').forEach(function (a) { a.addEventListener('click', function () { Q.type = a.dataset.quote; Q.like = ''; goStep(2) }) })

  // "I want a site like this" in the viewer: closes it and opens the quote summary with that site named.
  $('#viewer-want').addEventListener('click', function (e) {
    e.preventDefault()
    var w = viewing
    closeViewer()
    if (w) { Q.like = w.name; Q.type = { stay: 'stay', food: 'food', local: 'trade' }[w.cat] || 'other' }
    goStep(3)
    $('#quote').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  })

  // Phone menu: the button opens the same five links; a link, Escape or a second tap closes it.
  var nav = $('.nav'), toggle = $('.nav__toggle')
  function setMenu(open) { nav.classList.toggle('is-open', open); toggle.setAttribute('aria-expanded', String(open)) }
  toggle.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')) })
  $('#nav-links').addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false) })
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus() } })

  $('#year').textContent = new Date().getFullYear()
  applyLang()
  openFromLink()
})()
