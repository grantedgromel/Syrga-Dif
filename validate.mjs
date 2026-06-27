// Validate internal links + image refs across all generated HTML pages.
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { dirname, resolve, join } from "node:path";

const root = process.cwd();
const pages = [];
for (const f of readdirSync(root)) if (f.endsWith(".html")) pages.push(f);
for (const f of readdirSync(join(root, "galleries"))) if (f.endsWith(".html")) pages.push("galleries/" + f);

let missing = 0, ext = 0, checked = 0;
const internalSyrga = [];

for (const page of pages) {
  const full = join(root, page);
  const dir = dirname(full);
  const html = readFileSync(full, "utf8");
  const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
  for (const ref of refs) {
    if (/^https?:\/\//i.test(ref)) {
      if (/syrgadif\.com/i.test(ref)) internalSyrga.push(page + " -> " + ref);
      ext++; continue;
    }
    if (ref.startsWith("#") || ref.startsWith("mailto:") || ref.startsWith("data:") || ref.startsWith("//")) continue;
    const target = resolve(dir, ref.split("#")[0]);
    checked++;
    if (!existsSync(target)) { console.log("MISSING:", page, "->", ref); missing++; }
  }
}

console.log("\npages:", pages.length, "| internal refs checked:", checked, "| external:", ext, "| missing:", missing);
if (internalSyrga.length) { console.log("\n!! leftover syrgadif.com links:"); internalSyrga.forEach((x) => console.log("  " + x)); }
else console.log("no leftover internal syrgadif.com links ✓");
console.log(missing === 0 ? "\nALL INTERNAL REFS RESOLVE ✓" : "\n" + missing + " BROKEN REF(S) ✗");
