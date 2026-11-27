(function () {
  var ids = ['overview', 'results', 'projects', 'experience', 'skills', 'life', 'contact'];
  var links = [].slice.call(document.querySelectorAll('[data-tab]'));
  var body = document.body;
  var burger = document.querySelector('.burger');
  var scrim = document.querySelector('.scrim');
  var chips = document.querySelector('.secnav');
  var panelsTop = document.querySelector('.panels');
  var mq = window.matchMedia('(max-width: 900px)');

  function show(id, push) {
    if (ids.indexOf(id) < 0) id = 'overview';
    ids.forEach(function (x) {
      var p = document.getElementById(x + '-panel');
      if (!p) return;
      p.hidden = x !== id;
      p.classList.toggle('in', x === id);
    });
    links.forEach(function (a) {
      if (a.dataset.tab === id) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    var c = chips && chips.querySelector('[aria-current]');
    if (c) chips.scrollLeft = c.offsetLeft - chips.clientWidth / 2 + c.offsetWidth / 2;
    if (push) history.pushState(null, '', '#' + id);
  }

  function closeDrawer() {
    body.classList.remove('drawer');
    scrim.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
  }

  links.forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      show(a.dataset.tab, true);
      closeDrawer();
      var off = mq.matches ? 100 : 70;
      var top = panelsTop.getBoundingClientRect().top + window.scrollY - off;
      if (window.scrollY > top) window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  burger.addEventListener('click', function () {
    if (mq.matches) {
      var open = !body.classList.contains('drawer');
      body.classList.toggle('drawer', open);
      scrim.hidden = !open;
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    } else {
      var mini = !body.classList.contains('mini');
      body.classList.toggle('mini', mini);
      burger.setAttribute('aria-expanded', mini ? 'false' : 'true');
    }
  });
  scrim.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });
  window.addEventListener('popstate', function () { show(location.hash.slice(1)); });
  burger.setAttribute('aria-expanded', mq.matches ? 'false' : 'true');
  show(location.hash.slice(1));
})();
