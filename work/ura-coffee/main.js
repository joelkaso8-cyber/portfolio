// Ura Coffee Roasters (sample business, demo by Joel Kaso): shop with cart, subscription request, wholesale form, EN/SQ.
import { createKit, $, $$, clean } from '../demo-kit/kit.js'

// [TODO: real WhatsApp number] Digits only with country code. Empty: WhatsApp opens with the order written and the
// visitor picks the chat, so no stranger's number is ever used.
const WHATSAPP = ''
// [TODO: roastery email] Subscription and wholesale requests go here through FormSubmit, e.g. 'https://formsubmit.co/ajax/hello@example.com'.
// While it holds [TODO], the forms only show their success message plus a "demo, nothing was sent" line.
const FORM_ENDPOINT = 'https://formsubmit.co/ajax/[TODO: roastery email]'

// The coffees. Origins and prices are SAMPLE data. price: euros per bag size (grams).
// [TODO: replace img/bag-*.svg with real product photos, ~480×560, under 80 KB]
const PRODUCTS = [
  { id: 'no1', image: 'img/bag-1.svg', price: { 250: 12, 1000: 38 }, name: { en: 'Ura No. 1 · Bright', sq: 'Ura Nr. 1 · E gjallë' },
    origin: { en: 'Ethiopia · sample origin', sq: 'Etiopi · origjinë shembull' }, notes: { en: ['Jasmine', 'peach', 'honey'], sq: ['Jasemin', 'pjeshkë', 'mjaltë'] } },
  { id: 'no2', image: 'img/bag-2.svg', price: { 250: 11, 1000: 35 }, name: { en: 'Ura No. 2 · Round', sq: 'Ura Nr. 2 · E butë' },
    origin: { en: 'Colombia · sample origin', sq: 'Kolumbi · origjinë shembull' }, notes: { en: ['Cocoa', 'cherry', 'caramel'], sq: ['Kakao', 'qershi', 'karamel'] } },
  { id: 'no3', image: 'img/bag-3.svg', price: { 250: 10, 1000: 32 }, name: { en: 'Ura No. 3 · Deep', sq: 'Ura Nr. 3 · E fortë' },
    origin: { en: 'Brazil · sample origin', sq: 'Brazil · origjinë shembull' }, notes: { en: ['Hazelnut', 'chocolate', 'toffee'], sq: ['Lajthi', 'çokollatë', 'tofi'] } },
]
// Monthly plans, sample prices.
const PLANS = [
  { id: 'taster', price: 14, name: { en: 'Taster', sq: 'Provë' }, what: { en: '1 × 250 g a month, a new coffee each time', sq: '1 × 250 g në muaj, kafe tjetër çdo herë' } },
  { id: 'regular', price: 26, name: { en: 'Regular', sq: 'E rregullt' }, what: { en: '2 × 250 g a month, your favourite', sq: '2 × 250 g në muaj, e preferuara jote' } },
  { id: 'office', price: 36, name: { en: 'Office', sq: 'Zyrë' }, what: { en: '1 kg a month for the team', sq: '1 kg në muaj për ekipin' } },
]

const dict = {
  en: {
    'info.text': 'A small coffee roaster that sells online: bags, subscriptions and wholesale for cafés.',
    'info.f1': 'Shop with bag sizes, cart and total', 'info.f2': 'Monthly subscription request', 'info.f3': 'Wholesale form for cafés and shops', 'info.f4': 'Brewing guide in three steps',
    'nav.shop': 'Shop', 'nav.sub': 'Subscribe', 'nav.wholesale': 'Wholesale',
    'todo.photo': '[TODO: replace with real photo]', 'todo.address': '[TODO: address]',
    'hero.label': 'Roastery · online shop', 'hero.title': 'Small-batch coffee, roasted every week.', 'hero.sub': 'Three sample coffees in 250 g or 1 kg bags, whole bean. Order online or set up a monthly delivery.',
    'hero.cta': 'Shop coffee', 'hero.alt': 'Placeholder illustration: a paper coffee bag with the Ura label',
    'shop.label': '01 · Shop', 'shop.title': 'The coffees', 'shop.intro': 'Origins and prices are sample data.',
    'p.notes': 'Tasting notes', 'p.size': 'Bag size', 'p.sample': 'Sample price', 'p.add': 'Add to cart', 'p.added': 'Added', 'p.photo': 'Placeholder: bag of {name}',
    'cart.title': 'Your cart', 'cart.empty': 'Your cart is empty. Add a bag above.', 'cart.total': 'Total', 'cart.send': 'Send order on WhatsApp',
    'cart.hint': 'Payment and delivery are confirmed in the reply. [TODO: online payment]', 'cart.items': '{n} bags', 'cart.item': '1 bag', 'cart.link': 'Cart, {n} bags', 'cart.rm': 'Remove {name}',
    'wa.hi': 'Hello Ura, I would like to order:', 'wa.total': 'Total', 'wa.sample': 'sample prices',
    'sub.label': '02 · Subscription', 'sub.title': 'Monthly coffee subscription', 'sub.intro': 'Fresh coffee at your door each month. Pause or stop any time. Sample prices.',
    'sub.choose': 'Choose a plan', 'sub.month': 'a month', 'sub.cta': 'Subscribe', 'sub.plan': 'Plan', 'sub.grind': 'Grind', 'sub.send': 'Send subscription request',
    'sub.ok': 'Subscription request received. The roastery will email you to set up the first delivery.',
    'grind.whole': 'Whole bean', 'grind.filter': 'Ground for filter', 'grind.espresso': 'Ground for espresso',
    'f.name': 'Name', 'f.contact': 'Email or phone', 'f.pick': 'Choose',
    'ws.label': '03 · Wholesale', 'ws.title': 'Coffee for your café, restaurant or shop', 'ws.intro': 'Tell us what you need and we send prices and samples.',
    'ws.biz': 'Business name', 'ws.type': 'Type', 'ws.qty': 'Monthly quantity', 'ws.send': 'Request wholesale prices',
    'ws.cafe': 'Café', 'ws.restaurant': 'Restaurant', 'ws.shop': 'Shop', 'ws.ok': 'Request received. The roastery will send prices and samples within two working days.',
    'brew.label': '04 · Brewing guide', 'brew.title': 'A good filter cup in three steps',
    'brew.s1': 'Grind', 'brew.t1': '15 g of coffee, medium-fine, like coarse sand.', 'brew.s2': 'Bloom', 'brew.t2': 'Pour 30 g of water just off the boil and wait 30 seconds.',
    'brew.s3': 'Pour', 'brew.t3': 'Pour slowly to 250 g in circles. Done in about 3 minutes.',
    'foot.roastery': 'Roastery', 'foot.contact': 'Phone & WhatsApp', 'foot.sample': '(sample number)',
    'foot.legal': 'Ura Coffee Roasters is a sample business made for a demo. Coffees, origins, prices and contact details are not real.',
  },
  sq: {
    'info.text': 'Një pjekëse e vogël kafeje që shet online: pako, abonime dhe shitje me shumicë për kafenetë.',
    'info.f1': 'Dyqan me madhësi pakoje, shportë dhe total', 'info.f2': 'Kërkesë për abonim mujor', 'info.f3': 'Formular shumice për kafene dhe dyqane', 'info.f4': 'Udhëzues përgatitjeje në tre hapa',
    'nav.shop': 'Dyqani', 'nav.sub': 'Abonim', 'nav.wholesale': 'Shumicë',
    'todo.photo': '[TODO: zëvendëso me foto reale]', 'todo.address': '[TODO: adresa]',
    'hero.label': 'Pjekëse · dyqan online', 'hero.title': 'Kafe në sasi të vogla, e pjekur çdo javë.', 'hero.sub': 'Tre kafe shembull në pako 250 g ose 1 kg, kokërr. Porosit online ose merre çdo muaj në derë.',
    'hero.cta': 'Bli kafe', 'hero.alt': 'Ilustrim zëvendësues: një pako letre kafeje me etiketën Ura',
    'shop.label': '01 · Dyqani', 'shop.title': 'Kafet', 'shop.intro': 'Origjinat dhe çmimet janë të dhëna shembull.',
    'p.notes': 'Shijet', 'p.size': 'Madhësia e pakos', 'p.sample': 'Çmim shembull', 'p.add': 'Shto në shportë', 'p.added': 'U shtua', 'p.photo': 'Zëvendësues: pako e {name}',
    'cart.title': 'Shporta jote', 'cart.empty': 'Shporta është bosh. Shto një pako më lart.', 'cart.total': 'Totali', 'cart.send': 'Dërgo porosinë në WhatsApp',
    'cart.hint': 'Pagesa dhe dërgesa konfirmohen në përgjigje. [TODO: pagesë online]', 'cart.items': '{n} pako', 'cart.item': '1 pako', 'cart.link': 'Shporta, {n} pako', 'cart.rm': 'Hiq {name}',
    'wa.hi': 'Përshëndetje Ura, dua të porosis:', 'wa.total': 'Totali', 'wa.sample': 'çmime shembull',
    'sub.label': '02 · Abonim', 'sub.title': 'Abonim mujor për kafe', 'sub.intro': 'Kafe e freskët në derë çdo muaj. E ndal ose e anulon kur të duash. Çmime shembull.',
    'sub.choose': 'Zgjidh një plan', 'sub.month': 'në muaj', 'sub.cta': 'Abonohu', 'sub.plan': 'Plani', 'sub.grind': 'Bluarja', 'sub.send': 'Dërgo kërkesën për abonim',
    'sub.ok': 'Kërkesa për abonim u mor. Pjekësja të shkruan për dërgesën e parë.',
    'grind.whole': 'Kokërr e plotë', 'grind.filter': 'E bluar për filtër', 'grind.espresso': 'E bluar për espreso',
    'f.name': 'Emri', 'f.contact': 'Email ose telefon', 'f.pick': 'Zgjidh',
    'ws.label': '03 · Shumicë', 'ws.title': 'Kafe për kafenenë, restorantin ose dyqanin tënd', 'ws.intro': 'Na trego çfarë të duhet dhe të dërgojmë çmime dhe mostra.',
    'ws.biz': 'Emri i biznesit', 'ws.type': 'Lloji', 'ws.qty': 'Sasia mujore', 'ws.send': 'Kërko çmimet e shumicës',
    'ws.cafe': 'Kafene', 'ws.restaurant': 'Restorant', 'ws.shop': 'Dyqan', 'ws.ok': 'Kërkesa u mor. Pjekësja të dërgon çmime dhe mostra brenda dy ditëve pune.',
    'brew.label': '04 · Udhëzues', 'brew.title': 'Një filtër i mirë në tre hapa',
    'brew.s1': 'Bluaje', 'brew.t1': '15 g kafe, mesatarisht e imët, si rërë e trashë.', 'brew.s2': 'Lagu', 'brew.t2': 'Hidh 30 g ujë sapo të ketë vluar dhe prit 30 sekonda.',
    'brew.s3': 'Hidh', 'brew.t3': 'Hidh ngadalë deri në 250 g, në rrathë. Gati për rreth 3 minuta.',
    'foot.roastery': 'Pjekësja', 'foot.contact': 'Telefon dhe WhatsApp', 'foot.sample': '(numër shembull)',
    'foot.legal': 'Ura Coffee Roasters është biznes shembull i krijuar për një demo. Kafet, origjinat, çmimet dhe kontaktet nuk janë reale.',
  },
}
const titles = {
  en: { title: 'Ura Coffee Roasters · coffee shop (demo by Joel Kaso)', desc: 'Demo site by Joel Kaso for a sample coffee roaster: shop with cart, monthly subscription, wholesale form and a brewing guide. EN and SQ.' },
  sq: { title: 'Ura Coffee Roasters · dyqan kafeje (demo nga Joel Kaso)', desc: 'Faqe demo nga Joel Kaso për një pjekëse kafeje shembull: dyqan me shportë, abonim mujor, formular shumice dhe udhëzues. EN dhe SQ.' },
}

const kit = createKit({ name: 'Ura Coffee Roasters', dict, titles })
const { t, money } = kit
const L = (o) => o[kit.lang] || o.en
const size = (g) => (g >= 1000 ? g / 1000 + ' kg' : g + ' g')
const picked = Object.fromEntries(PRODUCTS.map((p) => [p.id, 250])) // chosen bag size per coffee
const cart = [] // { id, g, n }

// ---- Products ----
function renderProducts() {
  $('#products').innerHTML = PRODUCTS.map((p) => `<article class="product" aria-labelledby="pn-${p.id}">
    <div class="product__img"><img src="${p.image}" width="480" height="560" loading="lazy" decoding="async" alt="${t('p.photo').replace('{name}', L(p.name))}"></div>
    <div>
      <h3 id="pn-${p.id}">${L(p.name)}</h3>
      <p class="product__origin">${L(p.origin)}</p>
      <p class="product__notes"><span class="sr">${t('p.notes')}: </span>${L(p.notes).join(' · ')}</p>
      <fieldset class="weights"><legend class="sr">${t('p.size')}, ${L(p.name)}</legend>
        ${Object.keys(p.price).map((g) => `<label><input type="radio" name="w-${p.id}" value="${g}"${+g === picked[p.id] ? ' checked' : ''}><span>${size(+g)}</span></label>`).join('')}
      </fieldset>
    </div>
    <div class="product__buy">
      <p class="product__price"><small>${t('p.sample')}</small><span id="pp-${p.id}">${money(p.price[picked[p.id]])}</span></p>
      <button class="btn btn--dark" type="button" data-add="${p.id}">${t('p.add')}</button>
    </div></article>`).join('')
}
$('#products').addEventListener('change', (e) => {
  const r = e.target.closest('input[type=radio]'); if (!r) return
  const id = r.name.slice(2); picked[id] = +r.value
  $('#pp-' + id).textContent = money(PRODUCTS.find((p) => p.id === id).price[picked[id]])
})
$('#products').addEventListener('click', (e) => {
  const b = e.target.closest('[data-add]'); if (!b) return
  const id = b.dataset.add, g = picked[id], line = cart.find((x) => x.id === id && x.g === g)
  if (line) line.n = Math.min(20, line.n + 1); else cart.push({ id, g, n: 1 })
  renderCart(true)
  b.textContent = t('p.added') + ' ✓'; clearTimeout(b._t); b._t = setTimeout(() => { b.textContent = t('p.add') }, 1400)
})

// ---- Cart ----
const send = $('#cart-send')
function renderCart(bump) {
  const n = cart.reduce((s, x) => s + x.n, 0)
  let total = 0; const lines = []
  $('#cart-list').innerHTML = cart.map((x, i) => {
    const p = PRODUCTS.find((q) => q.id === x.id), sum = p.price[x.g] * x.n; total += sum
    lines.push(`${x.n} × ${L(p.name)}, ${size(x.g)} (${money(sum)})`)
    return `<li><span><b>${x.n} ×</b> ${L(p.name)} · ${size(x.g)}</span><span class="cart__line">${money(sum)}</span><button class="cart__rm" type="button" data-rm="${i}" aria-label="${t('cart.rm').replace('{name}', L(p.name) + ', ' + size(x.g))}">×</button></li>`
  }).join('')
  $('#cart-empty').hidden = n > 0
  $('#cart-total').textContent = money(total)
  $('#cart-items').textContent = n === 1 ? t('cart.item') : t('cart.items').replace('{n}', n)
  const c = $('#cart-count'); c.textContent = n
  $('#cart-link').setAttribute('aria-label', t('cart.link').replace('{n}', n))
  if (bump) { c.classList.remove('is-bump'); void c.offsetWidth; c.classList.add('is-bump') }
  send.setAttribute('aria-disabled', String(!n))
  send.href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent([t('wa.hi'), '', ...lines, '', `${t('wa.total')}: ${money(total)} (${t('wa.sample')})`].join('\n'))
}
$('#cart-list').addEventListener('click', (e) => { const b = e.target.closest('[data-rm]'); if (!b) return; cart.splice(+b.dataset.rm, 1); renderCart(); $('#cart').focus() })
send.addEventListener('click', (e) => { if (send.getAttribute('aria-disabled') === 'true') e.preventDefault() })
$('#cart-link').addEventListener('click', () => setTimeout(() => $('#cart').focus({ preventScroll: true }), 450))

// ---- Subscription ----
let plan = 'regular'
const subForm = $('#sub-form'), subOpen = $('#sub-open')
function renderPlans() {
  $('#plans').innerHTML = `<legend class="sr">${t('sub.choose')}</legend>` + PLANS.map((p) => `<label class="plan">
    <input type="radio" name="plan" value="${p.id}"${p.id === plan ? ' checked' : ''}>
    <b>${L(p.name)}</b><span class="plan__price">${money(p.price)}<small>${t('sub.month')}</small></span><small>${L(p.what)}</small></label>`).join('')
  $('#s-plan').innerHTML = PLANS.map((p) => `<option value="${p.id}">${L(p.name)} · ${money(p.price)} ${t('sub.month')}</option>`).join('')
  $('#s-plan').value = plan
  const g = $('#s-grind'), gv = g.value
  g.innerHTML = ['whole', 'filter', 'espresso'].map((k) => `<option value="${k}">${t('grind.' + k)}</option>`).join('')
  g.value = gv || 'whole'
}
$('#plans').addEventListener('change', (e) => { plan = e.target.value; $('#s-plan').value = plan })
$('#s-plan').addEventListener('change', (e) => { plan = e.target.value; const r = $(`#plans input[value="${plan}"]`); if (r) r.checked = true })
subOpen.addEventListener('click', () => {
  const show = subForm.hidden; subForm.hidden = !show; subOpen.setAttribute('aria-expanded', String(show))
  if (show) $('#s-name').focus()
})
kit.demoForm(subForm, {
  endpoint: FORM_ENDPOINT, subject: 'Subscription request · Ura Coffee Roasters', okKey: 'sub.ok',
  data: () => ({ plan: $('#s-plan').value, grind: $('#s-grind').value, name: clean(subForm.elements.name.value, 80), contact: clean(subForm.elements.contact.value, 120), language: kit.lang }),
})
subForm.addEventListener('kit:reset', () => { $('#s-plan').value = plan; $('#s-grind').value = 'whole' })

// ---- Wholesale ----
const wsForm = $('#ws-form')
function renderWholesale() {
  const ty = $('#w-type'), q = $('#w-qty'), tv = ty.value, qv = q.value
  ty.innerHTML = `<option value="">${t('f.pick')}</option>` + ['cafe', 'restaurant', 'shop'].map((k) => `<option value="${k}">${t('ws.' + k)}</option>`).join('')
  q.innerHTML = `<option value="">${t('f.pick')}</option>` + ['5–10 kg', '10–25 kg', '25–50 kg', '50+ kg'].map((k) => `<option>${k}</option>`).join('')
  ty.value = tv; q.value = qv
}
kit.demoForm(wsForm, {
  endpoint: FORM_ENDPOINT, subject: 'Wholesale request · Ura Coffee Roasters', okKey: 'ws.ok',
  data: () => ({ business: clean(wsForm.elements.business.value, 80), type: $('#w-type').value, monthly_quantity: $('#w-qty').value, contact: clean(wsForm.elements.contact.value, 120), language: kit.lang }),
})

function renderAll() { renderProducts(); renderCart(); renderPlans(); renderWholesale() }
renderAll()
kit.onLang(renderAll)
kit.apply()
