// Lule Balkan Kitchen (sample restaurant, demo by Joel Kaso): menu tabs from menu.js, table reservation,
// takeaway order on WhatsApp, opening hours, EN/SQ.
import { createKit, $, $$, clean, isoToday } from '../demo-kit/kit.js'
import { MENU } from './menu.js'

// [TODO: real WhatsApp number] Digits only with country code. Empty: WhatsApp opens with the order written and the
// visitor picks the chat, so no stranger's number is ever used.
const WHATSAPP = ''
// [TODO: restaurant email] Reservation requests go here through FormSubmit, e.g. 'https://formsubmit.co/ajax/table@example.com'.
// While it holds [TODO], the form only shows its success message plus a "demo, nothing was sent" line.
const RESERVE_ENDPOINT = 'https://formsubmit.co/ajax/[TODO: restaurant email]'
// Opening hours, Monday first. null = closed. Sample hours [TODO: real opening hours].
const HOURS = [null, ['12:00', '22:00'], ['12:00', '22:00'], ['12:00', '22:00'], ['12:00', '23:00'], ['12:00', '23:00'], ['12:00', '21:00']]
// Reservation times offered (every 30 minutes).
const SLOTS = ['12:00', '12:30', '13:00', '13:30', '14:00', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00']

const dict = {
  en: {
    'info.text': 'A Balkan restaurant. Guests read the menu, reserve a table and order takeaway on WhatsApp.',
    'info.f1': 'Menu tabs built from one editable file', 'info.f2': 'Table reservation form', 'info.f3': 'Takeaway order with a live total, sent on WhatsApp', 'info.f4': 'Opening hours, today highlighted',
    'nav.menu': 'Menu', 'nav.reserve': 'Reserve', 'nav.takeaway': 'Takeaway',
    'todo.photo': '[TODO: replace with real photo]', 'todo.dishes': '[TODO: real dish photos]', 'todo.hours': '[TODO: real opening hours]', 'todo.address': '[TODO: address]',
    'hero.eyebrow': 'Balkan home cooking', 'hero.kind': 'Balkan Kitchen', 'hero.tag': 'Byrek from the oven, qofte from the grill, and a table that waits for you.',
    'hero.menu': 'View menu', 'hero.reserve': 'Reserve a table', 'hero.alt': 'Placeholder illustration: a table of Balkan dishes from above',
    'menu.title': 'The menu', 'menu.intro': 'Sample menu. Prices are demo data.', 'menu.tabs': 'Menu categories', 'menu.veg': 'Veg', 'menu.vegfull': 'vegetarian',
    'res.title': 'Reserve a table', 'res.intro': 'Send the request and the restaurant confirms by phone.',
    'res.date': 'Date', 'res.time': 'Time', 'res.pick': 'Choose', 'res.guests': 'Guests', 'res.name': 'Name', 'res.phone': 'Phone', 'res.send': 'Request the table',
    'res.ok': 'Table request received. The restaurant will call you to confirm.', 'res.more': '12+ (call us)',
    'take.title': 'Takeaway & delivery', 'take.intro': 'Choose your dishes and send the order on WhatsApp. Sample prices.',
    'take.mode': 'Pick-up or delivery', 'take.pickup': 'Pick-up', 'take.delivery': 'Delivery', 'take.total': 'Total', 'take.send': 'Order via WhatsApp',
    'take.empty': 'Add at least one dish to order.', 'take.ready': 'Opens WhatsApp with your order written. The restaurant replies with the time.',
    'take.less': 'One less', 'take.more': 'One more',
    'wa.hi': 'Hello Lule, I would like to order for {mode}:', 'wa.pickup': 'pick-up', 'wa.delivery': 'delivery', 'wa.total': 'Total', 'wa.sample': 'sample prices',
    'hours.title': 'Opening hours', 'hours.intro': 'Sample hours.', 'hours.closed': 'Closed', 'hours.today': 'Today',
    'days': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    'foot.address': 'Address', 'foot.phone': 'Phone & WhatsApp', 'foot.sample': '(sample number)',
    'foot.legal': 'Lule Balkan Kitchen is a sample restaurant made for a demo. The menu, prices and contact details are not real.',
  },
  sq: {
    'info.text': 'Një restorant ballkanik. Klientët lexojnë menunë, rezervojnë tavolinë dhe porosisin për ta marrë me vete në WhatsApp.',
    'info.f1': 'Menu me kategori nga një skedar që ndryshohet lehtë', 'info.f2': 'Formular rezervimi tavoline', 'info.f3': 'Porosi me total të menjëhershëm, e dërguar në WhatsApp', 'info.f4': 'Orari, me ditën e sotme të theksuar',
    'nav.menu': 'Menuja', 'nav.reserve': 'Rezervo', 'nav.takeaway': 'Porosi',
    'todo.photo': '[TODO: zëvendëso me foto reale]', 'todo.dishes': '[TODO: foto reale të pjatave]', 'todo.hours': '[TODO: orari real]', 'todo.address': '[TODO: adresa]',
    'hero.eyebrow': 'Gatim shtëpie ballkanik', 'hero.kind': 'Kuzhinë Ballkanike', 'hero.tag': 'Byrek nga furra, qofte nga skara dhe një tavolinë që të pret.',
    'hero.menu': 'Shiko menunë', 'hero.reserve': 'Rezervo tavolinë', 'hero.alt': 'Ilustrim zëvendësues: një tavolinë me pjata ballkanike parë nga lart',
    'menu.title': 'Menuja', 'menu.intro': 'Menu shembull. Çmimet janë të dhëna demo.', 'menu.tabs': 'Kategoritë e menusë', 'menu.veg': 'Veg', 'menu.vegfull': 'vegjetariane',
    'res.title': 'Rezervo tavolinë', 'res.intro': 'Dërgo kërkesën dhe restoranti ta konfirmon në telefon.',
    'res.date': 'Data', 'res.time': 'Ora', 'res.pick': 'Zgjidh', 'res.guests': 'Persona', 'res.name': 'Emri', 'res.phone': 'Telefoni', 'res.send': 'Kërko tavolinën',
    'res.ok': 'Kërkesa për tavolinë u mor. Restoranti të telefonon për ta konfirmuar.', 'res.more': '12+ (na telefono)',
    'take.title': 'Porosi për me vete', 'take.intro': 'Zgjidh pjatat dhe dërgoje porosinë në WhatsApp. Çmime shembull.',
    'take.mode': 'Merre vetë ose me dërgesë', 'take.pickup': 'E marr vetë', 'take.delivery': 'Me dërgesë', 'take.total': 'Totali', 'take.send': 'Porosit në WhatsApp',
    'take.empty': 'Shto të paktën një pjatë për të porositur.', 'take.ready': 'Hap WhatsApp me porosinë të shkruar. Restoranti të përgjigjet me orën.',
    'take.less': 'Një më pak', 'take.more': 'Një më shumë',
    'wa.hi': 'Përshëndetje Lule, dua të porosis ({mode}):', 'wa.pickup': 'e marr vetë', 'wa.delivery': 'me dërgesë', 'wa.total': 'Totali', 'wa.sample': 'çmime shembull',
    'hours.title': 'Orari', 'hours.intro': 'Orar shembull.', 'hours.closed': 'Mbyllur', 'hours.today': 'Sot',
    'days': ['E hënë', 'E martë', 'E mërkurë', 'E enjte', 'E premte', 'E shtunë', 'E diel'],
    'foot.address': 'Adresa', 'foot.phone': 'Telefon dhe WhatsApp', 'foot.sample': '(numër shembull)',
    'foot.legal': 'Lule Balkan Kitchen është restorant shembull i krijuar për një demo. Menuja, çmimet dhe kontaktet nuk janë reale.',
  },
}
const titles = {
  en: { title: 'Lule Balkan Kitchen · restaurant (demo by Joel Kaso)', desc: 'Demo site by Joel Kaso for a sample Balkan restaurant: menu tabs from an editable file, table reservations, a takeaway order on WhatsApp and opening hours. EN and SQ.' },
  sq: { title: 'Lule Balkan Kitchen · restorant (demo nga Joel Kaso)', desc: 'Faqe demo nga Joel Kaso për një restorant ballkanik shembull: menu me kategori, rezervim tavoline, porosi në WhatsApp dhe orari. EN dhe SQ.' },
}

const kit = createKit({ name: 'Lule Balkan Kitchen', dict, titles })
const { t, money } = kit
const L = (o) => o[kit.lang] || o.en
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

// ---- Menu tabs (WAI-ARIA tabs: arrows, Home and End move between categories) ----
let current = MENU[0].id
function renderMenu() {
  $('#menu-tabs').innerHTML = MENU.map((c) => `<button class="tab" type="button" role="tab" id="tab-${c.id}" aria-controls="panel-${c.id}" aria-selected="${c.id === current}" tabindex="${c.id === current ? 0 : -1}">${esc(L(c.name))}</button>`).join('')
  $('#menu-panels').innerHTML = MENU.map((c) => `<div role="tabpanel" id="panel-${c.id}" aria-labelledby="tab-${c.id}" tabindex="0"${c.id === current ? '' : ' hidden'}>
    <ul class="dishes">${c.items.map((d) => `<li class="dish">
      <img src="${esc(d.image)}" width="72" height="72" alt="" loading="lazy" decoding="async">
      <div><h3>${esc(L(d.name))}${d.veg ? ` <span class="veg" title="${t('menu.vegfull')}"><span aria-hidden="true">${t('menu.veg')}</span><span class="sr">${t('menu.vegfull')}</span></span>` : ''}</h3><p>${esc(L(d.desc))}</p></div>
      <p class="dish__price">${money(d.price)}</p></li>`).join('')}</ul></div>`).join('')
}
function selectTab(id, focus) {
  current = id
  $$('#menu-tabs [role=tab]').forEach((b) => { const on = b.id === 'tab-' + id; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; if (on && focus) b.focus() })
  $$('#menu-panels [role=tabpanel]').forEach((p) => { p.hidden = p.id !== 'panel-' + id })
}
$('#menu-tabs').addEventListener('click', (e) => { const b = e.target.closest('[role=tab]'); if (b) selectTab(b.id.slice(4)) })
$('#menu-tabs').addEventListener('keydown', (e) => {
  const i = MENU.findIndex((c) => c.id === current), n = MENU.length
  const j = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: n - 1 }[e.key]
  if (j === undefined) return
  e.preventDefault(); selectTab(MENU[(j + n) % n].id, true)
})

// ---- Reservation ----
const rForm = $('#res-form'), rDate = $('#r-date')
function renderReserve() {
  const time = $('#r-time'), guests = $('#r-guests'), tv = time.value, gv = guests.value
  time.innerHTML = `<option value="">${t('res.pick')}</option>` + SLOTS.map((s) => `<option>${s}</option>`).join('')
  guests.innerHTML = Array.from({ length: 12 }, (_, k) => `<option value="${k + 1}">${k + 1}</option>`).join('') + `<option value="12+">${t('res.more')}</option>`
  time.value = tv; guests.value = gv || '2'
}
rDate.min = isoToday()
kit.demoForm(rForm, {
  endpoint: RESERVE_ENDPOINT, subject: 'Table request · Lule Balkan Kitchen', okKey: 'res.ok',
  extra: () => (rDate.value && rDate.value < isoToday() ? (kit.field(rDate, t('kit.err.date')), rDate) : null),
  data: () => ({ date: rDate.value, time: $('#r-time').value, guests: $('#r-guests').value, name: clean(rForm.elements.name.value, 80), phone: clean(rForm.elements.phone.value, 20), language: kit.lang }),
})
rForm.addEventListener('kit:reset', () => { $('#r-guests').value = '2' })

// ---- Takeaway order ----
const TAKE = MENU.flatMap((c) => c.items.filter((d) => d.takeaway))
const qty = TAKE.map(() => 0)
const send = $('#order-send')
function renderOrder() {
  $('#order').innerHTML = TAKE.map((d, i) => `<li>
    <span class="order__name">${esc(L(d.name))}</span>
    <span class="qty" role="group" aria-label="${esc(L(d.name))}">
      <button type="button" data-q="${i}" data-d="-1" aria-label="${t('take.less')}: ${esc(L(d.name))}">−</button>
      <output aria-live="polite" id="q-${i}">${qty[i]}</output>
      <button type="button" data-q="${i}" data-d="1" aria-label="${t('take.more')}: ${esc(L(d.name))}">+</button>
    </span>
    <span class="order__price">${money(d.price)}</span></li>`).join('')
  updateOrder()
}
function updateOrder() {
  let total = 0; const lines = []
  TAKE.forEach((d, i) => {
    $('#q-' + i).textContent = qty[i]
    $(`[data-q="${i}"][data-d="-1"]`).disabled = qty[i] === 0
    $(`[data-q="${i}"][data-d="1"]`).disabled = qty[i] >= 20
    if (qty[i]) { total += qty[i] * d.price; lines.push(`${qty[i]} × ${L(d.name)} (${money(qty[i] * d.price)})`) }
  })
  $('#order-total').textContent = money(total)
  const empty = !lines.length, mode = $('input[name=mode]:checked').value
  send.setAttribute('aria-disabled', String(empty))
  $('#order-hint').textContent = t(empty ? 'take.empty' : 'take.ready')
  const msg = [t('wa.hi').replace('{mode}', t('wa.' + mode)), '', ...lines, '', `${t('wa.total')}: ${money(total)} (${t('wa.sample')})`].join('\n')
  send.href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg)
}
$('#order').addEventListener('click', (e) => { const b = e.target.closest('[data-q]'); if (!b) return; const i = +b.dataset.q; qty[i] = Math.max(0, Math.min(20, qty[i] + Number(b.dataset.d))); updateOrder() })
$$('input[name=mode]').forEach((r) => r.addEventListener('change', updateOrder))
send.addEventListener('click', (e) => { if (send.getAttribute('aria-disabled') === 'true') { e.preventDefault(); $('#order-hint').focus?.() } })

// ---- Opening hours, today highlighted ----
function renderHours() {
  const today = (new Date().getDay() + 6) % 7 // Monday = 0
  $('#hours-table tbody').innerHTML = HOURS.map((h, i) => `<tr class="${i === today ? 'is-today' : ''}"><th scope="row" data-today="${t('hours.today')}">${t('days')[i]}</th><td>${h ? h[0] + '–' + h[1] : t('hours.closed')}</td></tr>`).join('')
}

function renderAll() { renderMenu(); renderReserve(); renderOrder(); renderHours() }
renderAll()
kit.onLang(renderAll)
kit.apply()
