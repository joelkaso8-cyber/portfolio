// Kripë demo: today's catch (demo data, changes daily), EN/SQ, hold-a-fish, WhatsApp booking.
;(function () {
  'use strict'
  var $ = function (s, r) { return (r || document).querySelector(s) }
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) }

  var WA = '355690000214' // Demo placeholder number, same style as the other demos.
  var TZ = 'Europe/Tirane'
  var OPEN = 12 * 60, KITCHEN = 22 * 60 + 45, CLOSE = 23 * 60 + 30

  // ---------- Texts ----------
  var T = {
    en: {
      'skip': 'Skip to content',
      'nav.catch': 'The catch', 'nav.menu': 'Menu', 'nav.find': 'Find us', 'nav.book': 'Book a table',
      'hero.hook': 'Fish taverna on Spile harbour. The menu is what the boat brings in.',
      'q.title': 'Book a table', 'q.day': 'Day', 'q.today': 'Today', 'q.tomorrow': 'Tomorrow', 'q.other': 'Other day',
      'q.date': 'Date', 'q.time': 'Time', 'q.people': 'People', 'q.less': 'One person fewer', 'q.more': 'One person more',
      'q.send': 'Book on WhatsApp',
      'catch.title': 'In the boat today',
      'catch.lead': 'Fish is sold by the kilo and weighed in front of you. When it is gone, it is gone. Tap a fish to hold one for your table.',
      'catch.demo': 'Demo data: the catch changes every day.',
      'fish.perkg': '/kg', 'fish.none': 'Not in the nets today', 'fish.held': 'Held for you',
      'd.close': 'Close', 'd.how': 'How we cook it', 'd.much': 'How much', 'd.less': 'Half a kilo less', 'd.more': 'Half a kilo more',
      'd.hold': 'Hold it for my table', 'd.unhold': 'Remove from my table', 'd.est': 'about',
      'd.serves': 'serves about',
      'd.pick': 'Pick your fish', 'd.s1': 'Tap a fish in the water.', 'd.s2': 'Choose how we cook it and how much.', 'd.s3': 'We weigh it and hold it for your table.',
      'cook.grill': 'Over the coals', 'cook.salt': 'In a salt crust', 'cook.fry': 'Fried', 'cook.pot': 'In the clay pot',
      'salt.title': 'Kripë means salt',
      'salt.text': 'The house way: the whole fish baked under a crust of sea salt from the Narta pans, cracked open at your table. It keeps every bit of moisture in, and nothing else goes on it but lemon and olive oil from the hills above Himarë.',
      'ways.grill': 'Over olive-wood coals, with oregano picked on the hill. The way most people want it.',
      'ways.fry': 'For the small ones: red mullet and squid, dusted in flour and fried in a minute.',
      'ways.pot': 'Octopus and the day’s soup go in the clay pot with onion, tomato and a glass of white.',
      'menu.title': 'Menu',
      'menu.note': 'Demo prices in Albanian lek. Euro is approximate. We take cards and cash.',
      'menu.boat': 'From the boat', 'menu.boat.note': 'priced by the kilo, weighed at the table',
      'menu.meze': 'Small plates', 'menu.pot': 'From the pot', 'menu.sides': 'Salads and sides', 'menu.drink': 'To drink',
      'book.title': 'Book a table',
      'book.lead': 'Choose a day, a time and how many of you. The message writes itself on the slate; send it and we answer on WhatsApp.',
      'book.name': 'Your name', 'book.optional': 'optional', 'book.note': 'Anything we should know?',
      'book.chips': 'Quick notes', 'chip.water': 'Table by the water', 'chip.chair': 'High chair', 'chip.bday': 'A birthday',
      'book.held': 'Fish you are holding', 'book.noheld': 'None yet. Tap a fish in today’s catch to hold one.',
      'book.remove': 'Remove',
      'book.slate': 'Your message', 'book.send': 'Send on WhatsApp', 'book.copy': 'Copy message', 'book.copied': 'Copied',
      'book.call': 'Or call', 'book.big': 'More than 12 of you? Call us and we will set up the long table.',
      'book.demo': 'Demo: the phone and WhatsApp number are placeholders.',
      'find.title': 'Find us',
      'find.text': 'On the quay at Spile, Himarë, where the fishing boats tie up. Park on the seafront road and walk to the end of the harbour; we are the blue door with the boat outside.',
      'find.hours': 'Every day 12:00–23:30. Kitchen until 22:45.',
      'find.map': 'Open in Google Maps', 'find.call': 'Call', 'find.wa': 'WhatsApp',
      'foot.demo': 'Kripë is a demo website. The taverna, its boat, the dishes, prices and catch are made up.',
      'foot.by': 'Designed and built by Joel Kaso.', 'foot.more': 'See more work',
      'foot.credits': 'Picture credits', 'foot.top': 'Back to the top',
      'dock.book': 'Book',
      // dynamic
      'live.today': 'Today: {n} kinds, {kg} kg on ice',
      'live.open': 'Open until 23:30', 'live.kitchen': 'Open, kitchen closed', 'live.closed': 'Closed, opens at 12:00',
      'live.closedtom': 'Closed, opens tomorrow at 12:00',
      'log': 'Out {out}, back {back}, {date}',
      'left': '{kg} kg left', 'soldout': 'All gone today',
      'sum': 'Table for {p}, {day}, {time}', 'sum.held': ' · holding {n}',
      'day.today': 'today', 'day.tomorrow': 'tomorrow',
      'people.one': '{p} person', 'people.many': '{p} people',
      'msg.hello': 'Hello Kripë! I’d like to book a table.',
      'msg.day': 'Day', 'msg.time': 'Time', 'msg.people': 'People', 'msg.name': 'Name', 'msg.hold': 'Please hold',
      'msg.note': 'Note', 'msg.foot': '(sent from the Kripë website)',
      'msg.fish': '{fish}, about {kg} kg, {cook}',
      'serves': '{n} people'
    },
    sq: {
      'skip': 'Kalo te përmbajtja',
      'nav.catch': 'Peshku sot', 'nav.menu': 'Menuja', 'nav.find': 'Na gjeni', 'nav.book': 'Rezervo',
      'hero.hook': 'Tavernë peshku në skelën e Spiles. Menuja është ajo që sjell barka.',
      'q.title': 'Rezervo tavolinë', 'q.day': 'Dita', 'q.today': 'Sot', 'q.tomorrow': 'Nesër', 'q.other': 'Ditë tjetër',
      'q.date': 'Data', 'q.time': 'Ora', 'q.people': 'Persona', 'q.less': 'Një person më pak', 'q.more': 'Një person më shumë',
      'q.send': 'Rezervo në WhatsApp',
      'catch.title': 'Sot në barkë',
      'catch.lead': 'Peshku shitet me kilogram dhe peshohet para jush. Kur mbaron, mbaroi. Prekni një peshk që t’jua mbajmë për tavolinën.',
      'catch.demo': 'Të dhëna demo: peshku ndryshon çdo ditë.',
      'fish.perkg': '/kg', 'fish.none': 'Sot nuk ra në rrjetë', 'fish.held': 'Ju mbahet',
      'd.close': 'Mbyll', 'd.how': 'Si e gatuajmë', 'd.much': 'Sa', 'd.less': 'Gjysmë kilogrami më pak', 'd.more': 'Gjysmë kilogrami më shumë',
      'd.hold': 'Ma mbani për tavolinën', 'd.unhold': 'Hiqe nga tavolina ime', 'd.est': 'rreth',
      'd.serves': 'mjafton për rreth',
      'd.pick': 'Zgjidhni peshkun', 'd.s1': 'Prekni një peshk në ujë.', 'd.s2': 'Zgjidhni si ta gatuajmë dhe sa.', 'd.s3': 'E peshojmë dhe jua mbajmë për tavolinën.',
      'cook.grill': 'Në skarë', 'cook.salt': 'Në kripë', 'cook.fry': 'I skuqur', 'cook.pot': 'Në tavë balte',
      'salt.title': 'Kripë, si kripa',
      'salt.text': 'Mënyra e shtëpisë: peshku i plotë piqet nën një kore kripe deti nga kripore e Nartës dhe çahet para jush në tavolinë. Ruan gjithë lëngun, dhe sipër s’i hidhet gjë tjetër veç limonit dhe vajit të ullirit nga kodrat mbi Himarë.',
      'ways.grill': 'Mbi prush ulliri, me rigon të mbledhur në kodër. Siç e duan shumica.',
      'ways.fry': 'Për të vegjlit: barbuni dhe kallamari, në miell dhe të skuqur për një minutë.',
      'ways.pot': 'Oktapodi dhe çorba e ditës shkojnë në tavë balte me qepë, domate dhe një gotë të bardhë.',
      'menu.title': 'Menuja',
      'menu.note': 'Çmime demo në lekë. Euro është e përafërt. Pranojmë kartë dhe para në dorë.',
      'menu.boat': 'Nga barka', 'menu.boat.note': 'me çmim për kilogram, peshohet në tavolinë',
      'menu.meze': 'Meze', 'menu.pot': 'Nga tenxherja', 'menu.sides': 'Sallata dhe garniturë', 'menu.drink': 'Për të pirë',
      'book.title': 'Rezervo tavolinë',
      'book.lead': 'Zgjidhni ditën, orën dhe sa veta jeni. Mesazhi shkruhet vetë në dërrasë; dërgojeni dhe ne ju përgjigjemi në WhatsApp.',
      'book.name': 'Emri juaj', 'book.optional': 'jo e detyrueshme', 'book.note': 'Diçka që duhet të dimë?',
      'book.chips': 'Shënime të shpejta', 'chip.water': 'Tavolinë buzë detit', 'chip.chair': 'Karrige për fëmijë', 'chip.bday': 'Ditëlindje',
      'book.held': 'Peshku që ju mbajmë', 'book.noheld': 'Ende asnjë. Prekni një peshk te peshku i sotëm.',
      'book.remove': 'Hiqe',
      'book.slate': 'Mesazhi juaj', 'book.send': 'Dërgo në WhatsApp', 'book.copy': 'Kopjo mesazhin', 'book.copied': 'U kopjua',
      'book.call': 'Ose telefononi', 'book.big': 'Më shumë se 12 veta? Na telefononi dhe ju shtrojmë tavolinën e gjatë.',
      'book.demo': 'Demo: numri i telefonit dhe i WhatsApp është shembull.',
      'find.title': 'Na gjeni',
      'find.text': 'Në skelën e Spiles, Himarë, aty ku lidhen barkat e peshkimit. Parkoni te rruga e bregdetit dhe ecni deri në fund të portit; jemi dera blu me barkën përpara.',
      'find.hours': 'Çdo ditë 12:00–23:30. Kuzhina deri në 22:45.',
      'find.map': 'Hape në Google Maps', 'find.call': 'Telefono', 'find.wa': 'WhatsApp',
      'foot.demo': 'Kripë është faqe demo. Taverna, barka, gatimet, çmimet dhe peshku janë të sajuara.',
      'foot.by': 'Dizajnuar dhe ndërtuar nga Joel Kaso.', 'foot.more': 'Shiko punë të tjera',
      'foot.credits': 'Burimet e figurave', 'foot.top': 'Kthehu lart',
      'dock.book': 'Rezervo',
      'live.today': 'Sot: {n} lloje, {kg} kg në akull',
      'live.open': 'Hapur deri në 23:30', 'live.kitchen': 'Hapur, kuzhina e mbyllur', 'live.closed': 'Mbyllur, hapet në 12:00',
      'live.closedtom': 'Mbyllur, hapet nesër në 12:00',
      'log': 'Doli {out}, u kthye {back}, {date}',
      'left': 'kanë mbetur {kg} kg', 'soldout': 'Mbaroi për sot',
      'sum': 'Tavolinë për {p}, {day}, {time}', 'sum.held': ' · mbajmë {n}',
      'day.today': 'sot', 'day.tomorrow': 'nesër',
      'people.one': '{p} person', 'people.many': '{p} persona',
      'msg.hello': 'Përshëndetje Kripë! Dua të rezervoj një tavolinë.',
      'msg.day': 'Dita', 'msg.time': 'Ora', 'msg.people': 'Persona', 'msg.name': 'Emri', 'msg.hold': 'Ju lutem mbani',
      'msg.note': 'Shënim', 'msg.foot': '(dërguar nga faqja e Kripë)',
      'msg.fish': '{fish}, rreth {kg} kg, {cook}',
      'serves': '{n} veta'
    }
  }

  // ---------- Today's catch (demo data) ----------
  var FISH = [
    { id: 'koc', sq: 'Koc', en: 'Gilthead bream', la: 'Sparus aurata', lek: 3400, kg: [3, 7], cook: ['salt', 'grill'], step: 0.5 },
    { id: 'fangri', sq: 'Fangri', en: 'Red porgy', la: 'Pagrus pagrus', lek: 4200, kg: [1.5, 4.5], cook: ['grill', 'salt'], step: 0.5 },
    { id: 'barbun', sq: 'Barbun', en: 'Red mullet', la: 'Mullus surmuletus', lek: 2800, kg: [1.5, 4], cook: ['fry', 'grill'], step: 0.5 },
    { id: 'oktapod', sq: 'Oktapod', en: 'Octopus', la: 'Octopus vulgaris', lek: 2600, kg: [2, 5], cook: ['grill', 'pot'], step: 0.5 },
    { id: 'kallamar', sq: 'Kallamar', en: 'Squid', la: 'Loligo vulgaris', lek: 2400, kg: [1.5, 4], cook: ['fry', 'grill'], step: 0.5 }
  ]
  var BY = {}; FISH.forEach(function (f) { BY[f.id] = f })

  // Time in Tirana
  function tirana () {
    var parts = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date())
    var o = {}; parts.forEach(function (p) { o[p.type] = p.value })
    return { y: +o.year, m: +o.month, d: +o.day, min: (+o.hour) * 60 + (+o.minute) }
  }
  function ymd (t) { return t.y * 10000 + t.m * 100 + t.d }
  function rng (seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 } }

  var now = tirana()
  var rand = rng(ymd(now))
  var missing = Math.floor(rand() * 8) // 0..7: indices 0-4 drop that fish for the day, 5-7 none missing
  FISH.forEach(function (f, i) {
    f.landed = i === missing ? 0 : Math.round((f.kg[0] + rand() * (f.kg[1] - f.kg[0])) * 10) / 10
  })
  var outMin = 5 * 60 + Math.floor(rand() * 25), backMin = 8 * 60 + 10 + Math.floor(rand() * 60)
  function serviceProgress () {
    var t = tirana().min
    if (t <= OPEN) return 0
    return Math.min(1, (t - OPEN) / (KITCHEN - OPEN))
  }
  function leftKg (f) {
    if (!f.landed) return 0
    var p = serviceProgress()
    var v = f.landed * (1 - 0.72 * p * (0.8 + 0.4 * ((f.id.charCodeAt(0) % 5) / 5)))
    return Math.max(0, Math.round(v * 10) / 10)
  }

  // ---------- State ----------
  var store = { get: function (k) { try { return localStorage.getItem(k) } catch (e) { return null } }, set: function (k, v) { try { localStorage.setItem(k, v) } catch (e) {} } }
  var lang = store.get('kripe-lang') === 'sq' ? 'sq' : (document.documentElement.lang === 'sq' ? 'sq' : 'en')
  var S = { day: 'today', date: null, time: null, people: 2, name: '', note: '', held: {}, sel: null, draft: {} }

  function t (k, vars) {
    var s = (T[lang] && T[lang][k]) || T.en[k] || k
    if (vars) Object.keys(vars).forEach(function (v) { s = s.split('{' + v + '}').join(vars[v]) })
    return s
  }
  var SQ_WD = ['e diel', 'e hënë', 'e martë', 'e mërkurë', 'e enjte', 'e premte', 'e shtunë']
  var SQ_WDS = ['Die', 'Hën', 'Mar', 'Mër', 'Enj', 'Pre', 'Sht']
  var SQ_M = ['janar', 'shkurt', 'mars', 'prill', 'maj', 'qershor', 'korrik', 'gusht', 'shtator', 'tetor', 'nëntor', 'dhjetor']
  var SQ_MS = ['jan', 'shk', 'mar', 'pri', 'maj', 'qer', 'korr', 'gush', 'sht', 'tet', 'nën', 'dhj']
  // Albanian formats are written out by hand so they do not depend on the browser's locale data.
  function fmtNum (v, dec) {
    if (lang === 'sq') {
      var str = v.toFixed(dec || 0).replace('.', ',')
      if (Math.abs(v) >= 10000) str = str.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
      return str
    }
    return new Intl.NumberFormat('en-GB', { minimumFractionDigits: dec || 0, maximumFractionDigits: dec || 0 }).format(v)
  }
  function fmtKg (v) { return fmtNum(v, 1) }
  function fmtLek (v) { return fmtNum(v, 0) + ' L' }
  function fmtEur (v) { return '≈ €' + Math.round(v / 100) }
  function hhmm (m) { return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0') }
  function dateFor (offsetDays, iso) {
    var d = iso ? new Date(iso + 'T12:00:00Z') : new Date(Date.UTC(now.y, now.m - 1, now.d, 12) + offsetDays * 864e5)
    return d
  }
  function fmtDate (d, long) {
    if (lang === 'sq') {
      return long ? SQ_WD[d.getUTCDay()] + ', ' + d.getUTCDate() + ' ' + SQ_M[d.getUTCMonth()]
        : SQ_WDS[d.getUTCDay()] + ' ' + d.getUTCDate() + ' ' + SQ_MS[d.getUTCMonth()]
    }
    return new Intl.DateTimeFormat('en-GB', { weekday: long ? 'long' : 'short', day: 'numeric', month: long ? 'long' : 'short', timeZone: 'UTC' }).format(d)
  }
  function isoOf (d) { return d.toISOString().slice(0, 10) }

  // ---------- i18n ----------
  function applyLang () {
    document.documentElement.lang = lang
    $$('[data-t]').forEach(function (el) { el.textContent = t(el.getAttribute('data-t')) })
    $$('[data-t-attr]').forEach(function (el) {
      el.getAttribute('data-t-attr').split(';').forEach(function (pair) {
        var p = pair.split(':'); if (p.length === 2) el.setAttribute(p[0].trim(), t(p[1].trim()))
      })
    })
    $$('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang)) })
    $$('[data-en]').forEach(function (el) { el.textContent = el.getAttribute(lang === 'sq' ? 'data-sq' : 'data-en') })
    $$('[data-lek]').forEach(function (el) { var v = +el.getAttribute('data-lek'); el.innerHTML = '<b>' + fmtLek(v) + '</b> <small>' + fmtEur(v) + '</small>' })
    renderAll()
  }

  // ---------- Time slots ----------
  function slots () {
    var list = []
    for (var m = OPEN; m <= 22 * 60 + 30; m += 30) list.push(m)
    return list
  }
  function minSlotToday () { var t0 = tirana().min + 45; return t0 }
  function dayIsToday () { return S.day === 'today' || (S.day === 'other' && S.date === isoOf(dateFor(0))) }
  function fillTimes () {
    var avail = slots().filter(function (m) { return !dayIsToday() || m >= minSlotToday() })
    if (!avail.length && S.day === 'today') { S.day = 'tomorrow'; return fillTimes() }
    if (S.time === null || avail.indexOf(S.time) === -1) {
      S.time = avail.indexOf(20 * 60) !== -1 ? 20 * 60 : avail[0]
    }
    $$('select[data-bind="time"]').forEach(function (sel) {
      var html = slots().map(function (m) {
        var off = avail.indexOf(m) === -1
        return '<option value="' + m + '"' + (off ? ' disabled' : '') + (m === S.time ? ' selected' : '') + '>' + hhmm(m) + '</option>'
      }).join('')
      sel.innerHTML = html
    })
  }

  // ---------- Rendering ----------
  function dayLabel () {
    if (S.day === 'today') return t('day.today')
    if (S.day === 'tomorrow') return t('day.tomorrow')
    return S.date ? fmtDate(dateFor(0, S.date)) : t('day.today')
  }
  function dayDate () {
    if (S.day === 'tomorrow') return dateFor(1)
    if (S.day === 'other' && S.date) return dateFor(0, S.date)
    return dateFor(0)
  }
  function heldList () { return Object.keys(S.held).map(function (id) { return { f: BY[id], h: S.held[id] } }) }

  function message () {
    var lines = [t('msg.hello'), '']
    lines.push('• ' + t('msg.day') + ': ' + fmtDate(dayDate(), true))
    lines.push('• ' + t('msg.time') + ': ' + hhmm(S.time))
    lines.push('• ' + t('msg.people') + ': ' + S.people)
    if (S.name.trim()) lines.push('• ' + t('msg.name') + ': ' + S.name.trim())
    heldList().forEach(function (x) {
      lines.push('• ' + t('msg.hold') + ': ' + t('msg.fish', { fish: x.f.sq + (lang === 'en' ? ' (' + x.f.en.toLowerCase() + ')' : ''), kg: fmtKg(x.h.kg), cook: t('cook.' + x.h.cook).toLowerCase() }))
    })
    if (S.note.trim()) lines.push('• ' + t('msg.note') + ': ' + S.note.trim())
    lines.push('', t('msg.foot'))
    return lines.join('\n')
  }
  function waHref () { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(message()) }

  var lastMsg = []
  function renderSlate () {
    var slate = $('#slate'); if (!slate) return
    var lines = message().split('\n')
    slate.innerHTML = ''
    lines.forEach(function (ln, i) {
      var p = document.createElement('span')
      p.className = 'slate__line' + (ln === '' ? ' slate__line--gap' : '')
      p.textContent = ln
      if (lastMsg.length && lastMsg.indexOf(ln) === -1 && ln) p.classList.add('is-new')
      slate.appendChild(p)
    })
    lastMsg = lines
  }

  function renderBooking () {
    fillTimes()
    $$('[data-bind="day"]').forEach(function (r) { r.checked = r.value === S.day })
    $$('select[data-bind="date"]').forEach(function (sel) {
      var html = ''
      for (var i = 2; i < 30; i++) {
        var d = dateFor(i), iso = isoOf(d)
        html += '<option value="' + iso + '"' + (iso === S.date ? ' selected' : '') + '>' + fmtDate(d) + '</option>'
      }
      sel.innerHTML = html
    })
    $$('.field--date').forEach(function (el) { el.hidden = S.day !== 'other' })
    $$('[data-bind="people"]').forEach(function (o) { o.value = S.people; o.textContent = S.people })
    $$('[data-step="people-"]').forEach(function (b) { b.disabled = S.people <= 1 })
    $$('[data-step="people+"]').forEach(function (b) { b.disabled = S.people >= 12 })
    var big = $('#big-group'); if (big) big.hidden = S.people < 12
    var n = Object.keys(S.held).length
    var sum = t('sum', { p: S.people, day: dayLabel(), time: hhmm(S.time) }) + (n ? t('sum.held', { n: n }) : '')
    $$('[data-sum]').forEach(function (el) { el.textContent = sum })
    var href = waHref()
    $$('[data-wa]').forEach(function (a) { a.href = href })
    renderHeld()
    renderSlate()
  }

  function renderHeld () {
    var box = $('#held'); if (!box) return
    var list = heldList()
    if (!list.length) { box.innerHTML = '<p class="held__empty">' + t('book.noheld') + '</p>'; return }
    box.innerHTML = '<ul class="held__list" role="list">' + list.map(function (x) {
      return '<li><span class="held__fish">' + x.f.sq + '</span> <span class="held__meta">' + fmtKg(x.h.kg) + ' kg · ' + t('cook.' + x.h.cook) + '</span>' +
        '<button type="button" class="link-btn" data-unhold="' + x.f.id + '">' + t('book.remove') + '</button></li>'
    }).join('') + '</ul>'
  }

  function renderLive () {
    var present = FISH.filter(function (f) { return leftKg(f) > 0 })
    var kg = present.reduce(function (a, f) { return a + leftKg(f) }, 0)
    $$('[data-live="today"]').forEach(function (el) { el.textContent = t('live.today', { n: present.length, kg: fmtKg(kg) }) })
    var m = tirana().min, st
    if (m >= OPEN && m < KITCHEN) st = t('live.open')
    else if (m >= KITCHEN && m < CLOSE) st = t('live.kitchen')
    else st = m < OPEN ? t('live.closed') : t('live.closedtom')
    $$('[data-live="open"]').forEach(function (el) { el.textContent = st; el.classList.toggle('is-closed', !(m >= OPEN && m < CLOSE)) })
    $$('[data-live="log"]').forEach(function (el) { el.textContent = t('log', { out: hhmm(outMin), back: hhmm(backMin), date: fmtDate(dateFor(0)) }) })
  }

  function renderCatch () {
    $$('.fish').forEach(function (el) {
      var f = BY[el.getAttribute('data-fish')]; if (!f) return
      var left = leftKg(f)
      el.classList.toggle('is-none', !f.landed)
      el.classList.toggle('is-held', !!S.held[f.id])
      el.classList.toggle('is-sel', S.sel === f.id)
      var btn = $('.fish__btn', el)
      btn.setAttribute('aria-pressed', String(S.sel === f.id))
      btn.disabled = !f.landed || left <= 0
      $('.fish__en', el).textContent = lang === 'sq' ? f.la : f.en
      $('.fish__price', el).textContent = fmtLek(f.lek) + t('fish.perkg')
      $('.fish__eur', el).textContent = fmtEur(f.lek)
      var st = $('.fish__left', el)
      st.textContent = !f.landed ? t('fish.none') : (left <= 0 ? t('soldout') : (S.held[f.id] ? t('fish.held') + ' · ' : '') + t('left', { kg: fmtKg(left) }))
    })
    $('.catch').classList.toggle('has-sel', !!S.sel)
    document.body.classList.toggle('sel-open', !!S.sel)
    renderDetail()
    renderMenuBoat()
  }

  function renderMenuBoat () {
    var ul = $('#menu-boat'); if (!ul) return
    ul.innerHTML = FISH.map(function (f) {
      var left = leftKg(f)
      return '<li class="dish' + (left > 0 ? '' : ' is-off') + '"><span class="dish__name">' + f.sq + '</span>' +
        '<span class="dish__desc">' + (lang === 'sq' ? f.la : f.en) + (left > 0 ? '' : ' · ' + (f.landed ? t('soldout') : t('fish.none'))) + '</span>' +
        '<span class="dish__price"><b>' + fmtLek(f.lek) + '</b>' + t('fish.perkg') + ' <small>' + fmtEur(f.lek) + '</small></span></li>'
    }).join('')
  }

  function renderDetail () {
    var d = $('#detail'); if (!d) return
    d.classList.toggle('is-empty', !S.sel)
    if (!S.sel) return
    var f = BY[S.sel]
    var dr = S.draft[f.id] || (S.held[f.id] ? { kg: S.held[f.id].kg, cook: S.held[f.id].cook } : { kg: 1, cook: f.cook[0] })
    S.draft[f.id] = dr
    var max = Math.max(f.step, Math.floor(leftKg(f) / f.step) * f.step)
    if (dr.kg > max) dr.kg = max
    $('#d-name').textContent = f.sq
    $('#d-sub').textContent = (lang === 'sq' ? '' : f.en + ' · ') + f.la
    $('#d-cooks').innerHTML = f.cook.map(function (c) {
      return '<label class="pick"><input type="radio" name="d-cook" value="' + c + '"' + (dr.cook === c ? ' checked' : '') + '><span>' + t('cook.' + c) + '</span></label>'
    }).join('')
    $('#d-kg').textContent = fmtKg(dr.kg) + ' kg'
    $('#d-less').disabled = dr.kg <= f.step
    $('#d-more').disabled = dr.kg + f.step > max + 1e-9
    $('#d-est').textContent = t('d.est') + ' ' + fmtLek(Math.round(dr.kg * f.lek / 50) * 50) + ' · ' + t('d.serves') + ' ' + t('serves', { n: Math.max(1, Math.round(dr.kg / 0.4)) })
    var hb = $('#d-hold')
    hb.textContent = S.held[f.id] ? t('d.unhold') : t('d.hold')
    hb.classList.toggle('is-held', !!S.held[f.id])
  }

  function renderAll () { renderLive(); renderCatch(); renderBooking() }

  // ---------- Events ----------
  document.addEventListener('click', function (e) {
    var b = e.target.closest('button, [data-lang]'); if (!b) return
    if (b.hasAttribute('data-lang')) { lang = b.getAttribute('data-lang'); store.set('kripe-lang', lang); applyLang(); return }
    var st = b.getAttribute('data-step')
    if (st === 'people-') { S.people = Math.max(1, S.people - 1); renderBooking(); return }
    if (st === 'people+') { S.people = Math.min(12, S.people + 1); renderBooking(); return }
    if (b.classList.contains('fish__btn')) {
      var id = b.closest('.fish').getAttribute('data-fish')
      S.sel = S.sel === id ? null : id
      renderCatch()
      if (S.sel) { var d = $('#detail'); d && d.focus({ preventScroll: true }); revealDetail() }
      return
    }
    if (b.id === 'd-close') { var was = S.sel; S.sel = null; renderCatch(); var fb = $('.fish[data-fish="' + was + '"] .fish__btn'); fb && fb.focus(); return }
    if (b.id === 'd-less' || b.id === 'd-more') {
      var f = BY[S.sel], dr = S.draft[f.id]
      dr.kg = Math.round((dr.kg + (b.id === 'd-more' ? f.step : -f.step)) * 10) / 10
      if (S.held[f.id]) S.held[f.id].kg = dr.kg
      renderDetail(); renderBooking(); return
    }
    if (b.id === 'd-hold') {
      var f2 = BY[S.sel], dr2 = S.draft[f2.id]
      if (S.held[f2.id]) delete S.held[f2.id]
      else S.held[f2.id] = { kg: dr2.kg, cook: dr2.cook }
      renderCatch(); renderBooking(); return
    }
    if (b.hasAttribute('data-unhold')) { delete S.held[b.getAttribute('data-unhold')]; renderCatch(); renderBooking(); return }
    if (b.hasAttribute('data-chip')) {
      var txt = t(b.getAttribute('data-chip'))
      var parts = S.note.split(/\s*,\s*/).filter(Boolean)
      var i = parts.indexOf(txt)
      if (i === -1) parts.push(txt); else parts.splice(i, 1)
      S.note = parts.join(', ')
      var ta = $('#b-note'); if (ta) ta.value = S.note
      b.setAttribute('aria-pressed', String(i === -1))
      renderBooking(); return
    }
    if (b.id === 'copy') {
      var msg = message()
      var done = function () { b.textContent = t('book.copied'); setTimeout(function () { b.textContent = t('book.copy') }, 1800) }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(msg).then(done, function () {})
      return
    }
  })
  document.addEventListener('change', function (e) {
    var el = e.target, bind = el.getAttribute('data-bind')
    if (bind === 'day') {
      S.day = el.value
      if (S.day === 'other' && !S.date) S.date = isoOf(dateFor(2))
      renderBooking()
      if (S.day === 'other') { var dp = el.closest('form').querySelector('[data-bind="date"]'); dp && dp.focus() }
    } else if (bind === 'date') { if (el.value) { S.date = el.value; S.day = 'other' } renderBooking() }
    else if (bind === 'time') { S.time = +el.value; renderBooking() }
    else if (el.name === 'd-cook') {
      var f = BY[S.sel]; S.draft[f.id].cook = el.value
      if (S.held[f.id]) S.held[f.id].cook = el.value
      renderBooking()
    }
  })
  document.addEventListener('input', function (e) {
    if (e.target.id === 'b-name') { S.name = e.target.value; renderBooking() }
    if (e.target.id === 'b-note') {
      S.note = e.target.value
      $$('[data-chip]').forEach(function (c) { c.setAttribute('aria-pressed', String(S.note.indexOf(t(c.getAttribute('data-chip'))) !== -1)) })
      renderBooking()
    }
  })
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && S.sel) { var was = S.sel; S.sel = null; renderCatch(); var fb = $('.fish[data-fish="' + was + '"] .fish__btn'); fb && fb.focus() }
  })
  $$('form').forEach(function (f) { f.addEventListener('submit', function (e) { e.preventDefault() }) })

  function revealDetail () {
    var d = $('#detail'); if (!d) return
    var r = d.getBoundingClientRect()
    if (r.bottom > window.innerHeight || r.top < 0) d.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' })
  }

  // Dock (phones): show once the waterline plate has scrolled away, hide at the booking section.
  var dock = $('.dock'), quick = $('#quick'), book = $('#book')
  if (dock && 'IntersectionObserver' in window) {
    var seen = { quick: true, book: false }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { seen[en.target === quick ? 'quick' : 'book'] = en.isIntersecting })
      dock.classList.toggle('is-on', !seen.quick && !seen.book)
    }, { threshold: 0 })
    quick && io.observe(quick); book && io.observe(book)
  }

  // Credits toggle text stays semantic (<details>), nothing to do.
  setInterval(renderLive, 60000)
  document.documentElement.classList.add('js')
  applyLang()
})()
