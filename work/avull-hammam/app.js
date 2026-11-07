// Avull · Hammam & Spa. Everything on the page is built from site-config.json:
// treatments with lengths, ritual finder, 4-step booking (calendar, live time slots, therapist), quiet-times chart,
// memberships, gift-voucher builder with a card you can save, gallery, reviews, FAQ, hours, EN/SQ, cookies, legal.
// Requests go to /api/enquiry (Telegram + Google Sheets, see netlify/functions) or WhatsApp.
;(function () {
  'use strict'
  var $ = function (s, r) { return (r || document).querySelector(s) }
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) }
  var DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  var C = null
  var store = { get: function (k) { try { return localStorage.getItem(k) } catch (e) { return null } }, set: function (k, v) { try { localStorage.setItem(k, v) } catch (e) {} } }
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // On the portfolio (GitHub Pages) there is no server, so forms show a demo message instead of sending.
  var DEMO = /github\.io$/.test(location.hostname) || location.protocol === 'file:'

  var lang = store.get('site-lang') || ((navigator.languages || [navigator.language || 'en']).some(function (l) { return /^sq/i.test(l) }) ? 'sq' : 'en')
  if (!window.I18N[lang]) lang = 'en'
  var t = function (k, vars) { var s = (window.I18N[lang] && window.I18N[lang][k]) || window.I18N.en[k] || k; if (vars && typeof s === 'string') Object.keys(vars).forEach(function (v) { s = s.split('{' + v + '}').join(vars[v]) }); return s }
  var pick = function (o) { return o == null ? '' : typeof o === 'string' ? o : (o[lang] || o.en || '') }
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] }) }
  var clean = function (s, max) { return String(s == null ? '' : s).replace(/<[^>]*>/g, ' ').replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max || 200) }
  var pad = function (n) { return (n < 10 ? '0' : '') + n }
  var locale = function () { return lang === 'sq' ? 'sq-AL' : 'en-GB' }

  function nowThere() {
    var tz = (C && C.business.timezone) || undefined
    var p = new Intl.DateTimeFormat('en-GB', { timeZone: tz, weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date())
    var g = function (k) { return (p.find(function (x) { return x.type === k }) || {}).value }
    return { day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(g('weekday')), iso: g('year') + '-' + g('month') + '-' + g('day'), min: (Number(g('hour')) % 24) * 60 + Number(g('minute')) }
  }
  var toMin = function (hm) { var p = hm.split(':'); return Number(p[0]) * 60 + Number(p[1]) }
  var toHM = function (m) { return pad(Math.floor(m / 60)) + ':' + pad(m % 60) }
  var isoDate = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) }
  var fromIso = function (iso) { return new Date(iso + 'T12:00:00') }
  var addDays = function (iso, n) { var d = fromIso(iso); d.setDate(d.getDate() + n); return isoDate(d) }
  var dayIdx = function (iso) { return (fromIso(iso).getDay() + 6) % 7 }
  var fmtDate = function (iso) { return fromIso(iso).toLocaleDateString(locale(), { weekday: 'short', day: 'numeric', month: 'short' }) }
  var money = function (n) { try { return new Intl.NumberFormat(locale(), { style: 'currency', currency: C.business.currency, maximumFractionDigits: n % 1 ? 2 : 0 }).format(n) } catch (e) { return '£' + n } }
  // Small stable hash: the same day and time always show the same "taken" state.
  var hash = function (s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) } return (h >>> 0) / 4294967295 }
  var svcById = function (id) { return C && C.services.find(function (s) { return s.id === id }) }

  // ---------- Text ----------
  function applyText() {
    document.documentElement.lang = lang
    $$('[data-i18n]').forEach(function (el) { var v = t(el.dataset.i18n); if (/<em>/.test(v)) el.innerHTML = v; else el.textContent = v })
    $$('[data-i18n-label]').forEach(function (el) { el.setAttribute('aria-label', t(el.dataset.i18nLabel)) })
    $$('[data-ph]').forEach(function (el) { el.placeholder = t(el.dataset.ph) })
    $$('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === lang)) })
    $('#burger .sr').textContent = t($('#burger').getAttribute('aria-expanded') === 'true' ? 'nav.close' : 'nav.open')
    $('#sound-label').textContent = t(sound.on ? 'sound.on' : 'sound.off')
    if (!C) return
    var b = C.business, a = b.address
    var set = function (key, fn) { $$('[data-fill="' + key + '"]').forEach(fn) }
    set('tagline', function (el) { el.textContent = pick(b.tagline) })
    set('address', function (el) { el.textContent = [a.street, a.region, a.city + ' ' + a.postcode].filter(Boolean).join(', ') })
    set('parking', function (el) { el.textContent = pick(b.parking); el.hidden = !pick(b.parking) })
    set('maps', function (el) { el.href = b.mapsUrl })
    set('phone', function (el) { el.href = 'tel:' + b.phone.replace(/[^\d+]/g, ''); el.textContent = b.phone })
    set('phone-link', function (el) { el.href = 'tel:' + b.phone.replace(/[^\d+]/g, '') })
    set('email', function (el) { el.href = 'mailto:' + b.email; el.textContent = b.email })
    set('wa-link', function (el) { el.href = 'https://wa.me/' + b.whatsapp + '?text=' + encodeURIComponent(t('wa.hello', { biz: b.name })) })
    set('instagram', function (el) { el.href = b.instagram || '#'; el.hidden = !b.instagram })
    set('facebook', function (el) { el.href = b.facebook || '#'; el.hidden = !b.facebook })
    set('credits', function (el) { el.textContent = C.credits || '' })
    var n = $('#notice'); n.textContent = pick(C.notice); n.hidden = !pick(C.notice)
    var count = C.rating.count.toLocaleString(locale())
    $('#stat-rating').textContent = t('stat.rating', { n: count })
    $('#rev-score').textContent = C.rating.score.toLocaleString(locale(), { minimumFractionDigits: 1 })
    $('#rev-count').textContent = t('stat.rating', { n: count }) + ' ' + t('rev.on')
    $('#g-post-l').textContent = t('gift.p', { p: money(C.vouchers.postage) })
    renderMenu(); renderQuiz(); renderBooking(); renderBusy(); renderPlans(); renderGift(); renderReviews(); renderFaq(); renderHours()
  }
  $$('[data-lang]').forEach(function (b) { b.addEventListener('click', function () { lang = b.dataset.lang; store.set('site-lang', lang); applyText() }) })

  // ---------- Header: solid after the film, phone menu, current section ----------
  var bar = $('#top-bar'), film = $('.film'), burger = $('#burger')
  function headerState() { bar.classList.toggle('is-solid', !film || film.classList.contains('film--still') || window.scrollY > film.offsetTop + film.offsetHeight - window.innerHeight - 40) }
  window.addEventListener('scroll', headerState, { passive: true }); headerState()
  function menu(open) {
    burger.setAttribute('aria-expanded', String(open)); bar.classList.toggle('is-menu', open)
    document.body.style.overflow = open ? 'hidden' : ''
    $('#burger .sr').textContent = t(open ? 'nav.close' : 'nav.open')
  }
  burger.addEventListener('click', function () { menu(burger.getAttribute('aria-expanded') !== 'true') })
  $$('#nav a').forEach(function (a) { a.addEventListener('click', function () { menu(false) }) })
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && bar.classList.contains('is-menu')) menu(false) })
  if ('IntersectionObserver' in window) {
    var links = {}; $$('#nav a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a })
    var spy = new IntersectionObserver(function (es) { es.forEach(function (e) { var a = links[e.target.id]; if (a) a.classList.toggle('is-here', e.isIntersecting) }) }, { rootMargin: '-45% 0px -50% 0px' })
    Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s) })
  }
  // Film chapter counter (01 / 04) follows the captions.
  var filmN = $('#film-n'), bands = $$('.film__band').map(function (b) { return +b.dataset.a })
  function chapter() {
    if (!film) return
    var p = Math.min(1, Math.max(0, (window.scrollY - film.offsetTop) / Math.max(1, film.offsetHeight - window.innerHeight)))
    var n = 1; bands.forEach(function (a, i) { if (p >= a - 0.001) n = i + 1 })
    var s = pad(n); if (filmN.textContent !== s) filmN.textContent = s
  }
  window.addEventListener('scroll', chapter, { passive: true }); chapter()

  // ---------- Reveal and counters ----------
  function countUp(el) {
    var end = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0)
    if (reduce) { el.textContent = end.toLocaleString(locale(), { minimumFractionDigits: dec }); return }
    var t0 = null
    function step(ts) {
      if (!t0) t0 = ts
      var k = Math.min(1, (ts - t0) / 1400), v = end * (1 - Math.pow(1 - k, 3))
      el.textContent = v.toLocaleString(locale(), { minimumFractionDigits: dec, maximumFractionDigits: dec })
      if (k < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }
  function reveal() {
    if (!('IntersectionObserver' in window)) { $$('.reveal').forEach(function (e) { e.classList.add('is-in') }); return }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return
        en.target.classList.add('is-in'); io.unobserve(en.target)
        var c = en.target.querySelector('[data-count]'); if (c) countUp(c)
      })
    }, { rootMargin: '0px 0px -8% 0px' })
    $$('.reveal:not(.is-in)').forEach(function (e) { io.observe(e) })
  }

  // ---------- Sound: soft brown noise like a steam room, made in the browser (no file to download) ----------
  var sound = { on: false, ctx: null, gain: null }
  $('#sound').addEventListener('click', function () {
    var Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    if (!sound.ctx) {
      var ctx = new Ctx(), len = ctx.sampleRate * 4, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0), last = 0
      for (var i = 0; i < len; i++) { var w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; d[i] = last * 3.2 }
      var src = ctx.createBufferSource(); src.buffer = buf; src.loop = true
      var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 520
      var lfo = ctx.createOscillator(), lfoGain = ctx.createGain(); lfo.frequency.value = 0.08; lfoGain.gain.value = 180
      lfo.connect(lfoGain); lfoGain.connect(lp.frequency); lfo.start()
      var g = ctx.createGain(); g.gain.value = 0
      src.connect(lp); lp.connect(g); g.connect(ctx.destination); src.start()
      sound.ctx = ctx; sound.gain = g
    }
    sound.on = !sound.on
    if (sound.ctx.state === 'suspended') sound.ctx.resume()
    sound.gain.gain.cancelScheduledValues(sound.ctx.currentTime)
    sound.gain.gain.setTargetAtTime(sound.on ? 0.22 : 0, sound.ctx.currentTime, 0.6)
    this.setAttribute('aria-pressed', String(sound.on))
    $('#sound-label').textContent = t(sound.on ? 'sound.on' : 'sound.off')
  })

  // ---------- Treatments ----------
  var menuCat = 'all', lenPick = {}
  function priceLine(s, i) { var o = s.options[i || 0]; return money(o.price) + (s.people === 2 ? '<small>' + esc(t('menu.for2')) + '</small>' : '') }
  function renderMenu() {
    var tabs = $('#menu-tabs'); tabs.innerHTML = ''
    ;[{ id: 'all', name: t('menu.all') }].concat(C.categories.map(function (c) { return { id: c.id, name: pick(c.name) } })).forEach(function (c) {
      var b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'tab'); b.textContent = c.name
      b.setAttribute('aria-selected', String(c.id === menuCat))
      b.addEventListener('click', function () { menuCat = c.id; renderMenu() })
      tabs.appendChild(b)
    })
    var box = $('#menu-list'); box.innerHTML = ''
    C.services.filter(function (s) { return menuCat === 'all' || s.cat === menuCat }).forEach(function (s, n) {
      var i = lenPick[s.id] || 0, el = document.createElement('article'); el.className = 'svc'; el.style.animationDelay = (n * 0.05) + 's'
      el.innerHTML = (s.tag ? '<p class="svc__tag">' + esc(pick(s.tag)) + '</p>' : '') +
        '<div class="svc__top"><h3>' + esc(pick(s.name)) + '</h3><p class="svc__price">' + priceLine(s, i) + '</p></div>' +
        '<p class="svc__desc">' + esc(pick(s.desc)) + '</p><div class="svc__foot"><div class="chips"></div><button type="button" class="svc__add"><span>' + esc(t('menu.add')) + '</span><i aria-hidden="true">→</i></button></div>'
      var chips = el.querySelector('.chips')
      s.options.forEach(function (o, k) {
        var c = document.createElement('button'); c.type = 'button'; c.textContent = t('menu.min', { n: o.min }); c.setAttribute('aria-pressed', String(k === i))
        c.addEventListener('click', function () {
          lenPick[s.id] = k; $$('button', chips).forEach(function (x, j) { x.setAttribute('aria-pressed', String(j === k)) })
          var p = el.querySelector('.svc__price'); p.style.opacity = 0; setTimeout(function () { p.innerHTML = priceLine(s, k); p.style.opacity = 1 }, 160)
        })
        chips.appendChild(c)
      })
      el.querySelector('.svc__add').setAttribute('aria-label', t('menu.add') + ': ' + pick(s.name))
      el.querySelector('.svc__add').addEventListener('click', function () { bookThis(s.id, lenPick[s.id] || 0) })
      box.appendChild(el)
    })
  }

  // ---------- Ritual finder ----------
  var quiz = { i: 0, ans: {} }
  function quizResult() {
    var r = C.quiz.results.find(function (x) { return Object.keys(x.if).every(function (k) { return quiz.ans[k] === x.if[k] }) })
    return svcById(r.service)
  }
  function renderQuiz() {
    var card = $('#quiz-card'), Q = C.quiz.questions, total = Q.length
    if (quiz.i >= total) {
      var s = quizResult(), best = quiz.ans.time === 'long' ? s.options.length - 1 : quiz.ans.time === 'short' ? 0 : Math.min(1, s.options.length - 1)
      card.innerHTML = '<div class="quiz__anim quiz__res"><p class="quiz__step">' + esc(t('quiz.res')) + '</p><h3>' + esc(pick(s.name)) + '</h3><p class="muted">' + esc(pick(s.desc)) + '</p>' +
        '<p class="svc__price">' + priceLine(s, best) + ' <small>· ' + esc(t('menu.min', { n: s.options[best].min })) + '</small></p>' +
        '<div class="quiz__row"><button type="button" class="btn" id="quiz-book">' + esc(t('menu.add')) + '</button><button type="button" class="btn btn--ghost" id="quiz-again">' + esc(t('quiz.again')) + '</button></div></div>'
      $('#quiz-book').addEventListener('click', function () { bookThis(s.id, best) })
      $('#quiz-again').addEventListener('click', function () { quiz = { i: 0, ans: {} }; renderQuiz(); var f = $('#quiz-card button'); if (f) f.focus() })
      return
    }
    var q = Q[quiz.i]
    card.innerHTML = '<div class="quiz__anim"><div class="quiz__row" style="justify-content:space-between"><p class="quiz__step">' + esc(t('quiz.step', { a: quiz.i + 1, b: total })) + '</p>' +
      (quiz.i ? '<button type="button" class="linklike" id="quiz-back">' + esc(t('quiz.back')) + '</button>' : '') + '</div>' +
      '<div class="quiz__bar"><i style="width:' + (quiz.i / total * 100) + '%"></i></div><p class="quiz__q">' + esc(pick(q.q)) + '</p><div class="quiz__a"></div></div>'
    var box = $('.quiz__a', card)
    q.a.forEach(function (a) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = pick(a.t)
      b.addEventListener('click', function () { quiz.ans[q.id] = a.id; quiz.i++; renderQuiz(); var f = $('#quiz-card .quiz__a button, #quiz-book'); if (f) f.focus({ preventScroll: true }) })
      box.appendChild(b)
    })
    var back = $('#quiz-back'); if (back) back.addEventListener('click', function () { quiz.i--; renderQuiz() })
  }

  // ---------- Booking ----------
  var form = $('#book-form')
  var B = { step: 1, svc: null, len: 0, date: '', time: '', ther: 'any', guests: 1, month: null, maxStep: 1 }
  function bookThis(id, len) {
    B.svc = id; B.len = len || 0; B.time = ''; var s = svcById(id); B.guests = s.people === 2 ? 2 : Math.min(B.guests, 2)
    B.step = B.date ? 3 : 2; B.maxStep = Math.max(B.maxStep, B.step); status('')
    renderBooking()
    $('#book').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }
  function hoursFor(iso) { return C.hours[DAY_KEYS[dayIdx(iso)]] }
  function slotsFor(iso) {
    var h = hoursFor(iso), s = svcById(B.svc); if (!h || !s) return []
    var dur = s.options[B.len].min, open = toMin(h[0]), close = toMin(h[1]), step = C.booking.step || 30, out = []
    var now = nowThere(), busy = C.busy[DAY_KEYS[dayIdx(iso)]] || [], from = C.busy.from || 9
    for (var m = open; m + dur <= close; m += step) {
      if (iso === now.iso && m < now.min + 60) continue
      var lvl = busy[Math.floor(m / 60) - from] || 0
      out.push({ time: toHM(m), taken: hash(iso + toHM(m) + B.svc) < 0.12 + lvl / 300, quiet: lvl < 35 })
    }
    return out
  }
  var isBlocked = function (iso) { return (C.booking.blockedDates || []).indexOf(iso) >= 0 }
  function dayOk(iso) {
    var today = nowThere().iso
    if (iso < today || iso > addDays(today, C.booking.daysAhead || 42) || isBlocked(iso) || !hoursFor(iso)) return false
    return !B.svc || slotsFor(iso).some(function (x) { return !x.taken })
  }
  function stepOk(n) {
    if (n >= 1 && !B.svc) return fail(1, 'err.svc')
    if (n >= 2 && !B.date) return fail(2, 'err.date')
    if (n >= 3 && !B.time) return fail(3, 'err.time')
    return true
  }
  function fail(step, key, field) {
    B.step = step; renderBooking(); status(t(key), true)
    if (field) { field.setAttribute('aria-invalid', 'true'); field.focus() }
    return false
  }
  function renderBooking() {
    if (!C) return
    var s = svcById(B.svc)
    $$('.progress li').forEach(function (li) {
      var n = +li.dataset.s; li.classList.toggle('is-now', n === B.step); li.classList.toggle('is-done', n < B.step || n <= B.maxStep && n !== B.step)
      var btn = li.querySelector('button'); btn.disabled = n > B.maxStep; if (n === B.step) btn.setAttribute('aria-current', 'step'); else btn.removeAttribute('aria-current')
    })
    $$('.pane').forEach(function (p) { p.hidden = +p.dataset.pane !== B.step })
    $('#prev').hidden = B.step === 1
    $('#next').hidden = B.step === 4
    $('#send').hidden = B.step !== 4

    // 1. Treatment and length
    var pickBox = $('#pick-svc'); pickBox.innerHTML = ''
    C.services.forEach(function (x) {
      var l = document.createElement('label'); l.innerHTML = '<input type="radio" name="svc" /><b></b><small></small>'
      var inp = l.firstChild; inp.value = x.id; inp.checked = x.id === B.svc
      l.querySelector('b').textContent = pick(x.name)
      l.querySelector('small').textContent = t('menu.from') + ' ' + money(x.options[0].price) + ' · ' + x.options.map(function (o) { return o.min }).join(' / ') + ' min'
      inp.addEventListener('change', function () { B.svc = x.id; B.len = 0; B.time = ''; B.guests = x.people === 2 ? 2 : 1; status(''); renderBooking() })
      pickBox.appendChild(l)
    })
    var lenBox = $('#pick-len'); lenBox.innerHTML = ''
    ;(s ? s.options : []).forEach(function (o, k) {
      var c = document.createElement('button'); c.type = 'button'; c.textContent = t('menu.min', { n: o.min }) + ' · ' + money(o.price); c.setAttribute('aria-pressed', String(k === B.len))
      c.addEventListener('click', function () { B.len = k; B.time = ''; renderBooking() })
      lenBox.appendChild(c)
    })
    lenBox.previousElementSibling.hidden = !s

    // 2. Calendar
    renderCal()

    // 3. Time slots, therapist, guests
    var slots = $('#slots'); slots.innerHTML = ''
    if (B.date && s) {
      var list = slotsFor(B.date)
      if (!list.some(function (x) { return !x.taken })) slots.innerHTML = '<p class="slots__none">' + esc(t('book.notimes')) + '</p>'
      list.forEach(function (x) {
        var b = document.createElement('button'); b.type = 'button'; b.disabled = x.taken; b.setAttribute('aria-pressed', String(x.time === B.time))
        b.innerHTML = '<span>' + x.time + '</span>' + (x.taken ? '<small>' + esc(t('book.taken')) + '</small>' : x.quiet ? '<small>' + esc(t('book.quiet')) + '</small>' : '')
        b.setAttribute('aria-label', x.time + (x.taken ? ', ' + t('book.taken') : x.quiet ? ', ' + t('book.quiet') : ''))
        b.addEventListener('click', function () { B.time = x.time; status(''); renderBooking(); $('#next').focus() })
        slots.appendChild(b)
      })
    }
    var ther = $('#pick-ther'); ther.innerHTML = ''
    C.therapists.forEach(function (x) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = pick(x.name); b.setAttribute('aria-pressed', String(x.id === B.ther))
      b.addEventListener('click', function () { B.ther = x.id; renderBooking() }); ther.appendChild(b)
    })
    var gb = $('#pick-guests'); gb.innerHTML = ''
    $('#guests-box').hidden = !!(s && s.people === 2)
    ;[1, 2].forEach(function (n) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = String(n); b.setAttribute('aria-pressed', String(n === B.guests))
      b.setAttribute('aria-label', t('book.guests') + ': ' + n)
      b.addEventListener('click', function () { B.guests = n; renderBooking() }); gb.appendChild(b)
    })
    summary()
  }
  function renderCal() {
    var box = $('#cal'), today = nowThere().iso, last = addDays(today, C.booking.daysAhead || 42)
    if (!B.month) B.month = today.slice(0, 7)
    var y = +B.month.slice(0, 4), m = +B.month.slice(5, 7) - 1, first = new Date(y, m, 1, 12), days = new Date(y, m + 1, 0).getDate()
    var title = first.toLocaleDateString(locale(), { month: 'long', year: 'numeric' })
    var html = '<div class="cal__head"><b>' + esc(title) + '</b><div class="cal__nav">' +
      '<button type="button" class="round" data-m="-1" aria-label="' + (lang === 'sq' ? 'Muaji i kaluar' : 'Previous month') + '"' + (B.month <= today.slice(0, 7) ? ' disabled' : '') + '><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5 8 12l7 7"/></svg></button>' +
      '<button type="button" class="round" data-m="1" aria-label="' + (lang === 'sq' ? 'Muaji tjetër' : 'Next month') + '"' + (B.month >= last.slice(0, 7) ? ' disabled' : '') + '><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg></button></div></div><div class="cal__grid">'
    t('days').forEach(function (d) { html += '<span class="cal__dow" aria-hidden="true">' + esc(d) + '</span>' })
    var lead = (first.getDay() + 6) % 7
    for (var i = 0; i < lead; i++) html += '<span class="cal__day is-blank" aria-hidden="true"></span>'
    for (var d = 1; d <= days; d++) {
      var iso = y + '-' + pad(m + 1) + '-' + pad(d), ok = dayOk(iso)
      html += '<button type="button" class="cal__day' + (iso === today ? ' is-today' : '') + '" data-d="' + iso + '" aria-pressed="' + (iso === B.date) + '"' + (ok ? '' : ' disabled') + ' aria-label="' + esc(fmtDate(iso)) + '">' + d + '</button>'
    }
    box.innerHTML = html + '</div>'
    $$('[data-m]', box).forEach(function (b) {
      b.addEventListener('click', function () { var dt = new Date(y, m + Number(b.dataset.m), 1, 12); B.month = dt.getFullYear() + '-' + pad(dt.getMonth() + 1); renderCal(); var f = $('[data-m="' + b.dataset.m + '"]', box); if (f && !f.disabled) f.focus() })
    })
    $$('.cal__day[data-d]', box).forEach(function (b) {
      b.addEventListener('click', function () { B.date = b.dataset.d; B.time = ''; status(''); B.step = 3; B.maxStep = Math.max(B.maxStep, 3); renderBooking(); var f = $('#slots button:not([disabled])'); if (f) f.focus({ preventScroll: true }) })
    })
  }
  function total() { var s = svcById(B.svc); if (!s) return 0; return s.options[B.len].price * (s.people === 2 ? 1 : B.guests) }
  function summary() {
    var s = svcById(B.svc), ther = C.therapists.find(function (x) { return x.id === B.ther })
    var rows = [
      [t('book.s1'), s ? pick(s.name) + ' · ' + t('menu.min', { n: s.options[B.len].min }) : ''],
      [t('book.s2'), B.date ? fmtDate(B.date) : ''],
      [t('book.s3'), B.time],
      [t('book.ther'), ther ? pick(ther.name) : ''],
      [t('book.guests'), String(s && s.people === 2 ? 2 : B.guests)],
    ]
    $('#summary').innerHTML = rows.map(function (r) { return '<div><dt>' + esc(r[0]) + '</dt><dd' + (r[1] ? '' : ' class="is-empty"') + '>' + esc(r[1] || t('book.pick')) + '</dd></div>' }).join('')
    var tot = total()
    $('#sum-total').textContent = tot ? money(tot) : '—'
    $('#sum-dep').textContent = tot ? money(Math.round(tot * (C.booking.deposit || 0.2))) : '—'
  }
  function status(msg, bad) { var s = $('#form-status'); s.className = 'form-status' + (msg ? (bad ? ' is-error' : ' is-ok') : ''); s.textContent = msg }
  $$('.progress button').forEach(function (b) { b.addEventListener('click', function () { var n = +b.dataset.go; if (n <= B.maxStep) { B.step = n; status(''); renderBooking() } }) })
  $('#prev').addEventListener('click', function () { if (B.step > 1) { B.step--; status(''); renderBooking() } })
  $('#next').addEventListener('click', function () {
    if (!stepOk(B.step)) return
    B.step = Math.min(4, B.step + 1); B.maxStep = Math.max(B.maxStep, B.step); status(''); renderBooking()
    var f = B.step === 4 ? form.elements.name : null; if (f) f.focus({ preventScroll: true })
  })
  function collect() {
    var e = form.elements, s = svcById(B.svc), ther = C.therapists.find(function (x) { return x.id === B.ther })
    var notes = [t('book.ther') + ': ' + (ther ? pick(ther.name) : ''), t('book.total') + ': ' + money(total())]
    if (e.medical.checked) notes.push('⚠ ' + t('book.preg'))
    var msg = clean(e.message.value, 600); if (msg) notes.push(msg)
    return {
      service: s ? pick(s.name) + ' · ' + s.options[B.len].min + ' min' : '', serviceId: B.svc || '', date: B.date, dateOut: '', nights: 0, time: B.time,
      guests: s && s.people === 2 ? 2 : B.guests, name: clean(e.name.value, 80), phone: clean(e.phone.value, 24), email: clean(e.email.value, 120),
      message: notes.join(' · ').slice(0, 600), lang: lang, website: e.website.value,
    }
  }
  function validate(d) {
    $$('[aria-invalid]', form).forEach(function (x) { x.removeAttribute('aria-invalid') })
    if (!stepOk(3)) return false
    if (d.name.length < 2) return fail(4, 'err.name', form.elements.name)
    if (d.phone.replace(/\D/g, '').length < 7) return fail(4, 'err.phone', form.elements.phone)
    if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) return fail(4, 'err.email', form.elements.email)
    return true
  }
  // Sends to the server, or in demo mode waits a moment and reports success without sending anything.
  function send(payload) {
    if (DEMO) return new Promise(function (ok) { setTimeout(ok, 900) })
    var ctrl = new AbortController(), timer = setTimeout(function () { ctrl.abort() }, 12000)
    return fetch('/api/enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: ctrl.signal })
      .then(function (r) { return r.json().catch(function () { return {} }).then(function (j) { clearTimeout(timer); if (!r.ok || !j.ok) throw new Error(j.error || r.status) }) }, function (e) { clearTimeout(timer); throw e })
  }
  var busy = false
  form.addEventListener('submit', function (ev) {
    ev.preventDefault()
    if (busy || !C) return
    var d = collect()
    if (!validate(d)) return
    if (d.website) { status(t('ok.sent', { name: d.name })); return } // honeypot: pretend it worked
    busy = true; var btn = $('#send'); btn.disabled = true; btn.textContent = t('book.sending'); status('')
    send(d)
      .then(function () {
        status(t(DEMO ? 'ok.demo' : 'ok.sent', { name: d.name }))
        form.reset(); B = { step: 1, svc: null, len: 0, date: '', time: '', ther: 'any', guests: 1, month: B.month, maxStep: 1 }
        renderBooking(); $('#form-status').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' })
      })
      .catch(function () { status(t('err.send'), true) })
      .then(function () { busy = false; btn.disabled = false; btn.textContent = t('book.send') })
  })
  $('#wa-book').addEventListener('click', function () {
    if (!C) return
    var d = collect(), lines = [t('wa.hello', { biz: C.business.name })]
    if (d.service) lines.push('• ' + d.service)
    if (d.date) lines.push('• ' + fmtDate(d.date) + (d.time ? ' · ' + d.time : ''))
    lines.push('• ' + t('book.guests') + ': ' + d.guests)
    if (d.name) lines.push('• ' + d.name)
    lines.push(d.message)
    window.open('https://wa.me/' + C.business.whatsapp + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener')
  })

  // ---------- Quiet-times chart ----------
  var busyDay = null
  function renderBusy() {
    var now = nowThere(); if (busyDay === null) busyDay = now.day
    var tabs = $('#busy-days'); tabs.innerHTML = ''
    t('days').forEach(function (name, i) {
      var b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'tab'); b.textContent = name; b.setAttribute('aria-selected', String(i === busyDay))
      b.setAttribute('aria-label', t('daysLong')[i]); b.addEventListener('click', function () { busyDay = i; renderBusy() }); tabs.appendChild(b)
    })
    var key = DAY_KEYS[busyDay], data = C.busy[key], h = C.hours[key], from = C.busy.from, chart = $('#chart'), hourNow = Math.floor(now.min / 60)
    chart.innerHTML = ''
    var desc = []
    data.forEach(function (v, k) {
      var hr = from + k, open = h && hr >= Math.floor(toMin(h[0]) / 60) && hr < Math.ceil(toMin(h[1]) / 60) && v > 0
      var col = document.createElement('div'); col.className = 'chart__col' + (!open ? ' is-off' : v >= 75 ? ' is-hi' : '')
      var isNow = busyDay === now.day && hr === hourNow && open
      if (isNow) col.classList.add('is-now')
      col.innerHTML = '<i style="height:0%"></i><span>' + pad(hr) + '</span>' + (isNow ? '<b>' + esc(t('busy.now')) + '</b>' : '')
      col.title = pad(hr) + ':00 · ' + (open ? level(v) : t('busy.closed'))
      chart.appendChild(col)
      if (open) desc.push(pad(hr) + ':00 ' + level(v))
      requestAnimationFrame(function () { requestAnimationFrame(function () { col.firstChild.style.height = (open ? Math.max(4, v) : 100) + '%' }) })
    })
    chart.setAttribute('aria-label', t('daysLong')[busyDay] + ': ' + desc.join(', '))
    var note = $('#chart-note')
    if (busyDay === now.day) {
      var v = data[hourNow - from], open = h && now.min >= toMin(h[0]) && now.min < toMin(h[1])
      note.textContent = t('busy.now') + ': ' + (open && v != null ? level(v) : t('busy.closed'))
    } else {
      var best = null; data.forEach(function (v, k) { if (v > 0 && (best === null || v < data[best])) best = k })
      note.textContent = best === null ? t('busy.closed') : t('book.quiet') + ': ' + pad(from + best) + ':00'
    }
  }
  function level(v) { return t(v < 35 ? 'busy.l0' : v < 60 ? 'busy.l1' : v < 85 ? 'busy.l2' : 'busy.l3') }

  // ---------- Memberships ----------
  var bill = 'month'
  $$('[data-bill]').forEach(function (b) { b.addEventListener('click', function () { bill = b.dataset.bill; $$('[data-bill]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)) }); renderPlans() }) })
  function renderPlans() {
    var box = $('#mem-list'); box.innerHTML = ''
    C.memberships.forEach(function (p) {
      var el = document.createElement('article'); el.className = 'plan reveal is-in' + (p.featured ? ' is-featured' : '')
      el.innerHTML = (p.featured ? '<p class="plan__pop">' + esc(t('mem.pop')) + '</p>' : '') + '<h3>' + esc(pick(p.name)) + '</h3>' +
        '<p class="plan__price"><b>' + money(p[bill]) + '</b><span>' + esc(t(bill === 'month' ? 'mem.pm' : 'mem.py')) + '</span></p><ul>' +
        pick(p.perks).map(function (x) { return '<li>' + esc(x) + '</li>' }).join('') + '</ul>' +
        '<a class="btn' + (p.featured ? '' : ' btn--ghost') + '" target="_blank" rel="noopener noreferrer"></a>'
      var a = el.querySelector('a'); a.textContent = t('mem.join', { n: pick(p.name) })
      a.href = 'https://wa.me/' + C.business.whatsapp + '?text=' + encodeURIComponent(t('wa.mem', { biz: C.business.name, n: pick(p.name) }) + ' (' + money(p[bill]) + ' ' + t(bill === 'month' ? 'mem.pm' : 'mem.py') + ')')
      box.appendChild(el)
    })
  }

  // ---------- Gift voucher ----------
  var gform = $('#gift-form')
  var G = { type: 'money', amount: 100, other: false, ritual: null, code: '' }
  G.code = 'AV-' + Math.random().toString(36).slice(2, 6).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000)
  $$('[data-gtype]').forEach(function (b) { b.addEventListener('click', function () { G.type = b.dataset.gtype; $$('[data-gtype]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)) }); renderGift() }) })
  function giftValue() {
    if (G.type === 'ritual') { var s = svcById(G.ritual) || C.services[0]; return { price: s.options[0].price, label: pick(s.name), sub: money(s.options[0].price) } }
    var v = G.other ? Number(gform.elements.other.value) || 0 : G.amount
    return { price: v, label: v ? money(v) : '—', sub: '' }
  }
  function renderGift() {
    var amts = $('#g-amounts'); amts.innerHTML = ''
    C.vouchers.amounts.concat(['other']).forEach(function (a) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = a === 'other' ? t('gift.other') : money(a)
      b.setAttribute('aria-pressed', String(a === 'other' ? G.other : !G.other && a === G.amount))
      b.addEventListener('click', function () { if (a === 'other') { G.other = true; renderGift(); gform.elements.other.focus() } else { G.other = false; G.amount = a; renderGift() } })
      amts.appendChild(b)
    })
    $('#g-other-box').hidden = !G.other
    gform.elements.other.min = C.vouchers.min; gform.elements.other.max = C.vouchers.max
    $('#g-money').hidden = G.type !== 'money'; $('#g-ritual').hidden = G.type !== 'ritual'
    var sel = $('#g-ritual-sel'), keep = G.ritual || C.services[0].id; sel.innerHTML = ''
    C.services.forEach(function (s) { var o = document.createElement('option'); o.value = s.id; o.textContent = pick(s.name) + ' · ' + money(s.options[0].price); sel.appendChild(o) })
    sel.value = keep; G.ritual = keep
    voucher()
  }
  function voucher() {
    var v = giftValue(), e = gform.elements, valid = new Date(); valid.setFullYear(valid.getFullYear() + 1)
    var val = $('#v-value'); val.textContent = v.label; val.style.fontSize = G.type === 'ritual' ? 'clamp(1.9rem, 4vw, 2.8rem)' : ''
    $('#v-note').textContent = clean(e.note.value, 140) || t('gift.noteph')
    $('#v-to').textContent = clean(e.to.value, 40) || '—'
    $('#v-from').textContent = clean(e.from.value, 40) || '—'
    $('#v-valid').textContent = valid.toLocaleDateString(locale(), { month: 'short', year: 'numeric' })
    $('#v-code').textContent = G.code
  }
  gform.addEventListener('input', function (e) { if (e.target.name === 'ritual') G.ritual = e.target.value; voucher() })
  gform.addEventListener('change', function (e) { if (e.target.name === 'ritual') { G.ritual = e.target.value; voucher() } })
  // Card tilt follows the pointer (mouse only).
  var card = $('#voucher')
  if (!reduce && window.matchMedia('(hover: hover)').matches) {
    card.addEventListener('pointermove', function (e) { var r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; card.style.setProperty('--ry', ((x - 0.5) * 10).toFixed(2) + 'deg'); card.style.setProperty('--rx', ((0.5 - y) * 8).toFixed(2) + 'deg'); card.style.setProperty('--gx', (x * 100) + '%'); card.style.setProperty('--gy', (y * 100) + '%') })
    card.addEventListener('pointerleave', function () { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg') })
  }
  function gstatus(msg, bad) { var s = $('#gift-status'); s.className = 'form-status' + (msg ? (bad ? ' is-error' : ' is-ok') : ''); s.textContent = msg }
  function giftData() {
    var e = gform.elements, v = giftValue(), post = e.deliv.value === 'post'
    var to = clean(e.to.value, 40), note = clean(e.note.value, 140)
    var msg = [t('gift.to') + ': ' + to, t('gift.code') + ': ' + G.code, t('gift.deliv') + ': ' + (post ? t('gift.p', { p: money(C.vouchers.postage) }) : t('gift.e'))]
    if (note) msg.push('“' + note + '”')
    return {
      service: 'Gift voucher: ' + v.label + (G.type === 'ritual' ? ' (' + money(v.price) + ')' : ''), serviceId: 'voucher', date: nowThere().iso, dateOut: '', nights: 0, time: '', guests: 1,
      name: clean(e.from.value, 80), phone: clean(e.phone.value, 24), email: clean(e.email.value, 120), message: msg.join(' · '), lang: lang, website: e.website.value, value: v.price + (post ? C.vouchers.postage : 0),
    }
  }
  function giftOk(d) {
    $$('[aria-invalid]', gform).forEach(function (x) { x.removeAttribute('aria-invalid') })
    var e = gform.elements, bad = function (f, k, vars) { gstatus(t(k, vars), true); if (f) { f.setAttribute('aria-invalid', 'true'); f.focus() } return false }
    var v = giftValue()
    if (G.type === 'money' && (v.price < C.vouchers.min || v.price > C.vouchers.max)) return bad(G.other ? e.other : null, 'err.amount', { a: money(C.vouchers.min), b: money(C.vouchers.max) })
    if (clean(e.to.value).length < 2) return bad(e.to, 'err.to')
    if (d.name.length < 2) return bad(e.from, 'err.name')
    if (d.phone.replace(/\D/g, '').length < 7) return bad(e.phone, 'err.phone')
    if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) return bad(e.email, 'err.email')
    return true
  }
  var gbusy = false
  gform.addEventListener('submit', function (ev) {
    ev.preventDefault()
    if (gbusy || !C) return
    var d = giftData(); if (!giftOk(d)) return
    if (d.website) { gstatus(t('ok.gift')); return }
    gbusy = true; var btn = $('#gift-send'); btn.disabled = true; btn.textContent = t('book.sending'); gstatus('')
    send(d)
      .then(function () { gstatus(t(DEMO ? 'ok.giftdemo' : 'ok.gift')) })
      .catch(function () { gstatus(t('err.send'), true) })
      .then(function () { gbusy = false; btn.disabled = false; btn.textContent = t('gift.order') })
  })
  $('#gift-wa').addEventListener('click', function () {
    if (!C) return
    var d = giftData(), lines = [t('wa.gift', { biz: C.business.name }), '• ' + d.service, '• ' + d.message]
    if (d.name) lines.push('• ' + t('gift.from') + ': ' + d.name)
    window.open('https://wa.me/' + C.business.whatsapp + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener')
  })
  // Save the card as a PNG, drawn on a canvas at print size.
  $('#gift-save').addEventListener('click', function () {
    var W = 1600, H = 1000, cv = document.createElement('canvas'); cv.width = W; cv.height = H
    var x = cv.getContext('2d'), v = giftValue(), e = gform.elements
    var bg = x.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#2c2518'); bg.addColorStop(1, '#16140e'); x.fillStyle = bg; x.fillRect(0, 0, W, H)
    var g1 = x.createRadialGradient(W, 0, 0, W, 0, W * 0.75); g1.addColorStop(0, 'rgba(240,201,138,.30)'); g1.addColorStop(1, 'rgba(240,201,138,0)'); x.fillStyle = g1; x.fillRect(0, 0, W, H)
    var g2 = x.createRadialGradient(0, H, 0, 0, H, W * 0.6); g2.addColorStop(0, 'rgba(127,128,92,.38)'); g2.addColorStop(1, 'rgba(127,128,92,0)'); x.fillStyle = g2; x.fillRect(0, 0, W, H)
    x.strokeStyle = 'rgba(240,201,138,.22)'; x.lineWidth = 2; ;[220, 300, 380].forEach(function (r) { x.beginPath(); x.arc(W - 110, H - 110, r, 0, Math.PI * 2); x.stroke() })
    x.strokeStyle = 'rgba(240,201,138,.35)'; x.strokeRect(24, 24, W - 48, H - 48)
    var serif = '"Cormorant Garamond", Georgia, serif', sans = '"Hanken Grotesk", Arial, sans-serif'
    x.fillStyle = '#eee5d3'; x.font = '400 92px ' + serif; x.fillText('Avull', 110, 190)
    x.fillStyle = '#f0c98a'; x.font = '500 26px ' + sans; x.textAlign = 'right'; x.fillText('GIFT  ·  HAMMAM & SPA', W - 110, 180); x.textAlign = 'left'
    x.fillStyle = '#eee5d3'; x.font = '300 ' + (G.type === 'ritual' ? 120 : 190) + 'px ' + serif; x.fillText(v.label, 104, 500)
    x.fillStyle = '#c9bfa9'; x.font = 'italic 400 46px ' + serif; x.fillText((clean(e.note.value, 140) || t('gift.noteph')).slice(0, 60), 110, 600)
    var foot = [[t('gift.to'), clean(e.to.value, 40) || '—'], [t('gift.from'), clean(e.from.value, 40) || '—'], [t('gift.valid'), $('#v-valid').textContent], [t('gift.code'), G.code]]
    foot.forEach(function (f, i) { var fx = 110 + i * 360; x.fillStyle = '#958d78'; x.font = '500 22px ' + sans; x.fillText(f[0].toUpperCase(), fx, 850); x.fillStyle = '#eee5d3'; x.font = '500 34px ' + sans; x.fillText(f[1].slice(0, 16), fx, 896) })
    cv.toBlob(function (blob) {
      if (!blob) return
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'avull-gift-' + G.code + '.png'
      document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove() }, 1500)
    }, 'image/png')
  })

  // ---------- Gallery lightbox ----------
  var lb = $('#lightbox'), shots = $$('.gal__i'), at = 0
  function show(i) { at = (i + shots.length) % shots.length; var b = shots[at], img = b.querySelector('img'); $('#lb-img').src = b.dataset.full; $('#lb-img').alt = img.alt; $('#lb-cap').textContent = img.alt + '  ·  ' + (at + 1) + ' / ' + shots.length }
  shots.forEach(function (b, i) { b.setAttribute('aria-label', b.querySelector('img').alt); b.addEventListener('click', function () { show(i); lb.showModal() }) })
  $('#lb-close').addEventListener('click', function () { lb.close() })
  $('#lb-prev').addEventListener('click', function () { show(at - 1) })
  $('#lb-next').addEventListener('click', function () { show(at + 1) })
  lb.addEventListener('click', function (e) { if (e.target === lb) lb.close() })
  lb.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') show(at - 1); if (e.key === 'ArrowRight') show(at + 1) })
  var sx = null
  lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX }, { passive: true })
  lb.addEventListener('touchend', function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(at + (dx < 0 ? 1 : -1)); sx = null })

  // ---------- Reviews carousel ----------
  var rv = { i: 0, timer: null, paused: false }
  function renderReviews() {
    var track = $('#rev-track'), dots = $('#rev-dots'); track.innerHTML = ''; dots.innerHTML = ''
    C.reviews.forEach(function (r, i) {
      var q = document.createElement('blockquote'); q.className = 'quote' + (i === rv.i ? ' is-on' : ''); q.setAttribute('aria-hidden', String(i !== rv.i))
      q.innerHTML = '<p></p><footer><b></b><span class="stars" aria-label="' + r.stars + '/5">' + '★★★★★'.slice(0, r.stars) + '</span><span></span></footer>'
      q.querySelector('p').textContent = pick(r.text); q.querySelector('b').textContent = r.name; q.querySelector('footer span:last-child').textContent = pick(r.when) + ' · Google'
      track.appendChild(q)
      var d = document.createElement('button'); d.type = 'button'; d.setAttribute('aria-label', (i + 1) + ' / ' + C.reviews.length); d.setAttribute('aria-current', String(i === rv.i))
      d.addEventListener('click', function () { goRev(i) }); dots.appendChild(d)
    })
    var tallest = 0; $$('.quote', track).forEach(function (q) { tallest = Math.max(tallest, q.scrollHeight) }); track.style.minHeight = tallest + 'px'
    autoRev()
  }
  function goRev(i) {
    rv.i = (i + C.reviews.length) % C.reviews.length
    $$('.quote').forEach(function (q, k) { q.classList.toggle('is-on', k === rv.i); q.setAttribute('aria-hidden', String(k !== rv.i)) })
    $$('#rev-dots button').forEach(function (d, k) { d.setAttribute('aria-current', String(k === rv.i)) })
    autoRev()
  }
  function autoRev() { clearTimeout(rv.timer); if (!reduce && !rv.paused) rv.timer = setTimeout(function () { goRev(rv.i + 1) }, 7000) }
  $('#rev-prev').addEventListener('click', function () { goRev(rv.i - 1) })
  $('#rev-next').addEventListener('click', function () { goRev(rv.i + 1) })
  var stage = $('.rev__stage')
  ;['mouseenter', 'focusin'].forEach(function (ev) { stage.addEventListener(ev, function () { rv.paused = true; clearTimeout(rv.timer) }) })
  ;['mouseleave', 'focusout'].forEach(function (ev) { stage.addEventListener(ev, function () { rv.paused = false; autoRev() }) })
  var rsx = null
  stage.addEventListener('touchstart', function (e) { rsx = e.touches[0].clientX }, { passive: true })
  stage.addEventListener('touchend', function (e) { if (rsx === null) return; var dx = e.changedTouches[0].clientX - rsx; if (Math.abs(dx) > 50) goRev(rv.i + (dx < 0 ? 1 : -1)); rsx = null })
  window.addEventListener('resize', function () { if (C) { var tr = $('#rev-track'), m = 0; $$('.quote', tr).forEach(function (q) { m = Math.max(m, q.scrollHeight) }); tr.style.minHeight = m + 'px' } }, { passive: true })

  // ---------- FAQ and hours ----------
  function renderFaq() {
    var box = $('#faq-list'); box.innerHTML = ''
    C.faq.forEach(function (f) { var d = document.createElement('details'); d.innerHTML = '<summary></summary><p></p>'; d.firstChild.textContent = pick(f.q); d.lastChild.textContent = pick(f.a); box.appendChild(d) })
  }
  function renderHours() {
    var ul = $('#hours'), now = nowThere(), days = t('daysLong'); ul.innerHTML = ''
    DAY_KEYS.forEach(function (k, i) {
      var h = C.hours[k], li = document.createElement('li'); if (i === now.day) li.className = 'is-today'
      li.innerHTML = '<span></span><span></span>'; li.children[0].textContent = days[i].charAt(0).toUpperCase() + days[i].slice(1); li.children[0].dataset.today = t('visit.today')
      li.children[1].textContent = h ? h[0] + '–' + h[1] : t('closed'); ul.appendChild(li)
    })
    var st = $('#open-status'), today = C.hours[DAY_KEYS[now.day]], open = today && now.min >= toMin(today[0]) && now.min < toMin(today[1])
    st.className = 'status' + (open ? ' is-open' : '')
    if (open) { st.textContent = t('open.now', { t: today[1] }); return }
    var when = ''
    if (today && now.min < toMin(today[0])) when = t('open.at', { t: today[0] })
    else for (var k = 1; k <= 7; k++) { var hh = C.hours[DAY_KEYS[(now.day + k) % 7]]; if (hh) { when = k === 1 ? t('open.tomorrow', { t: hh[0] }) : t('open.on', { day: days[(now.day + k) % 7], t: hh[0] }); break } }
    st.textContent = t('open.closed', { when: when })
  }

  // ---------- Cookies (analytics only after "Accept") ----------
  var banner = $('#cookie')
  function loadAnalytics() {
    var id = C && C.analytics && C.analytics.ga4
    if (!id || window.__ga) return
    window.__ga = true
    var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id); document.head.appendChild(s)
    window.dataLayer = window.dataLayer || []; window.gtag = function () { window.dataLayer.push(arguments) }
    window.gtag('js', new Date()); window.gtag('config', id, { anonymize_ip: true })
  }
  function cookieChoice(v) { store.set('site-cookies', v); banner.hidden = true; if (v === 'yes') loadAnalytics() }
  $('#cookie-yes').addEventListener('click', function () { cookieChoice('yes') })
  $('#cookie-no').addEventListener('click', function () { cookieChoice('no') })
  $('#cookie-reopen').addEventListener('click', function () { banner.hidden = false })

  // ---------- Privacy policy and terms (filled from the config) ----------
  var modal = $('#modal')
  function legalHtml(which) {
    var b = C.business, L = C.legal, who = esc(L.owner || b.name), mail = esc(L.privacyEmail || b.email), upd = esc(L.updated || '')
    var addr = esc([b.address.street, b.address.city, b.address.postcode].filter(Boolean).join(', '))
    if (which === 'privacy') return lang === 'sq'
      ? '<p>Përditësuar: ' + upd + '</p><h3>Kush jemi</h3><p>' + who + ', ' + addr + '. Kontakt për privatësinë: <a href="mailto:' + mail + '">' + mail + '</a>.</p>' +
        '<h3>Çfarë mbledhim</h3><p>Kur rezervon ose porosit një kupon: emrin, telefonin, email-in (nëse e jep), trajtimin, datën dhe orën, dhe shënimin tënd. Nëse shënon kutinë shëndetësore, e përdorim vetëm që trajtimi të jetë i sigurt për ty.</p>' +
        '<h3>Ku ruhen</h3><p>Kërkesa na vjen në telefon (Telegram) dhe ruhet në një tabelë Google Sheets të biznesit. Faqja mbahet nga Netlify. Nuk i shesim dhe nuk i japim të dhënat për reklama.</p>' +
        '<h3>Sa kohë</h3><p>Deri në 12 muaj pas vizitës, pastaj i fshijmë.</p><h3>Cookies</h3><p>Faqja ruan në pajisjen tënde vetëm gjuhën dhe zgjedhjen për cookies. Numërimi anonim i vizitave ndizet vetëm nëse shtyp "Prano".</p>' +
        '<h3>Të drejtat e tua</h3><p>Mund të kërkosh të shohësh, ndryshosh ose fshish të dhënat e tua, ose të ankohesh te autoriteti i mbrojtjes së të dhënave (në Mbretërinë e Bashkuar: ICO). Shkruaj në ' + mail + '.</p>'
      : '<p>Last updated: ' + upd + '</p><h3>Who we are</h3><p>' + who + ', ' + addr + (L.companyNumber ? ', company no. ' + esc(L.companyNumber) : '') + '. Privacy contact: <a href="mailto:' + mail + '">' + mail + '</a>.</p>' +
        '<h3>What we collect</h3><p>When you book or order a voucher: your name, phone, email (if given), the treatment, date and time, and your note. If you tick the health box we use it only to keep your treatment safe (legal basis: your explicit consent).</p>' +
        '<h3>Where it goes</h3><p>Your request reaches us on Telegram and is logged in our Google Sheets. The site is hosted by Netlify. We do not sell your data or use it for advertising.</p>' +
        '<h3>How long</h3><p>Up to 12 months after your visit, then deleted.</p><h3>Cookies</h3><p>The site stores only your language and your cookie choice on your device. Anonymous visit counting (Google Analytics) runs only if you press "Accept", and you can change that any time under "Cookie settings".</p>' +
        '<h3>Your rights</h3><p>Under UK GDPR you can ask to see, correct or delete your data, or object to how we use it. Write to ' + mail + '. You can also complain to the ICO at ico.org.uk.</p>'
    return lang === 'sq'
      ? '<p>Përditësuar: ' + upd + '</p><h3>Rezervimet</h3><p>Një kërkesë nuk është rezervim i konfirmuar derisa ta konfirmojmë ne në WhatsApp ose me email. Parapagimi 20% paguhet me link pas konfirmimit.</p><h3>Anulimi</h3><p>Falas deri 24 orë përpara. Më vonë mbajmë parapagimin.</p><h3>Kuponët</h3><p>Vlejnë 12 muaj nga blerja, nuk këmbehen me para dhe mund të përdoren për çdo trajtim.</p><h3>Shëndeti</h3><p>Na trego për shtatzëninë, presionin e lartë, lëndimet ose alergjitë para trajtimit.</p><h3>Kontakt</h3><p>' + mail + '</p>'
      : '<p>Last updated: ' + upd + '</p><h3>Bookings</h3><p>A request is not a confirmed booking until we confirm it on WhatsApp or by email. A 20% deposit is paid by card link once we confirm.</p><h3>Cancelling</h3><p>Free up to 24 hours before your time. After that we keep the deposit.</p><h3>Vouchers</h3><p>Valid for 12 months from purchase, not exchangeable for cash, and usable for any treatment.</p><h3>Health</h3><p>Please tell us about pregnancy, high blood pressure, injuries or allergies before your treatment.</p><h3>Contact</h3><p>' + mail + '</p>'
  }
  $$('[data-open]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (!C) return
      $('#modal-title').textContent = t(b.dataset.open === 'privacy' ? 'legal.privacy' : 'legal.terms')
      $('#modal-body').innerHTML = legalHtml(b.dataset.open)
      modal.showModal()
    })
  })
  $('#modal-close').addEventListener('click', function () { modal.close() })
  modal.addEventListener('click', function (e) { if (e.target === modal) modal.close() })

  // ---------- Start ----------
  if (DEMO) $('.demo-tag').hidden = false
  applyText()
  fetch('site-config.json', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json() })
    .then(function (cfg) {
      C = cfg
      applyText(); reveal()
      var choice = store.get('site-cookies')
      if (choice === 'yes') loadAnalytics()
      else if (!choice) {
        var shown = false, show = function () { if (shown || store.get('site-cookies')) return; shown = true; banner.hidden = false; window.removeEventListener('scroll', onS) }
        var onS = function () { if (window.scrollY > window.innerHeight * 3) show() }
        window.addEventListener('scroll', onS, { passive: true }); setTimeout(show, 20000)
      }
      var m = location.hash.match(/^#book-(.+)$/); if (m && svcById(decodeURIComponent(m[1]))) bookThis(decodeURIComponent(m[1]), 0)
    })
    .catch(function () { reveal(); status(t('err.send'), true) })
})()
