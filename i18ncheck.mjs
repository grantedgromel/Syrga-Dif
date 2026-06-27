// Check that every data-k* key used in markup exists in both FR and EN dictionaries.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
// COMMON keys provided by assets/site.js
const COMMON = ["navHome","navPortfolio","navAbout","navTravels","navInfo","navContact",
  "menuLabel","closeLabel","footerTagline","footerRights","backToPortfolio","lbPrev","lbNext","lbClose"];

const pages = [];
for (const f of readdirSync(root)) if (f.endsWith(".html") && f !== "index.html") pages.push(f);
for (const f of readdirSync(join(root, "galleries"))) if (f.endsWith(".html")) pages.push("galleries/" + f);

let problems = 0;
for (const page of pages) {
  const html = readFileSync(join(root, page), "utf8");
  // extract window.PAGE_I18N={...};
  const m = html.match(/window\.PAGE_I18N\s*=\s*(\{[\s\S]*?\});<\/script>/);
  if (!m) { console.log("NO PAGE_I18N:", page); problems++; continue; }
  let dict;
  try { dict = new Function("return (" + m[1] + ")")(); }
  catch (e) { console.log("EVAL FAIL:", page, e.message); problems++; continue; }
  const fr = new Set([...COMMON, ...Object.keys(dict.fr || {})]);
  const en = new Set([...COMMON, ...Object.keys(dict.en || {})]);
  // collect used keys
  const used = new Set();
  for (const attr of ["data-k", "data-k-html", "data-k-aria", "data-k-alt", "data-k-ph"]) {
    const re = new RegExp(attr + '="([^"]+)"', "g");
    let mm; while ((mm = re.exec(html))) used.add(mm[1]);
  }
  for (const k of used) {
    if (!fr.has(k)) { console.log("MISSING FR:", page, "key:", k); problems++; }
    if (!en.has(k)) { console.log("MISSING EN:", page, "key:", k); problems++; }
  }
  // also flag dict keys that differ between fr/en (one lang missing a translation)
  const fk = Object.keys(dict.fr || {}), ek = Object.keys(dict.en || {});
  for (const k of fk) if (!(dict.en && k in dict.en)) { console.log("FR-only key:", page, k); problems++; }
  for (const k of ek) if (!(dict.fr && k in dict.fr)) { console.log("EN-only key:", page, k); problems++; }
}
console.log("\nchecked", pages.length, "pages.", problems === 0 ? "ALL i18n KEYS COMPLETE ✓" : problems + " problem(s) ✗");
