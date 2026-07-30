/* Thinkers Foundation - portrait plates
   Portraits are requested from the Wikimedia API in batches of fifty and
   inserted once resolved. Entries without an image keep their initials plate. */
(function () {
  var figures = Array.prototype.slice.call(document.querySelectorAll('.portrait[data-wiki]'));
  if (!figures.length) return;

  var byTitle = {};
  figures.forEach(function (f) {
    var t = f.getAttribute('data-wiki');
    (byTitle[t] = byTitle[t] || []).push(f);
  });

  var titles = Object.keys(byTitle);
  var API = 'https://en.wikipedia.org/w/api.php';

  function place(title, url) {
    (byTitle[title] || []).forEach(function (fig) {
      var img = new Image();
      img.alt = 'Portrait of ' + title.replace(/\s*\(.*?\)\s*/, '');
      img.loading = 'lazy';
      img.decoding = 'async';
      img.referrerPolicy = 'no-referrer';
      img.onload = function () {
        fig.appendChild(img);
        requestAnimationFrame(function () { img.classList.add('is-loaded'); });
        var fb = fig.querySelector('.portrait__fallback');
        if (fb) fb.style.display = 'none';
      };
      img.src = url;
    });
  }

  function request(batch) {
    var params = new URLSearchParams({
      action: 'query',
      titles: batch.join('|'),
      prop: 'pageimages',
      piprop: 'thumbnail',
      pithumbsize: '400',
      pilimit: '50',
      pilicense: 'any',
      redirects: '1',
      format: 'json',
      origin: '*'
    });

    fetch(API + '?' + params.toString())
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var q = data && data.query;
        if (!q || !q.pages) return;

        /* map any redirected or normalised titles back to what we asked for */
        var alias = {};
        ['normalized', 'redirects'].forEach(function (k) {
          (q[k] || []).forEach(function (m) { alias[m.to] = alias[m.from] || m.from; });
        });

        Object.keys(q.pages).forEach(function (id) {
          var page = q.pages[id];
          if (!page.thumbnail || !page.thumbnail.source) return;
          var asked = alias[page.title] || page.title;
          if (byTitle[asked]) place(asked, page.thumbnail.source);
        });
      })
      .catch(function () { /* plates keep their initials */ });
  }

  for (var i = 0; i < titles.length; i += 50) request(titles.slice(i, i + 50));
})();
