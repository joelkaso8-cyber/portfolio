// Grusht Boxing Club demo: count-up stats, timetable with booking, round timer with bell, membership calculator, gym hours, free-class form.
;(function () {
  var $ = function (s, r) { return (r || document).querySelector(s) }
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) }
  var pad = function (n) { return String(n).padStart(2, '0') }
  var gbp = function (n) { return '£' + (Math.round(n * 100) / 100).toFixed(n % 1 ? 2 : 0) }
  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  var SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  var TYPES = { beg: 'Beginners', fit: 'Fitness', tech: 'Technique', spar: 'Sparring', kids: 'Kids' }
  // [time, name, coach, type, capacity]
  var WEEK = [
    [['06:30', 'Fight Fit', 'Dren', 'fit', 20], ['12:15', 'Lunch Rounds', 'Mira', 'fit', 16], ['18:00', 'First Punch', 'Dren', 'beg', 18], ['19:15', 'Technique: Jab and Cross', 'Arben', 'tech', 14], ['20:30', 'Bag Burner', 'Mira', 'fit', 20]],
    [['07:00', 'Skip and Shadow', 'Mira', 'fit', 18], ['16:30', 'Junior Boxing (8–12)', 'Luan', 'kids', 14], ['18:00', 'Fight Fit', 'Dren', 'fit', 20], ['19:15', 'Controlled Sparring', 'Arben', 'spar', 12]],
    [['06:30', 'Fight Fit', 'Dren', 'fit', 20], ['12:15', 'Lunch Rounds', 'Mira', 'fit', 16], ['18:00', 'First Punch', 'Luan', 'beg', 18], ['19:15', 'Technique: Defence', 'Arben', 'tech', 14], ['20:30', 'Women Only Boxing', 'Mira', 'fit', 16]],
    [['07:00', 'Skip and Shadow', 'Mira', 'fit', 18], ['16:30', 'Junior Boxing (8–12)', 'Luan', 'kids', 14], ['18:00', 'Bag Burner', 'Dren', 'fit', 20], ['19:15', 'Controlled Sparring', 'Arben', 'spar', 12]],
    [['06:30', 'Fight Fit', 'Dren', 'fit', 20], ['12:15', 'Lunch Rounds', 'Mira', 'fit', 16], ['18:00', 'First Punch', 'Dren', 'beg', 18], ['19:00', 'Friday Fight Night Pads', 'Arben', 'tech', 14]],
    [['09:00', 'First Punch', 'Luan', 'beg', 18], ['10:15', 'Junior Boxing (8–12)', 'Luan', 'kids', 16], ['11:30', 'Saturday Sparring', 'Arben', 'spar', 14], ['13:00', 'Bag Burner', 'Mira', 'fit', 20]],
    [['10:00', 'Recovery: Mobility and Shadow', 'Mira', 'fit', 18], ['11:15', 'First Punch', 'Dren', 'beg', 18]],
  ]
  var HOURS = [[6, 22], [6, 22], [6, 22], [6, 22], [6, 21], [8, 16], [9, 14]]

  // London time now
  var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date())
  var get = function (t) { return (parts.find(function (x) { return x.type === t }) || {}).value }
  var today = SHORT.indexOf(get('weekday')); if (today < 0) today = 0
  var nowH = Number(get('hour')) % 24 + Number(get('minute')) / 60
  var toH = function (t) { var p = t.split(':'); return Number(p[0]) + Number(p[1]) / 60 }

  // Header turns solid once you are past the film.
  var bar = $('#top-bar'), film = $('.film')
  function headerState() { bar.classList.toggle('is-solid', window.scrollY > (film.offsetTop + film.offsetHeight - window.innerHeight - 40)) }
  window.addEventListener('scroll', headerState, { passive: true }); headerState()

  // Count-up numbers
  function countUp(el) {
    var end = Number(el.dataset.count), t0 = performance.now(), dur = 1400
    function step(t) { var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(end * e).toLocaleString('en-GB'); if (k < 1) requestAnimationFrame(step) }
    requestAnimationFrame(step)
  }

  // Timetable
  var mine = {}
  try { mine = JSON.parse(localStorage.getItem('grusht-booked') || '{}') || {} } catch (e) {}
  var save = function () { try { localStorage.setItem('grusht-booked', JSON.stringify(mine)) } catch (e) {} }
  var seed = function (s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h }
  var day = today, type = 'all'
  // Days start from today so "today" is first.
  var order = []; for (var i = 0; i < 7; i++) order.push((today + i) % 7)
  order.forEach(function (d, i) {
    var b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'tab'); b.dataset.d = d
    b.innerHTML = '<span></span><b></b>'; b.children[0].textContent = i === 0 ? 'Today' : SHORT[d]; b.children[1].textContent = WEEK[d].length
    b.setAttribute('aria-label', DAYS[d] + ', ' + WEEK[d].length + ' classes')
    b.addEventListener('click', function () { day = d; renderDays(); renderSessions() })
    $('#days').appendChild(b)
  })
  ;[['all', 'All']].concat(Object.keys(TYPES).map(function (k) { return [k, TYPES[k]] })).forEach(function (t) {
    var b = document.createElement('button'); b.type = 'button'; b.textContent = t[1]; b.dataset.t = t[0]
    b.addEventListener('click', function () { type = t[0]; $$('#levels button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)) }); renderSessions() })
    b.setAttribute('aria-pressed', String(t[0] === 'all')); $('#levels').appendChild(b)
  })
  function renderDays() { $$('#days button').forEach(function (b) { b.setAttribute('aria-selected', String(Number(b.dataset.d) === day)) }) }
  function renderSessions() {
    var ul = $('#sessions'); ul.innerHTML = ''
    var list = WEEK[day].filter(function (s) { return type === 'all' || s[3] === type })
    if (!list.length) { ul.innerHTML = '<li class="empty">No ' + TYPES[type].toLowerCase() + ' classes on ' + DAYS[day] + '. Try another day.</li>'; return }
    list.forEach(function (s, i) {
      var key = day + '|' + s[0], cap = s[4], taken = Math.min(cap - 1, 4 + seed(key) % (cap - 3)) + (mine[key] ? 1 : 0)
      var left = cap - taken, past = day === today && toH(s[0]) <= nowH
      var li = document.createElement('li'); li.className = 'sess' + (mine[key] ? ' is-mine' : '') + (past ? ' is-past' : ''); li.style.animationDelay = i * 60 + 'ms'
      li.innerHTML = '<span class="sess__time"></span><span class="sess__name"><b></b><small></small></span><span class="spots"><span></span><span class="spots__bar"><i></i></span></span><button class="btn" type="button"></button>'
      li.querySelector('.sess__time').textContent = s[0]
      li.querySelector('b').textContent = s[1]
      li.querySelector('small').textContent = 'Coach ' + s[2] + ' · ' + TYPES[s[3]] + ' · 60 min'
      li.querySelector('.spots span').textContent = past ? 'Started' : left ? left + ' of ' + cap + ' spots left' : 'Full, join the waitlist'
      li.querySelector('.spots__bar i').style.width = (taken / cap) * 100 + '%'
      var btn = li.querySelector('button')
      btn.textContent = mine[key] ? 'Cancel' : left ? 'Book' : 'Waitlist'
      btn.className = 'btn' + (mine[key] ? ' btn--ghost' : '')
      btn.disabled = past
      btn.setAttribute('aria-label', (mine[key] ? 'Cancel ' : 'Book ') + s[1] + ' at ' + s[0] + ' on ' + DAYS[day])
      btn.addEventListener('click', function () {
        if (mine[key]) delete mine[key]; else mine[key] = 1
        save(); renderSessions(); renderMine()
      })
      ul.appendChild(li)
    })
  }
  function renderMine() {
    var keys = Object.keys(mine).filter(function (k) { var p = k.split('|'); return WEEK[p[0]] && WEEK[p[0]].some(function (s) { return s[0] === p[1] }) })
    $('#mine').textContent = keys.length ? 'You are booked into ' + keys.length + (keys.length === 1 ? ' class' : ' classes') + ' this week: ' + keys.map(function (k) { var p = k.split('|'); return SHORT[p[0]] + ' ' + p[1] }).join(', ') + '.' : ''
  }
  renderDays(); renderSessions(); renderMine()

  // Round timer with a bell made in the browser (no sound files).
  var ac = null
  function bell(times) {
    if (!$('#t-sound').checked) return
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)()
      if (ac.state === 'suspended') ac.resume()
      for (var k = 0; k < times; k++) {
        var t = ac.currentTime + k * 0.32
        ;[1, 2.76, 5.4].forEach(function (m, j) {
          var o = ac.createOscillator(), g = ac.createGain()
          o.type = 'sine'; o.frequency.value = 820 * m
          g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.32 / (j + 1), t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.3 - j * 0.3)
          o.connect(g).connect(ac.destination); o.start(t); o.stop(t + 1.4)
        })
      }
    } catch (e) {}
  }
  function clack() {
    if (!$('#t-sound').checked || !ac) return
    try { var o = ac.createOscillator(), g = ac.createGain(); o.type = 'square'; o.frequency.value = 1400; g.gain.setValueAtTime(0.12, ac.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.08); o.connect(g).connect(ac.destination); o.start(); o.stop(ac.currentTime + 0.1) } catch (e) {}
  }
  var T = { running: false, phase: 'ready', round: 1, left: 180, len: 180, last: 0, id: null, warned: false }
  var cfg = function () { return { rounds: Number($('#t-rounds').value), work: Number($('#t-work').value), rest: Number($('#t-rest').value) } }
  var fmt = function (s) { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ':' + pad(s % 60) }
  function drawTimer() {
    var c = cfg(), card = $('#timer-card')
    $('#t-clock').textContent = fmt(T.left)
    $('#t-phase').textContent = { ready: 'Ready', work: 'Fight', rest: 'Rest', done: 'Done. Good work.' }[T.phase]
    $('#t-phase').className = 'timer__phase' + (T.phase === 'work' ? ' is-work' : T.phase === 'rest' ? ' is-rest' : '')
    $('#t-round').textContent = T.phase === 'done' ? c.rounds + ' rounds finished' : 'Round ' + T.round + ' of ' + c.rounds
    $('#t-bar').style.width = (T.phase === 'ready' ? 0 : T.phase === 'done' ? 100 : (1 - T.left / T.len) * 100) + '%'
    card.classList.toggle('is-rest', T.phase === 'rest')
    $('#t-go').textContent = T.running ? 'Pause' : T.phase === 'ready' || T.phase === 'done' ? 'Start' : 'Resume'
  }
  function flash() { var c = $('#timer-card'); c.classList.remove('is-flash'); void c.offsetWidth; c.classList.add('is-flash') }
  function tick() {
    var now = performance.now(); T.left -= (now - T.last) / 1000; T.last = now
    var c = cfg()
    if (T.phase === 'work' && !T.warned && T.left <= 10) { T.warned = true; clack(); setTimeout(clack, 180) }
    if (T.left <= 0) {
      if (T.phase === 'work' && T.round >= c.rounds) { T.phase = 'done'; T.left = 0; stop(); bell(3); flash(); drawTimer(); return }
      if (T.phase === 'work') { T.phase = 'rest'; T.left = T.len = c.rest; bell(1) }
      else { T.phase = 'work'; T.round++; T.left = T.len = c.work; T.warned = false; bell(2) }
      flash()
    }
    drawTimer()
  }
  function stop() { T.running = false; clearInterval(T.id); T.id = null }
  function reset() { stop(); var c = cfg(); T.phase = 'ready'; T.round = 1; T.left = T.len = c.work; T.warned = false; drawTimer() }
  $('#t-go').addEventListener('click', function () {
    if (T.running) { stop(); drawTimer(); return }
    if (T.phase === 'ready' || T.phase === 'done') { reset(); T.phase = 'work'; bell(2) }
    T.running = true; T.last = performance.now(); T.id = setInterval(tick, 100); drawTimer()
  })
  $('#t-reset').addEventListener('click', reset)
  ;['#t-rounds', '#t-work', '#t-rest'].forEach(function (s) { $(s).addEventListener('change', function () { if (!T.running && (T.phase === 'ready' || T.phase === 'done')) reset(); else drawTimer() }) })
  reset()

  // Membership calculator
  function seg(box, name, opts, checked) {
    opts.forEach(function (o, i) {
      var l = document.createElement('label'); l.innerHTML = '<input type="radio" /><span></span>'
      l.firstChild.name = name; l.firstChild.value = o[0]; l.firstChild.checked = i === checked; l.lastChild.textContent = o[1]
      $(box).appendChild(l)
    })
  }
  var BASE = { 2: 49, 3: 65, 9: 85 }, TERM = { 1: 0, 6: 0.1, 12: 0.18 }
  seg('#p-classes', 'classes', [['2', '2 a week'], ['3', '3 a week'], ['9', 'Unlimited']], 1)
  seg('#p-term', 'term', [['1', 'Monthly'], ['6', '6 months'], ['12', '12 months']], 0)
  var pf = $('#plan-form')
  function price() {
    var e = pf.elements, base = BASE[e.classes.value], off = TERM[e.term.value] + (e.student.checked ? 0.15 : 0)
    var p = base * (1 - off) + (e.pt.checked ? 70 : 0)
    $('#p-price').textContent = gbp(p)
    var notes = []
    if (off) notes.push('You save ' + gbp(base * off) + ' a month')
    if (e.term.value !== '1') notes.push(e.term.value + '-month plan, then rolling monthly')
    if (e.kit.checked) notes.push('plus £45 for the kit on day one')
    $('#p-note').textContent = notes.join(' · ') || 'Cancel with 30 days notice'
  }
  pf.addEventListener('change', price); price()

  // Hours, London time
  HOURS.forEach(function (h, i) {
    var li = document.createElement('li'); if (i === today) li.className = 'is-today'
    li.innerHTML = '<span></span><span></span>'; li.children[0].textContent = DAYS[i]; li.children[1].textContent = pad(h[0]) + ':00–' + pad(h[1]) + ':00'; $('#hours').appendChild(li)
  })
  var open = nowH >= HOURS[today][0] && nowH < HOURS[today][1], st = $('#open-status')
  st.className = 'status' + (open ? ' is-open' : '')
  st.textContent = open ? 'Open now · until ' + pad(HOURS[today][1]) + ':00' : 'Closed now · opens ' + (nowH < HOURS[today][0] ? 'at ' + pad(HOURS[today][0]) + ':00' : 'tomorrow at ' + pad(HOURS[(today + 1) % 7][0]) + ':00')

  // Free class form
  var sel = $('#trial-cls'), seen = {}
  WEEK.forEach(function (d, i) { d.forEach(function (s) { if (s[3] === 'beg' || s[3] === 'fit' || s[3] === 'kids') { var o = document.createElement('option'); o.textContent = SHORT[i] + ' ' + s[0] + ' · ' + s[1]; if (!seen[o.textContent]) { seen[o.textContent] = 1; sel.appendChild(o) } } }) })
  var form = $('#trial-form'), lastSend = 0
  var clean = function (s, m) { return String(s).replace(/[<>\u0000-\u001f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, m) }
  form.addEventListener('submit', function (e) {
    e.preventDefault()
    if (Date.now() - lastSend < 1500) return
    var out = $('#trial-status'); $$('[aria-invalid]', form).forEach(function (el) { el.removeAttribute('aria-invalid') })
    var fail = function (f, m) { out.className = 'form-status is-error'; out.textContent = m; form.elements[f].setAttribute('aria-invalid', 'true'); form.elements[f].focus() }
    if (!clean(form.elements.name.value, 80)) return fail('name', 'Write your name.')
    if (clean(form.elements.phone.value, 20).replace(/\D/g, '').length < 7) return fail('phone', 'Write a phone number we can text.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(form.elements.email.value, 120))) return fail('email', 'Write a full email address.')
    lastSend = Date.now()
    if (form.elements.website.value) return
    out.className = 'form-status is-ok'
    out.textContent = 'Spot saved for ' + form.elements.cls.value + '. Bring water and trainers; we lend the gloves. (Demo: nothing is sent.)'
    form.reset()
  })

  // Reveal on scroll
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return
        en.target.classList.add('is-in'); io.unobserve(en.target)
        var n = en.target.querySelector('[data-count]'); if (n) countUp(n)
      })
    }, { rootMargin: '0px 0px -10% 0px' })
    $$('.reveal').forEach(function (el) { io.observe(el) })
  } else $$('.reveal').forEach(function (el) { el.classList.add('is-in'); var n = el.querySelector('[data-count]'); if (n) n.textContent = n.dataset.count })
})()
