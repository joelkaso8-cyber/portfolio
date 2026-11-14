/* Vjosa Rafting: the tour at a glance and 1-tap WhatsApp booking.
   Pick a tour, a day and the number of guests; the WhatsApp button (and the phone dock at the bottom of the
   screen) always holds a message with those filled in, so one tap opens WhatsApp ready to send. */
(function () {
  'use strict';
  var WA = '355684340615', PRICE = 30, MAX = 24;
  var form = document.getElementById('qb'); if (!form) return;
  var $ = function (s) { return document.querySelector(s); };
  var TRIPS = {
    morning: { name: 'Morning Run', time: '09:30', short: 'Morning' },
    afternoon: { name: 'Afternoon Run', time: '13:00', short: 'Afternoon' },
    custom: { name: 'Custom Time / Group run', time: '', short: 'Custom time' }
  };
  var n = 2;
  var iso = function (d) { return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };
  var dayAt = function (k) { var d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + k); return d; };
  var label = function (d) { return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }); };
  var dateIn = $('#qb-date');
  dateIn.min = iso(new Date());
  Array.prototype.forEach.call(document.querySelectorAll('#qb [data-day]'), function (el) { el.textContent = label(dayAt(+el.dataset.day)); });

  function pickedDay() {
    var v = form.elements.qday.value;
    if (v === 'pick') { return dateIn.value ? new Date(dateIn.value + 'T12:00:00') : null; }
    return dayAt(+v);
  }
  function render() {
    var trip = TRIPS[form.elements.qtrip.value] || TRIPS.afternoon, day = pickedDay(), dayText = day ? label(day) : 'a day to agree';
    var who = n + (n === 1 ? ' person' : ' people');
    $('#qb-n').textContent = n;
    $('#qb-minus').disabled = n <= 1; $('#qb-plus').disabled = n >= MAX;
    $('#qb-total').innerHTML = '';
    $('#qb-total').append(n + ' × €' + PRICE + ' = ', Object.assign(document.createElement('b'), { textContent: '€' + n * PRICE }), ', paid on the day');
    $('#qb-date-l').hidden = form.elements.qday.value !== 'pick';
    $('#qb-pick-l').textContent = form.elements.qday.value === 'pick' && day ? label(day) : 'pick a date';
    var msg = 'Hello Adion! I would like to book the ' + trip.name + (trip.time ? ' (' + trip.time + ')' : '') + ' on ' + dayText + ' for ' + who + '.' +
      (trip.time ? '' : ' What start times are free?') + '\nIs there space? (Sent from the Vjosa Rafting website)';
    var url = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
    $('#qb-go').href = url;
    var dock = $('#qb-dock'); dock.href = url;
    $('#qb-dock-s').textContent = trip.short + ' · ' + (day ? (form.elements.qday.value === '1' ? 'tomorrow' : form.elements.qday.value === '0' ? 'today' : label(day)) : 'pick a day') + ' · ' + who.replace('people', 'guests').replace('person', 'guest');
  }
  form.addEventListener('change', render);
  dateIn.addEventListener('input', render);
  $('#qb-minus').addEventListener('click', function () { n = Math.max(1, n - 1); render(); });
  $('#qb-plus').addEventListener('click', function () { n = Math.min(MAX, n + 1); render(); });
  form.addEventListener('submit', function (e) { e.preventDefault(); });
  // "Other day" with no date yet: the button asks for the date instead of sending an empty day.
  $('#qb-go').addEventListener('click', function (e) {
    if (form.elements.qday.value === 'pick' && !dateIn.value) { e.preventDefault(); dateIn.focus(); if (dateIn.showPicker) try { dateIn.showPicker(); } catch (x) {} }
  });
  // Every "Book Morning / Afternoon / Custom" button on the page also picks that tour here.
  Array.prototype.forEach.call(document.querySelectorAll('[data-trip]'), function (a) {
    a.addEventListener('click', function () { var r = form.querySelector('input[name="qtrip"][value="' + a.dataset.trip + '"]'); if (r) { r.checked = true; render(); } });
  });

  // Phone dock: shows once the film is behind you, and hides while the booking card or the full form is on screen.
  var dock = $('#qb-dock'), hero = document.getElementById('top'), seen = new Set();
  function dockState() {
    var past = hero ? hero.getBoundingClientRect().bottom < window.innerHeight * 0.6 : true;
    dock.hidden = !past || seen.size > 0;
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) seen.add(en.target); else seen.delete(en.target); }); dockState(); }, { threshold: 0.15 });
    [form, document.getElementById('bookForm'), document.getElementById('bookDone')].forEach(function (el) { if (el) io.observe(el); });
  }
  addEventListener('scroll', dockState, { passive: true });
  render(); dockState();
})();
