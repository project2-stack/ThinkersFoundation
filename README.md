# Thinkers Foundation

An independent review of economics, moral politics, and philosophy.

A static site. No build step, no dependencies, no framework.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Masthead, featured essay, the four subjects, guide notice, submissions |
| `essays.html` | Every published essay, arranged under Economics, Moral Politics, Philosophy, Miscellaneous |
| `essays/the-best-something.html` | The essay itself |
| `political-thought-guide.html` | Standing reference work: 6 eras, 48 schools, 123 thinkers, with portraits |
| `about.html` | Purpose of the review and submission terms |

Each page has one job and no page repeats another. The guide is reference material and carries no argument; the essays argue and carry no reference apparatus.

## Portraits

`assets/js/portraits.js` requests portraits from the Wikimedia API in batches of fifty and inserts them into the plates beside each thinker. Nothing is stored in the repository, so the images cost no space and never go stale. Where Wikimedia holds no image, the plate keeps the thinker's initials.

## Adding an essay

1. Copy `essays/the-best-something.html`, rename it, and replace the title, kicker, standfirst, and body paragraphs.
2. Open `essays.html` and add a `<li>` to the correct subject's `<ul class="listing">`, copying the existing one as the pattern.
3. If the essay should lead the site, replace the block inside `<section id="featured">` in `index.html` and update the essay count on that subject's card.

## Palette and type

| Role | Value |
| --- | --- |
| Background | `#F7F3EA` |
| Alternate background | `#FBF8F2` |
| Headings, links, accents | `#5A1E24` |
| Body text | `#4A4A4A` |
| Rules and dividers | `#D8CEC0` |

Display face Cormorant Garamond, body face Spectral, both from Google Fonts with system serifs behind them. Every value sits in `:root` at the top of `assets/css/style.css`.

## Publishing

Commit and push from GitHub Desktop. GitHub Pages serves the repository root, so all of these files belong at the top level of the repository, not inside a subfolder.
