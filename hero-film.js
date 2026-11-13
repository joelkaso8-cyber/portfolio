// Hero film: the page always scrolls normally (no scroll lock). The film behind the hero follows
// the scroll position: the first 600 px of scrolling play it to the end, scrolling back up plays it backwards.
// On tall desktop screens style.css also holds the hero still for those 600 px, so the film plays in place.
(function () {
  'use strict'
  var hero = document.querySelector('.hero'), v = hero && hero.querySelector('.hero-film video')
  if (!v) return
  // Data Saver or a slow connection: keep the poster still, no 2-7 MB film.
  var net = navigator.connection
  if (net && (net.saveData || /^(slow-2g|2g|3g)$/.test(net.effectiveType))) return
  var DIST = 600 // px of scroll for the whole film; Joel wants it short, so keep it at 600
  var phone = window.matchMedia('(max-width: 900px) and (orientation: portrait)').matches
  var SRC = phone ? 'media/hero-m.mp4' : 'media/hero.mp4'
  var bar = hero.querySelector('.hero-progress i'), hint = hero.querySelector('.hero-hint')
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  var dur = 0, target = 0, cur = 0, lastT = -1, seeking = false, pending = null, raf = 0

  function clamp(x) { return x < 0 ? 0 : x > 1 ? 1 : x }
  function seek(t) { if (seeking) { pending = t; return } seeking = true; v.currentTime = t }
  v.addEventListener('seeked', function () { seeking = false; if (pending !== null) { var t = pending; pending = null; seek(t) } })
  v.addEventListener('loadedmetadata', function () {
    dur = v.duration || 0; lastT = -1
    render()
  })
  v.addEventListener('loadeddata', function () { // iOS won't paint a frame until play() has run once
    hero.classList.add('film-ready')
    var p = v.play(); if (p && p.then) p.then(function () { v.pause() }).catch(function () {}); else v.pause()
  }, { once: true })

  // Whole file as a blob after the page has loaded: every seek is local, so scrubbing stays smooth.
  function load(u) { v.preload = 'auto'; v.src = u }
  function start() {
    if (window.fetch && window.URL && URL.createObjectURL) {
      fetch(SRC).then(function (r) { if (!r.ok) throw 0; return r.blob() })
        .then(function (b) { load(URL.createObjectURL(b)) }).catch(function () { load(SRC) })
    } else load(SRC)
  }
  // Reduced motion: keep the poster (media/hero.webp) and never download the film.
  if (reduce) return
  // The film is not needed for the first paint: fetch it on the first scroll or touch,
  // or once the browser is idle after load, whichever comes first.
  var started = false
  function kick() {
    if (started) return
    started = true
    removeEventListener('scroll', kick); removeEventListener('pointerdown', kick); removeEventListener('keydown', kick)
    start()
  }
  addEventListener('scroll', kick, { passive: true, once: true })
  addEventListener('pointerdown', kick, { passive: true, once: true })
  addEventListener('keydown', kick, { once: true })
  function idle() { if (window.requestIdleCallback) requestIdleCallback(kick, { timeout: 2500 }); else setTimeout(kick, 1500) }
  if (document.readyState === 'complete') idle(); else window.addEventListener('load', idle, { once: true })

  function render() {
    if (dur) { var t = cur * (dur - 0.05); if (Math.abs(t - lastT) > 0.001) { lastT = t; seek(t) } }
    v.style.transform = 'scale(' + (1 + cur * 0.08).toFixed(4) + ')'
    hero.style.setProperty('--p', cur.toFixed(4)) // style.css moves the text and the device a little with it
    if (bar) bar.style.transform = 'scaleX(' + cur.toFixed(4) + ')'
    if (hint) hint.classList.toggle('gone', cur > 0.02)
  }
  // Eased: the film glides after the scroll instead of jumping.
  function frame() {
    cur += (target - cur) * 0.24
    if (Math.abs(target - cur) < 0.0005) cur = target
    render()
    raf = cur !== target ? requestAnimationFrame(frame) : 0
  }
  function onScroll() { target = clamp(window.scrollY / DIST); if (!raf) raf = requestAnimationFrame(frame) }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})()
