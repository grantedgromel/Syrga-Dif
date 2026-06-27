# Syrga Dif — Wedding Photographer Website

A full static rebuild of [syrgadif.com](https://syrgadif.com/) for **Syrga Dif**, a wedding
photographer based in Grenoble, available across France and worldwide. Bilingual **FR / EN**,
no build framework, no dependencies — just HTML, CSS and vanilla JS.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home (hero, approach, gallery teaser, destination, about, publications, testimonials, contact CTA, Instagram) |
| `weddings.html` | Portfolio — grid of all wedding galleries |
| `galleries/<slug>.html` | One page per wedding (hero + masonry + lightbox); 19 weddings + `egypte` travel diary |
| `about.html` | Bio & approach |
| `voyages.html` | Travels — featuring the Égypte travel diary |
| `faq.html` | Info / FAQ (accordion) |
| `contact.html` | Contact form + socials |

## Shared system

- **`assets/site.css`** — design tokens (ivory/cream/ink palette, Cormorant Garamond + Jost),
  components (header, mobile menu, portfolio/gallery grids, lightbox, FAQ, forms, footer), responsive + reduced-motion.
- **`assets/site.js`** — i18n engine (FR/EN, persisted in `localStorage` so the choice follows you across pages),
  mobile menu, FAQ accordion, and an accessible gallery lightbox (click / arrows / Esc).
  Each page supplies its own strings via `window.PAGE_I18N`.

The homepage (`index.html`) is intentionally self-contained (its own inline styles + script) but shares the
same `localStorage` language key, so language persists between it and the rest of the site.

## Images

`img/` holds the homepage/about/contacts/logo assets. The wedding and travel folders
(`lorene-eamonn/`, `Egypte/`, …) hold the full-resolution galleries; `_manifest.csv` records their provenance.

## Build & validate

Gallery pages and `weddings.html` are generated from the image folders:

    node build.mjs        # regenerate weddings.html + galleries/*.html
    node validate.mjs     # check every internal link + image ref resolves
    node i18ncheck.mjs    # check every data-k* key exists in both FR and EN

## View it locally

No build step required. Open `index.html`, or serve the folder:

    python -m http.server 8000   # then open http://localhost:8000

## Contact form

`contact.html` posts to a placeholder [Formspree](https://formspree.io/) endpoint —
replace `your-form-id` in the `<form action>` with a real endpoint (or another static-form backend) to receive submissions.
