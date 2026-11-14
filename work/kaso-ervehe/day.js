/* A day in Përmet. The real sun over Përmet (40.233° N, 20.350° E) is worked out live; drag it across the valley
   and the light changes, while the plan shows what to do at that hour. Every place, tip and time comes from this
   site (Around Përmet, The hotel, the FAQ and the stay facts). This file sits outside the React root: it waits for
   hydration, then adds its section after "Around Përmet", so React's markup is never touched before it hydrates.
   It follows the site's EN/SQ switch through the <html lang> attribute that the app sets. */
(function () {
  'use strict'
  if (document.getElementById('permet-day')) return
  var LAT = 40.232966, LNG = 20.350347, TZ = 'Europe/Tirane'
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

  // ---- Words (EN, and SQ in the site's own phrasing where the site has it) ----
  var TX = {
    en: {
      nav: 'Your day', title: 'A day in Përmet', lead: 'Scroll down and the sun crosses the valley. The light follows the real sun over Përmet, and the plan shows what to do at each hour.',
      canvas: 'The Përmet valley from the hotel garden, lit for the time of day as you scroll', time: 'Time of day',
      rise: 'Sunrise', set: 'Sunset', light: 'Daylight', hours: function (h, m) { return h + ' h ' + m + ' min' },
      today: 'Today', seasons: ['Spring', 'Summer', 'Autumn', 'Winter'], play: 'Play the day', pause: 'Pause',
      laneIn: 'At the hotel', laneOut: 'Around Përmet', now: 'Now',
      phase: { night: 'Night', dawn: 'Dawn', early: 'First light', morning: 'Morning', midday: 'Midday', afternoon: 'Afternoon', golden: 'Golden hour', sunset: 'Sunset', dusk: 'Dusk' },
      maps: 'Open in Google Maps', check: 'Check your dates', chat: 'Chat on WhatsApp', dinnerAsk: 'Ask for dinner on WhatsApp',
      waText: 'Hello Hotel Kaso Ervehe, I would like to ask about a stay.', dinnerText: 'Hello Hotel Kaso Ervehe, we would like to book a traditional dinner during our stay.',
      rafting: 'Rafting runs from spring to autumn.', offSeason: 'Rafting runs from spring to autumn, so not on this date.',
      atSunset: function (t) { return 'At sunset, ' + t }, atDusk: 'At dusk', evening: 'In the evening', morning: 'In the morning', midday: 'Around midday', afternoon: 'In the afternoon',
      items: {
        breakfast: ['Breakfast included', 'Local cheese, fruit, juice and pancakes.', ''],
        benja: ['Bënja thermal baths', 'Warm sulphur pools below the old stone Kadiut bridge.', 'Go before 10 a.m. for quiet pools.', '20 min by car'],
        canyon: ['Langarica canyon', 'Walk or wade up the gorge.', 'Wear water shoes: you wade the river.', 'From Bënja'],
        checkout: ['Check-out', 'Check-out is by 11:00.', '', 'By 11:00'],
        vjosa: ['The Vjosa', 'Rafting and swimming in Europe’s first wild river national park.', 'Rafting: spring to autumn, book ahead.', 'In town'],
        checkin: ['Check-in', 'Check-in is from 14:00 to 21:30.', '', '14:00 to 21:30'],
        hotova: ['Hotova Fir National Park', 'Old fir forest above the valley.', 'Bring a warm layer, even in August.', '17 km'],
        guri: ['Guri i Qytetit', 'The great rock in the centre of town.', 'Climb the steps at sunset.', '5 min on foot'],
        town: ['Përmet', 'The city of roses, on the Vjosa between the mountains.', 'Walk the river at dusk; try the gliko.', 'In town'],
        dinner: ['Traditional dinner', 'The restaurant cooks traditional dishes from the valley. Ask at reception or send us a WhatsApp message earlier in the day, so the kitchen can prepare.', '', 'Restaurant'],
        fire: ['The garden and the bar', 'A sun terrace and an outdoor fireplace. Live music on some evenings.', '', 'Garden and terrace'],
        late: ['Arriving after 21:30?', 'Tell us your arrival time in advance by WhatsApp or phone, and we will arrange your check-in.', '', 'After 21:30']
      }
    },
    sq: {
      nav: 'Dita juaj', title: 'Një ditë në Përmet', lead: 'Rrëshqitni poshtë dhe dielli kalon luginën. Drita ndjek diellin e vërtetë mbi Përmet, dhe plani tregon çfarë të bëni në çdo orë.',
      canvas: 'Lugina e Përmetit nga kopshti i hotelit, e ndriçuar sipas orës së ditës ndërsa rrëshqitni', time: 'Ora e ditës',
      rise: 'Lindja e diellit', set: 'Perëndimi', light: 'Dritë dite', hours: function (h, m) { return h + ' orë ' + m + ' min' },
      today: 'Sot', seasons: ['Pranverë', 'Verë', 'Vjeshtë', 'Dimër'], play: 'Shihni ditën', pause: 'Ndal',
      laneIn: 'Te hoteli', laneOut: 'Rreth Përmetit', now: 'Tani',
      phase: { night: 'Natë', dawn: 'Agim', early: 'Drita e parë', morning: 'Paradite', midday: 'Mesditë', afternoon: 'Pasdite', golden: 'Ora e artë', sunset: 'Perëndim', dusk: 'Muzg' },
      maps: 'Hapeni në Google Maps', check: 'Kontrolloni datat', chat: 'Shkruani në WhatsApp', dinnerAsk: 'Kërkoni darkë në WhatsApp',
      waText: 'Përshëndetje Hotel Kaso Ervehe, dua të pyes për një qëndrim.', dinnerText: 'Përshëndetje Hotel Kaso Ervehe, do të donim të rezervonim një darkë tradicionale gjatë qëndrimit tonë.',
      rafting: 'Raftingu bëhet nga pranvera në vjeshtë.', offSeason: 'Raftingu bëhet nga pranvera në vjeshtë, jo në këtë datë.',
      atSunset: function (t) { return 'Në perëndim, ' + t }, atDusk: 'Në muzg', evening: 'Në mbrëmje', morning: 'Në mëngjes', midday: 'Rreth mesditës', afternoon: 'Pasdite',
      items: {
        breakfast: ['Mëngjesi i përfshirë', 'Djathë vendi, fruta, lëng dhe petulla.', ''],
        benja: ['Banjat e Bënjës', 'Pishina të ngrohta squfuri nën urën e vjetër të Kadiut.', 'Shkoni para orës 10, për pishina të qeta.', '20 min me makinë'],
        canyon: ['Kanioni i Langaricës', 'Ecni ose kaloni nëpër ujë përgjatë grykës.', 'Mbani këpucë uji: kaloni nëpër lumë.', 'Nga Bënja'],
        checkout: ['Largimi', 'Largimi bëhet deri në orën 11:00.', '', 'Deri në 11:00'],
        vjosa: ['Vjosa', 'Rafting dhe not në parkun e parë kombëtar të një lumi të egër në Evropë.', 'Rafting: nga pranvera në vjeshtë, rezervoni më parë.', 'Në qytet'],
        checkin: ['Hyrja', 'Hyrja bëhet nga ora 14:00 deri në 21:30.', '', '14:00 deri në 21:30'],
        hotova: ['Parku Kombëtar Bredhi i Hotovës', 'Pyll i vjetër bredhi mbi luginë.', 'Merrni një xhaketë, edhe në gusht.', '17 km'],
        guri: ['Guri i Qytetit', 'Shkëmbi i madh në qendër të qytetit.', 'Ngjituni shkallëve në perëndim, për pamjen.', '5 min në këmbë'],
        town: ['Përmeti', 'Qyteti i trëndafilave, mbi Vjosë, mes maleve.', 'Shëtisni buzë lumit në mbrëmje dhe provoni glikon.', 'Në qytet'],
        dinner: ['Darkë tradicionale', 'Restoranti gatuan pjata tradicionale të luginës. Pyesni në recepsion ose na shkruani në WhatsApp më herët gjatë ditës, që kuzhina të përgatitet.', '', 'Restoranti'],
        fire: ['Kopshti dhe bari', 'Tarracë me diell dhe vatër zjarri në oborr. Muzikë live në disa mbrëmje.', '', 'Kopshti dhe tarraca'],
        late: ['Pas orës 21:30?', 'Na tregoni orën e mbërritjes paraprakisht me WhatsApp ose në telefon dhe do ta rregullojmë hyrjen tuaj.', '', 'Pas orës 21:30']
      }
    }
  }
  var MAPS = { benja: 'Banjat e Bënjës, Përmet', canyon: 'Kanioni i Langaricës, Përmet', vjosa: 'Lumi Vjosa, Përmet', hotova: 'Parku Kombëtar Bredhi i Hotovës', guri: 'Guri i Qytetit, Përmet', town: 'Përmet, Albania' }
  function lang() { return document.documentElement.lang === 'sq' ? 'sq' : 'en' }

  // ---- Time and the sun ----
  var fmtParts = null
  try { fmtParts = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }) } catch (e) {}
  function parts(ms) {
    if (fmtParts) { var p = {}; fmtParts.formatToParts(new Date(ms)).forEach(function (x) { p[x.type] = x.value }); return { y: +p.year, m: +p.month, d: +p.day, h: +p.hour % 24, mi: +p.minute, s: +p.second } }
    var mo = new Date(ms).getUTCMonth(), d = new Date(ms + (mo >= 3 && mo <= 9 ? 120 : 60) * 60000)
    return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate(), h: d.getUTCHours(), mi: d.getUTCMinutes(), s: d.getUTCSeconds() }
  }
  function tzOff(ms) { var p = parts(ms); return Math.round((Date.UTC(p.y, p.m - 1, p.d, p.h, p.mi, p.s) - ms) / 60000) }
  var RAD = Math.PI / 180
  function sun(ms) {
    var d = ms / 86400000 - 0.5 + 2440588 - 2451545
    var M = RAD * (357.5291 + 0.98560028 * d), C = RAD * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M))
    var Ls = M + C + RAD * 102.9372 + Math.PI, e = RAD * 23.4397
    var dec = Math.asin(Math.sin(e) * Math.sin(Ls)), ra = Math.atan2(Math.sin(Ls) * Math.cos(e), Math.cos(Ls))
    var H = RAD * (280.16 + 360.9856235 * d) + LNG * RAD - ra, phi = LAT * RAD
    return Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H)) / RAD
  }
  function hhmm(min) { min = Math.round(min); var h = Math.floor(min / 60) % 24, m = ((min % 60) + 60) % 60; return ('0' + h).slice(-2) + ':' + ('0' + m).slice(-2) }

  // ---- Build once React has hydrated ----
  // Providers.tsx sets data-hydrated on <html> once React has taken over the page.
  function hydrated() { return document.documentElement.getAttribute('data-hydrated') === 'true' }
  var tries = 0
  ;(function wait() { if (hydrated() || tries++ > 60) build(); else setTimeout(wait, 120) })()

  function build() {
    if (document.getElementById('permet-day')) return
    var main = document.getElementById('main'); if (!main) return
    var sec = document.createElement('section')
    sec.className = 'section pd-sec'; sec.id = 'permet-day'; sec.setAttribute('aria-labelledby', 'pd-title'); sec.setAttribute('data-tone', 'forest')
    sec.innerHTML =
      '<div class="container">' +
        '<div class="head-split"><h2 id="pd-title" data-pd="title"></h2><p class="lead" data-pd="lead"></p></div>' +
        '<div class="pd">' +
          '<div class="pd__stage" id="pd-stage"><canvas id="pd-canvas" role="img"></canvas>' +
            '<p class="pd__clock clear"><b id="pd-clock">08:00</b><span id="pd-phase"></span></p>' +
            '<p class="pd__sun clear" id="pd-sun"></p></div>' +
          '<div class="pd__scrub"><input type="range" id="pd-range" min="0" max="1000" step="1" value="300" tabindex="-1" aria-hidden="true"><div class="pd__hours" id="pd-hours" aria-hidden="true"></div></div>' +
          '<div class="pd__lanes" id="pd-lanes"></div>' +
          '<div class="pd__foot">' +
            '<article class="pd__card clear" id="pd-card" aria-live="polite"></article>' +
          '</div>' +
        '</div>' +
      '</div>'
    var after = document.getElementById('around'), before = document.getElementById('getting-here')
    if (after && after.parentNode === main) main.insertBefore(sec, after.nextSibling)
    else if (before && before.parentNode === main) main.insertBefore(sec, before)
    else main.appendChild(sec)
    document.querySelectorAll('.nav__links, .nav__menu ul').forEach(function (ul) {
      if (ul.querySelector('a[href="#permet-day"]')) return
      var li = document.createElement('li'), a = document.createElement('a')
      a.href = '#permet-day'; a.setAttribute('data-pd', 'nav'); li.appendChild(a)
      var ref = ul.querySelector('a[href="#around"]')
      if (ref && ref.parentNode.nextSibling) ul.insertBefore(li, ref.parentNode.nextSibling); else ul.appendChild(li)
    })
    words()
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); init(sec) } }, { rootMargin: '400px 0px' })
      io.observe(sec)
    } else init(sec)
    new MutationObserver(function () { words(); if (window.__pdRelang) window.__pdRelang() }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] })
  }
  function words() {
    var w = TX[lang()]
    document.querySelectorAll('[data-pd]').forEach(function (el) { var k = el.getAttribute('data-pd'); if (w[k]) el.textContent = w[k] })
    var cv = document.getElementById('pd-canvas'); if (cv) cv.setAttribute('aria-label', w.canvas)
    var r = document.getElementById('pd-range'); if (r) r.setAttribute('aria-label', w.time)
  }

  // ---- The piece ----
  function init(sec) {
    function $(id) { return document.getElementById(id) }
    var stage = $('pd-stage'), cv = $('pd-canvas'), ctx = cv.getContext('2d')
    var range = $('pd-range'), hoursEl = $('pd-hours'), lanesEl = $('pd-lanes'), card = $('pd-card')
    var elClock = $('pd-clock'), elPhase = $('pd-phase'), elSun = $('pd-sun')
    var wa = (function () { var a = document.querySelector('a[href*="wa.me/"]'); var m = a && /wa\.me\/(\d+)/.exec(a.getAttribute('href')); return m ? m[1] : '355693295827' })()

    var day = null, min = 480, picked = null, cw = 1, ch = 1, dpr = 1, T = 0
    var ITEMS = []

    function clamp(v, a, b) { return v < a ? a : v > b ? b : v }
    function setDay(y, m, d, keepMin) {
      var noonUTC = Date.UTC(y, m - 1, d, 12) , off = tzOff(noonUTC), base = Date.UTC(y, m - 1, d) - off * 60000
      var alt = new Float32Array(1441)
      for (var i = 0; i <= 1440; i++) alt[i] = sun(base + i * 60000)
      function cross(a, b, up) { for (var i = a + 1; i <= b; i++) { var p = alt[i - 1], q = alt[i]; if (up ? (p < -0.833 && q >= -0.833) : (p >= -0.833 && q < -0.833)) return i - 1 + (p + 0.833) / (p - q) } return up ? 360 : 1080 }
      var R = cross(0, 720, true), S = cross(720, 1440, false), peak = 0
      for (i = 0; i <= 1440; i++) peak = Math.max(peak, alt[i])
      var start = Math.min(360, Math.floor((R - 40) / 30) * 30)
      day = { y: y, m: m, d: d, base: base, alt: alt, R: R, S: S, peak: peak, start: start, end: 1410 }
      buildItems()
      if (!keepMin) min = clamp(min, day.start, day.end)
      else min = clamp(keepMin, day.start, day.end)
      hours(); lanes(); update(true)
    }
    function altAt(m) { var i = Math.floor(clamp(m, 0, 1439)), f = m - i; return day.alt[i] + (day.alt[i + 1] - day.alt[i]) * f }

    function buildItems() {
      var R = day.R, S = day.S
      var raft = day.m >= 3 && day.m <= 11
      ITEMS = [
        { id: 'breakfast', lane: 'in', a: Math.max(R, 420), b: 630, place: 'hotel', when: 'morning', cta: 'check' },
        { id: 'checkout', lane: 'in', a: 630, b: 660, place: 'gate', when: 'fixed', cta: 'check' },
        { id: 'checkin', lane: 'in', a: 840, b: 900, place: 'gate', when: 'fixed', cta: 'check' },
        { id: 'dinner', lane: 'in', a: Math.min(S + 45, 1200), b: Math.min(S + 165, 1290), place: 'table', when: 'evening', cta: 'dinner' },
        { id: 'fire', lane: 'in', a: Math.min(S + 165, 1290), b: 1410, place: 'fire', when: 'evening', cta: 'check' },
        { id: 'late', lane: 'in', a: 1290, b: 1350, place: 'gate', when: 'fixed', cta: 'chat' },
        { id: 'benja', lane: 'out', a: Math.max(R + 30, 450), b: 600, place: 'benja', when: 'fixed', cta: 'maps' },
        { id: 'canyon', lane: 'out', a: 600, b: 720, place: 'benja', when: 'midday', cta: 'maps' },
        { id: 'vjosa', lane: 'out', a: 720, b: Math.max(780, S - 150), place: 'vjosa', when: 'afternoon', cta: 'maps', raft: raft },
        { id: 'hotova', lane: 'out', a: Math.max(780, S - 150), b: S - 50, place: 'hotova', when: 'afternoon', cta: 'maps' },
        { id: 'guri', lane: 'out', a: S - 50, b: S, place: 'guri', when: 'sunset', cta: 'maps' },
        { id: 'town', lane: 'out', a: S, b: S + 45, place: 'town', when: 'dusk', cta: 'maps' }
      ]
    }
    function pctOf(m) { return ((m - day.start) / (day.end - day.start) * 100) }
    function hours() {
      var h = ''
      for (var m = Math.ceil(day.start / 120) * 120; m <= day.end; m += 120) h += '<span style="left:' + pctOf(m).toFixed(2) + '%">' + hhmm(m) + '</span>'
      hoursEl.innerHTML = h
    }
    function lanes() {
      var w = TX[lang()], html = ''
      ;['in', 'out'].forEach(function (ln) {
        var list = ITEMS.filter(function (it) { return it.lane === ln }).sort(function (a, b) { return a.a - b.a })
        var rows = [], trackW = Math.max(300, lanesEl.clientWidth || 1000), span = day.end - day.start
        if (trackW < 760 && matchMedia('(max-width: 40rem)').matches) trackW = 760
        list.forEach(function (it) {
          // a chip is at least as wide as its label, so rows are planned on that width
          var px = 30 + 40 + w.items[it.id][0].length * 6.6
          it.vEnd = Math.max(it.b, it.a + px / trackW * span)
          var r = 0; while (rows[r] !== undefined && rows[r] > it.a + 1) r++; rows[r] = it.vEnd; it.row = r
        })
        html += '<div class="pd__lane" style="--rows:' + rows.length + '"><p class="pd__lane-name">' + (ln === 'in' ? w.laneIn : w.laneOut) + '</p><div class="pd__lane-track">'
        list.forEach(function (it) {
          var a = pctOf(it.a), b = pctOf(it.vEnd)
          html += '<button type="button" class="pd__item" tabindex="-1" data-item="' + it.id + '" title="' + w.items[it.id][0] + '" style="--a:' + Math.min(a, 100 - (b - a)).toFixed(2) + '%;--w:' + (b - a).toFixed(2) + '%;--r:' + it.row + '" aria-pressed="false"><span class="pd__item-time">' + hhmm(it.a) + '</span><span class="pd__item-name">' + w.items[it.id][0] + '</span></button>'
        })
        html += '</div></div>'
      })
      lanesEl.innerHTML = html
    }
    // ---- Light ----
    var KEYS = [
      [40, [112, 150, 186], [206, 220, 222], [128, 150, 170], [70, 96, 82], [150, 160, 110], [238, 234, 222], [255, 246, 222], 0.16],
      [15, [116, 146, 178], [222, 220, 200], [134, 146, 160], [74, 92, 76], [156, 150, 104], [240, 224, 198], [255, 232, 186], 0.28],
      [5, [122, 128, 158], [238, 196, 134], [146, 130, 140], [80, 80, 70], [150, 124, 88], [240, 198, 152], [255, 206, 124], 0.48],
      [0, [96, 98, 136], [232, 148, 96], [126, 104, 120], [66, 62, 64], [118, 92, 74], [214, 156, 118], [255, 160, 96], 0.6],
      [-4, [62, 68, 108], [170, 110, 112], [86, 78, 104], [44, 44, 56], [70, 62, 64], [140, 118, 118], [220, 120, 110], 0.32],
      [-8, [28, 36, 66], [62, 64, 98], [44, 48, 72], [26, 30, 42], [36, 38, 46], [72, 74, 92], [100, 96, 140], 0.1],
      [-14, [10, 14, 30], [24, 28, 48], [20, 24, 38], [12, 16, 24], [16, 20, 26], [42, 44, 58], [40, 40, 60], 0]
    ]
    function light(alt) {
      var a, b, last = KEYS[KEYS.length - 1]
      if (alt >= KEYS[0][0]) a = b = KEYS[0]
      else if (alt <= last[0]) a = b = last
      else for (var i = 1; i < KEYS.length; i++) if (alt >= KEYS[i][0]) { a = KEYS[i - 1]; b = KEYS[i]; break }
      var k = a === b ? 0 : (a[0] - alt) / (a[0] - b[0])
      function m(i) { return [a[i][0] + (b[i][0] - a[i][0]) * k, a[i][1] + (b[i][1] - a[i][1]) * k, a[i][2] + (b[i][2] - a[i][2]) * k] }
      return { top: m(1), hor: m(2), far: m(3), mid: m(4), valley: m(5), fg: m(6), glow: m(7), ga: a[8] + (b[8] - a[8]) * k }
    }
    function rgba(c, a) { return 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + (a === undefined ? 1 : +a.toFixed(3)) + ')' }
    function mix(a, b, k) { return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k] }
    function mul(a, b) { return [a[0] * b[0] / 255, a[1] * b[1] / 255, a[2] * b[2] / 255] }
    function hash(n) { var x = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x) }

    // ---- Scene ----
    function hz() { return ch * 0.64 }
    function sunXY(m) {
      // the sun sets behind the far ridge, so its horizon sits at the mountain tops
      var tx = (m - day.R) / (day.S - day.R), alt = altAt(m), top = ch * 0.07, sh = ch * 0.41
      return { x: cw * (0.08 + 0.84 * tx), y: sh - alt * (sh - top) / Math.max(25, day.peak), alt: alt }
    }
    function ridge(y0, amp, seed, x) { return y0 - amp * (0.55 * Math.sin(x * 0.006 + seed) + 0.3 * Math.sin(x * 0.017 + seed * 2.1) + 0.15 * Math.sin(x * 0.041 + seed * 3.3)) }
    function fillRidge(y0, amp, seed, col, scale) {
      ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, ch)
      for (var x = 0; x <= cw + 8; x += 8) ctx.lineTo(x, ridge(y0, amp, seed, x / scale))
      ctx.lineTo(cw, ch); ctx.closePath(); ctx.fill()
    }
    var P = {}
    function draw() {
      var s = sunXY(min), L = light(s.alt), H0 = hz(), sc = cw / 1200, night = clamp((-s.alt - 2) / 8, 0, 1)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      var g = ctx.createLinearGradient(0, 0, 0, H0)
      g.addColorStop(0, rgba(L.top)); g.addColorStop(0.7, rgba(mix(L.top, L.hor, 0.6))); g.addColorStop(1, rgba(L.hor))
      ctx.fillStyle = g; ctx.fillRect(0, 0, cw, H0 + 2)
      if (night > 0) for (var i = 0; i < 90; i++) {
        ctx.fillStyle = 'rgba(240,238,226,' + (night * (reduce ? 0.7 : 0.45 + 0.4 * Math.sin(T * 1.8 + i * 5.1)) * (0.3 + 0.7 * hash(i * 2.7))).toFixed(3) + ')'
        ctx.fillRect(hash(i) * cw, hash(i + 40) * H0 * 0.7, 1.4, 1.4)
      }
      // sun and glow (before the mountains, so the ridges hide it when it is low)
      var gy = Math.min(s.y, ch * 0.41), gr = cw * 0.35
      var gg = ctx.createRadialGradient(s.x, gy, 0, s.x, gy, gr)
      gg.addColorStop(0, rgba(L.glow, L.ga)); gg.addColorStop(0.4, rgba(L.glow, L.ga * 0.35)); gg.addColorStop(1, rgba(L.glow, 0))
      ctx.fillStyle = gg; ctx.fillRect(0, 0, cw, H0 + 2)
      if (s.alt > -1.5) {
        var r = Math.max(8, cw * 0.012), low = clamp(1 - s.alt / 10, 0, 1), col = mix([255, 250, 234], [255, 140, 76], Math.pow(low, 1.6))
        var halo = ctx.createRadialGradient(s.x, s.y, r * 0.6, s.x, s.y, r * 4.5)
        halo.addColorStop(0, rgba(col, 0.5)); halo.addColorStop(1, rgba(col, 0))
        ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(s.x, s.y, r * 4.5, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = rgba(col); ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, Math.PI * 2); ctx.fill()
      }
      // far mountains, then the fir-forested range
      fillRidge(ch * 0.42, ch * 0.1, 1.3, rgba(mix(L.far, L.hor, 0.25)), sc)
      fillRidge(ch * 0.53, ch * 0.09, 4.1, rgba(L.mid), sc)
      // firs on the left slopes (Hotova's fir forest sits above the valley)
      ctx.fillStyle = rgba(mix(L.mid, [10, 24, 16], 0.35))
      for (i = 0; i < 70; i++) {
        var fx = hash(i * 3.3) * cw * 0.45, fy = ridge(ch * 0.53, ch * 0.09, 4.1, fx / sc) + 6 + hash(i * 1.7) * ch * 0.07, fh = (8 + hash(i) * 8) * sc * 1.4
        ctx.beginPath(); ctx.moveTo(fx, fy - fh); ctx.lineTo(fx - fh * 0.32, fy); ctx.lineTo(fx + fh * 0.32, fy); ctx.fill()
      }
      P.hotova = [cw * 0.2, ridge(ch * 0.53, ch * 0.09, 4.1, cw * 0.2 / sc) + ch * 0.03]
      // valley floor
      var vg = ctx.createLinearGradient(0, ch * 0.58, 0, ch * 0.82)
      vg.addColorStop(0, rgba(mix(L.valley, L.hor, 0.2))); vg.addColorStop(1, rgba(mul(L.valley, [200, 210, 190])))
      ctx.fillStyle = vg; ctx.fillRect(0, ch * 0.6, cw, ch * 0.4)
      for (i = 0; i < 26; i++) {
        var px = hash(i * 5.1) * cw, py = ch * (0.62 + hash(i * 2.2) * 0.16), pw = cw * (0.05 + hash(i) * 0.08)
        ctx.fillStyle = rgba(mix(L.valley, i % 3 ? [92, 110, 64] : [170, 150, 96], 0.25), 0.55)
        ctx.beginPath(); ctx.ellipse(px, py, pw, pw * 0.12, 0, 0, Math.PI * 2); ctx.fill()
      }
      // the Vjosa winding through the valley
      var river = []
      for (var k = 0; k <= 40; k++) { var t = k / 40; river.push([cw * (1.02 - t * 1.06), ch * (0.6 + t * t * 0.17) + Math.sin(t * 7 + 0.5) * ch * 0.018, 2 + t * t * ch * 0.035]) }
      ctx.fillStyle = rgba(mix(mix(L.hor, [72, 150, 140], 0.5), L.top, 0.15))
      ctx.beginPath(); river.forEach(function (p, j) { if (j) ctx.lineTo(p[0], p[1] - p[2] / 2); else ctx.moveTo(p[0], p[1] - p[2] / 2) })
      for (k = river.length - 1; k >= 0; k--) ctx.lineTo(river[k][0], river[k][1] + river[k][2] / 2)
      ctx.fill()
      ctx.strokeStyle = rgba(mix(L.glow, [255, 255, 255], 0.4), 0.18 + 0.3 * clamp(1 - Math.abs(s.alt - 3) / 12, 0, 1)); ctx.lineWidth = 1
      for (k = 4; k < 40; k += 5) { var rp = river[k], sh = reduce ? 0 : Math.sin(T * 1.5 + k) * 3; ctx.beginPath(); ctx.moveTo(rp[0] - rp[2] + sh, rp[1]); ctx.lineTo(rp[0] + rp[2] * 0.6 + sh, rp[1]); ctx.stroke() }
      P.vjosa = [river[30][0], river[30][1]]; P.town = [river[17][0], river[17][1] - ch * 0.02]; P.benja = [cw * 0.94, ch * 0.585]
      // town houses and Guri i Qytetit
      var gx = cw * 0.63, gyTop = ch * 0.43
      var rock = mul([196, 188, 172], L.fg), rockSh = mul([132, 124, 112], L.fg), sunLeft = s.x < gx
      ctx.fillStyle = rgba(rockSh)
      ctx.beginPath(); ctx.moveTo(gx - cw * 0.05, ch * 0.66); ctx.bezierCurveTo(gx - cw * 0.045, ch * 0.55, gx - cw * 0.03, gyTop + ch * 0.02, gx - cw * 0.008, gyTop)
      ctx.bezierCurveTo(gx + cw * 0.012, gyTop - ch * 0.006, gx + cw * 0.03, gyTop + ch * 0.03, gx + cw * 0.04, ch * 0.66); ctx.fill()
      ctx.fillStyle = rgba(rock, s.alt > -2 ? 0.9 : 0.3)
      ctx.beginPath()
      if (sunLeft) { ctx.moveTo(gx - cw * 0.05, ch * 0.66); ctx.bezierCurveTo(gx - cw * 0.045, ch * 0.55, gx - cw * 0.03, gyTop + ch * 0.02, gx - cw * 0.008, gyTop); ctx.bezierCurveTo(gx - cw * 0.01, ch * 0.52, gx - cw * 0.02, ch * 0.6, gx - cw * 0.012, ch * 0.66) }
      else { ctx.moveTo(gx + cw * 0.04, ch * 0.66); ctx.bezierCurveTo(gx + cw * 0.03, gyTop + ch * 0.03, gx + cw * 0.012, gyTop - ch * 0.006, gx - cw * 0.008, gyTop); ctx.bezierCurveTo(gx + cw * 0.004, ch * 0.52, gx + cw * 0.012, ch * 0.6, gx + cw * 0.006, ch * 0.66) }
      ctx.fill()
      ctx.strokeStyle = rgba(mul([240, 230, 210], L.fg), 0.7); ctx.lineWidth = Math.max(1, sc * 1.4)
      ctx.beginPath(); for (k = 0; k < 6; k++) { var sy = ch * (0.64 - k * 0.032), sx = gx + cw * (k % 2 ? 0.012 : -0.016); if (k) ctx.lineTo(sx, sy); else ctx.moveTo(sx, sy) } ctx.stroke()
      P.guri = [gx - cw * 0.004, gyTop]
      var lit = clamp((-s.alt + 1) / 6, 0, 1)
      for (i = 0; i < 46; i++) {
        var hx = cw * (0.42 + hash(i * 7.3) * 0.46), hy = ch * (0.6 + hash(i * 3.9) * 0.08), hw = (10 + hash(i) * 10) * sc * 1.3, hh = hw * 0.6
        if (Math.abs(hx - gx) < cw * 0.035 && hy < ch * 0.66) continue
        ctx.fillStyle = rgba(mul([228, 220, 204], L.fg)); ctx.fillRect(hx, hy, hw, hh)
        ctx.fillStyle = rgba(mul([170, 92, 70], L.fg)); ctx.beginPath(); ctx.moveTo(hx - 2, hy); ctx.lineTo(hx + hw / 2, hy - hh * 0.55); ctx.lineTo(hx + hw + 2, hy); ctx.fill()
        if (lit > 0 && hash(i * 1.9) < lit) { ctx.fillStyle = 'rgba(255,204,130,' + (0.9 * lit).toFixed(3) + ')'; ctx.fillRect(hx + hw * 0.3, hy + hh * 0.35, Math.max(2, hw * 0.18), Math.max(2, hh * 0.25)) }
      }
      // the wooded hill behind the hotel
      ctx.fillStyle = rgba(mix(L.mid, [16, 30, 20], 0.45))
      ctx.beginPath(); ctx.moveTo(0, ch * 0.56); ctx.bezierCurveTo(cw * 0.12, ch * 0.5, cw * 0.26, ch * 0.62, cw * 0.36, ch * 0.76); ctx.lineTo(0, ch * 0.8); ctx.fill()
      for (i = 0; i < 30; i++) { var tx2 = hash(i * 4.4) * cw * 0.3, ty2 = ch * (0.56 + hash(i * 6.1) * 0.2); if (ty2 < ch * 0.56 + (tx2 / cw) * ch * 0.5 - ch * 0.04) continue; ctx.fillStyle = rgba(mix(L.mid, [8, 18, 12], 0.55), 0.8); ctx.beginPath(); ctx.arc(tx2, ty2, (6 + hash(i) * 6) * sc * 1.4, 0, Math.PI * 2); ctx.fill() }
      // the hotel garden: stone wall, roses, white chairs and the outdoor fireplace
      var wy = ch * 0.82
      ctx.fillStyle = rgba(mul([196, 180, 156], L.fg)); ctx.fillRect(0, wy, cw, ch - wy)
      ctx.strokeStyle = rgba(mul([140, 124, 104], L.fg), 0.6); ctx.lineWidth = 1
      for (var ry = wy + ch * 0.04, rr = 0; ry < ch; ry += ch * 0.04, rr++) {
        ctx.beginPath(); ctx.moveTo(0, ry); ctx.lineTo(cw, ry); ctx.stroke()
        for (var bx = (rr % 2) * 20 * sc + hash(rr) * 30 * sc; bx < cw; bx += (36 + hash(bx + rr) * 26) * sc) { ctx.beginPath(); ctx.moveTo(bx, ry - ch * 0.04); ctx.lineTo(bx, ry); ctx.stroke() }
      }
      ctx.fillStyle = rgba(mul([226, 214, 192], L.fg)); ctx.fillRect(0, wy, cw, ch * 0.016)
      // rose bushes along the wall
      for (i = 0; i < 16; i++) {
        var rx = cw * (0.02 + i * 0.064 + hash(i) * 0.02), rby = wy + 2, rs = (16 + hash(i * 2) * 10) * sc * 1.5
        if (rx > cw * 0.33 && rx < cw * 0.55) continue
        ctx.fillStyle = rgba(mul([70, 98, 62], L.fg)); ctx.beginPath(); ctx.ellipse(rx, rby - rs * 0.4, rs, rs * 0.6, 0, 0, Math.PI * 2); ctx.fill()
        for (var j = 0; j < 7; j++) {
          ctx.fillStyle = rgba(mul(j % 3 ? [226, 98, 112] : [240, 160, 168], L.fg))
          ctx.beginPath(); ctx.arc(rx + (hash(i * 9 + j) - 0.5) * rs * 1.6, rby - rs * 0.4 + (hash(i * 5 + j * 3) - 0.5) * rs * 0.8, Math.max(2, rs * 0.12), 0, Math.PI * 2); ctx.fill()
        }
      }
      // courtyard: a table with white chairs, then the stone fireplace
      var tbx = cw * 0.4, tby = wy - ch * 0.005
      ctx.fillStyle = rgba(mul([246, 244, 238], L.fg))
      ;[-1, 1].forEach(function (sd) {
        var cx = tbx + sd * cw * 0.03
        ctx.fillRect(cx - 6 * sc * 1.4, tby - ch * 0.05, 3 * sc * 1.4, ch * 0.05); ctx.fillRect(cx - 6 * sc * 1.4, tby - ch * 0.025, 12 * sc * 1.4, 3 * sc * 1.4); ctx.fillRect(cx + 4 * sc * 1.4, tby - ch * 0.025, 2.5 * sc * 1.4, ch * 0.025)
      })
      ctx.fillRect(tbx - cw * 0.018, tby - ch * 0.032, cw * 0.036, 3 * sc * 1.4); ctx.fillRect(tbx - 1.5 * sc * 1.4, tby - ch * 0.032, 3 * sc * 1.4, ch * 0.032)
      P.table = [tbx, tby - ch * 0.05]; P.hotel = P.table
      var fpx = cw * 0.5, fpy = wy
      ctx.fillStyle = rgba(mul([160, 146, 126], L.fg)); ctx.fillRect(fpx - cw * 0.022, fpy - ch * 0.06, cw * 0.044, ch * 0.06)
      ctx.fillStyle = rgba(mul([40, 30, 24], L.fg)); ctx.beginPath(); ctx.arc(fpx, fpy - ch * 0.02, cw * 0.012, Math.PI, 0); ctx.fillRect(fpx - cw * 0.012, fpy - ch * 0.02, cw * 0.024, ch * 0.02); ctx.fill()
      var fire = clamp((min - (day.S + 30)) / 40, 0, 1) * (min < 1410 ? 1 : 0)
      if (fire > 0) {
        var fl = reduce ? 1 : 0.8 + 0.2 * Math.sin(T * 13) * Math.sin(T * 7.3)
        var fg2 = ctx.createRadialGradient(fpx, fpy - ch * 0.02, 0, fpx, fpy - ch * 0.02, cw * 0.09)
        fg2.addColorStop(0, 'rgba(255,170,80,' + (0.45 * fire * fl).toFixed(3) + ')'); fg2.addColorStop(1, 'rgba(255,170,80,0)')
        ctx.fillStyle = fg2; ctx.fillRect(fpx - cw * 0.1, fpy - ch * 0.12, cw * 0.2, ch * 0.2)
        for (k = 0; k < 3; k++) {
          var fh2 = ch * (0.016 + 0.01 * (reduce ? 0.5 : (Math.sin(T * (9 + k * 3) + k) + 1) / 2)) * fire
          ctx.fillStyle = k === 1 ? 'rgba(255,224,140,.95)' : 'rgba(255,140,60,.9)'
          ctx.beginPath(); ctx.moveTo(fpx - cw * 0.008 + k * cw * 0.006, fpy - ch * 0.004); ctx.quadraticCurveTo(fpx - cw * 0.006 + k * cw * 0.006, fpy - ch * 0.004 - fh2, fpx - cw * 0.004 + k * cw * 0.006, fpy - ch * 0.006 - fh2); ctx.quadraticCurveTo(fpx - cw * 0.0005 + k * cw * 0.006, fpy - ch * 0.01, fpx + k * cw * 0.006, fpy - ch * 0.004); ctx.fill()
        }
      }
      P.fire = [fpx, fpy - ch * 0.06]
      // the stone gate with its lantern
      var gtx = cw * 0.86
      ctx.fillStyle = rgba(mul([176, 160, 138], L.fg)); ctx.fillRect(gtx - cw * 0.05, wy - ch * 0.1, cw * 0.1, ch * 0.1 + 2)
      ctx.fillStyle = rgba(mul([92, 70, 52], L.fg)); ctx.beginPath(); ctx.moveTo(gtx - cw * 0.028, wy + 2); ctx.lineTo(gtx - cw * 0.028, wy - ch * 0.055); ctx.arc(gtx, wy - ch * 0.055, cw * 0.028, Math.PI, 0); ctx.lineTo(gtx + cw * 0.028, wy + 2); ctx.fill()
      if (lit > 0) { var lg = ctx.createRadialGradient(gtx + cw * 0.04, wy - ch * 0.08, 0, gtx + cw * 0.04, wy - ch * 0.08, cw * 0.04); lg.addColorStop(0, 'rgba(255,206,130,' + (0.7 * lit).toFixed(3) + ')'); lg.addColorStop(1, 'rgba(255,206,130,0)'); ctx.fillStyle = lg; ctx.fillRect(gtx, wy - ch * 0.13, cw * 0.08, ch * 0.1) }
      P.gate = [gtx, wy - ch * 0.1]
      // grade
      var vv = ctx.createRadialGradient(cw / 2, ch * 0.5, Math.min(cw, ch) * 0.45, cw / 2, ch * 0.5, Math.max(cw, ch) * 0.75)
      vv.addColorStop(0, 'rgba(10,14,12,0)'); vv.addColorStop(1, 'rgba(10,14,12,.3)')
      ctx.fillStyle = vv; ctx.fillRect(0, 0, cw, ch)
      // pins for what is on now
      var w = TX[lang()]
      active().slice(0, 2).forEach(function (it) { pin(P[it.place], w.items[it.id][0], it.lane === 'out') })
    }
    function pin(p, label, out) {
      if (!p) return
      var x = p[0], y = p[1], fs = Math.max(11, Math.round(cw * 0.011))
      ctx.font = '500 ' + fs + 'px "Funnel Sans", system-ui, sans-serif'
      var tw = ctx.measureText(label).width, pw = tw + 20, ph = fs + 12, by = y - 34 - ph
      var bx = clamp(x - pw / 2, 6, cw - pw - 6)
      ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, y - 4); ctx.lineTo(x, by + ph); ctx.stroke()
      ctx.fillStyle = out ? 'rgba(232,190,110,1)' : 'rgba(255,255,255,1)'; ctx.beginPath(); ctx.arc(x, y - 3, 4, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = 'rgba(16,22,26,.82)'; roundRect(bx, by, pw, ph, ph / 2); ctx.fill()
      ctx.fillStyle = '#fff'; ctx.textBaseline = 'middle'; ctx.fillText(label, bx + 10, by + ph / 2 + 0.5)
    }
    function roundRect(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath() }

    // ---- Now: what is on, and the card ----
    function active() {
      var on = ITEMS.filter(function (it) { return min >= it.a && min < it.b })
      on.sort(function (a, b) { return (a.id === picked ? -1 : 0) - (b.id === picked ? -1 : 0) || (a.lane === 'out' ? -1 : 1) - (b.lane === 'out' ? -1 : 1) })
      return on
    }
    function nearest() {
      var best = null, bd = 1e9
      ITEMS.forEach(function (it) { var d = min < it.a ? it.a - min : min - it.b; if (d < bd) { bd = d; best = it } })
      return best
    }
    function phaseKey(alt) {
      if (min > 720 && Math.abs(alt + 0.833) < 0.45) return 'sunset'
      if (alt < -6) return 'night'
      if (alt < -0.833) return min < 720 ? 'dawn' : 'dusk'
      if (alt < 6) return min < 720 ? 'early' : 'golden'
      return min < 660 ? 'morning' : min < 840 ? 'midday' : 'afternoon'
    }
    function whenText(it) {
      var w = TX[lang()]
      if (it.when === 'fixed') return w.items[it.id][3]
      if (it.when === 'sunset') return w.atSunset(hhmm(day.S))
      if (it.when === 'dusk') return w.atDusk
      return w[it.when] || ''
    }
    var lastCard = ''
    function renderCard() {
      var w = TX[lang()], on = active(), it = on[0] || nearest()
      if (!it) return
      var tx = w.items[it.id], extra = ''
      if (it.id === 'vjosa') extra = '<p class="pd__note">' + (it.raft ? w.rafting : w.offSeason) + '</p>'
      var dist = it.lane === 'out' && tx[3] ? '<span class="pd__meta">' + tx[3] + '</span>' : ''
      var cta = ''
      if (it.cta === 'maps') cta = '<a class="btn btn--clear btn--small" target="_blank" rel="noopener noreferrer" href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(MAPS[it.id]) + '">' + w.maps + '</a>'
      else if (it.cta === 'dinner') cta = '<a class="btn btn--small btn--wa" target="_blank" rel="noopener noreferrer" href="https://wa.me/' + wa + '?text=' + encodeURIComponent(w.dinnerText) + '">' + w.dinnerAsk + '</a>'
      else if (it.cta === 'chat') cta = '<a class="btn btn--small btn--wa" target="_blank" rel="noopener noreferrer" href="https://wa.me/' + wa + '?text=' + encodeURIComponent(w.waText) + '">' + w.chat + '</a>'
      else cta = '<a class="btn btn--small" href="#book">' + w.check + '</a>'
      var html = '<p class="pd__when">' + whenText(it) + (on.length ? '' : '') + '</p><h3 class="pd__title">' + tx[0] + '</h3>' + dist +
        '<p class="pd__line">' + tx[1] + '</p>' + (tx[2] ? '<p class="pd__tip">' + tx[2] + '</p>' : '') + extra + '<div class="pd__cta">' + cta + '</div>'
      if (html !== lastCard) { lastCard = html; card.innerHTML = html }
      lanesEl.querySelectorAll('[data-item]').forEach(function (b) {
        var isOn = on.some(function (x) { return x.id === b.dataset.item })
        if ((b.getAttribute('aria-pressed') === 'true') !== isOn) b.setAttribute('aria-pressed', isOn ? 'true' : 'false')
      })
      // on a phone the plan scrolls sideways: keep what is on now in view
      var key = on.map(function (x) { return x.id }).join()
      if (key && key !== lastOn && lanesEl.scrollWidth > lanesEl.clientWidth + 4) {
        var chip = lanesEl.querySelector('[data-item="' + on[0].id + '"]')
        if (chip) lanesEl.scrollTo({ left: Math.max(0, chip.offsetLeft - 24), behavior: reduce ? 'auto' : 'smooth' })
      }
      lastOn = key
    }
    var lastOn = ''
    function update(force) {
      var alt = altAt(min), w = TX[lang()]
      elClock.textContent = hhmm(min)
      elPhase.textContent = w.phase[phaseKey(alt)]
      var v = Math.round((min - day.start) / (day.end - day.start) * 1000)
      if (force || +range.value !== v) range.value = v
      range.setAttribute('aria-valuetext', hhmm(min) + ', ' + w.phase[phaseKey(alt)])
      var dl = Math.round(day.S - day.R)
      elSun.textContent = w.rise + ' ' + hhmm(day.R) + ' · ' + w.set + ' ' + hhmm(day.S) + ' · ' + w.hours(Math.floor(dl / 60), dl % 60)
      renderCard()
      if (reduce || force || !visible) draw()
    }
    window.__pdRelang = function () { lastCard = ''; lanes(); update(true) }

    // ---- Scroll ----
    // Joel, 2026-11-14: no dragging, tapping, dates or Play button. The day follows the page scroll:
    // down moves the sun towards evening, up brings it back to the morning.
    var goal = null
    function scrollGoal() {
      if (!day) return
      var r = stage.getBoundingClientRect(), vh = window.innerHeight
      goal = day.start + (day.end - day.start) * clamp((vh * 0.8 - r.top) / (r.height + vh * 0.4), 0, 1)
      if (reduce || !visible) { min = goal; update(true) } else kick() // off screen: jump there, so the top is always the morning
    }
    window.addEventListener('scroll', scrollGoal, { passive: true })
    window.addEventListener('resize', scrollGoal)

    // ---- Loop and size ----
    var raf = 0, visible = false, lastT = 0
    function frame(now) {
      raf = 0
      var dt = lastT ? Math.min(0.05, (now - lastT) / 1000) : 1 / 60; lastT = now; T += dt
      if (goal !== null && Math.abs(goal - min) > 0.3) { min += (goal - min) * Math.min(1, dt * 6); update() }
      draw()
      if (visible) raf = requestAnimationFrame(frame); else lastT = 0
    }
    function kick() { if (!reduce && visible && !raf) raf = requestAnimationFrame(frame) }
    function resize() {
      var r = stage.getBoundingClientRect()
      cw = Math.max(1, r.width); ch = Math.max(1, r.height); dpr = Math.min(2, window.devicePixelRatio || 1)
      cv.width = Math.round(cw * dpr); cv.height = Math.round(ch * dpr)
      if (day) { draw(); var lw = lanesEl.clientWidth; if (lw !== lastLW) { lastLW = lw; lanes(); renderCard() } }
    }
    var lastLW = 0
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(stage); else window.addEventListener('resize', resize)
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) kick() }).observe(stage)
    else visible = true
    resize()
    var p = parts(Date.now())
    min = Math.max(360, Math.min(1380, p.h * 60 + p.mi))
    setDay(p.y, p.m, p.d, min)
    scrollGoal(); min = goal; update(true)
    kick()
  }
})()
