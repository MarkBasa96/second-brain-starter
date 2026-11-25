#!/usr/bin/env node
// Second Brain Starter installer for macOS, Linux and Windows (needs Node 18+).
// Same behaviour as install.ps1:
//   --mode new      copy the starter vault into an EMPTY folder, plus the Brain Graph plugin
//   --mode connect  you already have a vault: add ONLY the plugin, the brain-connect skill and a
//                   hidden kit folder. Never touches, moves or deletes your notes.
// Nothing is overwritten except this project's own plugin files. Settings files are backed up first.
//
//   node setup/install.mjs --vault "~/Documents/My Brain" --mode new
//   node setup/install.mjs --vault "~/Notes/MyVault" --mode connect --dry-run
//   Flags: --no-hotkey  (do not bind Cmd/Ctrl+G to the brain graph)
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf("--" + n); return i >= 0 ? args[i + 1] : d; };
const has = n => args.includes("--" + n);
const expand = p => (p && p.startsWith("~") ? path.join(os.homedir(), p.slice(1)) : p);
const vault = path.resolve(expand(opt("vault")) || "");
const mode = (opt("mode", "new") || "new").toLowerCase();
const dry = has("dry-run"), noHotkey = has("no-hotkey");
if (!opt("vault") || !["new", "connect"].includes(mode)) {
  console.log('Usage: node setup/install.mjs --vault <folder> --mode new|connect [--no-hotkey] [--dry-run]');
  process.exit(2);
}
const skipped = []; let added = 0;
const say = t => console.log(t);
const act = (what, fn) => { if (dry) say("  [dry run] " + what); else fn(); };

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
}
function copyTree(src, dst, overwrite) {
  for (const f of walk(src)) {
    const rel = path.relative(src, f), to = path.join(dst, rel);
    if (fs.existsSync(to) && !overwrite) { skipped.push(rel); continue; }
    act("add " + rel, () => {
      fs.mkdirSync(path.dirname(to), { recursive: true });
      if (/\.(md|json|html|js|txt)$|\.gitkeep$/.test(rel)) // LF endings: CRLF can drop an agent from the roster
        fs.writeFileSync(to, fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n"));
      else fs.copyFileSync(f, to);
    });
    added++;
  }
}
function backup(p) {
  if (!fs.existsSync(p)) return;
  const stamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
  const dir = path.join(vault, ".brain-connect-backup", stamp);
  act("back up " + p, () => { fs.mkdirSync(dir, { recursive: true }); fs.copyFileSync(p, path.join(dir, path.basename(p))); });
}
const readJson = (p, fallback) => { try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return fallback; } };

say(`Second Brain Starter installer (${mode} mode)\nVault: ${vault}`);
if (mode === "new") {
  if (fs.existsSync(vault)) {
    const left = fs.readdirSync(vault).filter(n => ![".obsidian", ".git"].includes(n));
    if (left.length) {
      say("\nThat folder already has files in it. New mode only installs into an empty folder.\nIf this is a vault you already use, re-run with --mode connect (it never touches your notes).");
      process.exit(2);
    }
  } else act("create " + vault, () => fs.mkdirSync(vault, { recursive: true }));
} else {
  if (!fs.existsSync(vault)) { say("Connect mode needs an existing vault folder: " + vault); process.exit(2); }
  const hasNotes = walk(vault).some(f => f.endsWith(".md"));
  if (!fs.existsSync(path.join(vault, ".obsidian")) && !hasNotes) {
    say("That folder has no notes and no .obsidian folder. Is it the right one? (Use --mode new for an empty folder.)");
    process.exit(2);
  }
}

say("\nInstalling the Brain Graph plugin...");
copyTree(path.join(repo, "plugin", "brain-graph"), path.join(vault, ".obsidian", "plugins", "brain-graph"), true);

const cp = path.join(vault, ".obsidian", "community-plugins.json");
const list = readJson(cp, []);
if (!list.includes("brain-graph")) {
  backup(cp); list.push("brain-graph");
  act("enable brain-graph in community-plugins.json", () => {
    fs.mkdirSync(path.dirname(cp), { recursive: true });
    fs.writeFileSync(cp, JSON.stringify(list, null, 2));
  });
}

if (!noHotkey) {
  const hk = path.join(vault, ".obsidian", "hotkeys.json");
  const map = readJson(hk, {});
  const clash = Object.entries(map).some(([k, v]) => !["brain-graph:open", "graph:open"].includes(k) &&
    (v || []).some(b => b.key === "G" && b.modifiers?.length === 1 && b.modifiers[0] === "Mod"));
  if (clash) say("  Mod+G is already used by another command in this vault, so I left your hotkeys alone.");
  else {
    backup(hk);
    map["brain-graph:open"] = [{ modifiers: ["Mod"], key: "G" }];
    map["graph:open"] = [];
    act("bind Ctrl/Cmd+G to the brain graph (the old graph stays in the command palette)", () => {
      fs.mkdirSync(path.dirname(hk), { recursive: true });
      fs.writeFileSync(hk, JSON.stringify(map, null, 2));
    });
  }
}

if (mode === "new") {
  say("\nCopying the starter vault...");
  copyTree(path.join(repo, "template"), vault, false);
} else {
  say("\nAdding the connect skill and the optional kit (hidden folders, so your graph stays yours)...");
  copyTree(path.join(repo, "connect", ".claude"), path.join(vault, ".claude"), false);
  const kit = path.join(vault, ".brain-connect-kit");
  copyTree(path.join(repo, "template", ".claude"), path.join(kit, ".claude"), false);
  copyTree(path.join(repo, "template", "07-memory"), path.join(kit, "07-memory"), false);
  copyTree(path.join(repo, "template", "08-concepts"), path.join(kit, "08-concepts"), false);
}

say(`\nDone.${dry ? " (dry run: nothing was changed)" : ""}\n  files added: ${added}`);
if (skipped.length) { say(`  already existed, left untouched: ${skipped.length}`); skipped.slice(0, 8).forEach(s => say("    - " + s)); }
say(`\nNEXT (two clicks, one command):
  1. In Obsidian: 'Open folder as vault' -> choose: ${vault}
  2. If Obsidian asks, click 'Turn on community plugins'. Then press Ctrl+G (Cmd+G on Mac).
  3. In a terminal:  cd "${vault}" && claude    then say:  ${mode === "new" ? "set me up" : "connect my brain"}`);
