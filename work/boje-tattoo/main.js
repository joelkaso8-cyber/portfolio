// Bojë: language switch, menu, the stencil lift, flash claims, gallery + lightbox, reviews, the form.
;(function () {
  'use strict'
  var B = window.BOJE
  var $ = function (s, r) { return (r || document).querySelector(s) }
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) }
  document.documentElement.classList.add('js')

  // ── Language ────────────────────────────────────────────────
  var lang = 'en'
  try {
    var q = new URLSearchParams(location.search).get('lang')
    lang = q === 'sq' || q === 'en' ? q : (localStorage.getItem('boje-lang') || (navigator.language || '').slice(0, 2) === 'sq' && 'sq' || 'en')
  } catch (e) {}
  if (lang !== 'sq') lang = 'en'
  var t = function (k) { return (B.t[lang] && B.t[lang][k]) || B.t.en[k] || '' }
  var fill = function (s, o) { return s.replace(/\{(\w+)\}/g, function (_, k) { return o[k] != null ? o[k] : '' }) }
  var wa = function (text) { return 'https://wa.me/' + B.wa + '?text=' + encodeURIComponent(text) }

  function applyLang(next, remember) {
    lang = next
    document.documentElement.lang = lang
    document.title = t('meta.title')
    var md = $('meta[name="description"]'); if (md) md.setAttribute('content', t('meta.desc'))
    $$('[data-i18n]').forEach(function (el) { var v = t(el.dataset.i18n); if (v) el.textContent = v })
    $$('[data-i18n-html]').forEach(function (el) { var v = t(el.dataset.i18nHtml); if (v) el.innerHTML = v })
    $$('[data-i18n-attr]').forEach(function (el) {
      el.dataset.i18nAttr.split(';').forEach(function (pair) { var p = pair.split(':'); var v = t(p[1]); if (v) el.setAttribute(p[0], v) })
    })
    $$('.lang__btn').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === lang)) })
    // WhatsApp links speak the visitor's language
    $$('[data-wa]').forEach(function (a) { a.href = wa(B.msg[lang].hello) })
    $$('[data-wa-flashday]').forEach(function (a) { a.href = wa(B.msg[lang].flashday) })
    $$('[data-wa-artist]').forEach(function (a) { a.href = wa(fill(B.msg[lang].artist, { name: a.dataset.waArtist })) })
    $$('.sheet').forEach(function (li) {
      var n = li.dataset.flash, a = $('.sheet__claim', li)
      if (a) a.href = wa(fill(B.msg[lang].flash, { n: n, title: t('fl.' + n) }))
    })
    $$('.lift').forEach(syncLift)
    if (remember) { try { localStorage.setItem('boje-lang', lang) } catch (e) {} }
  }
  $$('.lang__btn').forEach(function (b) { b.addEventListener('click', function () { applyLang(b.dataset.lang, true) }) })

  // ── Header: menu drawer + current section ─────────────────────
  var menuBtn = $('.nav__menu'), drawer = $('#drawer'), scrim = $('#scrim')
  var behind = ['main', '.foot', '.thumb-cta']
  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open))
    drawer.hidden = !open
    scrim.hidden = !open
    // the page behind the open menu can't be tabbed into or clicked
    behind.forEach(function (s) { var el = $(s); if (el) el.inert = open })
    $('.sr', menuBtn).textContent = t(open ? 'nav.close' : 'nav.menu')
    if (open) { var first = $('a', drawer); if (first) first.focus() }
  }
  menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true') })
  drawer.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false) })
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !drawer.hidden) { setMenu(false); menuBtn.focus() } })
  document.addEventListener('click', function (e) { if (!drawer.hidden && !e.target.closest('.nav')) setMenu(false) })
  window.matchMedia('(min-width: 1081px)').addEventListener('change', function (m) { if (m.matches) setMenu(false) })

  var links = $$('.nav__links a')
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return
        links.forEach(function (a) { a.toggleAttribute('aria-current', a.getAttribute('href') === '#' + en.target.id); if (a.hasAttribute('aria-current')) a.setAttribute('aria-current', 'true') })
      })
    }, { rootMargin: '-45% 0px -50% 0px' })
    $$('main > section[id]').forEach(function (s) { spy.observe(s) })
  }

  // ── The lift: tissue stencils that hinge up on their tape ─────────────
  function syncLift(fig) {
    var btn = $('.lift__btn', fig), up = fig.classList.contains('is-up')
    btn.setAttribute('aria-pressed', String(up))
    $('span', btn).textContent = t(up ? 'lift.down' : 'lift.up')
  }
  $$('.lift').forEach(function (fig) {
    $('.lift__btn', fig).addEventListener('click', function () { fig.classList.toggle('is-up'); syncLift(fig) })
  })

  // ── Reveal: sheets settle into place (transform only, text never hidden) ─
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var rv = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); rv.unobserve(en.target) } })
    }, { rootMargin: '0px 0px -8% 0px' })
    $$('.reveal').forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 70 + 'ms'; rv.observe(el) })
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('in') })
  }

  // ── Thumb-zone WhatsApp button: after the hero, hidden while the booking section is on screen ─
  var thumb = $('.thumb-cta'), hero = $('.hero'), book = $('#book')
  if (thumb && 'IntersectionObserver' in window) {
    var pastHero = false, atBook = false
    var upd = function () { thumb.classList.toggle('show', pastHero && !atBook) }
    new IntersectionObserver(function (e) { pastHero = !e[0].isIntersecting && e[0].boundingClientRect.top < 0; upd() }).observe(hero)
    new IntersectionObserver(function (e) { atBook = e[0].isIntersecting; upd() }, { threshold: 0.15 }).observe(book)
  }

  // ── Gallery filter ─────────────────────────────────────────
  var items = $$('#gallery li')
  $$('.chip').forEach(function (c) {
    c.addEventListener('click', function () {
      var f = c.dataset.filter
      $$('.chip').forEach(function (x) { x.setAttribute('aria-pressed', String(x === c)) })
      items.forEach(function (li) { li.hidden = f !== 'all' && li.dataset.tags.split(' ').indexOf(f) === -1 })
    })
  })

  // ── Lightbox ──────────────────────────────────────────────
  var lb = $('#lightbox'), lbImg = $('#lb-img'), lbCap = $('#lb-cap'), lbCredit = $('#lb-credit'), cur = 0, opener = null
  var visible = function () { return items.filter(function (li) { return !li.hidden }).map(function (li) { return $('.tile', li) }) }
  function show(i) {
    var list = visible(); if (!list.length) return
    cur = (i + list.length) % list.length
    var tile = list[cur], thumbImg = $('img', tile)
    lbImg.src = tile.dataset.full
    lbImg.width = thumbImg.naturalWidth ? thumbImg.naturalWidth * 2 : 1200
    lbImg.height = thumbImg.naturalHeight ? thumbImg.naturalHeight * 2 : 960
    lbImg.alt = thumbImg.alt
    lbCap.textContent = t(tile.dataset.cap)
    lbCredit.textContent = t('g.photo') + ': ' + tile.dataset.credit + ' · Unsplash'
  }
  if (lb && typeof lb.showModal === 'function') {
    $('#gallery').addEventListener('click', function (e) {
      var tile = e.target.closest('.tile'); if (!tile) return
      opener = tile
      show(visible().indexOf(tile))
      lb.showModal()
    })
    lb.addEventListener('click', function (e) {
      var b = e.target.closest('[data-lb]')
      if (b) { if (b.dataset.lb === 'close') lb.close(); else show(cur + Number(b.dataset.lb)) }
      else if (e.target === lb) lb.close()
    })
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') show(cur + 1)
      if (e.key === 'ArrowLeft') show(cur - 1)
    })
    lb.addEventListener('close', function () { if (opener) opener.focus() })
    var sx = null
    lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX }, { passive: true })
    lb.addEventListener('touchend', function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1)); sx = null })
  } else {
    // Very old browsers: open the large photo in the same tab
    $('#gallery').addEventListener('click', function (e) { var tile = e.target.closest('.tile'); if (tile) location.href = tile.dataset.full })
  }

  // ── Reviews: arrows step the scroll-snap track ────────────────
  var track = $('#track')
  $$('.slider-ctrl .round').forEach(function (b) {
    b.addEventListener('click', function () {
      var card = $('.quote', track), step = card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 24) : 400
      track.scrollBy({ left: step * Number(b.dataset.dir), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
    })
  })

  // ── Form: FormSubmit, with a WhatsApp alternative built from the same fields ─
  // form-guard.js (loaded first) already drops bot submits before this handler runs.
  var form = $('#form'), err = $('#form-err'), send = $('#form-send'), done = $('#form-done')
  var val = function (n) { return (form.elements[n].value || '').trim() }
  var looksLikeContact = function (s) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) || /^\+?[\d\s()-]{7,}$/.test(s) }
  // Each field's error sits right under it (linked with aria-describedby); the box above the buttons only says that several need a look.
  var ERR = { name: 'err.name', contact: 'err.contact', message: 'err.msg' }
  var errEl = function (f) { return $('#' + f.id + '-err') }
  function fieldErr(f, key) {
    f.setAttribute('aria-invalid', 'true')
    var e = errEl(f); if (e) { e.textContent = t(key); e.hidden = false }
  }
  function clearField(f) { f.removeAttribute('aria-invalid'); var e = errEl(f); if (e) { e.hidden = true; e.textContent = '' } }
  function showErr(key) { err.textContent = t(key); err.hidden = false }
  function clearErr() { err.hidden = true; $$('[aria-invalid]', form).forEach(clearField) }
  function check() {
    clearErr()
    var bad = []
    Object.keys(ERR).forEach(function (n) { if (!val(n)) { fieldErr(form.elements[n], ERR[n]); bad.push(form.elements[n]) } })
    if (val('contact') && !looksLikeContact(val('contact'))) { fieldErr(form.elements.contact, 'form.errContact'); bad.push(form.elements.contact) }
    if (!bad.length) return true
    if (bad.length > 1) showErr('form.errReq')
    bad.sort(function (a, b) { return a.compareDocumentPosition(b) & 4 ? -1 : 1 })[0].focus()
    return false
  }
  $$('input, textarea', form).forEach(function (f) { f.addEventListener('input', function () { if (f.hasAttribute('aria-invalid') && f.value.trim()) clearField(f) }) })

  form.addEventListener('submit', function (e) {
    e.preventDefault()
    if (!check()) return
    send.disabled = true; $('span', send).textContent = t('form.sending')
    var data = { _subject: 'Bojë demo · consultation request', _template: 'table', _captcha: 'false',
      name: val('name'), contact: val('contact'), artist: val('artist'), date: val('date') || '-', placement: val('placement') || '-', message: val('message'), language: lang }
    fetch('https://formsubmit.co/ajax/' + B.email, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json() })
      .then(function () { form.hidden = true; done.hidden = false; done.focus() })
      .catch(function () { showErr('form.errNet') })
      .then(function () { send.disabled = false; $('span', send).textContent = t('form.send') })
  })
  $('#form-wa').addEventListener('click', function () {
    var text = fill(B.msg[lang].form, { name: val('name') || '-', artist: val('artist'), date: val('date') || '-', placement: val('placement') || '-', message: val('message') || '-' })
    window.open(wa(text), '_blank', 'noopener')
  })

  applyLang(lang, false)
})()
