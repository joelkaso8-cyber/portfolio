// Hero film: while the page sits at the top, scroll input scrubs the film
// behind the hero text (forward and back) instead of moving the page.
// At the end, scrolling on releases the page; scrolling back up at the top
// takes control again. Nav links, End key and programmatic scrolls skip it.
(function () {
  'use strict'
  var hero = document.querySelector('.hero'), v = hero && hero.querySelector('.hero-film video')
  if (!v) return
  // Data Saver or a slow connection: keep the poster still and let the page scroll normally, no 2-7 MB film.
  var net = navigator.connection
  if (net && (net.saveData || /^(slow-2g|2g|3g)$/.test(net.effectiveType))) return
  var DIST = 600, TOUCH = 3.2 // px of scroll input for the whole film (was 2400, then 900); raise it for a longer film
  var phone = window.matchMedia('(max-width: 900px) and (orientation: portrait)').matches
  // The same drone film the Hotel Kaso Ervehe site scrubs, shared so it downloads once. Only its wide opening (the lit hotel) plays.
  var END = 2.6
  var SRC = phone ? 'work/kaso-ervehe/video/fly-in-tall.mp4' : 'work/kaso-ervehe/video/fly-in-wide.mp4'
  var bar = hero.querySelector('.hero-progress i'), hint = hero.querySelector('.hero-hint')
  var root = document.documentElement
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  var dur = 0, target = 0, cur = 0, lastT = -1, locked = false, seeking = false, pending = null, started = false, raf = 0, touchY = 0

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
  if (reduce) return // no scroll takeover and no film download: the still frame stays behind the text
  // The film is not needed for the first paint: fetch it on the first wheel, touch or key, or once the browser is idle.
  var fetched = false
  function kick() {
    if (fetched) return
    fetched = true
    ;['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach(function (n) { removeEventListener(n, kick) })
    start()
  }
  ;['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach(function (n) { addEventListener(n, kick, { passive: true, once: true }) })
  function idle() { if (window.requestIdleCallback) requestIdleCallback(kick, { timeout: 2500 }); else setTimeout(kick, 1500) }
  if (document.readyState === 'complete') idle(); else window.addEventListener('load', idle, { once: true })

  function render() {
    if (dur) { var t = cur * Math.min(dur - 0.05, END); if (Math.abs(t - lastT) > 0.001) { lastT = t; seek(t) } }
    v.style.transform = 'scale(' + (1 + cur * 0.06) + ')'
    bar.style.transform = 'scaleX(' + cur + ')'
    hint.classList.toggle('gone', started)
  }
  function frame() {
    cur += (target - cur) * 0.24
    if (Math.abs(target - cur) < 0.0005) cur = target
    render()
    raf = cur !== target ? requestAnimationFrame(frame) : 0
  }
  function push(d) {
    target = clamp(target + d / DIST)
    if (target > 0.001) started = true
    if (!raf) raf = requestAnimationFrame(frame)
  }
  function lock() { if (locked) return; locked = true; root.classList.add('film-locked') }
  function unlock() { if (!locked) return; locked = false; root.classList.remove('film-locked') }
  function finish() { target = cur = 1; started = true; render(); unlock() }
  function busy() { return !!document.querySelector('dialog[open]') }
  // One step of input (d > 0 = forward). Returns true when the page must not scroll.
  function step(d) {
    if (busy()) return false
    if (locked) {
      if (d > 0 && target >= 1 && cur > 0.995) { unlock(); return false }
      push(d); return true
    }
    if (d < 0 && window.scrollY <= 0) { lock(); push(d); return true }
    return false
  }

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  if (location.hash && location.hash !== '#top') finish()
  else { window.scrollTo(0, 0); lock(); render() }

  window.addEventListener('wheel', function (e) {
    if (e.ctrlKey) return // pinch / browser zoom
    var d = e.deltaY * (e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? innerHeight : 1)
    if (d && step(d)) e.preventDefault()
  }, { passive: false })

  window.addEventListener('touchstart', function (e) { touchY = e.touches[0].clientY }, { passive: true })
  window.addEventListener('touchmove', function (e) {
    var y = e.touches[0].clientY, d = (touchY - y) * TOUCH; touchY = y
    if (d && step(d) && e.cancelable) e.preventDefault()
  }, { passive: false })

  window.addEventListener('keydown', function (e) {
    if (!locked || e.altKey || e.ctrlKey || e.metaKey) return
    var tag = e.target.tagName, k = e.key, d = 0
    if (/INPUT|TEXTAREA|SELECT/.test(tag) || busy()) return
    if (k === 'End') { finish(); return }
    if (k === 'ArrowDown') d = 120; else if (k === 'ArrowUp') d = -120
    else if (k === 'PageDown') d = innerHeight * 0.8; else if (k === 'PageUp') d = -innerHeight * 0.8
    else if (k === ' ' && tag !== 'BUTTON' && tag !== 'A') d = (e.shiftKey ? -1 : 1) * innerHeight * 0.8
    if (d && step(d)) e.preventDefault()
  })

  // Links to sections (#work, #contact…) and scripted scrolls jump straight past the film.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]')
    if (a && locked && a.getAttribute('href') !== '#top') finish()
  }, true)
  window.addEventListener('scroll', function () { if (locked && window.scrollY > 2) finish() }, { passive: true })
})()
