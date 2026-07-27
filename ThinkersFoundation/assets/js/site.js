/* Thinkers Foundation - drawer index */
(function () {
  var toggle = document.getElementById('navToggle');
  var drawer = document.getElementById('drawer');
  var scrim  = document.getElementById('scrim');
  var close  = document.getElementById('drawerClose');
  if (!toggle || !drawer) return;

  function openDrawer() {
    drawer.setAttribute('data-open', 'true');
    scrim.hidden = false;
    scrim.setAttribute('data-open', 'true');
    toggle.setAttribute('aria-expanded', 'true');
    close.focus();
  }

  function closeDrawer() {
    drawer.setAttribute('data-open', 'false');
    scrim.setAttribute('data-open', 'false');
    toggle.setAttribute('aria-expanded', 'false');
    window.setTimeout(function () { scrim.hidden = true; }, 320);
    toggle.focus();
  }

  toggle.addEventListener('click', function () {
    drawer.getAttribute('data-open') === 'true' ? closeDrawer() : openDrawer();
  });
  close.addEventListener('click', closeDrawer);
  scrim.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.getAttribute('data-open') === 'true') closeDrawer();
  });

  /* Collapsible eras */
  var toggles = drawer.querySelectorAll('.tree__toggle');
  Array.prototype.forEach.call(toggles, function (btn) {
    btn.addEventListener('click', function () {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      panel.setAttribute('data-open', String(!open));
      btn.querySelector('.tree__sign').textContent = open ? '+' : '\u2212';
    });
  });

  /* Following a link inside the drawer closes it */
  Array.prototype.forEach.call(drawer.querySelectorAll('a'), function (a) {
    a.addEventListener('click', function () {
      drawer.setAttribute('data-open', 'false');
      scrim.setAttribute('data-open', 'false');
      toggle.setAttribute('aria-expanded', 'false');
      window.setTimeout(function () { scrim.hidden = true; }, 320);
    });
  });

  /* Opening the drawer on the guide page expands the era you are reading */
  var here = window.location.hash;
  if (here) {
    var link = drawer.querySelector('a[href$="' + here + '"]');
    if (link) {
      var panel = link.closest('.tree__panel');
      if (panel) {
        panel.setAttribute('data-open', 'true');
        var btn = drawer.querySelector('[aria-controls="' + panel.id + '"]');
        if (btn) {
          btn.setAttribute('aria-expanded', 'true');
          btn.querySelector('.tree__sign').textContent = '\u2212';
        }
      }
    }
  }
})();
