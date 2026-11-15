// Demo form: no backend, so show a confirmation instead of sending.
const f = document.getElementById('book-form'), ok = document.getElementById('sent')
f?.addEventListener('submit', e => { e.preventDefault(); if (ok) ok.hidden = false })
