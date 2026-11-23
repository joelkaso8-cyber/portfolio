// Joel Kaso portfolio: work grid, EN/SQ, hero demo, savings slider, quote configurator, QR in the viewer, FAQ, contact form.
;(function () {
  var $ = function (s, r) { return (r || document).querySelector(s) }
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) }
  var EMAIL = 'joelkaso8@gmail.com'
  var BASE = 'https://joelkaso8-cyber.github.io/portfolio/'

  // Selected Work: one card per project, in this order. Fields:
  //   name, category ('stay' | 'food' | 'local', matching a filter), description { en, sq }, image (desktop screenshot;
  //   the -600 and -phone shots beside it share its name), link (./work/<id>/, or a full URL for a site hosted elsewhere),
  //   isReal (true only for a real client; every other project is badged Demo), plus id, film (scroll-film filter),
  //   tag (badge colour for demos), where and chips. A filter hides itself when no project matches it.
  //   More demo sites live in work/ (git history has their old entries); add one here to show it again.
  var projects = [
    { id: 'kaso-ervehe', name: 'Hotel Kaso Ervehe', isReal: true, link: './work/kaso-ervehe/', image: 'img/kaso-ervehe-desk.webp', category: 'stay', tag: 'client', where: { en: 'Family hotel · Përmet, Albania', sq: 'Hotel familjar · Përmet, Shqipëri' },
      description: { en: 'Guests pick dates on the first screen and book direct, with 0% OTA commission. Requests reach WhatsApp and Telegram, in EN or SQ.', sq: 'Mysafirët zgjedhin datat në ekranin e parë dhe rezervojnë direkt, me 0% komision OTA. Kërkesat vijnë në WhatsApp dhe Telegram, EN ose SQ.' },
      chips: { en: ['Scroll film hero', 'Dates and guests on the first screen', 'Booking calendar', 'EN / SQ', 'Route on Google Maps', 'Bookings to Telegram'], sq: ['Film me scroll', 'Datat dhe mysafirët në ekranin e parë', 'Kalendar rezervimi', 'EN / SQ', 'Rruga në Google Maps', 'Rezervime në Telegram'] } },
    { id: 'ura-coffee', film: true, name: 'Ura Coffee Roasters', isReal: false, link: './work/ura-coffee/', image: 'img/ura-coffee-desk.webp', category: 'food', tag: 'demo', where: { en: 'Coffee roastery · Glasgow, UK', sq: 'Furrë kafeje · Glasgow, Skoci' },
      description: { en: 'Table bookings and pick-up orders land on WhatsApp, with no delivery-app cut. Diet filters get guests to the right drink fast.', sq: 'Rezervimet dhe porositë për marrje vijnë në WhatsApp, pa komision aplikacioni. Filtrat e dietës i çojnë shpejt te pija e duhur.' },
      chips: { en: ['Espresso film that plays as you scroll', 'Table booking and pick-up orders on WhatsApp', 'Menu with diet filters', 'Live hours and directions', 'Bean shop with bag'], sq: ['Film espreso që luan me scroll', 'Rezervim tavoline dhe porosi në WhatsApp', 'Menu me filtra diete', 'Orari live dhe rruga', 'Dyqan kafeje me shportë'] } },
    { id: 'balte-studio', film: true, name: 'Baltë Studio', isReal: false, link: './work/balte-studio/', image: 'img/balte-studio-desk.webp', category: 'local', tag: 'demo', where: { en: 'Pottery studio · Tirana, Albania', sq: 'Studio qeramike · Tiranë, Shqipëri' },
      description: { en: 'Pottery classes book straight on WhatsApp, no booking platform in between. Live opening hours and EN/SQ for locals and visitors.', sq: 'Kurset e qeramikës rezervohen direkt në WhatsApp, pa platformë në mes. Orari live dhe EN/SQ për vendasit dhe vizitorët.' },
      chips: { en: ['Clay film that plays as you scroll', 'Class booking on WhatsApp', 'Fanned photo gallery', 'Live opening hours', 'EN / SQ'], sq: ['Film balte që luan me scroll', 'Rezervim kursesh në WhatsApp', 'Galeri fotosh si freskore', 'Orari live', 'EN / SQ'] } },
    { id: 'lule-kitchen', film: true, name: 'Lule Balkan Kitchen', isReal: false, link: './work/lule-kitchen/', image: 'img/lule-kitchen-desk.webp', category: 'food', tag: 'demo', where: { en: 'Restaurant · London, UK', sq: 'Restorant · Londër, Angli' },
      description: { en: 'Table requests reach WhatsApp in seconds, with no booking-platform fees. Menu tabs and EN/SQ make ordering easy for every guest.', sq: 'Kërkesat për tavolinë vijnë në WhatsApp për sekonda, pa tarifa platforme. Menuja me kategori dhe EN/SQ e bëjnë të lehtë për çdo klient.' },
      chips: { en: ['Wood-fire film as you scroll', 'Menu with tabs', 'Table booking + WhatsApp', 'EN / SQ'], sq: ['Film me zjarr druri me scroll', 'Menu me kategori', 'Rezervim tavoline + WhatsApp', 'EN / SQ'] } },
    { id: 'northline-barbers', film: true, name: 'Northline Barbers', isReal: false, link: './work/northline-barbers/', image: 'img/northline-barbers-desk.webp', category: 'local', tag: 'demo', where: { en: 'Barber shop · Manchester, UK', sq: 'Berberi · Mançester, Angli' },
      description: { en: 'Customers see the free slots and book in four steps, or on WhatsApp. Fewer missed calls while the barber is busy cutting.', sq: 'Klientët shohin oraret e lira dhe rezervojnë në katër hapa, ose në WhatsApp. Më pak telefonata të humbura kur berberi është në punë.' },
      chips: { en: ['Barber film that plays as you scroll', '4-step booking with live free slots', 'Book via WhatsApp', 'EN / SQ'], sq: ['Film berberie me scroll', 'Rezervim në 4 hapa me orare të lira', 'Rezervo në WhatsApp', 'EN / SQ'] } },
    { id: 'vjosa-rafting', film: true, name: 'Vjosa Rafting', isReal: false, link: './work/vjosa-rafting/', image: 'img/vjosa-rafting-desk.webp', category: 'local', tag: 'project', where: { en: 'Rafting trips · Vjosa river, Albania', sq: 'Rafting · lumi Vjosa, Shqipëri' },
      description: { en: 'Price, time and meeting point at a glance, then one tap books on WhatsApp. Built light, so it loads fast on mountain signal.', sq: 'Çmimi, ora dhe pika e takimit me një shikim, pastaj një prekje rezervon në WhatsApp. E lehtë, hapet shpejt edhe me sinjal mali.' },
      chips: { en: ['Video hero', 'Price, time and meeting point at a glance', 'Book on WhatsApp in 1 tap', 'Built for phones'], sq: ['Video në hyrje', 'Çmimi, koha dhe pika e takimit me një shikim', 'Rezervo në WhatsApp me 1 prekje', 'E ndërtuar për telefon'] } },
    { id: 'boje-tattoo', film: true, name: 'Bojë Tattoo', isReal: false, link: './work/boje-tattoo/', image: 'img/boje-tattoo-desk.webp', category: 'local', tag: 'demo', where: { en: 'Fine-line & blackwork studio · Tirana, Albania', sq: 'Studio tatuazhesh fine-line & blackwork · Tiranë, Shqipëri' },
      description: { en: 'Visitors choose an artist by healed work, see honest price ranges and claim flash on WhatsApp. Bilingual EN/SQ for locals and tourists.', sq: 'Vizitorët zgjedhin artistin nga punët e shëruara, shohin çmime të qarta dhe rezervojnë flash në WhatsApp. EN/SQ për vendasit dhe turistët.' },
      chips: { en: ['Stencil film that plays as you scroll', 'Lift the stencil to see the healed piece', 'Flash wall with WhatsApp claims', 'Honest price guide', 'EN / SQ'], sq: ['Film stencili që luan me scroll', 'Ngri stencilin për të parë punën e shëruar', 'Mur flash me rezervim në WhatsApp', 'Udhëzues i qartë çmimesh', 'EN / SQ'] } },
    { id: 'brolin-tattoo', name: 'Brolin Tattoo', isReal: true, link: 'https://brolin-tattoo.netlify.app/', image: 'img/brolin-tattoo-desk.webp', category: 'local', tag: 'project', where: { en: 'Custom tattoo artist', sq: 'Artist tatuazhesh me porosi' },
      description: { en: 'Clients pick a style, claim flash designs and send a complete tattoo request. Less back-and-forth in DMs before the first session.', sq: 'Klientët zgjedhin stilin, rezervojnë dizajne flash dhe dërgojnë një kërkesë të plotë. Më pak mesazhe para-mbrapa para seancës së parë.' },
      chips: { en: ['Five styles, blackwork to realism', 'Flash designs you can claim', '4-step session guide', 'Tattoo request form'], sq: ['Pesë stile, nga blackwork te realizmi', 'Dizajne flash që i rezervon', 'Seanca në 4 hapa', 'Formular kërkese për tatuazh'] } },
  ]
  var WORK = projects
  // A project's address. isExternal: hosted elsewhere, so its card shows the real site live.
  var siteUrl = function (w) { return w.link }
  var isExternal = function (w) { return /^https?:/.test(w.link) }
  // Real client reviews. The section stays hidden while this list is empty. Add one per client, in both languages, only with their permission:
  // { name: 'Arben Hoxha', role: { en: 'Owner, Hotel Example, Berat', sq: 'Pronar, Hotel Example, Berat' },
  //   quote: { en: 'What they said.', sq: 'Çfarë thanë.' }, url: 'https://their-site.al/' }   (url is optional)
  var REVIEWS = []
  // While REVIEWS is empty, one placeholder card marked TODO shows (text: 'rev.todo'). Set to false to hide the section instead.
  var REVIEW_PLACEHOLDER = false

  // Launch spots still open (out of 10). Set a number, for example 7, to show "7 of 10 launch spots left" in the offer band.
  // Leave it null to hide the line. Only show a real, current number (switched off on 2026-11-15).
  var SPOTS_LEFT = null

  // Hotel Kaso Ervehe. Turn KASO_LIVE on only while the hotel's guests really use the site: it badges the card
  // "Live Client Site" and the footer says it is live. Then also update case.lead, case.s2 and case.s3, which say the site launches soon. Turn KASO_QUOTE on only if the hotel said those words and agreed to be quoted.
  var KASO_LIVE = false
  var KASO_QUOTE = false

  // Which package each showcase sells. The preview window shows it as a badge and the card names it.
  // Sites not listed here get no badge.
  var TIER = { 'vjosa-rafting': 'starter', 'lule-kitchen': 'business', 'kaso-ervehe': 'premium' }

  // Counts a button press if analytics.js is on (see the README). Does nothing otherwise.
  function track(name) { try { document.dispatchEvent(new CustomEvent('jk:track', { detail: name })) } catch (e) {} }

  // Every site that is not a real client's carries a plain "Demo" tag, so no one mistakes it for a live business.
  var DEMO = { en: 'Demo', sq: 'Demo' }
  var TAGS = { client: KASO_LIVE ? { en: 'Live Client Site', sq: 'Faqe Reale Live' } : { en: 'Real client', sq: 'Klient real' }, demo: DEMO, concept: DEMO, project: DEMO }

  // Every visible text in both languages. index.html carries the English copy; data-i18n keys point here.
  var T = {
    en: {
      skip: 'Skip to content', title: 'Websites for hotels, restaurants & local businesses · Joel Kaso',
      desc: 'Fast, custom websites for hotels, restaurants and local businesses in Albania and abroad: direct WhatsApp booking with no commission, English/Albanian. From 150€.',
      'nav.status': 'Taking new projects', 'nav.work': 'Work', 'nav.services': 'Services', 'nav.process': 'Process', 'nav.faq': 'FAQ', 'nav.contact': 'Contact',
      'hero.eyebrow': 'Web design & engineering studio · Albania → UK, EU & USA', 'hero.t1': 'Websites that turn visitors into', 'hero.t2': 'direct paying customers.',
      'hero.lead': 'Custom, fast websites for hotels, restaurants and local businesses, with a direct booking calendar, WhatsApp, two languages and no monthly platform lock-in.',
      'hero.quote': 'Get a quote', 'hero.work': 'See the work', 'hero.scroll': 'Scroll',
      'proof.1t': 'Fast on phones', 'proof.1p': 'hand-built, no page builders', 'proof.2t': '0% commission', 'proof.2p': 'on bookings that come direct', 'proof.3t': '3–14 days', 'proof.3p': 'from first call to live site',
      'roi.label': 'Your bookings a month', 'roi.pre': 'You keep about', 'roi.post': 'a month when those bookings come direct.',
      'roi.note': 'Worked out with an average booking of 100€ and an 18% platform commission.', 'roi.vt': '{n} bookings a month, about {x} kept',
      'sim.aria': 'Try a live example', 'sim.hint': 'A working demo. Tap two choices, then the green button.',
      sim: {
        hotel: { url: 'kaso-ervehe.al', img: 'img/kaso-ervehe-desk-600.webp', title: 'Book a room in Përmet', l1: 'Check-in', l2: 'Nights', o2: ['1', '2', '3'], cta: 'Book on WhatsApp', toast: "Demo: your booking request just reached the hotel's WhatsApp and Telegram, with 0% commission." },
        coffee: { url: 'ura-coffee.co.uk', img: 'img/ura-coffee-desk-600.webp', title: 'Order fresh beans', l1: 'Beans', o1: ['Ethiopia', 'Colombia', 'House blend'], l2: 'Bag', o2: ['250 g', '1 kg'], cta: 'Order on WhatsApp', toast: "Demo: your order went straight to the roastery's WhatsApp, with no delivery-app cut." },
        food: { url: 'lule-kitchen.co.uk', img: 'img/lule-kitchen-desk-600.webp', title: 'Book a table tonight', l1: 'Guests', o1: ['2', '4', '6'], l2: 'Time', o2: ['19:00', '20:00', '21:00'], cta: 'Reserve on WhatsApp', toast: "Demo: your table request reached the restaurant's WhatsApp in seconds, with no booking fees." }
      },
      days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      'preview.t': 'Not sure yet? Get a free preview.', 'preview.p': 'Send me your business name and a few photos. Within 48 hours I show you your own homepage on your phone. You pay nothing unless you want the full site.', 'preview.cta': 'Get my free preview', 'preview.wa': 'Hi Joel, I\'d like a free preview of my website.\nMy business: \nCity: ',
      'offer.spots': '{n} of 10 launch spots remaining at these prices', 'faq.q7': 'Can I see my website before I pay?', 'faq.a7': 'Yes. Send me your business name and a few photos, and within 48 hours I show you a free preview of your homepage. If you want the full site, a 50% deposit starts the build and the rest is due at launch.',
      'offer.tag': 'Fixed packages', 'offer.t1': 'Websites from', 'offer.cta': 'Start a project',
      'offer.text': 'Essential Landing from 150€, Business Pro with two languages and a booking form from 300€, Custom Signature with scroll film and automated lead routing at 600€+. Every site comes with phone and desktop design, WhatsApp and a map.',
      'case.tag': 'Featured case study', 'case.title': 'Hotel Kaso Ervehe, Përmet', 'case.lead': "My family's hotel in Përmet is my first real project, and its new site launches soon. Here is what it changes.",
      'case.alt': 'Home page of the Hotel Kaso Ervehe website', 'case.pt': 'The problem', 'case.pp': 'Up to 18% of every stay went to booking platforms as commission.',
      'case.st': 'The solution', 'case.items': ['A fast site of its own, in English and Albanian', 'A direct booking calendar', 'Booking alerts on Telegram', 'The route on Google Maps'],
      'case.s1': 'guest rating on Booking.com', 'case.proof': 'Check the reviews on Booking.com', 'case.s2': 'commission on direct reservations, once it launches', 'case.s3': 'guests can book in English or Albanian', 'case.cta': 'Open the hotel site in the preview',
      'cmp.tag': 'Why custom', 'cmp.title': 'Built for you, or rented from a template', 'cmp.c0': 'What matters', 'cmp.c1': 'A custom site by Joel Kaso', 'cmp.c2': 'WordPress, Wix or an agency template',
      'cmp.r1': 'Speed', 'cmp.r1a': 'Hand-built and light, with no plugins. Tested with Google PageSpeed before it goes live.', 'cmp.r1b': 'Heavy themes and plugins often take 3 to 6 seconds to open on a phone.',
      'cmp.r2': 'Monthly fees', 'cmp.r2a': 'No monthly fee required. You own the code, and a care plan is there if you want one.', 'cmp.r2b': 'Often 30–100€ a month for plugins, hosting and maintenance.',
      'cmp.r3': 'Security', 'cmp.r3a': 'No database and no plugins, so there is far less to attack and nothing to keep updating.', 'cmp.r3b': 'Plugins need constant updates, and an old one is a common way in.',
      'cmp.r4': 'Enquiries', 'cmp.r4a': 'Bookings and messages reach your WhatsApp or Telegram within seconds.', 'cmp.r4b': 'A generic contact form that often ends up in spam.',
      'work.tag': 'Demo sites', 'work.title': 'Selected work', 'work.all': 'All', 'work.stay': 'Hotels & stays', 'work.food': 'Restaurants & food', 'work.local': 'Local services', 'work.film': 'Scroll film experiences',
      'cta.work': 'Get a site like these', open: 'Open the site →', shot: ', website screenshot', film: '▶ Scroll film',
      'services.tag': 'Fixed prices', 'services.title': 'Packages & Pricing', 'services.lead': 'Every site is custom-designed for your business, with no monthly lock-in. Take direct bookings with 0% commission through instant WhatsApp requests or a built-in booking calendar, or connect the tools you already use (OpenTable, Fresha, Booksy, Airbnb or Booking.com) whenever you need them.',
      'plan1.name': 'Essential Landing', 'plan1.for': 'One high-converting page for cafés, barbers, trades and events that need to be found and messaged.',
      'plan2.name': 'Business Pro', 'plan2.for': 'For restaurants, salons, clinics and studios that take enquiries and bookings every day.',
      'plan3.name': 'Custom Signature', 'plan3.for': 'For hotels and brands that want a one-of-a-kind site, with motion and leads routed for them.',
      'plan.ask': 'Start with this', 'plan.see': 'See the example', 'plan.popular': 'Most popular', 'plan.from': 'from', 'plan.note': '50% deposit to start, 50% at launch.', 'pkg1.wa': 'Hi Joel, I\'m interested in the Essential Landing website package.', 'pkg2.wa': 'Hi Joel, I\'m interested in the Business Pro website package.', 'pkg3.wa': 'Hi Joel, I\'m interested in the Custom Signature website package.',
      'plan1.items': ['One page, up to 5 sections', 'One language: Albanian or English', 'WhatsApp button and Google Maps', 'Delivered in 3–4 days', '2 rounds of revisions'],
      'plan2.items': ['Up to 5 pages', 'Bilingual, with an EN/SQ switch', 'Custom enquiry or booking form, plus WhatsApp', 'Delivered in 5–10 days', '2 rounds of revisions'],
      'plan3.items': ['Fully bespoke layout', 'Interactive scroll film and hero choreography', 'Bilingual EN/SQ localisation', 'Automated lead routing: webhooks, n8n or your CRM', 'Delivered in 10–14 days', '3 rounds of revisions'],
      'care.tag': 'Optional, after launch', 'care.title': 'Care plan · 25€ a month', 'care.cta': 'Ask about the care plan', 'care.wa': "Hi Joel, I'd like to know more about the care plan.",
      'care.text': 'Send me your text, price and photo changes and I make them, usually within two days. Every month I check that the site, the booking and your Google listing work. Stop any time: the site stays yours.',
      'rev.tag': 'Client words', 'rev.title': 'What clients say', 'rev.visit': 'Visit the site →', 'rev.todo': 'TODO: add a real client testimonial here (their words, name and business, shared with their permission).',
      'q.tag': 'Quick quote', 'q.title': 'Plan your site in three steps', 'q.lead': 'Pick your business and what you need. You get the price and the timing straight away, and one tap sends it to me.',
      'q.s1': 'Your business', 'q.s2': 'Features', 'q.s3': 'Summary', 'q.type': 'What kind of business is it?', 'q.need': 'What should the site do?', 'q.sum': 'Your project',
      'q.d1': 'Business', 'q.d2': 'Features', 'q.d3': 'Estimated turnaround', 'q.d5': 'In the style of', 'q.price': 'Package', 'q.from': 'from',
      'q.note': 'Everything you pick is included. 50% deposit to start, 50% at launch, and no monthly fees.',
      'q.send': 'Send spec on WhatsApp', 'q.copy': 'Copy project brief', 'q.back': 'Back', 'q.next': 'Next',
      'q.copied': 'Copied. Paste it into an email or a message to me.', 'q.copyfail': 'Copying is blocked in this browser. Use the WhatsApp button instead.',
      'q.days': '{a}–{b} days',
      'q.types': { stay: 'Hotel or guesthouse', food: 'Restaurant or bar', beauty: 'Salon or clinic', trade: 'Local trade', other: 'Something else' },
      'q.needs': { booking: 'Direct booking system', wa: 'WhatsApp ordering', langs: 'English and Albanian', menu: 'Menu or price list you edit', google: 'Google Business Profile and local SEO', gallery: 'Photo gallery with lightbox', vouchers: 'Gift vouchers' },
      'q.msg': 'Hi Joel, I\'d like a website quote. Business: {type}, what I need: {needs}.{like}\nPackage: {price}, about {time}.', 'q.like': '\nIn the style of: {name}.',
      'process.tag': 'How it works', 'process.title': 'From a call to a live site',
      's1.d': '20 minutes', 's1.t': 'Quick call or WhatsApp chat', 's1.p': 'We talk about your business, your rooms or services, and your goals.',
      's2.d': 'Within 48 hours', 's2.t': 'Free homepage preview on your phone', 's2.p': 'You test a working first version of your homepage on your own phone, before paying a cent.',
      's3.d': 'Days 3–14', 's3.t': 'Full build and polish', 's3.p': 'Direct booking, WhatsApp, maps and English/Albanian, tested on every screen.',
      's4.d': 'Launch day', 's4.t': 'Live, with a video guide', 's4.p': 'Your own domain, Google listing and a short video on how to edit it.',
      'g.title': 'Half to start, half at launch.', 'g.text': 'You see a free preview of your homepage first. A 50% deposit starts the build, and the other 50% is due at launch, after you have checked the finished site on a private link on your own phone.', 'g.cta': 'Book a free call',
      'about.tag': 'About', 'about.title': 'Who builds your site',
      'about.p1': "I'm Joel, a web designer from Albania. I build fast, good-looking websites for hotels, restaurants and local businesses. I do the design, the code and the setup myself, so you talk to one person.",
      'about.items': ['I reply within 24 hours, in English or Albanian', 'Fixed price: 50% deposit to start, 50% at launch', 'The site is yours. No monthly fees unless you choose the care plan'],
      'faq.tag': 'FAQ', 'faq.title': 'Common questions', 'faq.lead': 'Everything you need to know before we start.',
      'faq.q1': 'Are there any monthly fees after the site goes live?', 'faq.a1': 'No monthly fees from me, unless you choose the optional care plan at 25€ a month, which you can stop any time. You pay once for the design and build, and the website is 100% yours. Your domain is registered in your own name and account, so you own it directly.',
      'faq.q2': 'How long does it take from start to finish?', 'faq.a2': 'Essential Landing takes 3–4 days, Business Pro 5–10 days and Custom Signature 10–14 days. Within 48 hours of our first call you get a free preview of your homepage on your phone, and the full site follows.',
      'faq.q3': 'Can I change prices, photos, or menus myself later?', 'faq.a3': 'Yes. When we launch, I send you a short video showing you exactly how to update your text, prices, and photos in minutes—no technical skills needed.',
      'faq.q4': 'How do bookings and orders reach me?', 'faq.a4': "However is easiest for you. Requests can go straight to your WhatsApp pre-filled with the customer's details, to your email, or into a booking calendar.",
      'faq.q5': 'How does payment work?', 'faq.a5': '50% deposit to start, 50% when the site launches. Before you pay anything you get a free homepage preview, and you check the finished site on a private link before the second payment.',
      'faq.q6': 'Who owns the domain and the website?', 'faq.a6': 'You do. The domain is registered in your name and the code is handed over to you, so you can move it or change designer whenever you like.',
      'contact.tag': 'Contact', 'contact.title': "Let's build yours", 'contact.lead': 'Tell me about your business, in English or Albanian. I reply within 24 hours.',
      'f.name': 'Name', 'f.business': 'Business (optional)', 'f.email': 'Email', 'f.msg': 'What do you need?', 'f.send': 'Send',
      'f.note': 'Your message goes to my email through FormSubmit. I use it only to reply.',
      err: { name: 'Write your name.', email: 'Write a full email address.', rate: 'Too many messages in a short time. Wait a minute, or write to me on WhatsApp.' },
      ok: 'Your email app is opening with the message ready. Press send there.', sent: 'Thanks, your message is sent. I reply within 24 hours.', sending: 'Sending…', subject: 'Website enquiry',
      'case.quote': 'Instead of losing up to 18% on every reservation to third-party platforms, guests finding us on Google can now check rooms in English or Albanian and message us directly on WhatsApp with their exact dates.', 'case.quoteBy': 'Hotel Kaso Ervehe, Përmet', 'footer.live': 'Featured case study Hotel Kaso Ervehe is a live client website. Every site tagged Demo (such as Vjosa Rafting and Ura Coffee Roasters) is a custom demo build made to show how booking and ordering work. Demo photos: Wikimedia Commons, credited on each site.',
      'footer.note': 'Hotel Kaso Ervehe (my family’s hotel in Përmet) and Brolin Tattoo (a tattoo artist in Athens) are real clients. Every site tagged Demo (such as Vjosa Rafting and Ura Coffee Roasters) is a custom demo build with made-up names, made to show how booking and ordering work. Demo photos: Wikimedia Commons, credited on each site.', 'footer.privacy': 'Privacy policy', 'footer.top': 'Back to top ↑',
      'viewer.desk': 'Desktop', 'viewer.phone': 'Phone', 'viewer.qr': 'Try it on your phone', 'viewer.qrhint': 'Point your phone camera at the code to open this site on your own phone.',
      'viewer.want': 'I want a site like this', 'viewer.open': 'Open in new tab ↗', 'wa.msg': "Hi Joel, I checked out your portfolio and I'm interested in a website.",
      'tier.starter': 'Essential Landing example · from 150€', 'tier.business': 'Business Pro example · from 300€', 'tier.premium': 'Custom Signature example · 600€+', 'tier.premiumLive': 'Custom Signature · live client site · 600€+',
      'wall.title': 'Demo sites you can try', 'wall.lead': 'Tap any screen to try that site the way your customers would.',
      'dome.title': 'Your site, on a phone', 'dome.lead': 'Most of your customers will see your site on a phone. Tap this one to try Hotel Kaso Ervehe.',
      'dome.aria': 'Open the Hotel Kaso Ervehe site in the preview'
    },
    sq: {
      skip: 'Kalo te përmbajtja', title: 'Faqe interneti për hotele, restorante dhe biznese · Joel Kaso',
      desc: 'Krijim faqesh interneti për hotele, restorante dhe biznese lokale në Shqipëri: të shpejta, me rezervim direkt në WhatsApp pa komision dhe dy gjuhë. Nga 150€.',
      'nav.status': 'Pranoj projekte të reja', 'nav.work': 'Punët', 'nav.services': 'Shërbimet', 'nav.process': 'Si punoj', 'nav.faq': 'Pyetje', 'nav.contact': 'Kontakt',
      'hero.eyebrow': 'Studio dizajni dhe ndërtimi web · Shqipëri → Angli, BE dhe SHBA', 'hero.t1': 'Website që i kthejnë vizitorët në', 'hero.t2': 'klientë direkt dhe të rregullt.',
      'hero.lead': 'Website të shpejta, të bëra posaçërisht për hotele, restorante dhe biznese lokale, me kalendar rezervimi direkt, WhatsApp, dy gjuhë dhe pa pagesa mujore për platforma.',
      'hero.quote': 'Kërko ofertë', 'hero.work': 'Shiko punët', 'hero.scroll': 'Rrëshqit poshtë',
      'proof.1t': 'E shpejtë në telefon', 'proof.1p': 'e shkruar me kod, pa shabllone', 'proof.2t': '0% komision', 'proof.2p': 'për rezervimet që vijnë direkt', 'proof.3t': '3–14 ditë', 'proof.3p': 'nga telefonata e parë te faqja online',
      'roi.label': 'Rezervimet e tua në muaj', 'roi.pre': 'Mban rreth', 'roi.post': 'në muaj kur këto rezervime vijnë direkt.',
      'roi.note': 'Llogaritur me një rezervim mesatar 100€ dhe komision 18% të platformave.', 'roi.vt': '{n} rezervime në muaj, rreth {x} të mbajtura',
      'sim.aria': 'Provo një shembull', 'sim.hint': 'Një demo që funksionon. Prek dy zgjedhje, pastaj butonin jeshil.',
      sim: {
        hotel: { url: 'kaso-ervehe.al', img: 'img/kaso-ervehe-desk-600.webp', title: 'Rezervo një dhomë në Përmet', l1: 'Mbërritja', l2: 'Netë', o2: ['1', '2', '3'], cta: 'Rezervo në WhatsApp', toast: 'Demo: kërkesa për rezervim sapo arriti në WhatsApp dhe Telegram të hotelit, me 0% komision.' },
        coffee: { url: 'ura-coffee.co.uk', img: 'img/ura-coffee-desk-600.webp', title: 'Porosit kafe të freskët', l1: 'Kokrrat', o1: ['Etiopi', 'Kolumbi', 'Përzierja e shtëpisë'], l2: 'Paketimi', o2: ['250 g', '1 kg'], cta: 'Porosit në WhatsApp', toast: 'Demo: porosia shkoi direkt në WhatsApp të furrës së kafesë, pa komision aplikacioni.' },
        food: { url: 'lule-kitchen.co.uk', img: 'img/lule-kitchen-desk-600.webp', title: 'Rezervo një tavolinë sonte', l1: 'Persona', o1: ['2', '4', '6'], l2: 'Ora', o2: ['19:00', '20:00', '21:00'], cta: 'Rezervo në WhatsApp', toast: 'Demo: kërkesa për tavolinë arriti në WhatsApp të restorantit për pak sekonda, pa tarifa rezervimi.' }
      },
      days: ['Die', 'Hën', 'Mar', 'Mër', 'Enj', 'Pre', 'Sht'],
      'preview.t': 'Ende i pasigurt? Merr një parapamje falas.', 'preview.p': 'Më dërgo emrin e biznesit dhe disa foto. Brenda 48 orësh të tregoj faqen tënde kryesore në telefon. Nuk paguan asgjë, përveç nëse do faqen e plotë.', 'preview.cta': 'Dua parapamjen falas', 'preview.wa': 'Përshëndetje Joel, dua një parapamje falas të faqes sime.\nBiznesi im: \nQyteti: ',
      'offer.spots': 'Edhe {n} nga 10 vendet e para me këto çmime', 'faq.q7': 'A mund ta shoh faqen para se të paguaj?', 'faq.a7': 'Po. Më dërgo emrin e biznesit dhe disa foto, dhe brenda 48 orësh të tregoj falas një parapamje të faqes kryesore. Nëse do faqen e plotë, një paradhënie prej 50% nis ndërtimin dhe pjesa tjetër paguhet në publikim.',
      'offer.tag': 'Paketa me çmim fiks', 'offer.t1': 'Website duke filluar nga', 'offer.cta': 'Nis një projekt',
      'offer.text': 'Essential Landing nga 150€, Business Pro me dy gjuhë dhe formular rezervimi nga 300€, Custom Signature me film me scroll dhe shpërndarje automatike të kërkesave me 600€+. Çdo website ka dizajn për telefon dhe kompjuter, WhatsApp dhe hartë.',
      'case.tag': 'Projekt i veçantë', 'case.title': 'Hotel Kaso Ervehe, Përmet', 'case.lead': 'Hoteli i familjes sime në Përmet është projekti im i parë real, dhe faqja e re del online së shpejti. Ja çfarë ndryshon.',
      'case.alt': 'Faqja kryesore e website-it të Hotel Kaso Ervehe', 'case.pt': 'Problemi', 'case.pp': 'Deri në 18% e çdo qëndrimi shkonte si komision te platformat e rezervimit.',
      'case.st': 'Zgjidhja', 'case.items': ['Një faqe e shpejtë e vetja, në anglisht dhe shqip', 'Kalendar rezervimi direkt', 'Njoftime rezervimesh në Telegram', 'Rruga në Google Maps'],
      'case.s1': 'vlerësim i mysafirëve në Booking.com', 'case.proof': 'Shiko vlerësimet në Booking.com', 'case.s2': 'komision për rezervimet direkte, sapo të dalë online', 'case.s3': 'mysafirët mund të rezervojnë në anglisht ose shqip', 'case.cta': 'Hap faqen e hotelit në parapamje',
      'cmp.tag': 'Pse me porosi', 'cmp.title': 'E ndërtuar për ty, apo e marrë me qira nga një shabllon', 'cmp.c0': 'Çfarë ka rëndësi', 'cmp.c1': 'Faqe me porosi nga Joel Kaso', 'cmp.c2': 'WordPress, Wix ose shabllon agjencie',
      'cmp.r1': 'Shpejtësia', 'cmp.r1a': 'E ndërtuar me dorë dhe e lehtë, pa plugin. E testuar me Google PageSpeed para se të dalë online.', 'cmp.r1b': 'Temat dhe plugin-et e rënda shpesh hapen për 3 deri 6 sekonda në telefon.',
      'cmp.r2': 'Pagesat mujore', 'cmp.r2a': 'Asnjë pagesë mujore e detyrueshme. Kodi është yti, dhe plani i kujdesit është opsional.', 'cmp.r2b': 'Shpesh 30–100€ në muaj për plugin, hosting dhe mirëmbajtje.',
      'cmp.r3': 'Siguria', 'cmp.r3a': "Pa bazë të dhënash dhe pa plugin, ndaj ka shumë më pak për t'u sulmuar dhe asgjë për t'u përditësuar.", 'cmp.r3b': 'Plugin-et duan përditësime të vazhdueshme, dhe një i vjetër është një derë e zakonshme për sulme.',
      'cmp.r4': 'Kërkesat', 'cmp.r4a': 'Rezervimet dhe mesazhet të vijnë në WhatsApp ose Telegram për pak sekonda.', 'cmp.r4b': 'Një formular i zakonshëm që shpesh përfundon te spam-i.',
      'work.tag': 'Faqe demo', 'work.title': 'Punë të zgjedhura', 'work.all': 'Të gjitha', 'work.stay': 'Hotele dhe akomodime', 'work.food': 'Restorante dhe ushqim', 'work.local': 'Shërbime lokale', 'work.film': 'Filma me scroll',
      'cta.work': 'Dua një faqe si këto', open: 'Hap faqen →', shot: ', pamje e faqes', film: '▶ Film me scroll',
      'services.tag': 'Çmime fikse', 'services.title': 'Paketat & çmimet', 'services.lead': 'Çdo faqe projektohet posaçërisht për biznesin tënd, pa pagesa mujore të detyruara. Merr rezervime direkte me 0% komision, me kërkesa të menjëhershme në WhatsApp ose me kalendar rezervimi brenda faqes. Dhe kur të duhet, faqja lidhet edhe me mjetet që përdor tashmë (OpenTable, Fresha, Booksy, Airbnb ose Booking.com).',
      'plan1.name': 'Essential Landing', 'plan1.for': 'Një faqe e vetme që kthen vizitorët në mesazhe: për kafene, berberë, mjeshtër dhe evente.',
      'plan2.name': 'Business Pro', 'plan2.for': 'Për restorante, sallone, klinika dhe studio që marrin kërkesa dhe rezervime çdo ditë.',
      'plan3.name': 'Custom Signature', 'plan3.for': 'Për hotele dhe marka që duan një faqe unike, me lëvizje dhe kërkesa që shpërndahen vetë.',
      'plan.ask': 'Fillo me këtë', 'plan.see': 'Shiko shembullin', 'plan.popular': 'Më e kërkuara', 'plan.from': 'nga', 'plan.note': '50% paradhënie për të nisur, 50% në publikim.', 'pkg1.wa': 'Përshëndetje Joel, më intereson paketa Essential Landing për website.', 'pkg2.wa': 'Përshëndetje Joel, më intereson paketa Business Pro për website.', 'pkg3.wa': 'Përshëndetje Joel, më intereson paketa Custom Signature për website.',
      'plan1.items': ['Një faqe, deri në 5 seksione', 'Një gjuhë: shqip ose anglisht', 'Buton WhatsApp dhe Google Maps', 'Gati për 3–4 ditë', '2 raunde ndryshimesh'],
      'plan2.items': ['Deri në 5 faqe', 'Dygjuhëshe, me ndërrues EN/SQ', 'Formular kërkese ose rezervimi me porosi, plus WhatsApp', 'Gati për 5–10 ditë', '2 raunde ndryshimesh'],
      'plan3.items': ['Dizajn tërësisht me porosi', 'Film me scroll dhe koreografi interaktive në hyrje', 'Lokalizim dygjuhësh EN/SQ', 'Shpërndarje automatike e kërkesave: webhooks, n8n ose CRM-ja jote', 'Gati për 10–14 ditë', '3 raunde ndryshimesh'],
      'care.tag': 'Opsional, pas publikimit', 'care.title': 'Plani i kujdesit · 25€ në muaj', 'care.cta': 'Pyet për planin e kujdesit', 'care.wa': 'Përshëndetje Joel, dua të di më shumë për planin e kujdesit.',
      'care.text': 'Më dërgon ndryshimet e teksteve, çmimeve dhe fotove dhe i bëj unë, zakonisht brenda dy ditësh. Çdo muaj kontrolloj që faqja, rezervimi dhe profili yt në Google punojnë. Mund ta ndalosh kur të duash: faqja mbetet e jotja.',
      'rev.tag': 'Fjalët e klientëve', 'rev.title': 'Çfarë thonë klientët', 'rev.visit': 'Shiko faqen →', 'rev.todo': 'TODO: shto këtu një vlerësim real nga një klient (fjalët, emri dhe biznesi, me lejen e klientit).',
      'q.tag': 'Ofertë e shpejtë', 'q.title': 'Planifiko faqen në tre hapa', 'q.lead': "Zgjidh biznesin dhe çfarë të duhet. Çmimin dhe kohën i sheh menjëherë, dhe me një prekje m'i dërgon mua.",
      'q.s1': 'Biznesi yt', 'q.s2': 'Funksionet', 'q.s3': 'Përmbledhja', 'q.type': 'Çfarë lloj biznesi ke?', 'q.need': 'Çfarë duhet të bëjë faqja?', 'q.sum': 'Projekti yt',
      'q.d1': 'Biznesi', 'q.d2': 'Funksionet', 'q.d3': 'Koha e përafërt', 'q.d5': 'Në stilin e', 'q.price': 'Paketa', 'q.from': 'nga',
      'q.note': 'Gjithçka që zgjedh përfshihet. 50% paradhënie për të nisur, 50% në publikim, pa pagesa mujore.',
      'q.send': 'Dërgo projektin në WhatsApp', 'q.copy': 'Kopjo përmbledhjen', 'q.back': 'Prapa', 'q.next': 'Vazhdo',
      'q.copied': 'U kopjua. Ngjite në një email ose mesazh për mua.', 'q.copyfail': 'Kopjimi është i bllokuar në këtë shfletues. Përdor butonin WhatsApp.',
      'q.days': '{a}–{b} ditë',
      'q.types': { stay: 'Hotel ose bujtinë', food: 'Restorant ose bar', beauty: 'Sallon ose klinikë', trade: 'Zanat lokal', other: 'Diçka tjetër' },
      'q.needs': { booking: 'Sistem rezervimi direkt', wa: 'Porosi në WhatsApp', langs: 'Anglisht dhe shqip', menu: 'Menu ose çmime që i ndryshon vetë', google: 'Profili në Google dhe SEO lokale', gallery: 'Galeri fotosh', vouchers: 'Kupona dhuratë' },
      'q.msg': 'Përshëndetje Joel, dua një ofertë për website. Biznesi: {type}, çfarë më duhet: {needs}.{like}\nPaketa: {price}, rreth {time}.', 'q.like': '\nNë stilin e: {name}.',
      'process.tag': 'Si punoj', 'process.title': 'Nga telefonata te faqja online',
      's1.d': '20 minuta', 's1.t': 'Telefonatë e shkurtër ose bisedë në WhatsApp', 's1.p': 'Flasim për biznesin tënd, dhomat ose shërbimet, dhe qëllimet e tua.',
      's2.d': 'Brenda 48 orëve', 's2.t': 'Parapamje falas e faqes kryesore në telefon', 's2.p': 'Provon në telefonin tënd versionin e parë të faqes kryesore, para se të paguash asnjë qindarkë.',
      's3.d': 'Ditët 3–14', 's3.t': 'Ndërtimi i plotë', 's3.p': 'Rezervim direkt, WhatsApp, harta dhe shqip/anglisht, të testuara në çdo ekran.',
      's4.d': 'Dita e nisjes', 's4.t': 'Online, me video udhëzuese', 's4.p': 'Domain-i yt, profili në Google dhe një video e shkurtër si ta ndryshosh.',
      'g.title': 'Gjysma për të nisur, gjysma në publikim.', 'g.text': 'Fillimisht shikon falas një parapamje të faqes kryesore. Një paradhënie prej 50% nis ndërtimin, dhe 50% tjetër paguhet në publikim, pasi ta kesh parë faqen e mbaruar në një lidhje private në telefonin tënd.', 'g.cta': 'Rezervo një telefonatë falas',
      'about.tag': 'Rreth meje', 'about.title': 'Kush e ndërton faqen tënde',
      'about.p1': 'Jam Joel, dizajner web nga Shqipëria. Ndërtoj faqe të shpejta dhe të bukura për hotele, restorante dhe biznese lokale. Dizajnin, kodin dhe konfigurimin i bëj vetë, ndaj flet me një person të vetëm.',
      'about.items': ['Përgjigjem brenda 24 orëve, në shqip ose anglisht', 'Çmim fiks: 50% paradhënie për të nisur, 50% në publikim', 'Faqja është e jotja. Pa pagesa mujore, përveç nëse zgjedh planin e kujdesit'],
      'faq.tag': 'Pyetje', 'faq.title': 'Pyetje të shpeshta', 'faq.lead': 'Gjithçka që duhet të dish para se të fillojmë.',
      'faq.q1': 'A ka pagesa mujore pasi faqja del online?', 'faq.a1': 'Nga unë nuk ka pagesa mujore, përveç nëse zgjedh planin opsional të kujdesit për 25€ në muaj, që mund ta ndalosh kur të duash. Paguan një herë për dizajnin dhe ndërtimin, dhe faqja është 100% e jotja. Domain-i regjistrohet në emrin dhe llogarinë tënde, ndaj e zotëron direkt.',
      'faq.q2': 'Sa zgjat nga fillimi deri në fund?', 'faq.a2': 'Essential Landing zgjat 3–4 ditë, Business Pro 5–10 ditë dhe Custom Signature 10–14 ditë. Brenda 48 orëve nga telefonata e parë merr falas një parapamje të faqes kryesore në telefon, dhe faqja e plotë vjen pas saj.',
      'faq.q3': "A mund t'i ndryshoj vetë çmimet, fotot ose menunë më vonë?", 'faq.a3': "Po. Kur e nisim, të dërgoj një video të shkurtër që të tregon saktësisht si t'i ndryshosh tekstet, çmimet dhe fotot për pak minuta, pa njohuri teknike.",
      'faq.q4': 'Si më vijnë rezervimet dhe porositë?', 'faq.a4': 'Si të të vijë më lehtë. Kërkesat mund të shkojnë direkt në WhatsApp-in tënd me të dhënat e klientit të plotësuara, në email, ose në një kalendar rezervimesh.',
      'faq.q5': 'Si bëhet pagesa?', 'faq.a5': 'Paradhënie 50% për të nisur dhe 50% kur faqja del online. Para se të paguash diçka merr falas një parapamje të faqes kryesore, dhe faqen e mbaruar e shikon në një lidhje private para pagesës së dytë.',
      'faq.q6': 'Kujt i përket domain-i dhe faqja?', 'faq.a6': 'Ty. Domain-i regjistrohet në emrin tënd dhe kodi të dorëzohet ty, ndaj mund ta lëvizësh ose të ndryshosh dizajner kur të duash.',
      'contact.tag': 'Kontakt', 'contact.title': 'Le ta ndërtojmë tëndin', 'contact.lead': 'Më trego për biznesin tënd, shqip ose anglisht. Përgjigjem brenda 24 orëve.',
      'f.name': 'Emri', 'f.business': 'Biznesi (jo i detyrueshëm)', 'f.email': 'Email', 'f.msg': 'Çfarë të duhet?', 'f.send': 'Dërgo',
      'f.note': "Mesazhi shkon në emailin tim përmes FormSubmit. E përdor vetëm për t'u përgjigjur.",
      err: { name: 'Shkruaj emrin.', email: 'Shkruaj një email të plotë.', rate: 'Shumë mesazhe në pak kohë. Prit një minutë, ose më shkruaj në WhatsApp.' },
      ok: 'Po hapet aplikacioni i emailit me mesazhin gati. Shtyp Dërgo atje.', sent: 'Faleminderit, mesazhi u dërgua. Përgjigjem brenda 24 orëve.', sending: 'Po dërgohet…', subject: 'Kërkesë për website',
      'case.quote': 'Në vend që të humbasim deri në 18% komision për çdo rezervim në platforma ndërmjetëse, turistët që na gjejnë në Google tani shohin dhomat në shqip ose anglisht dhe na dërgojnë kërkesën direkt në WhatsApp me datat e sakta.', 'case.quoteBy': 'Hotel Kaso Ervehe, Përmet', 'footer.live': 'Projekti i veçantë, Hotel Kaso Ervehe, është faqe reale dhe online e një klienti. Çdo faqe me etiketën Demo (si Vjosa Rafting dhe Ura Coffee Roasters) është ndërtim demo, të bëra për të treguar si funksionojnë rezervimet dhe porositë. Fotot e demove: Wikimedia Commons, të përmendura në secilën faqe.',
      'footer.note': 'Hotel Kaso Ervehe (hoteli i familjes sime në Përmet) dhe Brolin Tattoo (artist tatuazhesh në Athinë) janë klientë realë. Çdo faqe me etiketën Demo (si Vjosa Rafting dhe Ura Coffee Roasters) është ndërtim demo me emra të shpikur, të bëra për të treguar si funksionojnë rezervimet dhe porositë. Fotot e demove: Wikimedia Commons, të përmendura në secilën faqe.', 'footer.privacy': 'Politika e privatësisë', 'footer.top': 'Kthehu lart ↑',
      'viewer.desk': 'Kompjuter', 'viewer.phone': 'Telefon', 'viewer.qr': 'Provoje në telefon', 'viewer.qrhint': 'Drejtoje kamerën e telefonit te kodi për ta hapur këtë faqe në telefonin tënd.',
      'viewer.want': 'Dua një faqe si kjo', 'viewer.open': 'Hap në skedë të re ↗', 'wa.msg': 'Përshëndetje Joel, pashë portofolin tënd dhe më intereson një website.',
      'tier.starter': 'Shembull i paketës Essential Landing · nga 150€', 'tier.business': 'Shembull i paketës Business Pro · nga 300€', 'tier.premium': 'Shembull i paketës Custom Signature · 600€+', 'tier.premiumLive': 'Custom Signature · faqe klienti live · 600€+',
      'wall.title': 'Faqe demo që mund t’i provosh', 'wall.lead': 'Prek çdo ekran dhe provoje faqen si klientët e tu.',
      'dome.title': 'Faqja jote, në telefon', 'dome.lead': 'Shumica e klientëve do ta shohin faqen tënde në telefon. Prek këtë për të provuar Hotel Kaso Ervehe.',
      'dome.aria': 'Hap faqen e Hotel Kaso Ervehe në parapamje'
    }
  }

  var lang = 'en'
  try { var st = localStorage.getItem('jk-lang'); if (st === 'sq' || st === 'en') lang = st; else if ((navigator.languages || []).some(function (l) { return /^sq/i.test(l) })) lang = 'sq' } catch (e) {}
  // ?lang=sq or ?lang=en in the address wins, so each language has its own link for Google and for sharing.
  var ql = (location.search.match(/[?&]lang=(en|sq)\b/) || [])[1]; if (ql) lang = ql
  var pageUrl = function () { return location.pathname + (lang === 'sq' ? '?lang=sq' : '') + location.hash }
  var t = function (k) { return T[lang][k] }
  var money = function (n) { return n.toLocaleString('de-DE') + '€' } // Joel's format in both languages: 1.190€
  // "Essential Landing example · from 150€" for a site in TIER, or '' for the others.
  var tierLabel = function (w) { var k = w && TIER[w.id]; return k ? t(k === 'premium' && KASO_LIVE ? 'tier.premiumLive' : 'tier.' + k) : '' }
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  var filter = 'all'
  var matchesF = function (f, w) { return f === 'all' || (f === 'film' ? !!w.film : w.category === f) }
  var matches = function (w) { return matchesF(filter, w) }

  // Cursor spotlight on cards (mouse screens only).
  function spot(el) {
    if (!fine || el.dataset.spot) return
    el.dataset.spot = '1'
    el.addEventListener('pointermove', function (e) { var r = el.getBoundingClientRect(); el.style.setProperty('--mx', (e.clientX - r.left) + 'px'); el.style.setProperty('--my', (e.clientY - r.top) + 'px') })
  }

  // Sites hosted elsewhere (isExternal) show the real site live in the card: a desktop and a phone frame, scaled down,
  // loaded lazily and not clickable (the card link still opens the viewer). The img/ shots stay underneath as the poster.
  function liveShot(shot, w) {
    ;[['desk', 1280, 800], ['phone', 390, 844]].forEach(function (k) {
      var box = document.createElement('div'), f = document.createElement('iframe')
      box.className = 'live live--' + k[0]; box.setAttribute('aria-hidden', 'true')
      f.src = w.link; f.title = w.name; f.loading = 'lazy'; f.tabIndex = -1; f.width = k[1]; f.height = k[2]
      f.setAttribute('sandbox', 'allow-scripts allow-same-origin')
      box.appendChild(f); shot.appendChild(box)
      var fit = function () { if (box.clientWidth) box.style.setProperty('--s', box.clientWidth / k[1]) }
      if (window.ResizeObserver) new ResizeObserver(fit).observe(box); else window.addEventListener('resize', fit)
      fit()
    })
  }

  function renderWork() {
    var grid = $('#work-grid'); grid.innerHTML = ''
    WORK.forEach(function (w, i) {
      var a = document.createElement('a')
      a.className = 'item spot reveal' + (!matches(w) ? ' is-hidden' : '')
      a.href = siteUrl(w); a.target = '_blank'; a.rel = 'noopener noreferrer'
      a.style.transitionDelay = (i % 2) * 90 + 'ms'
      a.innerHTML = '<div class="item__shot"><img class="desk" loading="lazy" decoding="async" alt=""><img class="phone" loading="lazy" decoding="async" alt=""></div>' +
        '<div class="item__meta"><h3></h3><span class="badge"></span></div><p class="item__where"></p><p class="item__outcome"></p><p class="item__tier" hidden></p><ul class="chips"></ul><span class="item__open"></span>'
      var imgs = a.querySelectorAll('img')
      imgs[0].width = 1200; imgs[0].height = 750; imgs[1].width = 390; imgs[1].height = 844
      var base = w.image.replace(/-desk\.webp$/, '') // img/<id>: the 600px and phone shots share the name
      imgs[0].src = w.image; imgs[0].alt = w.name + t('shot')
      imgs[0].srcset = base + '-desk-600.webp 600w, ' + w.image + ' 1200w'
      imgs[0].sizes = '(min-width: 900px) 45vw, 92vw'
      imgs[1].srcset = base + '-phone-260.webp 260w, ' + base + '-phone.webp 390w'; imgs[1].sizes = '(min-width: 900px) 10vw, 21vw'
      imgs[1].src = base + '-phone.webp' // alt stays empty: the desktop shot already names the site
      a.querySelector('h3').textContent = w.name
      var tk = w.isReal ? 'client' : (w.tag || 'demo')
      var tag = a.querySelector('.badge'); tag.textContent = TAGS[tk][lang]; tag.classList.add('badge--' + tk)
      if (w.film) { var fb = document.createElement('span'); fb.className = 'film-badge'; fb.textContent = t('film'); a.querySelector('.item__shot').appendChild(fb) }
      a.querySelector('.item__where').textContent = w.where[lang]
      var oc = a.querySelector('.item__outcome'); if (w.description) oc.textContent = w.description[lang]; else oc.remove()
      var tierEl = a.querySelector('.item__tier'); tierEl.textContent = tierLabel(w); tierEl.hidden = !tierEl.textContent
      w.chips[lang].forEach(function (c) { var li = document.createElement('li'); li.textContent = c; a.querySelector('.chips').appendChild(li) })
      a.querySelector('.item__open').textContent = t('open')
      a.addEventListener('click', function (e) {
        // Ctrl/Cmd/Shift-click or middle-click still opens a real new tab.
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        openViewer(w)
      })
      if (isExternal(w)) liveShot(a.querySelector('.item__shot'), w)
      spot(a)
      grid.appendChild(a)
    })
    observe()
  }

  function setAttr(sel, attr, val) { var el = $(sel); if (el) el.setAttribute(attr, val) }
  function renderReviews() {
    var sec = $('#reviews'), list = $('#reviews-list')
    sec.hidden = !REVIEWS.length && !REVIEW_PLACEHOLDER
    list.textContent = ''
    if (!REVIEWS.length && REVIEW_PLACEHOLDER) {
      var ph = document.createElement('figure'), pt = document.createElement('p')
      ph.className = 'review review--todo card'; pt.textContent = t('rev.todo'); ph.appendChild(pt); list.appendChild(ph)
    }
    REVIEWS.forEach(function (r) {
      var fig = document.createElement('figure'), q = document.createElement('blockquote'), p = document.createElement('p'), cap = document.createElement('figcaption'), b = document.createElement('b'), s = document.createElement('span')
      fig.className = 'review card spot'
      p.textContent = r.quote[lang] || r.quote.en; q.appendChild(p)
      b.textContent = r.name; s.textContent = r.role[lang] || r.role.en
      cap.appendChild(b); cap.appendChild(s)
      if (r.url) { var a = document.createElement('a'); a.href = r.url; a.target = '_blank'; a.rel = 'noopener'; a.textContent = t('rev.visit'); cap.appendChild(a) }
      fig.appendChild(q); fig.appendChild(cap); list.appendChild(fig)
    })
  }

  function applyLang() {
    var tt = T[lang], url = BASE + (lang === 'sq' ? '?lang=sq' : '')
    document.documentElement.lang = lang
    document.title = tt.title
    ;['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]'].forEach(function (s) { setAttr(s, 'content', tt.desc) })
    ;['meta[property="og:title"]', 'meta[name="twitter:title"]'].forEach(function (s) { setAttr(s, 'content', tt.title) })
    setAttr('link[rel="canonical"]', 'href', url); setAttr('meta[property="og:url"]', 'content', url)
    $$('[data-wa]').forEach(function (a) { a.href = 'https://wa.me/355685727406?text=' + encodeURIComponent(tt[a.getAttribute('data-wa') || 'wa.msg']) })
    $$('[data-privacy]').forEach(function (a) { a.setAttribute('href', 'privacy.html' + (lang === 'sq' ? '#sq' : '')) })
    $$('[data-i18n]').forEach(function (el) { var v = tt[el.getAttribute('data-i18n')]; if (typeof v === 'string') el.textContent = v })
    $$('[data-i18n-alt]').forEach(function (el) { el.alt = tt[el.getAttribute('data-i18n-alt')] })
    $$('[data-i18n-aria]').forEach(function (el) { el.setAttribute('aria-label', tt[el.getAttribute('data-i18n-aria')]) })
    $$('[data-list]').forEach(function (ul) {
      ul.innerHTML = ''
      tt[ul.getAttribute('data-list')].forEach(function (x) { var li = document.createElement('li'); li.textContent = x; ul.appendChild(li) })
    })
    $$('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang)) })
    $$('[data-money]').forEach(function (el) { el.textContent = money(+el.getAttribute('data-money')) })
    var spots = $('#offer-spots')
    spots.hidden = typeof SPOTS_LEFT !== 'number'
    if (!spots.hidden) spots.textContent = t('offer.spots').replace('{n}', SPOTS_LEFT)
    $('#case-quote').hidden = !KASO_QUOTE
    if (KASO_LIVE) $('#footer-note').textContent = t('footer.live')
    $$('[data-tag]').forEach(function (el) { var k = el.getAttribute('data-tag'); el.textContent = TAGS[k][lang]; el.className = 'badge badge--' + k })
    renderWork(); renderSim(); renderRoi(); renderReviews(); buildOpts(); renderQuote()
  }

  $$('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { lang = b.getAttribute('data-lang'); try { localStorage.setItem('jk-lang', lang); history.replaceState(null, '', pageUrl()) } catch (e) {} ; applyLang() })
  })
  // A filter with no matching project is hidden ("All" always shows).
  $$('.filters button').forEach(function (b) { b.hidden = !WORK.some(function (w) { return matchesF(b.dataset.f, w) }) })
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

  // Process timeline: the gold line grows as the section passes 60% of the screen; each dot lights when the line reaches it.
  var tl = $('.timeline')
  if (tl) {
    var steps = $$('li', tl), tlBusy = false
    var drawLine = function () {
      tlBusy = false
      var r = tl.getBoundingClientRect(), p = reduce ? 1 : Math.min(1, Math.max(0, (innerHeight * .6 - r.top) / r.height))
      tl.style.setProperty('--p', p.toFixed(4))
      steps.forEach(function (li) { li.classList.toggle('is-on', li.offsetTop + 16 <= p * r.height + 1) })
    }
    addEventListener('scroll', function () { if (!tlBusy) { tlBusy = true; requestAnimationFrame(drawLine) } }, { passive: true })
    addEventListener('resize', drawLine)
    drawLine()
  }

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

  // Savings slider: bookings a month × 100€ average × 18% commission.
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
        status.className = 'form-status is-ok'; status.textContent = t('sent'); form.reset(); track('form-sent')
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
    if (open && viewing && window.JKQR) $('#viewer-qr-svg').innerHTML = window.JKQR.svg(new URL(siteUrl(viewing), location.href).href)
  }
  qrBtn.addEventListener('click', function () { setQr(qrBox.hidden) })
  function openViewer(w) {
    var url = siteUrl(w)
    viewing = w
    $('#viewer-title').textContent = w.name
    var vt = $('#viewer-tier'); vt.textContent = tierLabel(w); vt.hidden = !vt.textContent
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
  // For depth.js (3D wall): the site list and the viewer.
  window.JK = { work: WORK, open: function (id) { var w = WORK.find(function (x) { return x.id === id }); if (w) openViewer(w) } }
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
  // Each business type starts on a package; a starter business that picks a Business Pro feature moves up to Business Pro.
  // Prices are the packages' "from" prices; days are each package's delivery time.
  var PACKAGE = { starter: 'Essential Landing', business: 'Business Pro', premium: 'Custom Signature' }
  var FROM = { starter: 150, business: 300, premium: 600 }
  var DAYS = { starter: [3, 4], business: [5, 10], premium: [10, 14] }
  var PLAN = { stay: 'premium', food: 'business', beauty: 'business', trade: 'starter', other: 'starter' }
  var UPGRADE = ['booking', 'langs', 'menu', 'google']
  var CHECK = '<i aria-hidden="true"><svg class="ico"><use href="#i-check"/></svg></i>'
  function quoteFacts() {
    var needs = t('q.needs'), list = Object.keys(needs).filter(function (k) { return Q.needs.indexOf(k) >= 0 }).map(function (k) { return needs[k] })
    var plan = PLAN[Q.type]
    if (plan === 'starter' && Q.needs.some(function (k) { return UPGRADE.indexOf(k) >= 0 })) plan = 'business'
    var d = DAYS[plan]
    return { type: t('q.types')[Q.type], list: list, time: t('q.days').replace('{a}', d[0]).replace('{b}', d[1]), price: PACKAGE[plan] + ' · ' + (plan === 'premium' ? money(FROM[plan]) + '+' : t('q.from') + ' ' + money(FROM[plan])) }
  }
  function quoteText(f) {
    return t('q.msg').replace('{type}', f.type).replace('{needs}', f.list.length ? f.list.join(', ') : '—')
      .replace('{like}', Q.like ? t('q.like').replace('{name}', Q.like) : '').replace('{time}', f.time).replace('{price}', f.price)
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
    $('#q-price').textContent = f.price
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
    track('quote-copy')
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fail); else fail()
  })

  // "I want a site like this" in the viewer opens WhatsApp itself (data-wa); this only counts which site sparked it and closes the viewer.
  $('#viewer-want').addEventListener('click', function () {
    if (viewing) track('viewer-want-' + viewing.id)
    closeViewer()
  })

  // Phone menu: the button opens the same five links; a link, Escape or a second tap closes it.
  var nav = $('.nav'), toggle = $('.nav__toggle')
  function setMenu(open) { nav.classList.toggle('is-open', open); toggle.setAttribute('aria-expanded', String(open)) }
  toggle.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')) })
  $('#nav-links').addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false) })
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus() } })

  // Phones: the WhatsApp and chat buttons step aside while the quote calculator is on screen, so they never cover its
  // options or the Back / Next buttons (style.css, .fab-away). The calculator has its own WhatsApp button.
  var quoteSec = $('#quote')
  if (quoteSec && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { document.documentElement.classList.toggle('fab-away', es[0].isIntersecting) }, { rootMargin: '0px 0px -96px 0px' }).observe(quoteSec)
  }

  // While the hero is on screen the chat button (all widths) and the WhatsApp button (desktop) stay hidden, so they never cover the hero demo (style.css, .on-hero).
  var heroSec = $('#top')
  if (heroSec && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('on-hero')
    new IntersectionObserver(function (es) { document.documentElement.classList.toggle('on-hero', es[0].isIntersecting) }).observe(heroSec)
  }

  $('#year').textContent = new Date().getFullYear()
  applyLang()
  openFromLink()
})()
