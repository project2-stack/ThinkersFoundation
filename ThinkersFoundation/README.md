# Thinkers Foundation

Essays and research in political economy, philosophy, and history.

A static site. No build step, no dependencies, no framework. Open the HTML files in a browser and they work.

## Files

```
index.html          Homepage: masthead, featured essay, latest publications, fields of study
guide.html          Political Philosophy: A Guide by Era and School (7 eras, 51 schools, 132 thinkers)
about.html          About page (placeholder text, replace it)
logo_thf.png        Masthead logo (keep this filename)
.nojekyll           Tells GitHub Pages to serve the files as they are
assets/css/style.css
assets/js/site.js   Drawer index: open, close, expand eras
```

## Design

Two colours only, following the identity guide.

| Role | Hex |
| --- | --- |
| Background | `#F7F3EA` |
| Alternate background | `#FBF8F2` |
| Headings, links, accents | `#5A1E24` |
| Body text | `#4A4A4A` |
| Rules and dividers | `#D8CEC0` |

Display face: Cormorant Garamond. Body face: Spectral. Both load from Google Fonts, with system serifs as fallback.

Colours live in `:root` at the top of `style.css`. Change them there and the whole site follows.

## The index drawer

The three lines at the top left open a drawer holding the full classification: seven eras, each expanding to its schools, each school listing its thinkers. Every entry links to its anchor in `guide.html`.

To add a thinker, add an `<article class="thinker" id="thinker-name">` block to the right school in `guide.html`, then add a matching `<li>` to that school's list inside the drawer. The drawer markup is duplicated in all three pages, so paste the same line into each.

## Publishing

1. Commit and push from GitHub Desktop.
2. On GitHub: Settings, then Pages, then Source: deploy from branch `main`, folder `/ (root)`.
3. The site appears at `https://project2-stack.github.io/ThinkersFoundation/`.

## To do

- Replace the placeholder essays on the homepage with real ones
- Write the About page
- Add individual essay pages under an `essays/` folder
