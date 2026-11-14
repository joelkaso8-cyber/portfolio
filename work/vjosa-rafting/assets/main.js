(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const smoothstep = (p, e0, e1) => {
    const t = clamp((p - e0) / (e1 - e0), 0, 1);
    return t * t * (3 - 2 * t);
  };
  function rng(seed) {
    let s = seed >>> 0;
    return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
  }

  const root = document.documentElement;
  const RM = matchMedia('(prefers-reduced-motion: reduce)');

  /* ------------------------------------------------------------------
     Text splitting: a hidden full sentence for screen readers, plus an
     aria-hidden visual copy of word spans. Seeded, so identical per load.
  ------------------------------------------------------------------ */
  function split(el, seed, thresholdFor) {
    const text = el.textContent.trim().replace(/\s+/g, ' ');
    const r = rng(seed);
    el.textContent = '';
    const sr = document.createElement('span');
    sr.className = 'vh';
    sr.textContent = text;
    const vis = document.createElement('span');
    vis.className = 'split';
    vis.setAttribute('aria-hidden', 'true');
    const words = text.split(' ');
    words.forEach((w, i) => {
      const ws = document.createElement('span');
      ws.className = 'w';
      ws.textContent = w;
      ws.style.setProperty('--th', thresholdFor(i, words.length, r).toFixed(3));
      vis.appendChild(ws);
      if (i < words.length - 1) vis.appendChild(document.createTextNode(' '));
    });
    el.append(sr, vis);
    return $$('.w', vis);
  }

  split($('.fx-approach'), 11, (i, n, r) => i / n * 0.45 + r() * 0.05);
  split($('.fx-tip'), 23, (i, n) => i / n * 0.5);
  const punch = split($('.fx-punch'), 37, (i) => i * 0.18);
  punch.forEach(w => w.classList.add('em'));
  split($('.fx-rise'), 51, (i, n) => i / n * 0.42);

  /* ------------------------------------------------------------------
     Environment specks (whisper level)
  ------------------------------------------------------------------ */
  (() => {
    const box = $('.env .specks');
    const r = rng(7);
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 26; i++) {
      const s = document.createElement('span');
      s.className = 'speck';
      const d = 28 + r() * 26;
      s.style.cssText = `left:${(r() * 100).toFixed(2)}%;--sz:${(1.5 + r() * 2.5).toFixed(1)}px;--d:${d.toFixed(1)}s;--dl:${(-r() * d).toFixed(1)}s;--o:${(0.12 + r() * 0.3).toFixed(2)};--dx:${((r() - 0.5) * 80).toFixed(0)}px`;
      frag.appendChild(s);
    }
    box.appendChild(frag);
  })();

  /* ------------------------------------------------------------------
     River scenes: the fixed environment shows the scene of whichever
     section crosses the middle of the screen. Pictures load only as their
     section comes near, and phones get the lighter files.
  ------------------------------------------------------------------ */
  (() => {
    const scenes = new Map($$('.env .scene').map(s => [s.dataset.scene, s]));
    if (!scenes.size) return;
    const small = matchMedia('(max-width: 900px)').matches;
    const load = s => {
      if (!s || s.dataset.loaded) return;
      s.dataset.loaded = '1';
      s.style.backgroundImage = `url('${small ? s.dataset.bgS : s.dataset.bg}')`;
    };
    let current = null;
    const show = name => {
      if (name === current) return;
      current = name;
      scenes.forEach((s, key) => s.classList.toggle('on', key === name));
      load(scenes.get(name));
    };
    const sections = $$('section[data-scene]');
    const near = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) load(scenes.get(e.target.dataset.scene));
    }), { rootMargin: '100% 0px' });
    const mid = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) show(e.target.dataset.scene);
    }), { rootMargin: '-45% 0px -54% 0px' });
    sections.forEach(el => { near.observe(el); mid.observe(el); });
  })();

  /* ------------------------------------------------------------------
     Splash layer: spray particles and lens drops, all driven by one --s
  ------------------------------------------------------------------ */
  (() => {
    const spray = $('.splash .spray');
    const drops = $('.splash .drops');
    const r = rng(99);
    // the footage now carries its own real-looking splash, so the overlay stays light:
    // a few thrown droplets and drops on the lens, no white-out. Phones get even fewer.
    const lite = matchMedia('(pointer: coarse), (max-width: 900px)').matches;
    const N_SPRAY = lite ? 24 : 40, N_DROP = lite ? 7 : 12;
    // flying droplets and streaks, thrown out of the wave ahead and pulled back by gravity
    const fs = document.createDocumentFragment();
    for (let i = 0; i < N_SPRAY; i++) {
      const p = document.createElement('span');
      const side = r() < 0.5 ? -1 : 1;
      const streak = r() < 0.66;
      const big = false;
      p.className = 'sp' + (r() < 0.3 ? ' soft' : '');
      const vx = side * (6 + r() * 52);          // vw
      const vy = -(30 + r() * 70);               // vh, upward
      const rot = Math.atan2(vy * 9, vx * 16) * 180 / Math.PI;   // roughly along the throw
      p.style.cssText = [
        `--x0:${(32 + r() * 36).toFixed(1)}%`,
        `--y0:${(40 + r() * 20).toFixed(1)}%`,   // where the bow meets the wave, mid-frame
        `--sz:${streak ? (4 + r() * 7).toFixed(1) : big ? (22 + r() * 30).toFixed(0) : (5 + r() * 12).toFixed(0)}px`,
        `--len:${streak ? (5 + r() * 8).toFixed(1) : 1}`,
        `--rot:${rot.toFixed(0)}deg`,
        `--vx:${vx.toFixed(1)}vw`,
        `--vy:${vy.toFixed(1)}vh`,
        `--g:${(50 + r() * 60).toFixed(0)}vh`,
        `--dl:${(0.02 + r() * 0.12).toFixed(3)}`,
        `--du:${(0.18 + r() * 0.3).toFixed(3)}`,
        `--o:${(0.6 + r() * 0.4).toFixed(2)}`
      ].join(';');
      fs.appendChild(p);
    }
    spray.appendChild(fs);
    // drops that land on the lens and slide away
    const fd = document.createDocumentFragment();
    const pct = () => (40 + r() * 20).toFixed(0) + '%';
    for (let i = 0; i < N_DROP; i++) {
      const d = document.createElement('span');
      d.className = 'dr';
      const big = r() < 0.2;
      d.style.cssText = [
        `--x0:${(2 + r() * 92).toFixed(1)}%`,
        `--y0:${(4 + r() * 74).toFixed(1)}%`,
        `--sz:${big ? (60 + r() * 50).toFixed(0) : (12 + r() * 34).toFixed(0)}px`,
        `--tall:${(1.05 + r() * 0.6).toFixed(2)}`,
        `--shape:${pct()} ${pct()} ${pct()} ${pct()} / ${pct()} ${pct()} ${pct()} ${pct()}`,
        `--dl:${(0.05 + r() * 0.14).toFixed(3)}`,
        `--du:${(0.5 + r() * 0.42).toFixed(3)}`,
        `--fall:${(60 + r() * 220).toFixed(0)}px`
      ].join(';');
      fd.appendChild(d);
    }
    drops.appendChild(fd);
  })();

  /* ------------------------------------------------------------------
     The scrub hero
  ------------------------------------------------------------------ */
  const hero = $('.hero');
  const stage = $('.stage');
  const video = $('#hero');
  const posterLayer = $('.poster');
  const ring = $('.ring');
  const cue = $('.cue');
  const cueLabel = $('.cue-label');
  const splashEl = $('.splash');
  // two cuts of the same footage: wide screens scrub the 16:9 master, tall screens
  // (phones, tablets held upright) scrub a 608x1080 centre crop where every frame is
  // a keyframe, so phone decoders can land any scroll position instantly
  const VARIANTS = {
    wide: { video: 'assets/hero-scrub.mp4', poster: 'assets/hero-poster.jpg', bytes: 4654217 },
    tall: { video: 'assets/hero-scrub-m.mp4', poster: 'assets/hero-poster-m.jpg', bytes: 3020513 }
  };
  const TALL = matchMedia('(max-aspect-ratio: 1/1)');   // must match the tall-screen block in style.css
  const wantedVariant = () => (TALL.matches ? 'tall' : 'wide');

  const SPLASH_A = 0.42, SPLASH_B = 0.68;   // the bow meets the white water at about 2.6 to 3.3 s of 6

  const bands = $$('.band').map(el => ({
    el,
    a: +el.dataset.a,
    b: +el.dataset.b,
    ramp: el.dataset.ramp ? +el.dataset.ramp : null,
    op: -1, k: -1, on: null
  }));

  // measured against the sticky stage, not innerHeight: on phones innerHeight grows and
  // shrinks as the address bar hides, which would make the video jump mid-scroll
  function heroProgress() {
    const range = hero.offsetHeight - stage.offsetHeight;
    if (range <= 0) return 0;
    return clamp(-hero.getBoundingClientRect().top / range, 0, 1);
  }

  let loadK = 0;
  let lastCue = -1, lastS = -1, lastShake = '';

  function updateCaptions(p) {
    const n = bands.length;
    for (let i = 0; i < n; i++) {
      const bd = bands[i];
      const { a, b } = bd;
      const f = Math.min(0.02, (b - a) / 3);
      const inE = i === 0 ? 1 : smoothstep(p, a, a + f);
      const outE = i === n - 1 ? 1 : 1 - smoothstep(p, b - f, b);
      const op = inE * outE;
      const ramp = bd.ramp || Math.min(0.025, (b - a) * 0.35);
      let k = clamp((p - a) / ramp, 0, 1);
      if (i === 0) k = Math.max(k, loadK);
      if (Math.abs(op - bd.op) > 0.004 || ((op === 0 || op === 1) && bd.op !== op)) {
        bd.el.style.opacity = op.toFixed(3);
        bd.op = op;
        const on = op > 0.5;
        if (on !== bd.on) { bd.el.classList.toggle('on', on); bd.on = on; }
      }
      if (Math.abs(k - bd.k) > 0.008 || ((k === 0 || k === 1) && bd.k !== k)) {
        bd.el.style.setProperty('--k', k.toFixed(3));
        bd.k = k;
      }
    }
    // splash, scrubbed both ways
    const s = clamp((p - SPLASH_A) / (SPLASH_B - SPLASH_A), 0, 1);
    if (Math.abs(s - lastS) > 0.003 || ((s === 0 || s === 1) && lastS !== s)) {
      splashEl.style.setProperty('--s', s.toFixed(4));
      lastS = s;
    }
    // the hit gives the camera a small extra bump, then it settles (scrubbed, so it reverses too)
    const amp = smoothstep(s, 0.02, 0.06) * (1 - smoothstep(s, 0.06, 0.4)) * 6;
    const shake = amp < 0.2 ? '' :
      `translate3d(${(Math.sin(s * 97) * amp).toFixed(1)}px,${(Math.cos(s * 131) * amp * 0.7).toFixed(1)}px,0) scale(1.05)`;
    if (shake !== lastShake) {
      video.style.transform = shake;
      posterLayer.style.transform = shake;
      lastShake = shake;
    }
    // the cue only lives at the very top
    const c = 1 - smoothstep(p, 0.01, 0.05);
    if (Math.abs(c - lastCue) > 0.01 || ((c === 0 || c === 1) && lastCue !== c)) {
      cue.style.opacity = c.toFixed(2);
      cue.style.visibility = c === 0 ? 'hidden' : '';
      lastCue = c;
    }
  }

  // gated seeks: never overlap, coalesce to the newest target, never deadlock
  let seekBusy = false;
  let pendingTime = null;
  function requestSeek(t) {
    if (!video.duration || !isFinite(video.duration)) return;
    t = clamp(t, 0, video.duration - 0.04);
    if (seekBusy) { pendingTime = t; return; }
    if (Math.abs(video.currentTime - t) < 0.002) return;
    seekBusy = true;
    video.currentTime = t;
  }
  video.addEventListener('seeked', () => {
    seekBusy = false;
    if (pendingTime !== null) {
      const t = pendingTime;
      pendingTime = null;
      requestSeek(t);
    }
  });
  video.addEventListener('error', () => {
    seekBusy = false;
    pendingTime = null;
    failVideo();
  });

  // lerped display time, a loop that rests
  let target = 0, shown = 0, rafId = null, lastTick = 0, heroOnScreen = true;
  function tick(now) {
    const dt = Math.min(100, now - (lastTick || now));
    lastTick = now;
    const k = 0.14;
    shown += (target - shown) * (1 - Math.pow(1 - k, dt / 16.667));
    if (Math.abs(target - shown) < 0.0005) {
      shown = target;
      rafId = null;
      lastTick = 0;
    } else {
      rafId = requestAnimationFrame(tick);
    }
    requestSeek(shown * (video.duration || 0));
    updateCaptions(shown);
  }
  function onScroll() {
    target = heroProgress();
    if (rafId === null && heroOnScreen) rafId = requestAnimationFrame(tick);
  }
  new IntersectionObserver(([e]) => {
    heroOnScreen = e.isIntersecting;
    if (heroOnScreen && scrubOn) onScroll();
  }).observe(hero);

  // band one opens settled: a one-time load ramp that hands over to scroll
  function runLoadRamp() {
    const t0 = performance.now();
    const D = 1500;
    function step(now) {
      const t = clamp((now - t0) / D, 0, 1);
      loadK = 1 - Math.pow(1 - t, 3);
      if (scrubOn) updateCaptions(shown);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // the video: poster first, then a streamed blob behind an honest ring.
  // Loads the cut that fits the screen and swaps cuts if the screen turns.
  let heroInit = false, variant = null, loadToken = 0, loadCtrl = null, blobUrl = null;
  function initHeroOnce() {
    if (heroInit) return;
    heroInit = true;
    runLoadRamp();
  }
  function loadVariant(v) {
    if (v === variant) return;
    variant = v;
    const token = ++loadToken;
    const V = VARIANTS[v];
    if (loadCtrl) { loadCtrl.abort(); loadCtrl = null; }
    if (blobUrl) {
      video.removeAttribute('src');
      video.load();
      URL.revokeObjectURL(blobUrl);
      blobUrl = null;
    }
    seekBusy = false;
    pendingTime = null;
    stage.classList.remove('video-ready', 'ready-cue', 'video-failed');
    cueLabel.textContent = 'Loading the river';
    ring.style.setProperty('--ld', 126);
    // the poster wins the bandwidth race: the blob starts once it is in (or has failed)
    posterLayer.style.backgroundImage = `url('${V.poster}')`;
    let started = false;
    const start = () => {
      if (started || token !== loadToken) return;
      started = true;
      loadHeroBlob(V, token).catch(() => { if (token === loadToken) failVideo(); });
    };
    const img = new Image();
    img.onload = start;
    img.onerror = start;
    img.src = V.poster;
    setTimeout(start, 4000);   // safety: a hung poster never blocks the video forever
  }
  async function loadHeroBlob(V, token) {
    const ctrl = new AbortController();
    loadCtrl = ctrl;
    let watchdog = setTimeout(() => ctrl.abort(), 20000);
    try {
      const res = await fetch(V.video, { priority: 'low', signal: ctrl.signal });
      if (!res.ok) throw new Error('video ' + res.status);
      let blob;
      if (res.body && res.body.getReader) {
        const total = Number(res.headers.get('Content-Length')) || V.bytes;
        const reader = res.body.getReader();
        const chunks = [];
        let got = 0, lastRing = 0;
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          clearTimeout(watchdog);                          // re-armed on every chunk:
          watchdog = setTimeout(() => ctrl.abort(), 20000); // 20s with no progress aborts
          chunks.push(value);
          got += value.length;
          const frac = Math.min(1, got / total);
          const now = performance.now();
          if (now - lastRing > 100 || frac === 1) {
            lastRing = now;
            ring.style.setProperty('--ld', Math.round(126 * (1 - frac)));
          }
        }
        blob = new Blob(chunks, { type: 'video/mp4' });
      } else {
        blob = await res.blob();   // browsers without streams: no ring progress, same result
      }
      if (token !== loadToken) return;
      ring.style.setProperty('--ld', 0);
      blobUrl = URL.createObjectURL(blob);
      video.src = blobUrl;
      video.load();
      video.addEventListener('canplay', () => {
        if (token !== loadToken) return;
        // iPhones only paint seeked frames once a video has played. A muted inline
        // play() is always allowed, so play for an instant and pause straight away.
        const settle = () => {
          if (token !== loadToken) return;
          video.pause();
          seekBusy = false;
          pendingTime = null;
          requestSeek(heroProgress() * video.duration);
          stage.classList.add('video-ready', 'ready-cue');
          cueLabel.textContent = 'Scroll to go over';
        };
        // if the phone refuses even that (iPhone Low Power Mode), the visitor's first
        // touch counts as permission: play-and-pause once then, and frames start painting
        const unlockOnTouch = () => {
          const unlock = () => {
            if (token !== loadToken) return;
            const q = video.play();
            if (q && q.then) q.then(() => { video.pause(); requestSeek(heroProgress() * video.duration); }, () => {});
          };
          addEventListener('touchend', unlock, { once: true, passive: true });
          addEventListener('click', unlock, { once: true, passive: true });
        };
        let p = null;
        try { p = video.play(); } catch (e) { p = null; }
        if (p && p.then) p.then(settle, () => { settle(); unlockOnTouch(); });
        else settle();
      }, { once: true });
    } finally {
      clearTimeout(watchdog);
      if (loadCtrl === ctrl) loadCtrl = null;
    }
  }
  function failVideo() {
    stage.classList.add('video-failed');
    cueLabel.textContent = 'Scroll';
  }

  /* ------------------------------------------------------------------
     The static-hero gates, decided live (must match style.css exactly).
     Phones held upright scrub the tall cut; only a phone held sideways
     (no room for the journey) and reduced motion get the still hero.
  ------------------------------------------------------------------ */
  const GATES = [
    '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
    '(prefers-reduced-motion: reduce)'
  ];
  let scrubOn = false;
  function enableScrub() {
    if (scrubOn) return;
    scrubOn = true;
    initHeroOnce();
    loadVariant(wantedVariant());
    addEventListener('scroll', onScroll, { passive: true });
    bands.forEach(b => { b.op = -1; b.k = -1; b.on = null; });
    lastCue = lastS = -1;
    unpinFinalStates();
    target = shown = heroProgress();
    updateCaptions(shown);
    onScroll();
  }
  function disableScrub() {
    if (!scrubOn) return;
    scrubOn = false;
    removeEventListener('scroll', onScroll);
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
  }
  function applyHeroMode() {
    if (GATES.some(q => matchMedia(q).matches)) disableScrub();
    else enableScrub();
  }
  const MQLS = GATES.map(q => matchMedia(q));
  MQLS.forEach(m => m.addEventListener('change', applyHeroMode));
  // a tablet turned from upright to sideways (or back) swaps to the cut that fits
  TALL.addEventListener('change', () => { if (scrubOn) loadVariant(wantedVariant()); });

  /* ------------------------------------------------------------------
     Nav goes solid once the hero is behind you
  ------------------------------------------------------------------ */
  const nav = $('#nav');
  const heroStatic = $('.hero-static');
  let navSolid = null, navRaf = null;
  function navCheck() {
    navRaf = null;
    const h = hero.offsetHeight ? hero : heroStatic;
    const end = h.offsetTop + h.offsetHeight - 90;
    const solid = scrollY > end;
    if (solid !== navSolid) { nav.classList.toggle('solid', solid); navSolid = solid; }
  }
  addEventListener('scroll', () => { if (navRaf === null) navRaf = requestAnimationFrame(navCheck); }, { passive: true });
  addEventListener('resize', () => { navCheck(); if (scrubOn) onScroll(); });

  /* ------------------------------------------------------------------
     Section entrances and on-screen living elements
  ------------------------------------------------------------------ */
  const reveals = $$('.reveal');
  const enterIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add('in');
      enterIO.unobserve(el);
      setTimeout(() => el.classList.add('settled'), 2200);
      el.dispatchEvent(new CustomEvent('entered'));
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
  reveals.forEach(el => enterIO.observe(el));

  const liveIO = new IntersectionObserver(entries => {
    entries.forEach(e => e.target.classList.toggle('live', e.isIntersecting));
  });
  reveals.forEach(el => liveIO.observe(el));

  document.addEventListener('visibilitychange', () => {
    document.body.classList.toggle('paused', document.hidden);
  });

  /* counters */
  const counters = $$('.count');
  function countUp(el) {
    const to = +el.dataset.to;
    const isDec = el.dataset.to.includes('.');
    if (root.classList.contains('rm')) { el.textContent = el.dataset.to; return; }
    const t0 = performance.now(), D = 1300;
    let last = '';
    (function step(now) {
      const t = clamp((now - t0) / D, 0, 1);
      const v = isDec ? (to * (1 - Math.pow(1 - t, 3))).toFixed(1) : String(Math.round(to * (1 - Math.pow(1 - t, 3))));
      if (v !== last) { el.textContent = v; last = v; }
      if (t < 1) requestAnimationFrame(step);
    })(t0);
  }
  $('#run').addEventListener('entered', () => counters.forEach(countUp));

  /* ------------------------------------------------------------------
     River map: draws itself with scroll, markers appear as it reaches them
  ------------------------------------------------------------------ */
  const map = $('#riverMap');
  const riverPath = $('#riverPath');
  const markers = $$('.mk', map).map(g => ({ g, t: +g.dataset.t, on: null }));
  (() => {
    const len = riverPath.getTotalLength();
    markers.forEach(m => {
      const pt = riverPath.getPointAtLength(m.t * len);
      m.g.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
      const text = $('text', m.g);
      const left = m.g.dataset.side === 'l';
      text.setAttribute('x', left ? -16 : 16);
      text.setAttribute('y', 6);
      text.setAttribute('text-anchor', left ? 'end' : 'start');
    });
  })();
  // on narrow phones a label can run past the screen edge: flip it to the other side of its dot
  function fitMapLabels() {
    const vw = document.documentElement.clientWidth;
    markers.forEach(m => {
      const text = $('text', m.g);
      const leftPref = m.g.dataset.side === 'l';
      text.setAttribute('x', leftPref ? -16 : 16);
      text.setAttribute('text-anchor', leftPref ? 'end' : 'start');
      const r = text.getBoundingClientRect();
      if (!r.width) return;
      if (!leftPref && r.right > vw - 8) { text.setAttribute('x', -16); text.setAttribute('text-anchor', 'end'); }
      else if (leftPref && r.left < 8) { text.setAttribute('x', 16); text.setAttribute('text-anchor', 'start'); }
    });
  }
  fitMapLabels();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitMapLabels);
  addEventListener('resize', fitMapLabels);
  let mapDraw = -1, mapRaf = null, mapVisible = false;
  function mapUpdate() {
    mapRaf = null;
    let prog;
    if (root.classList.contains('rm')) prog = 1;
    else {
      const r = map.getBoundingClientRect();
      const vh = innerHeight;
      prog = clamp((vh * 0.85 - r.top) / (vh * 0.25 + r.height), 0, 1);
    }
    if (Math.abs(prog - mapDraw) > 0.002 || ((prog === 0 || prog === 1) && mapDraw !== prog)) {
      riverPath.style.setProperty('--draw', (1 - prog).toFixed(4));
      mapDraw = prog;
      markers.forEach(m => {
        const on = prog >= m.t - 0.001;
        if (on !== m.on) { m.g.classList.toggle('on', on); m.on = on; }
      });
    }
  }
  new IntersectionObserver(([e]) => {
    mapVisible = e.isIntersecting;
    if (mapVisible) mapUpdate();
  }, { rootMargin: '20% 0px' }).observe(map);
  addEventListener('scroll', () => {
    if (mapVisible && mapRaf === null) mapRaf = requestAnimationFrame(mapUpdate);
  }, { passive: true });

  /* ------------------------------------------------------------------
     The one interactive moment: hold to go over the line
  ------------------------------------------------------------------ */
  const dropSec = $('.drop-sec');
  const raft = $('#raft');
  const dropPath = $('#dropPath');
  const bpmEl = $('#bpm');
  const heart = $('.heart');
  const live = $('#dropLive');
  const splashG = $('.dsplash');
  const DLEN = dropPath.getTotalLength();
  const START = DLEN * 0.07, END = DLEN * 0.93;
  const DONE_TEXT = '164 bpm. Totally normal on the Vjosa.';
  {
    const pt = dropPath.getPointAtLength(DLEN * 0.83);
    splashG.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${(pt.y - 4).toFixed(1)})`);
  }
  // Joel, 2026-11-14: no button. The drop plays as you scroll: down goes over the rapid (up to 164 bpm),
  // up brings the raft back to the start and the heart back to 72 bpm.
  const dropStage = $('.drop-stage', dropSec);
  let hp = 0, goal = 0, hRaf = null, hLast = 0, lastBpm = '', lastHp = -1, isDone = false;

  function placeRaft(p) {
    // smooth on the flat, then gravity takes over at the lip
    const e = p < 0.62 ? (p / 0.62) * 0.66 : 0.66 + Math.pow((p - 0.62) / 0.38, 1.6) * 0.34;
    const l = START + (END - START) * e;
    const a = dropPath.getPointAtLength(l);
    const b = dropPath.getPointAtLength(Math.min(DLEN, l + 2));
    let ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
    ang = clamp(ang, -10, 62);
    raft.setAttribute('transform', `translate(${a.x.toFixed(1)} ${(a.y - 1).toFixed(1)}) rotate(${ang.toFixed(1)})`);
    const bpm = String(Math.round(72 + 92 * Math.pow(p, 1.3)));
    if (bpm !== lastBpm) { bpmEl.textContent = bpm; lastBpm = bpm; }
    if (Math.abs(p - lastHp) > 0.003 || p === 0 || p === 1) {
      heart.style.setProperty('--hb', (1 + p * 0.28).toFixed(3));
      lastHp = p;
    }
  }
  function setDone(v) {
    if (v === isDone) return;
    isDone = v;
    dropSec.classList.toggle('done', v);
    live.textContent = v ? DONE_TEXT : '';
  }
  function dropTick(now) {
    const dt = Math.min(100, now - (hLast || now));
    hLast = now;
    hp += (goal - hp) * (1 - Math.pow(1 - 0.14, dt / 16.667));
    if (Math.abs(goal - hp) < 0.002) hp = goal;
    placeRaft(hp);
    setDone(hp >= 0.995);
    if (hp !== goal) hRaf = requestAnimationFrame(dropTick);
    else { hRaf = null; hLast = 0; }
  }
  function onDropScroll() {
    if (RM.matches) return; // reduced motion keeps the finished state
    const r = dropStage.getBoundingClientRect(), vh = window.innerHeight;
    goal = clamp((vh * 0.85 - r.top) / (vh * 0.55), 0, 1);
    if (hRaf === null) hRaf = requestAnimationFrame(dropTick);
  }
  addEventListener('scroll', onDropScroll, { passive: true });
  addEventListener('resize', onDropScroll);
  placeRaft(0);
  onDropScroll();

  /* ------------------------------------------------------------------
     Booking form (real reservation sent to WhatsApp with email fallback)
  ------------------------------------------------------------------ */
  const form = $('#bookForm');
  const doneBox = $('#bookDone');
  const tripSel = $('#f-trip');
  const dateIn = $('#f-date');
  const today = new Date();
  const iso = d => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  dateIn.min = iso(today);

  $$('[data-trip]').forEach(a => a.addEventListener('click', () => { tripSel.value = a.dataset.trip; clearErr(tripSel); }));

  const checks = {
    'f-trip': el => el.value ? '' : 'Please choose a tour slot.',
    'f-date': el => !el.value ? 'Please pick a date.' : (el.value < el.min ? 'Pick a day from today onward.' : ''),
    'f-adults': el => { const n = +el.value; return Number.isInteger(n) && n >= 1 && n <= 24 ? '' : '1 to 24 adults per booking.'; },
    'f-children': el => { const n = +el.value; return Number.isInteger(n) && n >= 0 && n <= 20 ? '' : 'Enter 0 or more children.'; },
    'f-name': el => el.value.trim() ? '' : 'Tell us your full name.',
    'f-phone': el => el.value.trim().length >= 6 ? '' : 'Enter a valid WhatsApp or phone number.',
    'f-email': el => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim()) ? '' : "That email doesn't look right.",
    'f-fitness': el => el.checked ? '' : 'Please confirm fitness confirmation.'
  };
  let tried = false;
  function setErr(el, msg) {
    const box = $('#e-' + el.id.slice(2));
    if (box) box.textContent = msg;
    if (msg) el.setAttribute('aria-invalid', 'true');
    else el.removeAttribute('aria-invalid');
  }
  function clearErr(el) { setErr(el, ''); }
  Object.keys(checks).forEach(id => {
    const el = $('#' + id);
    if (!el) return;
    const ev = (el.tagName === 'SELECT' || el.type === 'checkbox') ? 'change' : 'blur';
    el.addEventListener(ev, () => { if (tried) setErr(el, checks[id](el)); });
    el.addEventListener('input', () => { if (el.getAttribute('aria-invalid')) setErr(el, checks[id](el)); });
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    tried = true;
    let first = null;
    Object.keys(checks).forEach(id => {
      const el = $('#' + id);
      if (!el) return;
      const msg = checks[id](el);
      setErr(el, msg);
      if (msg && !first) first = el;
    });
    if (first) { first.focus(); return; }

    const tripText = tripSel.options[tripSel.selectedIndex] ? tripSel.options[tripSel.selectedIndex].text : tripSel.value;
    const dateVal = $('#f-date').value;
    const adultsVal = $('#f-adults').value;
    const childrenVal = $('#f-children') ? $('#f-children').value : '0';
    const nameVal = $('#f-name').value.trim();
    const phoneVal = $('#f-phone').value.trim();
    const emailVal = $('#f-email').value.trim();
    const notesEl = $('#f-notes');
    const notesVal = notesEl ? notesEl.value.trim() : '';

    const waMsg = `Hello Adion! I would like to book a rafting tour with Vjosa Rafting Getaway:\n` +
      `- Tour Slot: ${tripText}\n` +
      `- Date: ${dateVal}\n` +
      `- Guests: ${adultsVal} adult(s)${+childrenVal > 0 ? ', ' + childrenVal + ' child(ren)' : ''}\n` +
      `- Lead Contact: ${nameVal}\n` +
      `- Phone/WhatsApp: ${phoneVal}\n` +
      `- Email: ${emailVal}` +
      (notesVal ? `\n- Questions/Notes: ${notesVal}` : '');

    const waUrl = `https://wa.me/355684340615?text=${encodeURIComponent(waMsg)}`;
    const mailUrl = `mailto:vjosaraftinggetaway@gmail.com?subject=${encodeURIComponent('Rafting Tour Booking: ' + nameVal)}&body=${encodeURIComponent(waMsg)}`;

    const firstName = nameVal.split(' ')[0];
    $('#doneTitle').textContent = `Booking request ready, ${firstName}!`;
    const waBtn = $('#waBtn');
    if (waBtn) waBtn.href = waUrl;
    const mailBtn = $('#mailBtn');
    if (mailBtn) mailBtn.href = mailUrl;

    // Open WhatsApp
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    form.hidden = true;
    doneBox.hidden = false;
    doneBox.focus();
  });
  $('#bookAgain').addEventListener('click', () => {
    form.reset();
    tried = false;
    Object.keys(checks).forEach(id => {
      const el = $('#' + id);
      if (el) clearErr(el);
    });
    doneBox.hidden = true;
    form.hidden = false;
    tripSel.focus();
  });

  /* ------------------------------------------------------------------
     Reduced motion, honored live in both directions
  ------------------------------------------------------------------ */
  let pinned = false;
  function pinToFinalStates() {
    pinned = true;
    root.classList.add('rm');
    reveals.forEach(el => el.classList.add('in', 'settled'));
    counters.forEach(el => { el.textContent = el.dataset.to; });
    mapUpdate();
    if (hRaf !== null) { cancelAnimationFrame(hRaf); hRaf = null; }
    hp = goal = 1; placeRaft(1); setDone(true);
  }
  function unpinFinalStates() {
    if (!pinned) return;
    pinned = false;
    root.classList.remove('rm');
    mapDraw = -1;
    mapUpdate();
    hp = 0; placeRaft(0); setDone(false); onDropScroll();
  }
  RM.addEventListener('change', e => {
    if (e.matches) pinToFinalStates();
    else { unpinFinalStates(); applyHeroMode(); }
  });

  if (RM.matches) pinToFinalStates();
  applyHeroMode();
  navCheck();
  // Ride it (assets/river.js): loads only when its section scrolls near.
  (function () {
    const sec = document.getElementById('ride'); if (!sec) return;
    const load = () => { const sc = document.createElement('script'); sc.src = 'assets/river.js?v=20261114'; document.body.appendChild(sc); };
    if (!('IntersectionObserver' in window)) return load();
    const io2 = new IntersectionObserver(es => { if (es[0].isIntersecting) { io2.disconnect(); load(); } }, { rootMargin: '600px 0px' });
    io2.observe(sec);
  })();
})();
