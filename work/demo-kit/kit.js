// Demo kit, shared by the three demos in work/ (Vjosa Rafting, Lule Balkan Kitchen, Ura Coffee Roasters).
// Each demo's main.js imports it: createKit({ name, dict }) returns t(), money(), the current language and onLang().
// It also fills <section data-kit-cta> with "Want a site like this?", Joel's WhatsApp button and the preview-request form.
//
// Language: ?lang=en|sq wins, then the portfolio's saved choice (localStorage 'jk-lang'), then the browser language.
// The demos and the portfolio share one saved language, so the choice follows the visitor.

const JOEL_WA = '355685727406' // Joel's WhatsApp, the same number as on the portfolio
// Same FormSubmit address as the portfolio's contact form (already activated there).
const JOEL_FORM = 'https://formsubmit.co/ajax/joelkaso8@gmail.com'

export const $ = (s, r = document) => r.querySelector(s)
export const $$ = (s, r = document) => Array.from(r.querySelectorAll(s))

const KIT = {
  en: {
    'kit.skip': 'Skip to content',
    'kit.banner': 'Demo · sample business and data',
    'kit.back': 'Joel Kaso ↗',
    'kit.backlong': '← Back to the portfolio',
    'kit.label': 'Demo site',
    'kit.note': 'The business, prices, photos and contact details are sample data.',
    'kit.by': 'Made by Joel Kaso',
    'kit.cta.title': 'Want a site like this for your business?',
    'kit.cta.text': 'I build it with your name, photos and prices. You see a free preview before you pay anything.',
    'kit.cta.wa': 'WhatsApp',
    'kit.cta.preview': 'Request preview',
    'kit.f.biz': 'Business name',
    'kit.f.type': 'Business type',
    'kit.f.typeph': 'e.g. restaurant, rafting, café',
    'kit.f.contact': 'Email or phone',
    'kit.f.consent': 'Joel Kaso may use these details to send me my preview.',
    'kit.f.privacy': 'Privacy notice',
    'kit.f.send': 'Send request',
    'kit.f.sending': 'Sending…',
    'kit.f.ok': "Received. I'll send your preview within 48 hours.",
    'kit.f.fail': "It didn't send. Please message me on WhatsApp instead.",
    'kit.f.rate': 'You just sent a request. Please wait a minute before sending another.',
    'kit.err.req': 'Please fill this in.',
    'kit.err.contact': 'Enter an email address or a phone number.',
    'kit.err.consent': 'Please tick the box so I can send your preview.',
    'kit.err.date': 'Please pick a date.',
    'kit.wa': "Hi Joel, I saw the {demo} demo and I'd like a site like this for my business.",
    'kit.demo': 'Demo: this form is not connected yet, so nothing was sent.',
    'kit.made': 'Concept design by Joel Kaso, not a real business.',
    'kit.portfolio': 'See more work',
  },
  sq: {
    'kit.skip': 'Kalo te përmbajtja',
    'kit.banner': 'Demo · biznes dhe të dhëna shembull',
    'kit.back': 'Joel Kaso ↗',
    'kit.backlong': '← Kthehu te portofoli',
    'kit.label': 'Faqe demo',
    'kit.note': 'Biznesi, çmimet, fotot dhe kontaktet janë të dhëna shembull.',
    'kit.by': 'Punuar nga Joel Kaso',
    'kit.cta.title': 'Dëshiron një faqe të tillë për biznesin tënd?',
    'kit.cta.text': 'E ndërtoj me emrin, fotot dhe çmimet e tua. Sheh një preview falas para se të paguash.',
    'kit.cta.wa': 'WhatsApp',
    'kit.cta.preview': 'Kërko preview',
    'kit.f.biz': 'Emri i biznesit',
    'kit.f.type': 'Lloji i biznesit',
    'kit.f.typeph': 'p.sh. restorant, rafting, kafene',
    'kit.f.contact': 'Email ose telefon',
    'kit.f.consent': 'Joel Kaso mund t’i përdorë këto të dhëna për të më dërguar preview-n.',
    'kit.f.privacy': 'Njoftimi i privatësisë',
    'kit.f.send': 'Dërgo kërkesën',
    'kit.f.sending': 'Po dërgohet…',
    'kit.f.ok': 'Marrë. Do të të dërgoj preview-n brenda 48 orëve.',
    'kit.f.fail': 'Nuk u dërgua. Të lutem më shkruaj në WhatsApp.',
    'kit.f.rate': 'Sapo dërgove një kërkesë. Prit një minutë para se të dërgosh një tjetër.',
    'kit.err.req': 'Plotëso këtë fushë.',
    'kit.err.contact': 'Shkruaj një adresë email ose një numër telefoni.',
    'kit.err.consent': 'Shëno kutinë që të të dërgoj preview-n.',
    'kit.err.date': 'Zgjidh një datë.',
    'kit.wa': 'Përshëndetje Joel, pashë demon {demo} dhe dua një faqe të tillë për biznesin tim.',
    'kit.demo': 'Demo: ky formular nuk është lidhur ende, ndaj nuk u dërgua asgjë.',
    'kit.made': 'Koncept nga Joel Kaso, jo biznes real.',
    'kit.portfolio': 'Shiko punë të tjera',
  },
}

const WA_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.4-.2Z"/></svg>'

// Trims, removes control characters and caps the length of anything typed into a form.
export const clean = (v, max = 200) => String(v || '').replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max)
const isContact = (v) => /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[a-z]{2,}$/i.test(v) || /^\+?[\d\s().-]{7,20}$/.test(v)
// Today as YYYY-MM-DD in the visitor's own time zone (inputs of type date use this format).
export const isoToday = () => { const d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10) }

export function createKit({ name, dict, titles }) {
  let lang = 'en'
  try { const s = localStorage.getItem('jk-lang'); if (s === 'en' || s === 'sq') lang = s; else if ((navigator.languages || []).some((l) => /^sq/i.test(l))) lang = 'sq' } catch (e) { /* storage blocked */ }
  const ql = (location.search.match(/[?&]lang=(en|sq)\b/) || [])[1]; if (ql) lang = ql
  const listeners = []
  const D = { en: { ...KIT.en, ...dict.en }, sq: { ...KIT.sq, ...dict.sq } }
  const t = (k) => (D[lang][k] !== undefined ? D[lang][k] : D.en[k] !== undefined ? D.en[k] : k)
  // Joel's price format in both languages: 1.190€
  const money = (n) => Number(n).toLocaleString('de-DE', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }) + '€'

  if (window.self !== window.top) document.documentElement.classList.add('kit-embedded')
  reveal()

  function apply() {
    document.documentElement.lang = lang
    if (titles) { document.title = titles[lang].title; const m = $('meta[name="description"]'); if (m) m.content = titles[lang].desc }
    $$('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n) })
    $$('[data-i18n-alt]').forEach((el) => { el.alt = t(el.dataset.i18nAlt) })
    $$('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', t(el.dataset.i18nAria)) })
    $$('[data-i18n-ph]').forEach((el) => { el.placeholder = t(el.dataset.i18nPh) })
    $$('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)))
    $$('.kit-err').forEach((e) => { e.textContent = '' })
    $$('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'))
    const wa = $('[data-kit-wa]'); if (wa) wa.href = 'https://wa.me/' + JOEL_WA + '?text=' + encodeURIComponent(t('kit.wa').replace('{demo}', name))
    const pv = $('[data-kit-privacy]'); if (pv) pv.href = '../../privacy.html' + (lang === 'sq' ? '#sq' : '')
    listeners.forEach((fn) => fn(lang))
  }

  function setLang(l) {
    lang = l
    try { localStorage.setItem('jk-lang', l); history.replaceState(null, '', location.pathname + (l === 'sq' ? '?lang=sq' : '') + location.hash) } catch (e) { /* ignore */ }
    apply()
  }
  document.addEventListener('click', (e) => { const b = e.target.closest('[data-lang]'); if (b) setLang(b.dataset.lang) })

  buildCta()
  const kit = { t, money, get lang() { return lang }, onLang: (fn) => listeners.push(fn), apply, field, demoForm }
  // The demo's own main.js calls kit.apply() once its own content is in place.
  return kit

  // Marks a field as wrong (or fine) and links the message to it for screen readers.
  function field(el, msg) {
    const box = document.getElementById('e-' + el.id)
    if (msg) { el.setAttribute('aria-invalid', 'true'); if (box) box.textContent = msg } else { el.removeAttribute('aria-invalid'); if (box) box.textContent = '' }
    return !msg
  }

  // Checks every [required] field of a form at once and focuses the first problem. Returns true when all is fine.
  function check(form, extra) {
    let first = null
    $$('[required]', form).forEach((el) => {
      const empty = el.type === 'checkbox' ? !el.checked : !clean(el.value)
      const msg = empty ? t(el.dataset.err || 'kit.err.req') : (el.dataset.kind === 'contact' && !isContact(clean(el.value)) ? t('kit.err.contact') : '')
      if (!field(el, msg) && !first) first = el
    })
    if (extra) { const bad = extra(); if (bad && !first) first = bad }
    if (first) first.focus()
    return !first
  }

  // A sample business's own form (table booking, wholesale...). While its endpoint still holds a [TODO], nothing is sent:
  // the visitor sees the success message plus a line saying it is a demo. With a real FormSubmit address it posts for real.
  function demoForm(form, { endpoint, subject, okKey, data, extra }) {
    const status = $('.form-status', form)
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      status.className = 'form-status'; status.textContent = ''
      if (!check(form, extra)) return
      if (form.elements._honey && form.elements._honey.value) return // honeypot filled in: a bot
      const ok = () => {
        status.className = 'form-status is-ok'
        status.textContent = t(okKey) + (/\[TODO/.test(endpoint) ? ' ' + t('kit.demo') : '')
        form.reset(); form.dispatchEvent(new Event('kit:reset'))
        status.focus()
      }
      if (/\[TODO/.test(endpoint)) return ok()
      const btn = $('button[type=submit]', form); btn.disabled = true
      fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ ...data(), _subject: subject, _captcha: 'false', _template: 'table', _honey: '' }) })
        .then((r) => r.json()).then((j) => { if (String(j.success) !== 'true') throw new Error('not sent'); ok() })
        .catch(() => { status.className = 'form-status is-err'; status.textContent = t('kit.f.fail') })
        .then(() => { btn.disabled = false })
    })
  }

  // [data-reveal] blocks rise in once as they reach the screen. Without JS, or with reduced motion, they are simply there.
  function reveal() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return
    document.documentElement.classList.add('kit-reveal')
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) } }), { rootMargin: '0px 0px -6% 0px' })
    $$('[data-reveal]').forEach((el) => io.observe(el))
  }

  function buildCta() {
    const box = $('[data-kit-cta]'); if (!box) return
    box.className = 'kit-cta'; box.setAttribute('aria-labelledby', 'kit-cta-title')
    box.innerHTML = `<div class="kit-cta__in">
      <p class="kit-cta__by" data-i18n="kit.by"></p>
      <h2 id="kit-cta-title" data-i18n="kit.cta.title"></h2>
      <p data-i18n="kit.cta.text"></p>
      <div class="kit-cta__btns">
        <a class="kit-btn kit-btn--gold" data-kit-wa target="_blank" rel="noopener noreferrer">${WA_ICON}<span data-i18n="kit.cta.wa"></span></a>
        <button class="kit-btn kit-btn--line" type="button" aria-expanded="false" aria-controls="kit-form" data-kit-open><span data-i18n="kit.cta.preview"></span></button>
      </div>
      <form class="kit-form" id="kit-form" hidden novalidate>
        <div class="kit-field"><label for="kit-biz" data-i18n="kit.f.biz"></label><input type="text" id="kit-biz" name="business" autocomplete="organization" maxlength="80" required aria-describedby="e-kit-biz"><p class="kit-err" id="e-kit-biz" aria-live="polite"></p></div>
        <div class="kit-field"><label for="kit-type" data-i18n="kit.f.type"></label><input type="text" id="kit-type" name="type" maxlength="60" required data-i18n-ph="kit.f.typeph" aria-describedby="e-kit-type"><p class="kit-err" id="e-kit-type" aria-live="polite"></p></div>
        <div class="kit-field"><label for="kit-contact" data-i18n="kit.f.contact"></label><input type="text" id="kit-contact" name="contact" autocomplete="email" inputmode="email" maxlength="120" required data-kind="contact" aria-describedby="e-kit-contact"><p class="kit-err" id="e-kit-contact" aria-live="polite"></p></div>
        <div><label class="kit-check"><input type="checkbox" id="kit-consent" name="consent" required data-err="kit.err.consent" aria-describedby="e-kit-consent"><span><span data-i18n="kit.f.consent"></span> <a data-kit-privacy target="_blank" rel="noopener" data-i18n="kit.f.privacy"></a></span></label><p class="kit-err" id="e-kit-consent" aria-live="polite"></p></div>
        <div class="kit-trap" aria-hidden="true"><label for="kit-honey">Leave empty</label><input type="text" id="kit-honey" name="_honey" tabindex="-1" autocomplete="off"></div>
        <button class="kit-btn kit-btn--gold" type="submit"><span data-i18n="kit.f.send"></span></button>
        <p class="kit-status" role="status" aria-live="polite" tabindex="-1"></p>
      </form>
      <p class="kit-made"><span data-i18n="kit.made"></span> <a href="../../#work" data-i18n="kit.portfolio"></a></p>
    </div>`
    const open = $('[data-kit-open]', box), form = $('#kit-form', box), status = $('.kit-status', form)
    open.addEventListener('click', () => {
      const show = form.hidden; form.hidden = !show; open.setAttribute('aria-expanded', String(show))
      if (show) $('#kit-biz', form).focus()
    })
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      status.className = 'kit-status'; status.textContent = ''
      if (!check(form)) return
      if (form.elements._honey.value) return // honeypot filled in: a bot, dropped silently
      // At most 3 requests in 10 minutes and 30 s between two, counted in this browser (shared with the portfolio form).
      const now = Date.now(); let sent = []
      try { sent = JSON.parse(localStorage.getItem('jk-sent') || '[]').filter((x) => now - x < 600000) } catch (err) { /* ignore */ }
      if (sent.length >= 3 || (sent.length && now - sent[sent.length - 1] < 30000)) { status.className = 'kit-status is-err'; status.textContent = t('kit.f.rate'); return }
      try { localStorage.setItem('jk-sent', JSON.stringify(sent.concat(now))) } catch (err) { /* ignore */ }
      const biz = clean(form.elements.business.value, 80), btn = $('button[type=submit]', form), label = $('span', btn)
      btn.disabled = true; label.textContent = t('kit.f.sending')
      fetch(JOEL_FORM, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ business: biz, business_type: clean(form.elements.type.value, 60), contact: clean(form.elements.contact.value, 120), demo_seen: name, language: lang, _subject: 'Preview request: ' + biz + ' (from the ' + name + ' demo)', _captcha: 'false', _template: 'table', _honey: '' }),
      }).then((r) => r.json())
        .then((j) => { if (String(j.success) !== 'true') throw new Error('not sent'); status.className = 'kit-status is-ok'; status.textContent = t('kit.f.ok'); form.reset() })
        .catch(() => { status.className = 'kit-status is-err'; status.textContent = t('kit.f.fail') })
        .then(() => { btn.disabled = false; label.textContent = t('kit.f.send'); status.focus() })
    })
  }
}
