# Syrga Dif — Wedding Photographer Website

Static homepage for **Syrga Dif**, a wedding photographer based in France
(Lyon · Paris · Provence · French Riviera · destination weddings).

## Contents

- **`index.html`** — the homepage. A self-contained static page (HTML + inline CSS +
  vanilla JS) implemented from a Claude Design mockup. Features:
  - Bilingual **FR / EN** toggle (French default)
  - Testimonial carousel with wrap-around navigation
  - Responsive header with a full-screen mobile menu
  - Film-grain overlay, scroll-reveal animations, and an Instagram strip
  - Accessibility: translatable ARIA labels, live regions, `prefers-reduced-motion` support
- **`img/`** — image assets referenced by the page
  (`img/home/`, `img/about/`, `img/contacts/`, and `img/logo.png` favicon).
- **Gallery source folders** (`home/`, `about/`, `contacts/`, `voyages/`, `weddings/`,
  and the per-session folders) plus **`_manifest.csv`** — the full underlying image set.

## View it locally

No build step or dependencies. Open `index.html` directly, or serve the folder:

    python -m http.server 8000
    # then open http://localhost:8000

## Customization

Brand colors, fonts, and copy live in the `:root` variables, the `I18N` dictionary,
and the `TESTI` testimonial arrays at the top/bottom of `index.html`.
