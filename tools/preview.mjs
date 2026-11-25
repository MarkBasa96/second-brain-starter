#!/usr/bin/env node
// Builds a standalone HTML file of the brain graph from any folder of markdown notes, so you can
// look at it in a normal browser without Obsidian (and take screenshots for a README).
// It reads [[wikilinks]] itself, which is a rough stand-in for Obsidian's own link resolver.
//
//   node tools/preview.mjs --vault "path/to/vault" --out brain.html [--focus "03-projects/foo"]
//
// --focus lights up one community on load (use the key shown in the legend).
// --no-legend hides the community list (handy for screenshots you will share).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const a = process.argv.slice(2);
const opt = n => { const i = a.indexOf("--" + n); return i >= 0 ? a[i + 1] : undefined; };
const vault = path.resolve(opt("vault") || "template"), out = path.resolve(opt("out") || "brain-preview.html");
const focus = opt("focus"), noLegend = a.includes("--no-legend");

function walk(d) {
  return fs.readdirSync(d, { withFileTypes: true }).flatMap(e => {
    if (e.name.startsWith(".") || e.name === "node_modules") return [];
    const p = path.join(d, e.name);
    return e.isDirectory() ? walk(p) : e.name.endsWith(".md") ? [p] : [];
  });
}
const communityOf = p => {
  const s = p.split("/");
  if (s.length === 1 || /00-(concept|brain)-map\.md$/.test(p)) return "core";
  if (s[0] === "03-projects" && s.length > 2) return "03-projects/" + s[1];
  return s[0];
};
const pretty = s => { s = s.replace(/^\d+-/, "").replace(/[-_]+/g, " "); return s[0].toUpperCase() + s.slice(1); };
const labelOf = k => k === "core" ? "Core · CLAUDE.md & hubs" : k.startsWith("03-projects/") ? "Project · " + pretty(k.slice(12)) : pretty(k);

const files = walk(vault).map(f => path.relative(vault, f).split(path.sep).join("/"));
const nodes = [], index = new Map(), byName = new Map(), comms = new Map();
const add = (id, name, c, ghost) => { index.set(id, nodes.length); nodes.push({ id, name, c, ghost }); comms.set(c, 1); };
files.forEach(f => { const name = path.basename(f, ".md"); add(f, name, communityOf(f), false); byName.set(name.toLowerCase(), f); });
const edges = [], seen = new Set();
const link = (x, y) => { if (x === y) return; const k = x < y ? x + "|" + y : y + "|" + x; if (!seen.has(k)) { seen.add(k); edges.push([x, y]); } };
files.slice().forEach(f => {
  const text = fs.readFileSync(path.join(vault, f), "utf8");
  for (const m of text.matchAll(/\[\[([^\]|#]+)/g)) {
    const t = m[1].trim(), key = t.split("/").pop().replace(/\.md$/, "").toLowerCase();
    const target = byName.get(key);
    if (target) link(index.get(f), index.get(target));
    else { const id = "?" + key; if (!index.has(id)) add(id, t, communityOf(f), true); link(index.get(f), index.get(id)); }
  }
});
const data = { nodes, edges, comms: [...comms.keys()].map(key => ({ key, label: labelOf(key) })) };
const pl = path.join(repo, "plugin", "brain-graph");
let html = fs.readFileSync(path.join(pl, "graph.html"), "utf8")
  .replace("/*__THREE__*/", () => fs.readFileSync(path.join(pl, "vendor", "three.min.js"), "utf8"))
  .replace("/*__ORBIT__*/", () => fs.readFileSync(path.join(pl, "vendor", "OrbitControls.js"), "utf8"))
  .replace('/*__DATA__*/{"nodes":[],"edges":[],"comms":[]}', () => JSON.stringify(data).replace(/</g, "\\u003c"));
if (focus) html = html.replace("</body>", `<script>setTimeout(()=>{const i=COMM.findIndex(c=>c.key===${JSON.stringify(focus)});if(i>=0)focusCommunity(i)},400)</script></body>`);
if (noLegend) html = html.replace("</body>", `<script>document.getElementById("legend").hidden=true</script></body>`);
fs.writeFileSync(out, html);
console.log(`notes=${nodes.filter(n => !n.ghost).length} ghosts=${nodes.filter(n => n.ghost).length} links=${edges.length} communities=${comms.size} -> ${out}`);
