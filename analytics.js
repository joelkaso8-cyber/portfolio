// Visit and click counting with GoatCounter: no cookies, nothing stored in the browser, no personal data.
// Off until CODE is set. To turn it on: make a free account at goatcounter.com, pick a code (for example
// "joelkaso"), write it below, push. The numbers then show at https://<code>.goatcounter.com.
;(function () {
  var CODE = ''
  if (!CODE || !navigator.sendBeacon || /^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(location.hostname)) return
  var END = 'https://' + CODE + '.goatcounter.com/count'

  function send(vars) {
    var d = {
      p: vars.p, t: vars.t || document.title, e: vars.e ? 'true' : '',
      r: vars.e ? '' : document.referrer, q: vars.e ? '' : location.search,
      s: [screen.width, screen.height, window.devicePixelRatio || 1].join(','),
      b: navigator.webdriver ? 150 : '', rnd: Math.random().toString(36).slice(2, 7)
    }
    var qs = Object.keys(d).filter(function (k) { return d[k] !== '' && d[k] != null }).map(function (k) { return k + '=' + encodeURIComponent(d[k]) }).join('&')
    try { navigator.sendBeacon(END + '?' + qs) } catch (e) {}
  }
  function event(name) { send({ p: name, t: name, e: true }) }

  // The page view (path without the ?lang= part, so EN and SQ count as one page).
  send({ p: location.pathname })

  // Where on the page a button sits, so you can see which WhatsApp button people actually use.
  function place(el) {
    var s = el.closest('section[id], header, footer, .dock, .viewer, #assistant')
    if (!s) return 'page'
    return s.id || s.tagName.toLowerCase()
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('a, button')
    if (!el) return
    var href = el.getAttribute('href') || ''
    if (el.id === 'q-send') return event('quote-sent-whatsapp')
    if (el.id === 'viewer-want') return event('want-site-like-this')
    if (el.hasAttribute('data-quote')) return event('plan-' + el.getAttribute('data-quote'))
    if (el.hasAttribute('data-lang')) return event('language-' + el.getAttribute('data-lang'))
    if (el.hasAttribute('data-open')) return event('open-site-' + el.getAttribute('data-open'))
    if (/wa\.me\//.test(href)) return event('whatsapp-' + (el.getAttribute('data-wa') === 'care.wa' ? 'care-plan' : place(el)))
    if (href.indexOf('tel:') === 0) return event('call-' + place(el))
    if (href.indexOf('mailto:') === 0) return event('email-' + place(el))
    if (href === '#quote' || href === '#contact') return event('go' + href.replace('#', '-') + '-from-' + place(el))
  }, true)

  // Events main.js reports itself: form-sent, quote-copy.
  document.addEventListener('jk:track', function (e) { if (e.detail) event(String(e.detail)) })
})()
