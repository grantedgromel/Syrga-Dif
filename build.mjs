// Static generator for Syrga Dif: weddings.html (portfolio) + galleries/<slug>.html
import { readdirSync, writeFileSync, mkdirSync } from "node:fs";

const ROOT = new URL("./", import.meta.url);
const dir = (p) => new URL(p, ROOT);

// Wedding galleries in the live-site order
const WEDDINGS = [
  { folder: "lorene-eamonn",       slug: "lorene-eamonn",       name: "Lorène & Eamonn" },
  { folder: "alexandra-luuk",      slug: "alexandra-luuk",      name: "Alexandra & Luuk" },
  { folder: "romane-james",        slug: "romane-james",        name: "Romane & James" },
  { folder: "lucie-philippe",      slug: "lucie-philippe",      name: "Lucie & Philippe" },
  { folder: "jasmine-benoit",      slug: "jasmine-benoit",      name: "Jasmine & Benoît" },
  { folder: "anastasia-quentin",   slug: "anastasia-quentin",   name: "Anastasia & Quentin" },
  { folder: "marie-guillaume",     slug: "marie-guillaume",     name: "Marie & Guillaume" },
  { folder: "laura-thomas",        slug: "laura-thomas",        name: "Laura & Thomas" },
  { folder: "lea-david",           slug: "lea-david",           name: "Léa & David" },
  { folder: "kuiny-sebastien",     slug: "kuiny-sebastien",     name: "Kuiny & Sébastien" },
  { folder: "Emily-Jean-Baptiste", slug: "emily-jean-baptiste", name: "Emily & Jean-Baptiste" },
  { folder: "valeria-wilfrid",     slug: "valeria-wilfrid",     name: "Valeria & Wilfrid" },
  { folder: "alison-olivier",      slug: "alison-olivier",      name: "Alison & Olivier" },
  { folder: "kawtar-joffrey",      slug: "kawtar-joffrey",      name: "Kawtar & Joffrey" },
  { folder: "sara-thomas",         slug: "sara-thomas",         name: "Sara & Thomas" },
  { folder: "rebecca-daniel",      slug: "rebecca-daniel",      name: "Rebecca & Daniel" },
  { folder: "kayra-ciro",          slug: "kayra-ciro",          name: "Kayra & Ciro" },
  { folder: "eden-virgil",         slug: "eden-virgil",         name: "Eden & Virgil" },
  { folder: "kelly-camille",       slug: "kelly-camille",       name: "Kelly & Camille" }
];

// Travel gallery (featured from /voyages)
const TRAVEL = [
  { folder: "Egypte", slug: "egypte", name: "Égypte", travel: true }
];

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const listImages = (folder) =>
  readdirSync(dir(folder + "/"))
    .filter((f) => /\.jpe?g$/i.test(f))
    .sort();

// ---- shared chrome (base = "" for root pages, "../" for galleries/) ----
function header(base, active) {
  const cur = (k) => (active === k ? ' aria-current="page"' : "");
  return `<header class="site-header">
  <div class="site-header__inner">
    <a href="${base}index.html" class="brand">Syrga Dif</a>
    <nav class="nav-desktop">
      <a class="navlink" data-k="navHome" href="${base}index.html"${cur("home")}>Accueil</a>
      <a class="navlink" data-k="navPortfolio" href="${base}weddings.html"${cur("portfolio")}>Portfolio</a>
      <a class="navlink" data-k="navAbout" href="${base}about.html"${cur("about")}>À propos</a>
      <a class="navlink" data-k="navTravels" href="${base}voyages.html"${cur("travels")}>Voyages</a>
      <a class="navlink" data-k="navInfo" href="${base}faq.html"${cur("info")}>Info</a>
      <a class="navlink" data-k="navContact" href="${base}contact.html"${cur("contact")}>Contact</a>
      <div class="lang">
        <button type="button" class="lang-btn" data-lang="fr" onclick="setLang('fr')" aria-label="Français">FR</button>
        <span class="lang__sep">/</span>
        <button type="button" class="lang-btn" data-lang="en" onclick="setLang('en')" aria-label="English">EN</button>
      </div>
    </nav>
    <button type="button" id="navBurger" class="nav-burger" onclick="openMenu()" aria-label="Menu" aria-expanded="false" aria-controls="mobileMenu" data-k-aria="menuLabel"><span></span></button>
  </div>
</header>
<div class="mobile-menu" id="mobileMenu">
  <div class="mobile-menu__top">
    <span class="mobile-menu__title">Syrga Dif</span>
    <button type="button" class="mobile-menu__close" onclick="closeMenu()" aria-label="Fermer" data-k-aria="closeLabel">&#10005;</button>
  </div>
  <nav>
    <a data-k="navHome" href="${base}index.html" onclick="closeMenu()"${cur("home")}>Accueil</a>
    <a data-k="navPortfolio" href="${base}weddings.html" onclick="closeMenu()"${cur("portfolio")}>Portfolio</a>
    <a data-k="navAbout" href="${base}about.html" onclick="closeMenu()"${cur("about")}>À propos</a>
    <a data-k="navTravels" href="${base}voyages.html" onclick="closeMenu()"${cur("travels")}>Voyages</a>
    <a data-k="navInfo" href="${base}faq.html" onclick="closeMenu()"${cur("info")}>Info</a>
    <a data-k="navContact" href="${base}contact.html" onclick="closeMenu()"${cur("contact")}>Contact</a>
  </nav>
  <div class="mobile-menu__lang">
    <button type="button" class="lang-btn" data-lang="fr" onclick="setLang('fr')">Français</button>
    <span class="lang__sep">/</span>
    <button type="button" class="lang-btn" data-lang="en" onclick="setLang('en')">English</button>
  </div>
</div>`;
}

function footer(base) {
  return `<footer class="site-footer">
  <div class="wrap">
    <div class="site-footer__cols">
      <div style="flex:1 1 280px;">
        <div class="site-footer__brand">Syrga Dif</div>
        <p class="site-footer__tag" data-k="footerTagline">Photographe de mariage en France et à l'étranger.</p>
      </div>
      <div style="display:flex;gap:clamp(36px,5vw,72px);flex-wrap:wrap;">
        <div class="site-footer__group">
          <a class="footlink" data-k="navHome" href="${base}index.html">Accueil</a>
          <a class="footlink" data-k="navPortfolio" href="${base}weddings.html">Portfolio</a>
          <a class="footlink" data-k="navAbout" href="${base}about.html">À propos</a>
          <a class="footlink" data-k="navContact" href="${base}contact.html">Contact</a>
        </div>
        <div class="site-footer__group">
          <a class="footlink" href="https://www.instagram.com/syrga.dif/" target="_blank" rel="noopener">Instagram</a>
          <a class="footlink" href="https://www.facebook.com/syrga.dif/" target="_blank" rel="noopener">Facebook</a>
          <a class="footlink" href="https://www.tiktok.com/@syrgadif" target="_blank" rel="noopener">TikTok</a>
        </div>
      </div>
    </div>
    <div class="site-footer__bar">Copyright 2021-2025 &#169; Syrga Dif. <span data-k="footerRights">Tous droits réservés.</span></div>
  </div>
</footer>
<div class="grain" aria-hidden="true"></div>
<script src="${base}assets/site.js"></script>`;
}

function lightbox() {
  return `<div class="lb" id="lightbox" aria-hidden="true">
  <button type="button" class="lb__btn lb__close" data-k-aria="lbClose" aria-label="Fermer">&#10005;</button>
  <button type="button" class="lb__btn lb__prev" data-k-aria="lbPrev" aria-label="Précédent">&#8249;</button>
  <img class="lb__img" src="" alt="">
  <button type="button" class="lb__btn lb__next" data-k-aria="lbNext" aria-label="Suivant">&#8250;</button>
  <div class="lb__count" aria-live="polite"></div>
</div>`;
}

// ---- gallery page ----
function galleryPage(g) {
  const base = "../";
  const imgs = listImages(g.folder);
  const cover = imgs[0];
  const count = imgs.length;
  const figures = imgs.map((f) =>
    `      <figure><img loading="lazy" src="${base}${g.folder}/${f}" alt="${esc(g.name)} — Syrga Dif"></figure>`
  ).join("\n");
  const kicker = g.travel ? "Carnet de voyage" : "Mariage";
  const backHref = g.travel ? "voyages.html" : "weddings.html";
  const pageI18n = g.travel
    ? `{ fr:{ kicker:"Carnet de voyage", photos:"photographies", backLabel:"Retour aux voyages" }, en:{ kicker:"Travel diary", photos:"photographs", backLabel:"Back to travels" } }`
    : `{ fr:{ kicker:"Mariage", photos:"photographies", backLabel:"Retour au portfolio" }, en:{ kicker:"Wedding", photos:"photographs", backLabel:"Back to portfolio" } }`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(g.name)} — Syrga Dif</title>
<meta name="description" content="${esc(g.name)} — ${g.travel ? "carnet de voyage" : "mariage"} photographié par Syrga Dif.">
<link rel="icon" type="image/png" href="${base}img/logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${base}assets/site.css">
<script>window.PAGE_I18N=${pageI18n};</script>
</head>
<body>
${header(base, g.travel ? "travels" : "portfolio")}

<main>
  <section class="page-hero">
    <img src="${base}${g.folder}/${cover}" alt="" loading="eager">
    <div class="page-hero__veil" aria-hidden="true"></div>
    <div class="page-hero__inner">
      <div class="eyebrow eyebrow--light" data-k="kicker">${kicker}</div>
      <h1>${esc(g.name)}</h1>
      <div class="eyebrow eyebrow--light" style="margin-top:1em;">${count} <span data-k="photos">photographies</span></div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="gallery-grid">
${figures}
      </div>
      <div class="center" style="margin-top:clamp(40px,6vw,72px);">
        <a class="arrowlink" data-k="backLabel" href="${base}${backHref}">${g.travel ? "Retour aux voyages" : "Retour au portfolio"}</a>
      </div>
    </div>
  </section>
</main>

${lightbox()}
${footer(base)}
</body>
</html>
`;
}

// ---- weddings portfolio index ----
function weddingsPage() {
  const base = "";
  const cards = WEDDINGS.map((g) => {
    const cover = listImages(g.folder)[0];
    return `        <a class="portfolio__card" href="galleries/${g.slug}.html">
          <div class="portfolio__media"><img loading="lazy" src="${g.folder}/${cover}" alt="${esc(g.name)} — Syrga Dif"></div>
          <div class="portfolio__name">${esc(g.name)}</div>
        </a>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Portfolio — Syrga Dif | Wedding Photographer</title>
<meta name="description" content="Portfolio de mariages photographiés par Syrga Dif — France et destinations.">
<link rel="icon" type="image/png" href="img/logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/site.css">
<script>window.PAGE_I18N={
  fr:{ pTitle:"Portfolio", pKicker:"Photographe de mariage", pIntro:"Chaque mariage est une nouvelle aventure. Parcourez les galeries et revivez ces instants magiques où l'amour se célèbre." },
  en:{ pTitle:"Portfolio", pKicker:"Wedding photographer", pIntro:"Each wedding is a new adventure. Browse the galleries and relive those magical moments where love is celebrated." }
};</script>
</head>
<body>
${header(base, "portfolio")}

<main>
  <section class="section" style="padding-top:clamp(120px,18vh,200px);">
    <div class="wrap center">
      <div class="eyebrow" data-k="pKicker">Photographe de mariage</div>
      <h1 class="h-display" style="font-size:clamp(2.6rem,6vw,5rem);margin:.18em 0 0;" data-k="pTitle">Portfolio</h1>
      <p class="lede" style="max-width:52ch;margin:1.4em auto 0;" data-k="pIntro">Chaque mariage est une nouvelle aventure. Parcourez les galeries et revivez ces instants magiques où l'amour se célèbre.</p>
    </div>
  </section>

  <section style="padding-bottom:clamp(80px,13vh,150px);">
    <div class="wrap">
      <div class="portfolio">
${cards}
      </div>
    </div>
  </section>
</main>

${footer(base)}
</body>
</html>
`;
}

// ---- run ----
mkdirSync(dir("galleries/"), { recursive: true });
let n = 0;
for (const g of [...WEDDINGS, ...TRAVEL]) {
  writeFileSync(dir("galleries/" + g.slug + ".html"), galleryPage(g));
  console.log("gallery:", g.slug, "(" + listImages(g.folder).length + " imgs)");
  n++;
}
writeFileSync(dir("weddings.html"), weddingsPage());
console.log("weddings.html written;", n, "gallery pages generated.");
