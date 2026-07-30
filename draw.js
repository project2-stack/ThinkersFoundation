/* Thinkers Foundation - draw a thinker
   Turning a card shuffles the stack, then deals a random entry from the guide. */
(function () {
  var card = document.getElementById('drawCard');
  if (!card || !window.THINKERS || !window.THINKERS.length) return;

  var deck = window.THINKERS;
  var recent = [];
  var busy = false;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SHUFFLE = reduced ? 0 : 640;

  var FACE =
    '<div class="draw__face">' +
      '<div class="deck" aria-hidden="true"><span></span><span></span><span></span></div>' +
      '<p class="draw__prompt" id="drawPrompt">The deck is cut and shuffled.</p>' +
      '<button class="draw__button" id="drawButton" type="button">Turn a card</button>' +
    '</div>';

  function pick() {
    var t, guard = 0;
    do {
      t = deck[Math.floor(Math.random() * deck.length)];
      guard++;
    } while (recent.indexOf(t.g) !== -1 && guard < 40);
    recent.push(t.g);
    if (recent.length > Math.min(12, deck.length - 1)) recent.shift();
    return t;
  }

  function initials(name) {
    return name.split(/\s+/)
      .filter(function (w) { return w && /[A-Za-z\u00C0-\u024F]/.test(w[0]); })
      .map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function loadPortrait(fig) {
    if (!fig || !window.fetch) return;
    var title = fig.getAttribute('data-wiki');
    var url = 'https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&redirects=1'
      + '&prop=pageimages&piprop=thumbnail&pithumbsize=400&pilicense=any'
      + '&titles=' + encodeURIComponent(title);

    fetch(url).then(function (r) { return r.json(); }).then(function (data) {
      var pages = data && data.query && data.query.pages;
      if (!pages) return;
      var src = null;
      Object.keys(pages).forEach(function (id) {
        var pg = pages[id];
        if (pg && pg.thumbnail && pg.thumbnail.source) src = pg.thumbnail.source;
      });
      if (!src || !fig.isConnected || fig.querySelector('img')) return;
      var img = document.createElement('img');
      img.alt = 'Portrait of ' + title;
      img.decoding = 'async';
      img.referrerPolicy = 'no-referrer';
      img.addEventListener('load', function () {
        img.classList.add('is-loaded');
        var fb = fig.querySelector('.portrait__fallback');
        if (fb) fb.style.display = 'none';
      });
      img.addEventListener('error', function () { img.remove(); });
      fig.appendChild(img);
      img.src = src;
    }).catch(function () {});
  }

  function deal(t) {
    card.setAttribute('data-state', 'drawn');
    card.innerHTML =
      '<figure class="portrait portrait--card" data-wiki="' + esc(t.k) + '">' +
        '<span class="portrait__fallback">' + esc(initials(t.n)) + '</span>' +
      '</figure>' +
      '<div class="draw__text">' +
        '<p class="draw__school">' + esc(t.c) + ' &middot; ' + esc(t.e) + '</p>' +
        '<h3 class="draw__name">' + esc(t.n) +
          (t.d ? ' <span class="draw__dates">' + esc(t.d) + '</span>' : '') + '</h3>' +
        (t.w ? '<p class="draw__works">' + esc(t.w) + '</p>' : '') +
        '<p class="draw__summary">' + esc(t.s) + '</p>' +
        '<p class="draw__actions">' +
          '<a class="more" href="political-thought-guide.html#' + esc(t.g) + '">Read the entry</a>' +
          '<button class="draw__again" type="button">Turn another</button>' +
        '</p>' +
      '</div>';
    loadPortrait(card.querySelector('.portrait[data-wiki]'));
    busy = false;
  }

  function turn() {
    if (busy) return;
    busy = true;
    var next = pick();

    if (!SHUFFLE) { deal(next); return; }

    card.innerHTML = FACE;
    card.setAttribute('data-state', 'shuffling');
    var prompt = card.querySelector('#drawPrompt');
    var button = card.querySelector('#drawButton');
    if (prompt) prompt.textContent = 'Shuffling';
    if (button) { button.disabled = true; button.textContent = 'Cutting the deck'; }

    window.setTimeout(function () { deal(next); }, SHUFFLE);
  }

  card.addEventListener('click', function (e) {
    var hit = e.target.closest('#drawButton, .draw__again');
    if (hit) turn();
  });
})();
