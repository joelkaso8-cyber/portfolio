/* Quick booking on the first screen: arrival, nights and guests, with the direct-booking promise under it.
   "Check your dates" carries those choices into the booking form below (it clicks the same calendar days and
   guest chip a guest would), then puts the cursor in the name field. The form itself still writes the request
   and the WhatsApp message, so nothing about how bookings reach the hotel changes.
   Like day.js, this file waits for React to hydrate and only adds its own elements; it follows <html lang>. */
(function () {
  'use strict'
  if (document.getElementById('kb')) return
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  var TX = {
    en: {
      aria: 'Check your dates', arrival: 'Arrival', nights: 'Nights', guests: 'Guests', go: 'Check your dates',
      night: function (n) { return n + (n === 1 ? ' night' : ' nights') },
      perks: ['Book direct with the family', 'No middleman, no card needed', 'We reply on WhatsApp'],
      perksAria: 'Why book here'
    },
    sq: {
      aria: 'Shikoni datat', arrival: 'Mbërritja', nights: 'Netë', guests: 'Mysafirë', go: 'Shikoni datat',
      night: function (n) { return n + (n === 1 ? ' natë' : ' net') },
      perks: ['Rezervoni direkt me familjen', 'Pa ndërmjetës, pa kartë', 'Ju përgjigjemi në WhatsApp'],
      perksAria: 'Pse të rezervoni këtu'
    }
  }
  function lang() { return document.documentElement.lang === 'sq' ? 'sq' : 'en' }
  var iso = function (d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') }
  var addDays = function (s, n) { var d = new Date(s + 'T12:00:00'); d.setDate(d.getDate() + n); return iso(d) }

  function hydrated() { return document.documentElement.getAttribute('data-hydrated') === 'true' }
  var tries = 0
  ;(function wait() { if (hydrated() || tries++ > 60) build(); else setTimeout(wait, 120) })()

  var form, perksHead
  function build() {
    form = document.createElement('form')
    form.id = 'kb'; form.className = 'kb'; form.noValidate = true
    form.innerHTML =
      '<div class="kb__fields">' +
        '<label class="kb__field kb__field--date"><span data-kb="arrival"></span><input type="date" name="arrival" required></label>' +
        '<label class="kb__field"><span data-kb="nights"></span><select name="nights"></select></label>' +
        '<label class="kb__field"><span data-kb="guests"></span><select name="guests"></select></label>' +
        '<button type="button" class="btn kb__go" data-kb="go"></button>' +
      '</div>' +
      '<ul class="kb__perks" data-kb-list></ul>'
    var today = new Date(), tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
    var arr = form.elements.arrival
    arr.min = iso(today); arr.value = iso(tomorrow)
    for (var g = 1; g <= 5; g++) form.elements.guests.add(new Option(String(g), String(g), g === 2, g === 2))
    // The button listens for its own click (a submit can be cancelled by the page's link handling); Enter in a field submits.
    form.querySelector('.kb__go').addEventListener('click', carry)
    form.addEventListener('submit', function (e) { e.preventDefault(); carry() })
    words()
    place()
    // A second promise line in the booking section, next to "Send us your dates".
    perksHead = document.createElement('ul'); perksHead.className = 'kb__perks kb__perks--book'; perksHead.setAttribute('data-kb-list', '')
    placeBook()
    words()
    document.documentElement.classList.add('kb-on')
    new MutationObserver(words).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] })
    // If React ever re-renders the hero or the booking head, put the pieces back.
    var root = document.getElementById('root')
    if (root) new MutationObserver(function () { if (!form.isConnected) place(); if (!perksHead.isConnected) placeBook() }).observe(root, { childList: true, subtree: true })
  }
  function place() {
    var actions = document.querySelector('.film-intro .hero__actions') || document.querySelector('#top .hero__actions')
    if (actions && actions.parentNode) actions.parentNode.insertBefore(form, actions.nextSibling)
  }
  function placeBook() {
    var lead = document.querySelector('#book .booking__head .lead')
    if (lead && lead.parentNode) lead.parentNode.insertBefore(perksHead, lead.nextSibling)
  }
  function words() {
    if (!form) return
    var w = TX[lang()]
    form.setAttribute('aria-label', w.aria)
    form.querySelectorAll('[data-kb]').forEach(function (el) { el.textContent = w[el.getAttribute('data-kb')] })
    var sel = form.elements.nights, keep = sel.value || '2'
    sel.textContent = ''
    for (var n = 1; n <= 14; n++) sel.add(new Option(w.night(n), String(n)))
    sel.value = keep
    document.querySelectorAll('[data-kb-list]').forEach(function (ul) {
      ul.setAttribute('aria-label', w.perksAria); ul.textContent = ''
      w.perks.forEach(function (p) { var li = document.createElement('li'); li.textContent = p; ul.appendChild(li) })
    })
  }

  // ---- Carry the choice into the booking form ----
  // Each click waits for React to draw the result before the next one, as a guest's own clicks would.
  var tick = function () { return new Promise(function (r) { requestAnimationFrame(function () { setTimeout(r, 0) }) }) }
  function dayBtn(isoDay) { return document.querySelector('#book .cal__day[data-iso="' + isoDay + '"]') }
  // Turn the calendar to the month that holds this day (24 steps is two years).
  async function showDay(isoDay) {
    for (var i = 0; i < 24 && !dayBtn(isoDay); i++) {
      var navs = document.querySelectorAll('#book .cal__nav')
      var first = document.querySelector('#book .cal__day[data-iso]'), firstIso = first && first.getAttribute('data-iso')
      var btn = firstIso && isoDay < firstIso ? navs[0] : navs[navs.length - 1]
      if (!btn || btn.disabled) break
      btn.click(); await tick()
    }
    return dayBtn(isoDay)
  }
  async function pick(isoDay) { var b = await showDay(isoDay); if (b && !b.disabled) { b.click(); await tick(); return true } return false }
  var busy = false
  async function carry() {
    if (busy) return
    busy = true
    try {
      var a = form.elements.arrival.value, n = +form.elements.nights.value, g = form.elements.guests.value
      var book = document.getElementById('book')
      if (!book) return
      // Straight to the request card, so the filled-in calendar is what they see (on a phone the section head comes first).
      var card = book.querySelector('form') || book
      card.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
      // Sections above the card settle as they are passed (photos, reveals), which can leave it off by a few hundred
      // pixels. Re-aim a few times while things settle, and stop as soon as the guest scrolls or taps themselves.
      var stop = false, quit = function () { stop = true }
      ;['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(function (t) { addEventListener(t, quit, { once: true, passive: true }) })
      ;[500, 1000, 1600].forEach(function (ms) { setTimeout(function () { if (stop) return; var off = card.getBoundingClientRect().top - 88; if (Math.abs(off) > 24) scrollBy({ top: off, behavior: 'auto' }) }, reduce ? ms / 5 : ms) })
      var gl = book.querySelector('label[for="guests-' + g + '"]'); if (gl) { gl.click(); await tick() }
      var cal = book.querySelector('.cal')
      if (cal && a && a >= form.elements.arrival.min) {
        // A stay already picked: a click on its arrival day clears it, so the new arrival starts clean.
        var on = book.querySelectorAll('.cal__day[aria-pressed="true"]')
        if (on.length) { on[0].click(); await tick() }
        if (await pick(a)) await pick(addDays(a, n))
        await showDay(a)
      } else if (!cal) {
        // No calendar (script trouble): fill the plain date fields instead.
        var ai = book.querySelector('input[name="arrival"]'), di = book.querySelector('input[name="departure"]')
        if (ai && a) { ai.value = a; ai.dispatchEvent(new Event('input', { bubbles: true })) }
        if (di && a) { di.value = addDays(a, n); di.dispatchEvent(new Event('input', { bubbles: true })) }
      }
      // On a mouse screen the cursor waits in the name field; on a phone the keyboard stays closed until they tap it.
      var name = document.getElementById('guest-name')
      if (name && matchMedia('(pointer: fine)').matches) setTimeout(function () { name.focus({ preventScroll: true }) }, reduce ? 0 : 900)
    } finally { busy = false }
  }
})()
