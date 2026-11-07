// Scroll film: the hero video plays forward as you scroll down and back as you scroll up.
// Markup: <section class="film" data-src="media/hero.mp4" data-poster="media/poster.jpg">
//           <div class="film__stage"><video muted playsinline preload="none"></video>
//             <div class="film__band" data-a="0" data-b="0.3">…</div> … <div class="film__bar"><i></i></div></div></section>
// The section is several screens tall; the stage sticks to the top while the scroll position drives the film.
// Bands fade in between their data-a and data-b (0 = top of the film, 1 = end).
// Reduced motion, or a video that cannot load: the poster stays and the bands become a simple stack.
;(function () {
  var film = document.querySelector('.film')
  if (!film) return
  var stage = film.querySelector('.film__stage')
  var video = film.querySelector('video')
  var bar = film.querySelector('.film__bar i')
  var bands = Array.prototype.map.call(film.querySelectorAll('.film__band'), function (el, i, all) {
    return { el: el, a: +el.dataset.a, b: +el.dataset.b, first: i === 0, last: i === all.length - 1, op: -1 }
  })
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)) }
  var smooth = function (x, a, b) { var t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t) }
  stage.style.backgroundImage = "url('" + film.dataset.poster + "')"

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
  if (reduce.matches) { film.classList.add('film--still'); return }

  var top = 0, range = 1
  function measure() { top = film.getBoundingClientRect().top + window.scrollY; range = Math.max(1, film.offsetHeight - window.innerHeight) }
  var progress = function () { return clamp((window.scrollY - top) / range, 0, 1) }
  var dur = function () { return video.duration && isFinite(video.duration) ? video.duration : 0 }

  // One seek at a time; always jump to the newest target once the last seek lands.
  var busy = false, pending = null
  function seek(t) {
    if (!dur()) return
    if (busy) { pending = t; return }
    busy = true
    video.currentTime = t
  }
  video.addEventListener('seeked', function () { busy = false; if (pending !== null) { var t = pending; pending = null; seek(t) } })

  function paint(p) {
    bands.forEach(function (B) {
      var f = Math.min(0.04, (B.b - B.a) / 3)
      var op = (B.first ? 1 : smooth(p, B.a, B.a + f)) * (B.last ? 1 : 1 - smooth(p, B.b - f, B.b))
      if (Math.abs(op - B.op) > 0.004 || op === 0 || op === 1) {
        B.op = op
        B.el.style.opacity = op.toFixed(3)
        B.el.style.transform = 'translate3d(0,' + ((1 - op) * 24).toFixed(1) + 'px,0)'
        B.el.style.visibility = op > 0.01 ? 'visible' : 'hidden'
      }
    })
    if (bar) bar.style.transform = 'scaleX(' + p.toFixed(4) + ')'
  }

  // Eased display position: the film glides after the scroll instead of jumping.
  var target = 0, shown = 0, raf = null, last = 0, onScreen = true
  function tick(now) {
    var dt = Math.min(100, now - (last || now)); last = now
    shown += (target - shown) * (1 - Math.pow(1 - 0.16, dt / 16.667))
    if (Math.abs(target - shown) < 0.0005) { shown = target; raf = null; last = 0 } else raf = requestAnimationFrame(tick)
    seek(shown * Math.max(0, dur() - 0.05))
    paint(shown)
  }
  function onScroll() { target = progress(); if (raf === null && onScreen) raf = requestAnimationFrame(tick) }

  // Load the whole clip as a blob: seeking a local blob is instant, seeking a streamed file stutters.
  // Phones held upright get media/hero-m.mp4 (a portrait centre crop, about a third of the size) when it exists.
  // A thin line on the stage shows how much has arrived; loading gives up only if nothing arrives for 15 s.
  var loadBar = document.createElement('div'); loadBar.className = 'film__load'; loadBar.innerHTML = '<i></i>'
  stage.appendChild(loadBar)
  var loadFill = loadBar.firstChild
  function grab(url) {
    var ctrl = new AbortController(), stall
    var poke = function () { clearTimeout(stall); stall = setTimeout(function () { ctrl.abort() }, 15000) }
    poke()
    return fetch(url, { signal: ctrl.signal }).then(function (r) {
      if (!r.ok) throw new Error(r.status)
      var total = Number(r.headers.get('content-length')) || 0
      if (!r.body || !r.body.getReader) return r.blob().then(function (b) { clearTimeout(stall); return b })
      if (!total) loadBar.classList.add('is-unknown')
      var reader = r.body.getReader(), parts = [], got = 0
      function pump() {
        return reader.read().then(function (x) {
          if (x.done) { clearTimeout(stall); return new Blob(parts, { type: 'video/mp4' }) }
          parts.push(x.value); got += x.value.length; poke()
          if (total) loadFill.style.transform = 'scaleX(' + Math.min(1, got / total).toFixed(3) + ')'
          return pump()
        })
      }
      return pump()
    }, function (e) { clearTimeout(stall); throw e })
  }
  function load() {
    var src = film.dataset.src
    var phone = window.matchMedia('(max-width: 760px) and (orientation: portrait)').matches
    var small = film.dataset.srcPhone || src.replace(/\.mp4$/, '-m.mp4')
    var first = phone && small !== src ? grab(small).catch(function () { return grab(src) }) : grab(src)
    first
      .then(function (blob) {
        loadFill.style.transform = 'scaleX(1)'
        video.src = URL.createObjectURL(blob)
        video.load()
        video.addEventListener('loadeddata', function () { seek(shown * dur()); stage.classList.add('is-ready'); loadBar.classList.add('is-done') }, { once: true })
      })
      .catch(function () { film.classList.add('film--still'); loadBar.classList.add('is-done') })
  }

  measure(); shown = target = progress(); paint(shown)
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', function () { measure(); onScroll() }, { passive: true })
  new IntersectionObserver(function (e) {
    onScreen = e[0].isIntersecting
    if (onScreen) onScroll(); else if (raf !== null) { cancelAnimationFrame(raf); raf = null; last = 0 }
  }).observe(film)
  // Start at once: the film is the first thing on the page, so it should not wait for images further down.
  load()
})()
