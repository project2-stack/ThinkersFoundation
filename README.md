# Thinkers Foundation

An independent review of economics, moral politics, and philosophy. A static site with no build step and no dependencies.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Masthead, current article, the four subjects, guide notice, submissions |
| `economics.html` | Articles under Economics |
| `moral-politics.html` | Articles under Moral Politics |
| `philosophy.html` | Articles under Philosophy |
| `miscellaneous.html` | Articles under Miscellaneous |
| `articles/the-best-something.html` | The article itself |
| `political-thought-guide.html` | Reference work: 6 eras, 48 schools, 123 thinkers, with portraits |
| `about.html` | Purpose of the review and submission terms |

Each subject is a page of its own. The sidebar carries one link per subject and one link to the guide.

## Adding an article

1. Copy `articles/the-best-something.html`, rename it, and replace the kicker, title, standfirst, and paragraphs.
2. Add an `<li>` to the `<ul class="listing">` on that subject's page, copying the existing one as the pattern.
3. To lead the site with it, replace the block inside `<section id="lead">` in `index.html` and update the count on that subject's card.

## Portraits

`assets/js/portraits.js` requests portraits from the Wikimedia API in batches and inserts them into the plates beside each thinker. Nothing is stored in the repository. Where Wikimedia holds no image the plate keeps the thinker's initials.

## Palette and type

| Role | Value |
| --- | --- |
| Background | `#F7F3EA` |
| Alternate background | `#FBF8F2` |
| Headings, links, accents | `#5A1E24` |
| Body text | `#4A4A4A` |
| Rules and dividers | `#D8CEC0` |

Cormorant Garamond for display, Spectral for body. All values sit in `:root` at the top of `assets/css/style.css`.

## Publishing

Commit and push from GitHub Desktop. Every file belongs at the repository root, not in a subfolder.
