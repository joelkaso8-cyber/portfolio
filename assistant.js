/* Site assistant: a chat that answers client questions in EN/SQ.
   Answers come from the free AI worker (assistant-worker/) when AI_URL is set,
   otherwise, or when the AI is busy or down, from assistant-kb.json on the page itself. */
(function () {
  'use strict'
  var AI_URL = 'https://joel-assistant.joelkaso8.workers.dev/chat' // free AI: assistant-worker/
  var WA = '355685727406'

  var UI = {
    en: {
      open: 'Ask a question', title: 'Ask about your website', sub: 'Instant answers · English or Albanian',
      hi: "Hi! I answer questions about Joel's websites: prices, timing, payment, what you get and his work. What would you like to know?",
      ph: 'Type your question…', send: 'Send', close: 'Close',
      note: 'Automatic answers, can be wrong. For a firm quote, message Joel.',
      unsure: "I'm not sure about that one. Joel can answer it himself, he replies within a day in English or Albanian.",
      wa: 'Ask Joel on WhatsApp', go: 'Show me', quote: 'Get a quote', waMsg: 'Hi Joel, I have a question about a website: ',
      chips: { price: 'How much?', time: 'How long?', payment: 'Payment', work: 'See the work', own: 'Do I own it?' }
    },
    sq: {
      open: 'Bëj një pyetje', title: 'Pyet për faqen tënde', sub: 'Përgjigje të menjëhershme · shqip ose anglisht',
      hi: 'Përshëndetje! Përgjigjem për faqet e Joelit: çmimet, kohën, pagesën, çfarë përfshihet dhe punët e tij. Çfarë do të dish?',
      ph: 'Shkruaj pyetjen…', send: 'Dërgo', close: 'Mbyll',
      note: 'Përgjigje automatike, mund të kenë gabime. Për ofertë të saktë, shkruaji Joelit.',
      unsure: 'Për këtë nuk jam i sigurt. Joeli të përgjigjet vetë, brenda një dite, në shqip ose anglisht.',
      wa: 'Pyet Joelin në WhatsApp', go: 'Më trego', quote: 'Merr ofertë', waMsg: 'Përshëndetje Joel, kam një pyetje për një faqe: ',
      chips: { price: 'Sa kushton?', time: 'Sa zgjat?', payment: 'Pagesa', work: 'Punët', own: 'E kujt është?' }
    }
  }

  var KB = null, kbLoad = null, history = [], busy = false, built = false
  var root, panel, log, form, input, launcher, chipsBox

  var siteLang = function () { return document.documentElement.lang === 'sq' ? 'sq' : 'en' }
  var u = function (k) { return UI[siteLang()][k] }
  // Lowercase, drop Albanian accents (ë→e, ç→c), keep words, € and %.
  var norm = function (s) { return ' ' + String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9€%.]+/g, ' ').trim() + ' ' }

  function loadKb() {
    if (!kbLoad) kbLoad = fetch('assistant-kb.json').then(function (r) { return r.json() }).then(function (j) { KB = j; return j }).catch(function () { kbLoad = null; return null })
    return kbLoad
  }

  // Albanian if it has ë/ç or common Albanian words; else the page language unless the text is clearly English.
  function langOf(text) {
    var n = norm(text)
    if (/[ëç]/i.test(text) || /( sa | si | cfare | kush | ku | kur | dua | eshte | per | nje | faqe | faleminderit | pershendetje | tung | ckemi | mund | kam | jeni | je )/.test(n)) return 'sq'
    if (/( the | how | what | is | do | does | can | you | much | price | want | need | my )/.test(n)) return 'en'
    return siteLang()
  }

  // Topics by keyword hits, best first (ties keep file order). Short keywords must match a whole word;
  // longer ones may start a word (rezervim → rezervimi). A phrase hit counts double.
  function rank(text) {
    if (!KB) return []
    var n = norm(text)
    return KB.topics.map(function (t, i) {
      var score = 0
      t.kw.forEach(function (k) {
        var kn = norm(k).trim()
        if (!kn) return
        var hit = kn.length >= 5 ? n.indexOf(' ' + kn) > -1 : n.indexOf(' ' + kn + ' ') > -1
        if (hit) score += kn.indexOf(' ') > -1 ? 2 : 1
      })
      return { t: t, score: score, i: i }
    }).filter(function (r) { return r.score > 0 }).sort(function (a, b) { return b.score - a.score || a.i - b.i })
  }
  function match(text) { var r = rank(text); return r.length ? r[0].t : null }

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e }

  function waHref(q) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(u('waMsg') + (q || '')) }

  function addMsg(who, text, actions) {
    var m = el('div', 'asst__msg asst__msg--' + who)
    m.appendChild(el('p', null, text))
    if (actions && actions.length) {
      var row = el('div', 'asst__acts')
      actions.forEach(function (a) {
        var b = el('a', 'asst__act' + (a.wa ? ' asst__act--wa' : ''), a.label)
        b.href = a.href
        if (a.wa) { b.target = '_blank'; b.rel = 'noopener noreferrer' } else b.addEventListener('click', close)
        row.appendChild(b)
      })
      m.appendChild(row)
    }
    log.appendChild(m)
    log.scrollTop = log.scrollHeight
    return m
  }

  function localAnswer(q, lang) {
    var r = rank(q), L = UI[lang]
    if (!r.length) return { text: L.unsure, actions: [{ label: L.wa, href: waHref(q), wa: true }, { label: L.quote, href: '#quote' }] }
    var t = r[0].t, text = t[lang] || t.en, acts = []
    // A two-part question ("how long, and how do I pay?") gets both answers when the second part is a clear hit.
    if (r[1] && r[1].score >= 2) text += '\n\n' + (r[1].t[lang] || r[1].t.en)
    if (t.go) acts.push({ label: t.go === '#quote' ? L.quote : L.go, href: t.go })
    if (t.id === 'contact' || t.id === 'start') acts.push({ label: L.wa, href: waHref(q), wa: true })
    return { text: text, actions: acts }
  }

  function askAi(lang) {
    var ctl = 'AbortController' in window ? new AbortController() : null
    var timer = setTimeout(function () { if (ctl) ctl.abort() }, 15000)
    return fetch(AI_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: ctl ? ctl.signal : undefined,
      body: JSON.stringify({ lang: lang, messages: history.slice(-8) })
    }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json() })
      .then(function (j) { if (!j.reply) throw new Error('empty'); return j.reply })
      .finally(function () { clearTimeout(timer) })
  }

  function ask(q) {
    q = String(q || '').trim().slice(0, 600)
    if (!q || busy) return
    busy = true
    chipsBox.hidden = true
    addMsg('me', q)
    history.push({ role: 'user', content: q })
    var lang = langOf(q), typing = el('div', 'asst__msg asst__msg--bot asst__typing')
    typing.setAttribute('aria-label', '…')
    typing.innerHTML = '<span></span><span></span><span></span>'
    log.appendChild(typing); log.scrollTop = log.scrollHeight

    var done = function (text, actions) {
      typing.remove()
      addMsg('bot', text, actions)
      history.push({ role: 'assistant', content: text })
      busy = false
      input.focus()
    }
    var fallback = function () { return loadKb().then(function () { var a = localAnswer(q, lang); done(a.text, a.actions) }) }

    if (AI_URL) {
      askAi(lang).then(function (reply) {
        var t = match(q), acts = t && t.go ? [{ label: t.go === '#quote' ? UI[lang].quote : UI[lang].go, href: t.go }] : []
        done(reply, acts)
      }).catch(fallback)
    } else {
      setTimeout(fallback, 350) // a short pause reads as a reply, not a canned popup
    }
  }

  function renderChips() {
    chipsBox.textContent = ''
    var ids = (KB && KB.chips) || ['price', 'time', 'payment', 'work', 'own']
    ids.forEach(function (id) {
      var b = el('button', 'asst__chip', u('chips')[id])
      b.type = 'button'
      b.addEventListener('click', function () { ask(b.textContent) })
      chipsBox.appendChild(b)
    })
  }

  function relabel() {
    if (!built) return
    launcher.setAttribute('aria-label', u('open'))
    launcher.querySelector('.asst__label').textContent = u('open')
    panel.querySelector('#asst-title').textContent = u('title')
    panel.querySelector('.asst__sub').textContent = u('sub')
    panel.querySelector('.asst__close').setAttribute('aria-label', u('close'))
    panel.querySelector('.asst__note').textContent = u('note')
    input.placeholder = u('ph')
    input.setAttribute('aria-label', u('ph'))
    form.querySelector('.asst__send').setAttribute('aria-label', u('send'))
    if (!history.length) { log.textContent = ''; addMsg('bot', u('hi')) }
    renderChips()
  }

  function build() {
    root = el('div', 'asst')
    root.innerHTML =
      '<button class="asst__launch" type="button" aria-expanded="false" aria-controls="asst-panel">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.6c-.5.4-1.3 0-1.3-.6V16A2.5 2.5 0 0 1 4 13.5z"/><path class="asst__spark" d="M12 6.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1L9 9.5l2.1-.9z"/></svg>' +
        '<span class="asst__label"></span></button>' +
      '<section class="asst__panel" id="asst-panel" role="dialog" aria-modal="false" aria-labelledby="asst-title" hidden>' +
        '<header class="asst__head"><span class="asst__avatar" aria-hidden="true">JK</span><div><h2 id="asst-title"></h2><p class="asst__sub"></p></div>' +
          '<button class="asst__close" type="button"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></header>' +
        '<div class="asst__log" aria-live="polite"></div>' +
        '<div class="asst__chips"></div>' +
        '<form class="asst__form" novalidate><input class="asst__input" type="text" maxlength="600" autocomplete="off" enterkeyhint="send">' +
          '<button class="asst__send" type="submit"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h14M13 6l6 6-6 6"/></svg></button></form>' +
        '<p class="asst__note"></p>' +
      '</section>'
    document.body.appendChild(root)
    launcher = root.querySelector('.asst__launch')
    panel = root.querySelector('.asst__panel')
    log = root.querySelector('.asst__log')
    chipsBox = root.querySelector('.asst__chips')
    form = root.querySelector('.asst__form')
    input = root.querySelector('.asst__input')
    built = true

    launcher.addEventListener('click', open)
    panel.querySelector('.asst__close').addEventListener('click', close)
    form.addEventListener('submit', function (e) { e.preventDefault(); var q = input.value; input.value = ''; ask(q) })
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) close() })
    // Follow the page's EN | SQ switch.
    new MutationObserver(relabel).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] })
    relabel()
  }

  function open() {
    loadKb().then(function () { if (!history.length) renderChips() })
    panel.hidden = false
    root.classList.add('is-open')
    launcher.setAttribute('aria-expanded', 'true')
    input.focus()
  }
  function close() {
    panel.hidden = true
    root.classList.remove('is-open')
    launcher.setAttribute('aria-expanded', 'false')
    launcher.focus()
  }

  build()
  // Self-check of the matcher, run with ?asst-test in the URL.
  if (/[?&]asst-test\b/.test(location.search)) loadKb().then(function () {
    var cases = [['How much is a website?', 'price'], ['Sa kushton një faqe?', 'price'], ['sa zgjat?', 'time'], ['A ka pagesa mujore?', 'monthly'], ['can I book a table', 'booking'], ['Who owns the domain', 'own'], ['what is the weather', null]]
    cases.forEach(function (c) { var t = match(c[0]); console.assert((t && t.id) === c[1], 'asst match', c[0], '→', t && t.id, 'expected', c[1]) })
    console.assert(localAnswer('Sa zgjat dhe si paguhet?', 'sq').text.indexOf('50%') > -1, 'asst two-part answer')
    console.info('asst self-check done')
  })
})()
