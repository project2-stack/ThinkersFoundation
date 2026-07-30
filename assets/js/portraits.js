/* Thinkers Foundation - portrait plates
   Portraits are requested from the Wikimedia API in batches and inserted into
   the plates beside each thinker. Plates without an available image keep their
   initials. The image element is attached to the document before its source is
   assigned; a detached image marked for lazy loading is never fetched. */
(function () {
  var figures = Array.prototype.slice.call(document.querySelectorAll('.portrait[data-wiki]'));
  if (!figures.length || !window.fetch) return;

  var byTitle = {};
  figures.forEach(function (f) {
    var t = f.getAttribute('data-wiki');
    (byTitle[t] = byTitle[t] || []).push(f);
  });

  var titles = Object.keys(byTitle);

  function place(title, url) {
    (byTitle[title] || []).forEach(function (fig) {
      if (fig.querySelector('img')) return;

      var img = document.createElement('img');
      img.alt = 'Portrait of ' + title.replace(/\s*\(.*?\)\s*/, '');
      img.decoding = 'async';
      img.referrerPolicy = 'no-referrer';

      img.addEventListener('load', function () {
        img.classList.add('is-loaded');
        var fb = fig.querySelector('.portrait__fallback');
        if (fb) fb.style.display = 'none';
      });
      img.addEventListener('error', function () { img.remove(); });

      fig.appendChild(img);
      img.src = url;
    });
  }

  function request(batch) {
    var url = 'https://en.wikipedia.org/w/api.php'
      + '?action=query&format=json&origin=*&redirects=1'
      + '&prop=pageimages&piprop=thumbnail&pithumbsize=400&pilicense=any&pilimit=50'
      + '&titles=' + batch.map(encodeURIComponent).join('%7C');

    fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var q = data && data.query;
        if (!q || !q.pages) return;

        var alias = {};
        ['normalized', 'redirects'].forEach(function (k) {
          (q[k] || []).forEach(function (m) { alias[m.to] = alias[m.from] || m.from; });
        });

        Object.keys(q.pages).forEach(function (id) {
          var page = q.pages[id];
          if (!page || !page.thumbnail || !page.thumbnail.source) return;
          var asked = alias[page.title] || page.title;
          if (byTitle[asked]) place(asked, page.thumbnail.source);
        });
      })
      .catch(function () { /* plates keep their initials */ });
  }

  for (var i = 0; i < titles.length; i += 40) request(titles.slice(i, i + 40));
})();
