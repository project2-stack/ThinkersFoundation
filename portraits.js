/* Thinkers Foundation - portrait plates
   Portraits are requested from the Wikimedia API and inserted into the plates.
   Two passes: the page image for each article, then, for any plate still empty,
   the first suitable illustration on that article. Plates that resolve to
   nothing keep their initials. The image element is attached to the document
   before its source is assigned, since a detached image is never fetched. */
(function () {
  var figures = Array.prototype.slice.call(document.querySelectorAll('.portrait[data-wiki]'));
  if (!figures.length || !window.fetch) return;

  var API = 'https://en.wikipedia.org/w/api.php';
  var byTitle = {};
  figures.forEach(function (f) {
    var t = f.getAttribute('data-wiki');
    (byTitle[t] = byTitle[t] || []).push(f);
  });
  var titles = Object.keys(byTitle);

  var REJECT = /(commons-logo|wikiquote|wikisource|wikidata|wiktionary|wikibooks|wikiversity|portal|question_book|edit-icon|ambox|disambig|symbol|padlock|loudspeaker|speakerlink|wiki_letter|folder_hexagon|magnify-clip|blue_pencil|red_pencil|nuvola|crystal|flag_of|map_of|coat_of_arms|signature|autograph|text_document|open_access|arrow|star_full|emblem)/i;
  var ALLOW = /\.(jpe?g|png|gif|webp)$/i;

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

  function unresolved() {
    return titles.filter(function (t) {
      return (byTitle[t] || []).some(function (f) { return !f.querySelector('img'); });
    });
  }

  function secondPass(title) {
    var url = API + '?action=query&format=json&origin=*&redirects=1'
      + '&generator=images&gimlimit=14&prop=imageinfo&iiprop=url&iiurlwidth=400'
      + '&titles=' + encodeURIComponent(title);

    fetch(url).then(function (r) { return r.json(); }).then(function (data) {
      var pages = data && data.query && data.query.pages;
      if (!pages) return;
      var best = null;
      Object.keys(pages).forEach(function (id) {
        if (best) return;
        var pg = pages[id];
        var name = (pg.title || '').replace(/^File:/, '');
        if (!ALLOW.test(name) || REJECT.test(name)) return;
        var info = pg.imageinfo && pg.imageinfo[0];
        if (info) best = info.thumburl || info.url;
      });
      if (best) place(title, best);
    }).catch(function () {});
  }

  function firstPass(batch, done) {
    var url = API + '?action=query&format=json&origin=*&redirects=1'
      + '&prop=pageimages&piprop=thumbnail&pithumbsize=400&pilicense=any&pilimit=50'
      + '&titles=' + batch.map(encodeURIComponent).join('%7C');

    fetch(url).then(function (r) { return r.json(); }).then(function (data) {
      var q = data && data.query;
      if (q && q.pages) {
        var alias = {};
        ['normalized', 'redirects'].forEach(function (k) {
          (q[k] || []).forEach(function (m) { alias[m.to] = alias[m.from] || m.from; });
        });
        Object.keys(q.pages).forEach(function (id) {
          var pg = q.pages[id];
          if (!pg || !pg.thumbnail || !pg.thumbnail.source) return;
          var asked = alias[pg.title] || pg.title;
          if (byTitle[asked]) place(asked, pg.thumbnail.source);
        });
      }
    }).catch(function () {}).then(done, done);
  }

  var pending = 0;
  for (var i = 0; i < titles.length; i += 40) {
    pending++;
    firstPass(titles.slice(i, i + 40), function () {
      if (--pending === 0) {
        window.setTimeout(function () { unresolved().forEach(secondPass); }, 250);
      }
    });
  }
})();
