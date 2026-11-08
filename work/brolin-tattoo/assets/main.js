/* ΒRÓŁΙN · scroll film, dotwork details, English and Greek */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const smoothstep = (p, e0, e1) => { const t = clamp((p - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
  const rng = seed => { let s = seed >>> 0; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; };
  const hash = str => { let h = 2166136261; for (const ch of str) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } }
  };
  const RM = matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Greek ---------- */
  const EL = {
    'meta.title': 'ΒRÓŁΙN · Blackwork και dotwork τατουάζ στην Αθήνα',
    'skip': 'Μετάβαση στο περιεχόμενο',
    'nav.label': 'Κύριο μενού',
    'nav.work': 'Έργα',
    'nav.styles': 'Στυλ',
    'nav.how': 'Πώς δουλεύω',
    'nav.faq': 'Ερωτήσεις',
    'nav.book': 'Ραντεβού',
    'lang.label': 'Γλώσσα',
    'b1.k': 'Tattoo artist · Αθήνα',
    'b1.h': 'Μαύρο μελάνι.|Τίποτα άλλο.',
    'b1.s': 'Λέγομαι ΒRÓŁΙN. Κάνω blackwork, dotwork και abstract τατουάζ στην Αθήνα.',
    'b2.h': 'Μία κουκκίδα|τη φορά.',
    'b2.s': 'Το dotwork είναι χιλιάδες μικρές κουκκίδες, μία μία με το χέρι. Θέλει υπομονή. Δεν βιάζομαι ποτέ.',
    'b3.h': 'Πρώτα ακούω.',
    'b3.s': 'Πες μου την ιδέα, το μέγεθος και το σημείο στο σώμα. Θα σου πω ειλικρινά τι θα κρατήσει καλά με τα χρόνια.',
    'b4.h': 'Γραμμές που|μένουν καθαρές.',
    'b4.s': 'Ένα φρέσκο τατουάζ δείχνει ωραίο σε όλους. Τα δικά μου είναι φτιαγμένα να μένουν καθαρά για χρόνια.',
    'b5.h': 'Η ιδέα σου,|σε μαύρο.',
    'b5.s': 'Στείλε μου μήνυμα στο Instagram με την ιδέα σου.',
    'cta.send': 'Στείλε την ιδέα σου',
    'cta.see': 'Δες τη δουλειά',
    'cue': 'Κύλισε',
    'hs.k': 'ΒRÓŁΙN · Tattoo artist · Αθήνα',
    'hs.h': 'Μαύρο μελάνι.<br>Τίποτα άλλο.',
    'hs.s': 'Blackwork, dotwork και abstract τατουάζ, φτιαγμένα με το χέρι στην Αθήνα.',
    'work.k': '01 · Η δουλειά',
    'work.h': 'Πρόσφατα έργα.',
    'work.l': 'Αληθινά τατουάζ σε αληθινούς ανθρώπους. Δες περισσότερα στο Instagram.',
    'work.more': 'Περισσότερα στο Instagram',
    'work.c1': 'Άγγελος και δαίμονας · στήθος',
    'work.c2': 'Μάσκα δαίμονα · μπράτσο',
    'work.c3': 'Μάνταλα dotwork · αυχένας και πλάτη',
    'work.c4': 'Διακοσμητικό μανίκι · σε εξέλιξη',
    'work.a1': 'Blackwork τατουάζ στο στήθος: μια μορφή με ένα φτερό αγγέλου και ένα φτερό δαίμονα, με σπαθί, μπροστά σε ένα γεωμετρικό σχήμα.',
    'work.a2': 'Blackwork τατουάζ με μάσκα δαίμονα, κέρατα και κοφτερά δόντια, στο μπράτσο.',
    'work.a3': 'Dotwork τατουάζ μάνταλα στον αυχένα, με γεμάτες μαύρες καμπύλες γύρω του.',
    'work.a4': 'Βίντεο: διακοσμητικό μανίκι με λωτό στο μισό χέρι, που γυρίζει για να φανεί όλο.',
    'work.play': 'Παίξε το βίντεο',
    'work.pause': 'Σταμάτα το βίντεο',
    'styles.k': '02 · Στυλ',
    'styles.h': 'Τρεις τρόποι να φορέσεις το μαύρο.',
    'styles.black': 'Δυνατά, γεμάτα μαύρα σχήματα. Ξεχωρίζουν από μακριά, καθαρά από κοντά.',
    'styles.dot': 'Σκίαση από χιλιάδες μικρές κουκκίδες. Απαλές διαβαθμίσεις, κοφτερή λεπτομέρεια.',
    'styles.abs': 'Ελεύθερες γραμμές και σχήματα που ακολουθούν το σώμα σου, όχι ένα έτοιμο σχέδιο.',
    'try.k': '03 · Δοκίμασέ το',
    'try.h': 'Νιώσε πώς γίνεται το dotwork.',
    'try.l': 'Πάτα και κράτα. Κάθε κουκκίδα είναι ένα άγγιγμα της βελόνας.',
    'try.btn': 'Κράτα για να σχεδιάσεις',
    'try.done': 'Σου πήρε λίγα δευτερόλεπτα. Ένα αληθινό έργο θέλει ώρες, και κάθε κουκκίδα μετράει.',
    'how.k': '04 · Πώς δουλεύω',
    'how.h': 'Από την ιδέα στο επουλωμένο τατουάζ.',
    'how.1.h': 'Στείλε την ιδέα σου',
    'how.1.p': 'Στείλε μου μήνυμα στο Instagram. Πες μου την ιδέα, το μέγεθος και το σημείο. Φωτογραφίες αναφοράς βοηθούν.',
    'how.2.h': 'Το σχεδιάζουμε μαζί',
    'how.2.p': 'Σχεδιάζω το έργο για σένα. Φτιάχνουμε μέγεθος και θέση μέχρι να σου κάθεται σωστά, και κλείνουμε ημερομηνία.',
    'how.3.h': 'Η μέρα του τατουάζ',
    'how.3.p': 'Καινούργιες βελόνες, που ανοίγουν μπροστά σου. Κάνουμε διάλειμμα όποτε το χρειαστείς.',
    'how.4.h': 'Επούλωση',
    'how.4.p': 'Φεύγεις με απλές οδηγίες φροντίδας. Έχεις απορία όσο επουλώνεται; Στείλε μου μήνυμα.',
    'clean.cap': 'Μαύρο μελάνι · καπάκι μιας χρήσης',
    'clean.k': '05 · Καθαρά, κάθε φορά',
    'clean.h': 'Το δέρμα σου, με φροντίδα.',
    'clean.1': 'Καινούργιες βελόνες για κάθε πελάτη, που ανοίγουν μπροστά σου.',
    'clean.2': 'Καπάκια μελανιού και γάντια μιας χρήσης.',
    'clean.3': 'Κάθε επιφάνεια καθαρίζεται μετά από κάθε πελάτη.',
    'clean.4': 'Ειλικρινής συμβουλή, ακόμα κι αν σημαίνει μικρότερο τατουάζ.',
    'faq.k': '06 · Ερωτήσεις',
    'faq.h': 'Πριν κλείσεις ραντεβού.',
    'faq.l': 'Έχεις ακόμα απορία; Ρώτα με στο Instagram. Καμία ερώτηση δεν είναι χαζή.',
    'faq.1.q': 'Πονάει;',
    'faq.1.a': 'Λίγο, ανάλογα με το σημείο. Πλευρά και πόδια πονάνε πιο πολύ, χέρια και μηροί λιγότερο. Σταματάμε για διάλειμμα όποτε θέλεις.',
    'faq.2.q': 'Πόσο κοστίζει;',
    'faq.2.a': 'Εξαρτάται από το μέγεθος και τη λεπτομέρεια. Στείλε μου την ιδέα σου και θα σου πω καθαρή τιμή πριν κλείσεις.',
    'faq.3.q': 'Έχω μόνο μια πρόχειρη ιδέα. Γίνεται;',
    'faq.3.a': 'Ναι. Οι περισσότεροι έτσι ξεκινούν. Στείλε ό,τι έχεις και θα το διαμορφώσουμε μαζί.',
    'faq.4.q': 'Κάνεις έγχρωμα τατουάζ;',
    'faq.4.a': 'Όχι. Δουλεύω μόνο με μαύρο. Αυτό είναι το στυλ μου, και γι\' αυτό η δουλειά δείχνει έτσι.',
    'faq.5.q': 'Είναι το πρώτο μου τατουάζ. Τι να ξέρω;',
    'faq.5.a': 'Πες μου ότι είναι το πρώτο σου. Θα σου εξηγήσω κάθε βήμα πριν ξεκινήσουμε. Φάε καλά, κοιμήσου καλά και έλα όπως είσαι.',
    'faq.6.q': 'Μπορείς να καλύψεις ένα παλιό τατουάζ;',
    'faq.6.a': 'Συχνά, ναι. Το μαύρο είναι δυνατό για κάλυψη. Στείλε μου φωτογραφία του παλιού και θα σου πω ειλικρινά.',
    'faq.7.q': 'Πόσο κρατάει η επούλωση;',
    'faq.7.a': 'Η επιφάνεια επουλώνεται σε δύο με τέσσερις εβδομάδες περίπου. Θα σου δώσω απλές οδηγίες φροντίδας.',
    'final.h': 'Ας το φτιάξουμε.',
    'final.l': 'Στείλε μου την ιδέα σου στο Instagram: τι θέλεις, πόσο μεγάλο και πού.',
    'final.place': 'Αθήνα, Ελλάδα',
    'foot.role': 'Tattoo artist · Αθήνα, Ελλάδα',
    'foot.note': 'Η εισαγωγική ταινία φτιάχτηκε με AI. Όλα τα τατουάζ είναι αληθινή δουλειά.'
  };

  /* ---------- splitting headline text into words and letters ---------- */
  function splitEl(el) {
    const text = el.dataset.text;
    const fx = el.closest('[data-fx]')?.dataset.fx || 'rise';
    const r = rng(hash((el.dataset.i18n || '') + text));
    const lines = text.split('|');
    const words = lines.map(l => l.trim().split(/\s+/));
    const nWords = words.flat().length;
    const nChars = text.replace(/[\s|]/g, '').length;
    let wi = 0, ci = 0;

    const wordSpan = w => {
      const thW = fx === 'drift' ? wi / nWords * 0.45 + r() * 0.04
        : fx === 'glow' ? wi / nWords * 0.4
        : wi / nWords * 0.5;
      wi++;
      if (fx === 'stipple' || fx === 'snap') {
        const chars = [...w].map(ch => {
          const th = fx === 'stipple' ? r() * 0.72 : ci / nChars * 0.55 + r() * 0.06;
          const jx = fx === 'snap' ? `;--jx:${(26 + r() * 40).toFixed(1)}px` : '';
          ci++;
          return `<span class="c" style="--th:${th.toFixed(3)}${jx}">${esc(ch)}</span>`;
        }).join('');
        return `<span class="w">${chars}</span>`;
      }
      return `<span class="w" style="--th:${thW.toFixed(3)}">${esc(w)}</span>`;
    };
    const build = () => { wi = 0; ci = 0; return words.map(line => line.map(wordSpan).join(' ')).join('<br>'); };

    const visual = fx === 'glow'
      ? `<span class="layer sharp">${build()}</span><span class="layer soft">${build()}</span>`
      : build();
    el.classList.add('fx-' + fx);
    el.innerHTML = `<span class="sr">${esc(lines.join(' '))}</span><span class="vis" aria-hidden="true">${visual}</span>`;
  }

  /* ---------- language ---------- */
  const EN = {};
  $$('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (el.classList.contains('split')) EN[key] = el.innerHTML.replace(/<br\s*\/?>/gi, '|').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    else EN[key] = el.innerHTML;
  });
  $$('[data-i18n-attr]').forEach(el => el.dataset.i18nAttr.split(';').forEach(pair => {
    const [attr, key] = pair.split(':');
    EN[key] = el.getAttribute(attr);
  }));
  EN['meta.title'] = document.title;
  EN['work.pause'] = 'Pause the video';

  let lang = 'en';
  const tr = key => ((lang === 'el' ? EL : EN)[key] ?? EN[key] ?? '');
  function applyLang(l) {
    lang = l === 'el' ? 'el' : 'en';
    const D = lang === 'el' ? EL : EN;
    const t = key => (D[key] ?? EN[key]);
    document.documentElement.lang = lang;
    document.title = t('meta.title');
    $$('[data-i18n]').forEach(el => {
      const v = t(el.dataset.i18n);
      if (el.classList.contains('split')) { el.dataset.text = v; splitEl(el); }
      else if (el.innerHTML !== v) el.innerHTML = v;
    });
    $$('[data-i18n-attr]').forEach(el => el.dataset.i18nAttr.split(';').forEach(pair => {
      const [attr, key] = pair.split(':');
      el.setAttribute(attr, t(key));
    }));
    $$('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    store.set('lang', lang);
    syncReel();
    bands.forEach(B => { B.op = -1; B.k = -1; B.vis = null; });
    if (scrubOn) updateCaptions(shown);
  }
  $$('.lang button').forEach(b => b.addEventListener('click', () => applyLang(b.dataset.lang)));

  /* ---------- the scroll film ---------- */
  const VIDEO_URL = 'assets/hero-scrub.mp4';
  const POSTER_URL = 'assets/hero-poster.jpg';
  const ENDING_URL = 'assets/hero-ending.jpg';
  const hero = $('#hero');
  const stage = $('.stage', hero);
  const video = $('#hero-video');
  const posterLayer = $('.poster', hero);
  const posterEnd = $('.poster-end', hero);
  const railDots = $$('.rail li', hero);
  const cue = $('.cue', hero);
  const top = $('#top');

  const bands = $$('.band', hero).map((el, i, all) => ({
    el, a: +el.dataset.a, b: +el.dataset.b, ramp: +el.dataset.ramp || 0,
    first: i === 0, last: i === all.length - 1, op: -1, k: -1, vis: null
  }));

  let heroTop = 0, heroRange = 1;
  function measure() {
    heroTop = hero.getBoundingClientRect().top + scrollY;
    heroRange = Math.max(1, hero.offsetHeight - innerHeight);
  }
  const heroProgress = () => clamp((scrollY - heroTop) / heroRange, 0, 1);
  const dur = () => (video.duration && isFinite(video.duration) ? video.duration : 0);

  let loadK = 0;
  let railOn = -1, cueOp = -1, endOp = -1, failed = false;

  function updateCaptions(p) {
    let active = 0;
    bands.forEach((B, i) => {
      const f = Math.min(0.02, (B.b - B.a) / 3);
      const op = (B.first ? 1 : smoothstep(p, B.a, B.a + f)) * (B.last ? 1 : 1 - smoothstep(p, B.b - f, B.b));
      const ramp = B.ramp || Math.min(0.025, (B.b - B.a) * 0.35);
      let k = clamp((p - B.a) / ramp, 0, 1);
      if (B.first) k = Math.max(k, loadK);
      if (p >= B.a) active = i;

      if (Math.abs(op - B.op) > 0.004 || (op === 0 && B.op !== 0) || (op === 1 && B.op !== 1)) {
        B.op = op;
        B.el.style.opacity = op.toFixed(3);
        const vis = op > 0.01;
        if (vis !== B.vis) { B.vis = vis; B.el.style.visibility = vis ? 'visible' : 'hidden'; }
      }
      if (Math.abs(k - B.k) > 0.008 || (k === 1 && B.k !== 1) || (k === 0 && B.k !== 0)) {
        B.k = k;
        B.el.style.setProperty('--k', k.toFixed(3));
      }
    });
    if (active !== railOn) {
      railDots.forEach((d, i) => d.classList.toggle('on', i === active));
      railOn = active;
    }
    const c = Math.round((1 - smoothstep(p, 0.008, 0.035)) * 100) / 100;
    if (c !== cueOp) { cueOp = c; cue.style.opacity = c; }
    if (failed) {   // no film: the still journey ends on the resting machine
      const e = Math.round(smoothstep(p, 0.84, 0.9) * 100) / 100;
      if (e !== endOp) { endOp = e; posterEnd.style.opacity = e; }
    }
  }

  // seeks never overlap: keep only the newest target, one follow-up per completed seek
  let seekBusy = false, pendingTime = null;
  function requestSeek(t) {
    if (!dur()) return;
    if (seekBusy) { pendingTime = t; return; }
    seekBusy = true;
    video.currentTime = t;
  }
  video.addEventListener('seeked', () => {
    seekBusy = false;
    if (pendingTime !== null) { const t = pendingTime; pendingTime = null; requestSeek(t); }
  });
  video.addEventListener('error', () => {
    seekBusy = false; pendingTime = null;
    if (video.getAttribute('src')) failVideo();
  });

  // eased display time, a loop that rests when it arrives
  let target = 0, shown = 0, rafId = null, lastTick = 0, heroOnScreen = true;
  const VIDEO_START = 0.4;   // the clip opens on a quarter second of black; the journey starts just after it
  const seekTo = s => requestSeek(VIDEO_START + s * Math.max(0, dur() - VIDEO_START - 0.04));
  function tick(now) {
    const dt = Math.min(100, now - (lastTick || now));
    lastTick = now;
    const k = 0.14;
    shown += (target - shown) * (1 - Math.pow(1 - k, dt / 16.667));
    if (Math.abs(target - shown) < 0.0005) { shown = target; rafId = null; lastTick = 0; }
    else rafId = requestAnimationFrame(tick);
    seekTo(shown);
    updateCaptions(shown);
  }
  function onScroll() {
    target = heroProgress();
    if (rafId === null && heroOnScreen) rafId = requestAnimationFrame(tick);
  }

  // band one opens already written: a short timed assembly that hands over to scroll
  let loadStart = 0, loadRaf = null;
  function runLoadRamp(now) {
    if (!loadStart) loadStart = now;
    const t = clamp((now - loadStart) / 1700, 0, 1);
    loadK = 1 - Math.pow(1 - t, 3);
    if (scrubOn) updateCaptions(shown);
    loadRaf = t < 1 ? requestAnimationFrame(runLoadRamp) : null;
  }

  let heroInit = false;
  function initHeroOnce() {
    if (heroInit) return;
    heroInit = true;
    posterLayer.style.backgroundImage = `url('${POSTER_URL}')`;
    let started = false;
    const start = () => { if (started) return; started = true; loadHeroBlob().catch(failVideo); };
    const img = new Image();
    img.onload = start;
    img.onerror = start;
    img.src = POSTER_URL;
    setTimeout(start, 4000);
  }
  async function loadHeroBlob() {
    const ctrl = new AbortController();
    const watchdog = setTimeout(() => ctrl.abort(), 20000);
    const res = await fetch(VIDEO_URL, { priority: 'low', signal: ctrl.signal });
    if (!res.ok) throw new Error('video ' + res.status);
    const blob = await res.blob();
    clearTimeout(watchdog);
    video.src = URL.createObjectURL(blob);
    video.load();
    video.addEventListener('canplay', () => {
      seekTo(heroProgress());
      stage.classList.add('video-ready');
    }, { once: true });
  }
  function failVideo() {
    if (failed) return;
    failed = true;
    stage.classList.add('video-failed');
    posterEnd.style.backgroundImage = `url('${ENDING_URL}')`;
    endOp = -1;
    updateCaptions(shown);
  }

  // the static-hero gates: identical strings live in style.css. Phones held upright get the film too:
  // the clip is vertical, small (6.8 MB) and fills a phone screen without cropping
  const GATES = [
    '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
    '(prefers-reduced-motion: reduce)'
  ];
  const MQLS = GATES.map(q => matchMedia(q));
  let scrubOn = false;
  function enableScrub() {
    if (scrubOn) return;
    scrubOn = true;
    measure();
    initHeroOnce();
    addEventListener('scroll', onScroll, { passive: true });
    bands.forEach(B => { B.op = -1; B.k = -1; B.vis = null; });
    railOn = -1; cueOp = -1; endOp = -1;
    shown = target = heroProgress();
    updateCaptions(shown);
    if (loadK < 1 && loadRaf === null) { loadStart = 0; loadRaf = requestAnimationFrame(runLoadRamp); }
    onScroll();
  }
  function disableScrub() {
    if (!scrubOn) return;
    scrubOn = false;
    removeEventListener('scroll', onScroll);
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; lastTick = 0; }
  }
  function applyHeroMode() {
    if (MQLS.some(m => m.matches)) disableScrub();
    else enableScrub();
  }
  MQLS.forEach(m => m.addEventListener('change', applyHeroMode));

  new IntersectionObserver(entries => {
    heroOnScreen = entries[0].isIntersecting;
    if (heroOnScreen && scrubOn) onScroll();
    else if (!heroOnScreen && rafId !== null) { cancelAnimationFrame(rafId); rafId = null; lastTick = 0; }
  }).observe(hero);

  addEventListener('resize', () => { if (scrubOn) { measure(); onScroll(); } }, { passive: true });

  /* ---------- header turns solid once the film is behind you ---------- */
  let solid = null, headRaf = null;
  function headerState() {
    headRaf = null;
    const past = scrubOn ? scrollY > heroTop + heroRange - 10 : scrollY > innerHeight * 0.55;
    if (past !== solid) { solid = past; top.classList.toggle('solid', past); }
  }
  addEventListener('scroll', () => { if (headRaf === null) headRaf = requestAnimationFrame(headerState); }, { passive: true });

  /* ---------- dot lines, drawn on arrival ---------- */
  $$('.dotline').forEach(el => {
    const n = +el.dataset.n || 60;
    const dots = Array.from({ length: n }, (_, i) =>
      `<circle cx="${((i + 0.5) / n * 100).toFixed(3)}%" cy="4" r="1.6" style="--i:${i}"/>`).join('');
    el.insertAdjacentHTML('afterbegin', `<svg aria-hidden="true">${dots}</svg>`);
  });

  /* ---------- dotwork motif and the faq orbit ---------- */
  (() => {
    const svg = $('.m-dots');
    const r = rng(11);
    let out = '';
    for (let ring = 0; ring < 15; ring++) {
      const rad = 6 + ring * 3.6;
      const n = Math.round(2 * Math.PI * rad / 4.6);
      for (let j = 0; j < n; j++) {
        const th = j / n * Math.PI * 2 + (ring % 2 ? Math.PI / n : 0);
        const shade = ring < 4 ? 0.95 : 0.15 + 0.8 * Math.pow(Math.abs(Math.cos(th * 4)), 3) * (1 - ring / 18);
        if (r() > shade && ring !== 14) continue;
        const size = ring === 14 ? 1.1 : 0.7 + (1 - ring / 15) * 0.9;
        out += `<circle cx="${(60 + rad * Math.cos(th)).toFixed(2)}" cy="${(60 + rad * Math.sin(th)).toFixed(2)}" r="${size.toFixed(2)}"/>`;
      }
    }
    svg.innerHTML = out;
    const orbit = $('.faq-orbit');
    let o = '';
    for (let j = 0; j < 36; j++) {
      const th = j / 36 * Math.PI * 2;
      o += `<circle cx="${(60 + 54 * Math.cos(th)).toFixed(2)}" cy="${(60 + 54 * Math.sin(th)).toFixed(2)}" r="${(j % 9 === 0 ? 2.6 : 1.3)}"/>`;
    }
    for (let j = 0; j < 18; j++) {
      const th = j / 18 * Math.PI * 2 + 0.17;
      o += `<circle cx="${(60 + 30 * Math.cos(th)).toFixed(2)}" cy="${(60 + 30 * Math.sin(th)).toFixed(2)}" r="1.1"/>`;
    }
    orbit.innerHTML = o + '<circle cx="60" cy="60" r="3"/>';
  })();

  // self-drawing strokes know their own length
  $$('.draw path').forEach(p => { try { p.style.setProperty('--len', Math.ceil(p.getTotalLength()) + 1); } catch { /* not rendered */ } });

  /* ---------- entrances and section life ---------- */
  $$('.reveal').forEach(sec => $$('.part', sec).forEach((p, i) => { if (!p.style.getPropertyValue('--d')) p.style.setProperty('--d', Math.min(i, 8)); }));
  const revealIO = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    el.classList.add('in');
    revealIO.unobserve(el);
    if (el.classList.contains('reveal')) {
      const n = $$('.part', el).length;
      setTimeout(() => el.classList.add('done'), Math.min(n, 8) * 90 + 1100);
    }
  }), { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
  $$('.reveal, .dotline').forEach(el => revealIO.observe(el));

  const liveIO = new IntersectionObserver(entries => entries.forEach(e => e.target.classList.toggle('live', e.isIntersecting)), { rootMargin: '10% 0px' });
  $$('[data-live]').forEach(el => liveIO.observe(el));

  document.addEventListener('visibilitychange', () => document.body.classList.toggle('paused', document.hidden));

  /* ---------- the sleeve clip: plays only when the visitor asks ---------- */
  const reel = $('.reel');
  const reelVideo = $('.reel-video', reel);
  const playBtn = $('.play', reel);
  function syncReel() {
    const on = !reelVideo.paused;
    reel.classList.toggle('playing', on);
    playBtn.setAttribute('aria-pressed', String(on));
    playBtn.setAttribute('aria-label', tr(on ? 'work.pause' : 'work.play'));
  }
  function toggleReel() {
    if (reelVideo.paused) {
      if (!reelVideo.getAttribute('src')) reelVideo.src = reelVideo.dataset.src;
      reelVideo.play().catch(() => { /* blocked or not loaded: stays paused */ });
    } else reelVideo.pause();
  }
  playBtn.addEventListener('click', toggleReel);
  $('.frame', reel).addEventListener('click', toggleReel);
  reelVideo.addEventListener('play', syncReel);
  reelVideo.addEventListener('pause', syncReel);
  new IntersectionObserver(es => { if (!es[0].isIntersecting && !reelVideo.paused) reelVideo.pause(); }).observe(reel);
  document.addEventListener('visibilitychange', () => { if (document.hidden && !reelVideo.paused) reelVideo.pause(); });

  /* ---------- the final call: the ink film moves with the scroll ---------- */
  const FIN_URL = 'assets/final-ink.mp4';
  const fin = $('#book');
  const finVideo = $('.final-video', fin);
  let finTarget = 0, finShown = 0, finRaf = null, finLast = 0, finOn = false, finLoad = null;
  let finBusy = false, finPending = null;
  const finDur = () => (finVideo.duration && isFinite(finVideo.duration) ? finVideo.duration : 0);
  // 0 when the section starts to come up the screen, 1 when its pinned stage lets go at the bottom
  const finProgress = () => { const r = fin.getBoundingClientRect(); return clamp((innerHeight - r.top) / r.height, 0, 1); };
  function finSeek(t) {
    if (!finDur()) return;
    if (finBusy) { finPending = t; return; }
    finBusy = true;
    finVideo.currentTime = t;
  }
  finVideo.addEventListener('seeked', () => {
    finBusy = false;
    if (finPending !== null) { const t = finPending; finPending = null; finSeek(t); }
  });
  finVideo.addEventListener('error', () => { finBusy = false; finPending = null; fin.classList.remove('film-ready'); });
  function finTick(now) {
    const dt = Math.min(100, now - (finLast || now));
    finLast = now;
    finShown += (finTarget - finShown) * (1 - Math.pow(1 - 0.14, dt / 16.667));
    if (Math.abs(finTarget - finShown) < 0.0005) { finShown = finTarget; finRaf = null; finLast = 0; }
    else finRaf = requestAnimationFrame(finTick);
    finSeek(finShown * Math.max(0, finDur() - 0.04));
  }
  function finScroll() {
    if (!finOn || RM.matches) return;
    finTarget = finProgress();
    if (finRaf === null) finRaf = requestAnimationFrame(finTick);
  }
  function loadFin() {
    if (finLoad) return;
    finLoad = (async () => {
      const ctrl = new AbortController();
      const watchdog = setTimeout(() => ctrl.abort(), 20000);
      const res = await fetch(FIN_URL, { priority: 'low', signal: ctrl.signal });
      if (!res.ok) throw new Error('final film ' + res.status);
      const blob = await res.blob();
      clearTimeout(watchdog);
      finVideo.src = URL.createObjectURL(blob);
      finVideo.load();
      finVideo.addEventListener('canplay', () => {
        finShown = finTarget = finProgress();
        finSeek(finShown * Math.max(0, finDur() - 0.04));
        fin.classList.add('film-ready');
      }, { once: true });
    })().catch(() => { /* no film: the still ink picture stays, the section is complete */ });
  }
  new IntersectionObserver(entries => {
    finOn = entries[0].isIntersecting;
    if (finOn && !RM.matches) { loadFin(); finScroll(); }
    else if (!finOn && finRaf !== null) { cancelAnimationFrame(finRaf); finRaf = null; finLast = 0; }
  }, { rootMargin: '100% 0px' }).observe(fin);
  addEventListener('scroll', finScroll, { passive: true });

  /* ---------- the hold moment: a dotwork mandala, one dot at a time ---------- */
  const trySec = $('#try');
  const cv = $('.stipple', trySec);
  const holdBtn = $('.hold', trySec);
  const ctx = cv.getContext('2d');
  const DOTS = (() => {
    const r = rng(2026);
    const pts = [];
    for (let ring = 0; ring < 30; ring++) {
      const rad = 0.03 + ring * 0.031;
      const n = Math.max(6, Math.round(2 * Math.PI * rad / 0.028));
      for (let j = 0; j < n; j++) {
        const th = j / n * Math.PI * 2 + (ring % 2 ? Math.PI / n : 0);
        let dens;
        if (rad < 0.16) dens = 0.95;
        else if (rad < 0.52) dens = 0.08 + 0.9 * Math.pow(Math.abs(Math.cos(th * 4)), 2.2) * (1 - (rad - 0.16) * 0.9);
        else if (rad < 0.6) dens = 0.92;
        else if (rad < 0.86) dens = 0.06 + 0.88 * Math.pow(Math.abs(Math.cos(th * 8 + 0.4)), 6);
        else dens = rad < 0.93 ? 0.2 : 0.95;
        if (r() > dens) continue;
        const size = rad < 0.16 ? 0.0105 : rad > 0.9 ? 0.006 : 0.0085 - rad * 0.003 + r() * 0.002;
        pts.push({ x: rad * Math.cos(th), y: rad * Math.sin(th), s: size, o: rad + r() * 0.08 });
      }
    }
    return pts.sort((a, b) => a.o - b.o);
  })();

  let holdP = 0, holding = false, holdDone = false, pinnedDone = false, holdRaf = null, holdLast = 0, drawnCount = -1, fillP = -1;
  function sizeCanvas() {
    const css = cv.getBoundingClientRect().width || 380;
    const px = Math.round(css * Math.min(devicePixelRatio || 1, 2));
    if (cv.width !== px) { cv.width = px; cv.height = px; drawnCount = -1; }
    drawStipple();
  }
  function drawStipple() {
    const count = Math.round(holdP * DOTS.length);
    if (count === drawnCount) return;
    drawnCount = count;
    const W = cv.width, R = W * 0.47;
    ctx.clearRect(0, 0, W, W);
    // the stencil: every dot to come, faint, like a transfer on skin
    ctx.fillStyle = 'rgba(162,168,172,.16)';
    ctx.beginPath();
    for (let i = count; i < DOTS.length; i++) {
      const d = DOTS[i];
      const x = W / 2 + d.x * R, y = W / 2 + d.y * R, s = d.s * W * 0.55;
      ctx.moveTo(x + s, y);
      ctx.arc(x, y, s, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.fillStyle = '#E9E7E1';
    ctx.beginPath();
    for (let i = 0; i < count; i++) {
      const d = DOTS[i];
      const grow = Math.min(1, (count - i) / 24);
      const x = W / 2 + d.x * R, y = W / 2 + d.y * R;
      ctx.moveTo(x + d.s * W * grow, y);
      ctx.arc(x, y, d.s * W * grow, 0, Math.PI * 2);
    }
    ctx.fill();
    if (count === DOTS.length) {
      ctx.fillStyle = '#5FD0EE';
      ctx.beginPath();
      ctx.arc(W / 2, W / 2, W * 0.016, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  function setFill() {
    const v = Math.round(holdP * 200) / 200;
    if (v !== fillP) { fillP = v; holdBtn.style.setProperty('--p', v); }
  }
  function holdTick(now) {
    const dt = Math.min(100, now - (holdLast || now));
    holdLast = now;
    if (holding && !holdDone) holdP = Math.min(1, holdP + dt / 2600);
    else if (!holdDone) holdP = Math.max(0, holdP - (dt / 1400) * (0.35 + holdP));   // eases back, never snaps
    drawStipple();
    setFill();
    if (holdP >= 1 && !holdDone) finishHold(false);
    if (holdDone || (!holding && holdP === 0)) { holdRaf = null; holdLast = 0; return; }
    holdRaf = requestAnimationFrame(holdTick);
  }
  function finishHold(pinned) {
    holdDone = true;
    pinnedDone = pinned;
    holdP = 1;
    holding = false;
    drawStipple();
    setFill();
    trySec.classList.add('drawn');
  }
  function startHold(e) {
    if (holdDone) return;
    if (e && e.type === 'pointerdown') { e.preventDefault(); try { holdBtn.setPointerCapture(e.pointerId); } catch { /* old browser */ } }
    holding = true;
    if (holdRaf === null) holdRaf = requestAnimationFrame(holdTick);
  }
  function endHold() {
    holding = false;
    if (holdRaf === null && !holdDone && holdP > 0) holdRaf = requestAnimationFrame(holdTick);
  }
  holdBtn.addEventListener('pointerdown', startHold);
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(t => holdBtn.addEventListener(t, endHold));
  holdBtn.addEventListener('contextmenu', e => e.preventDefault());
  holdBtn.addEventListener('keydown', e => {
    if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); startHold(); }
  });
  holdBtn.addEventListener('keyup', e => { if (e.key === ' ' || e.key === 'Enter') endHold(); });
  holdBtn.addEventListener('blur', endHold);
  addEventListener('resize', sizeCanvas, { passive: true });

  /* ---------- reduced motion, live in both directions ---------- */
  function pinToFinalStates() {
    if (holdRaf !== null) { cancelAnimationFrame(holdRaf); holdRaf = null; }
    if (finRaf !== null) { cancelAnimationFrame(finRaf); finRaf = null; finLast = 0; }
    if (!holdDone) finishHold(true);
    $$('.reveal, .dotline').forEach(el => el.classList.add('in', 'done'));
  }
  function unpinFinalStates() {
    if (pinnedDone) {
      holdDone = false; pinnedDone = false; holdP = 0; drawnCount = -1;
      trySec.classList.remove('drawn');
      drawStipple();
      setFill();
    }
  }
  RM.addEventListener('change', e => {
    if (e.matches) pinToFinalStates();
    else { unpinFinalStates(); applyHeroMode(); if (finOn) { loadFin(); finScroll(); } }
  });

  /* ---------- start ---------- */
  const saved = store.get('lang');
  applyLang(saved || ((navigator.language || '').toLowerCase().startsWith('el') ? 'el' : 'en'));
  sizeCanvas();
  if (RM.matches) pinToFinalStates();
  applyHeroMode();
  headerState();
  // Design it (assets/ink.js): loads only when its section scrolls near.
  (function () {
    var sec = document.getElementById('design'); if (!sec) return
    var load = function () { var sc = document.createElement('script'); sc.src = 'assets/ink.js'; document.body.appendChild(sc) }
    if (!('IntersectionObserver' in window)) return load()
    var io2 = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io2.disconnect(); load() } }, { rootMargin: '600px 0px' })
    io2.observe(sec)
  })();
})();
