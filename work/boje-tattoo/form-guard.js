/* Form guard: stops spam bots on every form without bothering real visitors.
   - adds a hidden "honeypot" field that people never see; bots fill it in
   - ignores forms sent less than 3 seconds after the page opened (bots are instant)
   Blocked sends are dropped silently, so bots learn nothing.
   Double-click protection stays in each site's own form code (button disabled while sending). */
(function () {
  'use strict';
  var opened = Date.now();

  function addTrap(form) {
    if (form.querySelector('input[name="website_url"]')) return;
    var wrap = document.createElement('div');
    wrap.setAttribute('aria-hidden', 'true');
    wrap.style.cssText = 'position:absolute!important;left:-9999px!important;width:1px;height:1px;overflow:hidden';
    var input = document.createElement('input');
    input.type = 'text';
    input.name = 'website_url';
    input.tabIndex = -1;
    input.autocomplete = 'off';
    wrap.appendChild(input);
    form.appendChild(wrap);
  }

  function isBot(form) {
    var trap = form.querySelector('input[name="website_url"]');
    if (trap && trap.value) return true;
    return Date.now() - opened < 3000;
  }

  function init() {
    Array.prototype.forEach.call(document.forms, addTrap);
    new MutationObserver(function () {
      Array.prototype.forEach.call(document.forms, addTrap);
    }).observe(document.body, { childList: true, subtree: true });
  }

  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (form instanceof HTMLFormElement && isBot(form)) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
