// Hero film (pattern from portfolio/work/balte-studio/scrub.js and portfolio/hero-film.js).
// The page scrolls normally. The hero is a little taller than the screen and its stage sticks to the top,
// so for that stretch the film follows the scroll: down plays it forward, up plays it backward.
// At the same time the stencil tissue peels up and away (CSS reads --peel); --p drives the bar and the slow zoom.
// Reduced motion, Data Saver, a slow connection or a film that fails to load: the poster stays, nothing is hidden.
;(function () {
  'use strict'
  var hero = document.querySelector('.hero')
  if (!hero) return
  var video = hero.querySelector('video')
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  var net = navigator.connection
  var lean = net && (net.saveData || /^(slow-2g|2g|3g)$/.test(net.effectiveType))

  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v }
  var smooth = function (x, a, b) { var t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t) }
  var top = 0, range = 1
  function measure() { top = hero.getBoundingClientRect().top + window.scrollY; range = Math.max(1, hero.offsetHeight - window.innerHeight) }
  var progress = function () { return clamp((window.scrollY - top) / range) }

  // Painting runs even without the film: the tissue still peels over the poster.
  var dur = 0, busy = false, pending = null
  function seek(t) {
    if (!dur) return
    if (busy) { pending = t; return }
    busy = true
    video.currentTime = t
  }
  video.addEventListener('seeked', function () { busy = false; if (pending !== null) { var t = pending; pending = null; seek(t) } })

  var target = 0, shown = 0, raf = null, last = 0, lastT = -1
  function paint(p) {
    hero.style.setProperty('--p', p.toFixed(4))
    hero.style.setProperty('--peel', smooth(p, 0.04, 0.62).toFixed(4))
    if (dur) { var t = p * Math.max(0, dur - 0.05); if (Math.abs(t - lastT) > 0.01) { lastT = t; seek(t) } }
  }
  function tick(now) {
    var dt = Math.min(100, now - (last || now)); last = now
    shown += (target - shown) * (1 - Math.pow(1 - 0.2, dt / 16.667))
    if (Math.abs(target - shown) < 0.0005) { shown = target; raf = null; last = 0 } else raf = requestAnimationFrame(tick)
    paint(shown)
  }
  var onScreen = true
  function onScroll() { target = progress(); if (raf === null && onScreen) raf = requestAnimationFrame(tick) }

  if (reduce) return // CSS keeps the tissue resting half-lifted over the still poster

  measure(); shown = target = progress(); paint(shown)
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', function () { measure(); onScroll() }, { passive: true })
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      onScreen = e[0].isIntersecting
      if (onScreen) onScroll(); else if (raf !== null) { cancelAnimationFrame(raf); raf = null; last = 0 }
    }).observe(hero)
  }

  if (lean || !window.fetch || !window.URL || !URL.createObjectURL) return
  // The whole clip as a blob after the page has loaded: seeking a local blob is instant, a streamed file stutters.
  // Phones held upright get the portrait crop (about 2 MB instead of 3.5 MB).
  var phone = window.matchMedia('(max-width: 760px) and (orientation: portrait)').matches
  var src = phone && hero.dataset.srcPhone ? hero.dataset.srcPhone : hero.dataset.src
  function start() {
    fetch(src).then(function (r) { if (!r.ok) throw new Error(r.status); return r.blob() })
      .then(function (blob) {
        video.src = URL.createObjectURL(blob)
        video.preload = 'auto'
        video.addEventListener('loadedmetadata', function () { dur = video.duration || 0; lastT = -1 }, { once: true })
        video.addEventListener('loadeddata', function () {
          // iOS paints no frame until play() has run once
          var pl = video.play(); if (pl && pl.then) pl.then(function () { video.pause(); paint(shown); hero.classList.add('is-ready') }).catch(function () { paint(shown); hero.classList.add('is-ready') })
          else { video.pause(); paint(shown); hero.classList.add('is-ready') }
        }, { once: true })
      })
      .catch(function () { /* the poster stays */ })
  }
  if (document.readyState === 'complete') start(); else window.addEventListener('load', start, { once: true })
})()
