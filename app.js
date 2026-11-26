(function () {
  var tabs = [].slice.call(document.querySelectorAll('[role="tab"]'));
  if (!tabs.length) return;
  var bar = document.querySelector('.tabbar');
  var wrap = document.querySelector('.tabs-wrap');
  var ind = document.querySelector('.tab-ind');
  var ids = tabs.map(function (t) { return t.dataset.tab; });

  function panelOf(t) { return document.getElementById(t.getAttribute('aria-controls')); }

  function moveInd(t) {
    ind.style.width = t.offsetWidth + 'px';
    ind.style.transform = 'translateX(' + t.offsetLeft + 'px)';
    var l = t.offsetLeft, r = l + t.offsetWidth;
    if (l < bar.scrollLeft) bar.scrollLeft = l - 16;
    else if (r > bar.scrollLeft + bar.clientWidth) bar.scrollLeft = r - bar.clientWidth + 16;
  }

  function show(id, opts) {
    opts = opts || {};
    var t = tabs[ids.indexOf(id)] || tabs[0];
    tabs.forEach(function (x) {
      var on = x === t;
      x.setAttribute('aria-selected', on ? 'true' : 'false');
      x.tabIndex = on ? 0 : -1;
      var p = panelOf(x);
      p.hidden = !on;
      p.classList.toggle('in', on);
    });
    moveInd(t);
    if (opts.focus) t.focus();
    if (opts.push) history.replaceState(null, '', '#' + t.dataset.tab);
    if (opts.scroll && window.scrollY > wrap.offsetTop) window.scrollTo({ top: wrap.offsetTop, behavior: 'smooth' });
  }

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { show(t.dataset.tab, { push: true, scroll: true }); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = null;
      if (k === 'ArrowRight') n = (i + 1) % tabs.length;
      else if (k === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
      else if (k === 'Home') n = 0;
      else if (k === 'End') n = tabs.length - 1;
      if (n === null) return;
      e.preventDefault();
      show(tabs[n].dataset.tab, { focus: true, push: true });
    });
  });

  [].slice.call(document.querySelectorAll('[data-go]')).forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      show(a.dataset.go, { push: true, scroll: true });
    });
  });

  window.addEventListener('hashchange', function () { show(location.hash.slice(1)); });
  window.addEventListener('resize', function () {
    var cur = tabs.filter(function (x) { return x.getAttribute('aria-selected') === 'true'; })[0];
    if (cur) moveInd(cur);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () {
    var cur = tabs.filter(function (x) { return x.getAttribute('aria-selected') === 'true'; })[0];
    if (cur) moveInd(cur);
  });

  show(location.hash.slice(1));
})();
