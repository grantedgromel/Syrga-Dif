/* ===== Syrga Dif — shared site behavior ===== */
(function () {
  "use strict";

  // Common (nav / footer / UI) strings; pages add their own via window.PAGE_I18N
  var COMMON = {
    fr: {
      navHome: "Accueil", navPortfolio: "Portfolio", navAbout: "À propos",
      navTravels: "Voyages", navInfo: "Info", navContact: "Contact",
      menuLabel: "Menu", closeLabel: "Fermer",
      footerTagline: "Photographe de mariage en France et à l'étranger.",
      footerRights: "Tous droits réservés.",
      backToPortfolio: "Retour au portfolio",
      lbPrev: "Précédent", lbNext: "Suivant", lbClose: "Fermer"
    },
    en: {
      navHome: "Home", navPortfolio: "Portfolio", navAbout: "About",
      navTravels: "Travels", navInfo: "Info", navContact: "Contact",
      menuLabel: "Menu", closeLabel: "Close",
      footerTagline: "Wedding photographer in France and abroad.",
      footerRights: "All rights reserved.",
      backToPortfolio: "Back to portfolio",
      lbPrev: "Previous", lbNext: "Next", lbClose: "Close"
    }
  };

  var KEY = "syrgadif_lang";
  var page = window.PAGE_I18N || { fr: {}, en: {} };
  var DICT = {
    fr: Object.assign({}, COMMON.fr, page.fr || {}),
    en: Object.assign({}, COMMON.en, page.en || {})
  };

  var lang = "fr";
  try { var s = localStorage.getItem(KEY); if (s === "fr" || s === "en") lang = s; } catch (e) {}

  function each(sel, fn) { var n = document.querySelectorAll(sel); for (var i = 0; i < n.length; i++) fn(n[i]); }

  function apply() {
    var d = DICT[lang];
    document.documentElement.lang = lang;
    each("[data-k]", function (el) { var k = el.getAttribute("data-k"); if (d[k] != null) el.textContent = d[k]; });
    each("[data-k-html]", function (el) { var k = el.getAttribute("data-k-html"); if (d[k] != null) el.innerHTML = d[k]; });
    each("[data-k-aria]", function (el) { var k = el.getAttribute("data-k-aria"); if (d[k] != null) el.setAttribute("aria-label", d[k]); });
    each("[data-k-alt]", function (el) { var k = el.getAttribute("data-k-alt"); if (d[k] != null) el.setAttribute("alt", d[k]); });
    each("[data-k-ph]", function (el) { var k = el.getAttribute("data-k-ph"); if (d[k] != null) el.setAttribute("placeholder", d[k]); });
    each(".lang-btn", function (b) { b.classList.toggle("active", b.getAttribute("data-lang") === lang); });
    // keep open FAQ answers sized correctly after text swap
    each(".faq__item.open .faq__a", function (a) { a.style.maxHeight = a.scrollHeight + "px"; });
    if (typeof window.onLangApplied === "function") window.onLangApplied(lang, d);
  }

  window.setLang = function (l) {
    if (l !== "fr" && l !== "en") return;
    lang = l;
    try { localStorage.setItem(KEY, l); } catch (e) {}
    apply();
    closeMenu();
  };
  window.getLang = function () { return lang; };
  window.getDict = function () { return DICT[lang]; };

  window.openMenu = function () {
    var m = document.getElementById("mobileMenu"); if (m) m.classList.add("open");
    var b = document.getElementById("navBurger"); if (b) b.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };
  window.closeMenu = function () {
    var m = document.getElementById("mobileMenu"); if (m) m.classList.remove("open");
    var b = document.getElementById("navBurger"); if (b) b.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  function initFaq() {
    each(".faq__q", function (q) {
      q.setAttribute("aria-expanded", "false");
      q.addEventListener("click", function () {
        var item = q.closest(".faq__item"); if (!item) return;
        var ans = item.querySelector(".faq__a"); if (!ans) return;
        var open = item.classList.toggle("open");
        q.setAttribute("aria-expanded", open ? "true" : "false");
        ans.style.maxHeight = open ? (ans.scrollHeight + "px") : "0";
      });
    });
  }

  function initLightbox() {
    var grid = document.querySelector(".gallery-grid");
    var lb = document.getElementById("lightbox");
    if (!grid || !lb) return;
    var imgs = [].slice.call(grid.querySelectorAll("img"));
    if (!imgs.length) return;
    var lbImg = lb.querySelector(".lb__img");
    var lbCount = lb.querySelector(".lb__count");
    if (!lbImg) return;
    var idx = 0, scrollY = 0;
    function show(i) {
      idx = (i + imgs.length) % imgs.length;
      lbImg.src = imgs[idx].getAttribute("data-full") || imgs[idx].src;
      lbImg.alt = imgs[idx].alt || "";
      if (lbCount) lbCount.textContent = (idx + 1) + " / " + imgs.length;
    }
    function open(i) {
      scrollY = window.scrollY || window.pageYOffset || 0;
      show(i);
      lb.classList.add("open");
      lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
    function close() {
      lb.classList.remove("open");
      lb.setAttribute("aria-hidden", "true");
      lbImg.removeAttribute("src");
      document.body.style.overflow = "";
      window.scrollTo(0, scrollY);
    }
    imgs.forEach(function (im, i) {
      im.addEventListener("click", function () { open(i); });
    });
    var cl = lb.querySelector(".lb__close"); if (cl) cl.addEventListener("click", close);
    var nx = lb.querySelector(".lb__next"); if (nx) nx.addEventListener("click", function () { show(idx + 1); });
    var pv = lb.querySelector(".lb__prev"); if (pv) pv.addEventListener("click", function () { show(idx - 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") { e.preventDefault(); close(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); show(idx + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); show(idx - 1); }
    });
  }

  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  document.addEventListener("DOMContentLoaded", function () { apply(); initFaq(); initLightbox(); });
})();
