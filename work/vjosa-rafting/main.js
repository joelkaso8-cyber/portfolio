// Vjosa Rafting (sample business, demo by Joel Kaso): trips, booking widget with a live total, WhatsApp request, EN/SQ.
import { createKit, $, $$, isoToday } from '../demo-kit/kit.js'

// [TODO: real WhatsApp number] Digits only, with country code, e.g. '3556XXXXXXXX'. While it is empty, the button opens
// WhatsApp with the message ready and the visitor picks the chat themselves, so no stranger's number is ever used.
const WHATSAPP = ''

// The trips. Prices are sample prices (demo data). level: 1 easy, 2 medium, 3 hard. hours on the water.
const TRIPS = [
  { id: 'splash', hours: 2, level: 1, price: 30, name: { en: 'First Splash', sq: 'Spërkatja e Parë' },
    text: { en: 'Calm water and small rapids. Right for a first time on a raft.', sq: 'Ujë i qetë dhe rrëmbime të vogla. E duhura për herën e parë në gomone.' } },
  { id: 'canyon', hours: 3.5, level: 2, price: 45, name: { en: 'Canyon Run', sq: 'Kanioni' },
    text: { en: 'Longer rapids between high canyon walls, with a swim stop.', sq: 'Rrëmbime më të gjata mes mureve të larta të kanionit, me një ndalesë për not.' } },
  { id: 'gorge', hours: 6, level: 3, price: 70, name: { en: 'Full Gorge', sq: 'Gryka e Plotë' },
    text: { en: 'The whole run and the strongest water, with lunch on the riverbank.', sq: 'I gjithë lumi dhe uji më i fortë, me drekë në breg të lumit.' } },
]

const dict = {
  en: {
    'info.text': 'A rafting and river-trip business. Visitors pick a trip, a date and their group, then send the booking on WhatsApp.',
    'info.f1': 'Three trips with level, time and price', 'info.f2': 'Booking widget with a live total', 'info.f3': 'The request opens in WhatsApp, already written', 'info.f4': 'English and Albanian',
    'nav.trips': 'Trips', 'nav.safety': 'Safety', 'nav.gallery': 'Gallery',
    'todo.photo': '[TODO: replace with real photo]', 'todo.weather': '[TODO: real river and weather data]', 'todo.age': '[TODO: minimum age]', 'todo.meet': '[TODO: meeting point]', 'todo.season': '[TODO: season dates]',
    'hero.alt': 'Placeholder illustration: a raft on a river between mountains', 'hero.eyebrow': 'Vjosa river · southern Albania', 'hero.title': 'Wild water, calm guides.',
    'hero.sub': 'Half-day and full-day rafting for first-timers and old hands. Helmet, vest and paddle included.', 'hero.cta': 'Book a trip', 'hero.more': 'See the trips',
    'facts.label': 'At a glance', 'facts.trips': 'trips, easy to hard', 'facts.group': 'people per booking', 'facts.time': 'on the water',
    'trips.title': 'Pick your trip', 'trips.intro': 'Three sample trips. Prices are demo data.',
    'lvl.1': 'Easy', 'lvl.2': 'Medium', 'lvl.3': 'Hard', 'lvl.label': 'Level', 'h': ' h',
    'trip.sample': 'Sample price', 'trip.pp': 'per person', 'trip.pick': 'Select', 'trip.picked': 'Selected',
    'book.title': 'Book your trip', 'book.intro': 'Choose the trip, the day and your group. The total updates as you go.',
    'book.trip': 'Trip', 'book.date': 'Date', 'book.people': 'People', 'book.less': 'One person less', 'book.more': 'One person more',
    'book.max': 'Up to 12 people. Bigger group? Message us.', 'book.total': 'Total', 'book.sample': 'sample price',
    'book.send': 'Send request', 'book.after': 'Opens WhatsApp with your request already written. Nothing is booked until the guides reply.',
    'wa.hi': 'Hello Vjosa Rafting, I would like to book a trip.', 'wa.trip': 'Trip', 'wa.date': 'Date', 'wa.people': 'People', 'wa.total': 'Total',
    'safety.title': 'Check conditions before booking', 'safety.intro': 'The Vjosa changes with rain and snowmelt. On high water the guides move you to an easier stretch or a new date, at no cost.',
    'safety.level': 'River level', 'safety.weather': 'Weather',
    'safety.l1': 'Helmet, vest and paddle for every rafter', 'safety.l2': 'A safety talk on the bank before you get in', 'safety.l3': 'One guide in every raft', 'safety.l4': 'Minimum age:',
    'gallery.title': 'From the river', 'gallery.intro': 'Six photo slots, ready for the real trips.',
    'g.1': 'Placeholder: the river from above', 'g.2': 'Placeholder: a raft in a rapid', 'g.3': 'Placeholder: lunch on the riverbank', 'g.4': 'Placeholder: guides with the group', 'g.5': 'Placeholder: the canyon walls', 'g.6': 'Placeholder: the meeting point at the start',
    'foot.meet': 'Meeting point', 'foot.season': 'Season', 'foot.sample': '(sample number)',
    'foot.legal': 'Vjosa Rafting is a sample business made for a demo. Trips, prices and contact details are not real.',
  },
  sq: {
    'info.text': 'Një biznes raftingu dhe udhëtimesh në lumë. Vizitorët zgjedhin udhëtimin, datën dhe grupin, pastaj e dërgojnë rezervimin në WhatsApp.',
    'info.f1': 'Tre udhëtime me nivel, kohë dhe çmim', 'info.f2': 'Rezervim me totalin që llogaritet menjëherë', 'info.f3': 'Kërkesa hapet në WhatsApp, e shkruar gati', 'info.f4': 'Anglisht dhe shqip',
    'nav.trips': 'Udhëtimet', 'nav.safety': 'Siguria', 'nav.gallery': 'Galeria',
    'todo.photo': '[TODO: zëvendëso me foto reale]', 'todo.weather': '[TODO: të dhëna reale për lumin dhe motin]', 'todo.age': '[TODO: mosha minimale]', 'todo.meet': '[TODO: pika e takimit]', 'todo.season': '[TODO: datat e sezonit]',
    'hero.alt': 'Ilustrim zëvendësues: një gomone në lumë mes maleve', 'hero.eyebrow': 'Lumi Vjosa · Shqipëri e jugut', 'hero.title': 'Ujë i egër, udhërrëfyes të qetë.',
    'hero.sub': 'Rafting gjysmë dite ose ditë të plotë, për fillestarë dhe të sprovuar. Helmeta, jeleku dhe rremi përfshihen.', 'hero.cta': 'Rezervo një udhëtim', 'hero.more': 'Shiko udhëtimet',
    'facts.label': 'Me një shikim', 'facts.trips': 'udhëtime, nga i lehtë te i vështirë', 'facts.group': 'persona për rezervim', 'facts.time': 'në ujë',
    'trips.title': 'Zgjidh udhëtimin', 'trips.intro': 'Tre udhëtime shembull. Çmimet janë të dhëna demo.',
    'lvl.1': 'I lehtë', 'lvl.2': 'Mesatar', 'lvl.3': 'I vështirë', 'lvl.label': 'Niveli', 'h': ' orë',
    'trip.sample': 'Çmim shembull', 'trip.pp': 'për person', 'trip.pick': 'Zgjidh', 'trip.picked': 'Zgjedhur',
    'book.title': 'Rezervo udhëtimin', 'book.intro': 'Zgjidh udhëtimin, ditën dhe grupin. Totali ndryshon ndërsa zgjedh.',
    'book.trip': 'Udhëtimi', 'book.date': 'Data', 'book.people': 'Persona', 'book.less': 'Një person më pak', 'book.more': 'Një person më shumë',
    'book.max': 'Deri në 12 persona. Grup më i madh? Na shkruaj.', 'book.total': 'Totali', 'book.sample': 'çmim shembull',
    'book.send': 'Dërgo kërkesën', 'book.after': 'Hap WhatsApp me kërkesën të shkruar gati. Asgjë nuk rezervohet pa u përgjigjur udhërrëfyesit.',
    'wa.hi': 'Përshëndetje Vjosa Rafting, dua të rezervoj një udhëtim.', 'wa.trip': 'Udhëtimi', 'wa.date': 'Data', 'wa.people': 'Persona', 'wa.total': 'Totali',
    'safety.title': 'Kontrollo kushtet para rezervimit', 'safety.intro': 'Vjosa ndryshon me shiun dhe shkrirjen e borës. Kur uji është i lartë, udhërrëfyesit të kalojnë në një pjesë më të lehtë ose në një datë tjetër, pa pagesë.',
    'safety.level': 'Niveli i lumit', 'safety.weather': 'Moti',
    'safety.l1': 'Helmetë, jelek dhe rrem për çdo pjesëmarrës', 'safety.l2': 'Udhëzime sigurie në breg para se të hipësh', 'safety.l3': 'Një udhërrëfyes në çdo gomone', 'safety.l4': 'Mosha minimale:',
    'gallery.title': 'Nga lumi', 'gallery.intro': 'Gjashtë vende për foto, gati për udhëtimet e vërteta.',
    'g.1': 'Zëvendësues: lumi nga lart', 'g.2': 'Zëvendësues: një gomone në rrëmbim', 'g.3': 'Zëvendësues: drekë në breg të lumit', 'g.4': 'Zëvendësues: udhërrëfyesit me grupin', 'g.5': 'Zëvendësues: muret e kanionit', 'g.6': 'Zëvendësues: pika e takimit në nisje',
    'foot.meet': 'Pika e takimit', 'foot.season': 'Sezoni', 'foot.sample': '(numër shembull)',
    'foot.legal': 'Vjosa Rafting është biznes shembull i krijuar për një demo. Udhëtimet, çmimet dhe kontaktet nuk janë reale.',
  },
}
const titles = {
  en: { title: 'Vjosa Rafting · river trips (demo by Joel Kaso)', desc: 'Demo site by Joel Kaso for a sample rafting business: three trips, a booking widget with a live total and a request sent on WhatsApp. EN and SQ.' },
  sq: { title: 'Vjosa Rafting · udhëtime në lumë (demo nga Joel Kaso)', desc: 'Faqe demo nga Joel Kaso për një biznes raftingu shembull: tre udhëtime, rezervim me total të menjëhershëm dhe kërkesë në WhatsApp. EN dhe SQ.' },
}

const kit = createKit({ name: 'Vjosa Rafting', dict, titles })
const { t, money } = kit
const form = $('#booker'), tripSel = $('#b-trip'), dateIn = $('#b-date'), people = $('#b-people'), send = $('#b-send')
let picked = 'canyon'

const hours = (h) => String(h).replace('.', kit.lang === 'sq' ? ',' : '.') + t('h')
const tripById = (id) => TRIPS.find((x) => x.id === id)
const count = () => Math.min(12, Math.max(1, parseInt(people.value, 10) || 1))

function renderTrips() {
  $('#trip-list').innerHTML = TRIPS.map((x) => `
    <article class="trip${x.id === picked ? ' is-picked' : ''}" data-reveal>
      <h3>${x.name[kit.lang]}</h3>
      <div class="trip__meta">
        <span class="chip"><span class="level" aria-hidden="true">${[1, 2, 3].map((n) => `<i class="${n <= x.level ? 'on' : ''}"></i>`).join('')}</span><span><span class="sr">${t('lvl.label')}: </span>${t('lvl.' + x.level)}</span></span>
        <span class="chip">${hours(x.hours)}</span>
      </div>
      <p>${x.text[kit.lang]}</p>
      <div class="trip__foot">
        <p class="price"><small>${t('trip.sample')}</small><b>${money(x.price)}</b> <span>${t('trip.pp')}</span></p>
        <button class="pick" type="button" data-trip="${x.id}" aria-pressed="${x.id === picked}">${x.id === picked ? t('trip.picked') : t('trip.pick')}</button>
      </div>
    </article>`).join('')
  $$('#trip-list [data-reveal]').forEach((el) => el.classList.add('is-in'))
  tripSel.innerHTML = TRIPS.map((x) => `<option value="${x.id}">${x.name[kit.lang]} · ${hours(x.hours)} · ${t('lvl.' + x.level)} · ${money(x.price)}</option>`).join('')
  tripSel.value = picked
}

// Recomputes the total and rewrites the WhatsApp link on every change.
function update() {
  const x = tripById(picked), n = count()
  $('#b-total').textContent = money(x.price * n)
  $('#b-calc').textContent = `${n} × ${money(x.price)} · ${t('book.sample')}`
  $('[data-step="-1"]').disabled = n <= 1
  $('[data-step="1"]').disabled = n >= 12
  const msg = [t('wa.hi'), '', `${t('wa.trip')}: ${x.name[kit.lang]} (${hours(x.hours)}, ${t('lvl.' + x.level)})`, `${t('wa.date')}: ${dateIn.value || '—'}`,
    `${t('wa.people')}: ${n}`, `${t('wa.total')}: ${money(x.price * n)} (${n} × ${money(x.price)}, ${t('book.sample')})`].join('\n')
  send.href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg)
}

function pick(id, jump) {
  picked = id
  renderTrips(); update()
  if (jump) { $('#book').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); setTimeout(() => tripSel.focus({ preventScroll: true }), 400) }
}

$('#trip-list').addEventListener('click', (e) => { const b = e.target.closest('[data-trip]'); if (b) pick(b.dataset.trip, true) })
tripSel.addEventListener('change', () => pick(tripSel.value, false))
$$('[data-step]').forEach((b) => b.addEventListener('click', () => { people.value = count() + Number(b.dataset.step); people.value = count(); update() }))
people.addEventListener('input', update)
people.addEventListener('change', () => { people.value = count(); update() })
dateIn.min = isoToday()
dateIn.addEventListener('change', () => { if (dateIn.value) kit.field(dateIn, ''); update() })

// The WhatsApp link only opens once a valid date is chosen (YYYY-MM-DD, today or later).
send.addEventListener('click', (e) => {
  const ok = dateIn.value && dateIn.value >= isoToday()
  if (!ok) { e.preventDefault(); kit.field(dateIn, t('kit.err.date')); dateIn.focus() }
})
form.addEventListener('submit', (e) => e.preventDefault())

kit.onLang(() => { renderTrips(); update() })
kit.apply()
