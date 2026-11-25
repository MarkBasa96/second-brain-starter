// Brain Graph: opens the vault's real notes and links as a 3D brain in an Obsidian tab.
// Plain CommonJS, no build step. The visual page is graph.html; this file feeds it data and
// turns its clicks into "open this note".
const { Plugin, ItemView, TFile, Notice } = require("obsidian");

const VIEW_TYPE = "brain-graph";

// Which community a note belongs to: its top folder, except projects, which split by project.
// Root files and the concept-map hub form the core, which runs down the brainstem.
function communityOf(path) {
  const parts = path.split("/");
  if (parts.length === 1 || /00-(concept|brain)-map\.md$/.test(path)) return "core";
  if (parts[0] === "03-projects" && parts.length > 2) return "03-projects/" + parts[1];
  return parts[0];
}
function labelOf(key) {
  if (key === "core") return "Core · CLAUDE.md & hubs";
  const pretty = s => { s = s.replace(/^\d+-/, "").replace(/[-_]+/g, " "); return s.charAt(0).toUpperCase() + s.slice(1); };
  if (key.startsWith("03-projects/")) return "Project · " + pretty(key.slice(12));
  return pretty(key);
}

function buildData(app) {
  // Hidden folders (.obsidian, .claude, .git) and dependency folders are not part of the brain
  const files = app.vault.getMarkdownFiles().filter(f => !f.path.includes("node_modules/") && !/(^|\/)\./.test(f.path));
  const index = new Map(), nodes = [], edges = [], seen = new Set();
  const comms = new Map();
  const addNode = (id, name, c, ghost) => {
    index.set(id, nodes.length);
    nodes.push({ id, name, c, ghost });
    comms.set(c, (comms.get(c) || 0) + 1);
  };
  files.forEach(f => addNode(f.path, f.basename, communityOf(f.path), false));
  const link = (a, b) => {
    if (a === b) return;
    const k = a < b ? a + "|" + b : b + "|" + a;
    if (seen.has(k)) return;
    seen.add(k); edges.push([a, b]);
  };
  const resolved = app.metadataCache.resolvedLinks || {};
  for (const src in resolved) {
    const a = index.get(src);
    if (a === undefined) continue;
    for (const dst in resolved[src]) {
      const b = index.get(dst);
      if (b !== undefined) link(a, b);
    }
  }
  // Links to notes that don't exist yet show as dim "ghost" notes, like Obsidian's own graph
  const unresolved = app.metadataCache.unresolvedLinks || {};
  for (const src in unresolved) {
    const a = index.get(src);
    if (a === undefined) continue;
    for (const name in unresolved[src]) {
      const id = "?" + name.toLowerCase();
      if (!index.has(id)) addNode(id, name, nodes[a].c, true);
      link(a, index.get(id));
    }
  }
  return {
    nodes, edges,
    comms: [...comms.keys()].map(key => ({ key, label: labelOf(key) })),
  };
}

class BrainView extends ItemView {
  constructor(leaf, plugin) { super(leaf); this.plugin = plugin; }
  getViewType() { return VIEW_TYPE; }
  getDisplayText() { return "Brain graph"; }
  getIcon() { return "brain-circuit"; }

  async onOpen() {
    this.contentEl.empty();
    this.contentEl.style.padding = "0";
    this.contentEl.style.overflow = "hidden";
    this.registerDomEvent(window, "message", e => this.onMessage(e));
    // Live updates: once Obsidian has re-indexed links (and you've paused for a moment),
    // send the new notes and links into the open brain without reloading it
    const queue = () => this.queueUpdate();
    this.registerEvent(this.app.metadataCache.on("resolved", queue));
    this.registerEvent(this.app.vault.on("delete", queue));
    this.registerEvent(this.app.vault.on("rename", queue));
    await this.render();
  }

  queueUpdate(delay = 2500) {
    clearTimeout(this.updateTimer);
    this.updateTimer = setTimeout(() => this.pushUpdate(), delay);
  }

  pushUpdate(force) {
    if (!this.frame || !this.frame.contentWindow) return false;
    const data = buildData(this.app), sig = JSON.stringify(data);
    if (!force && sig === this.lastSig) return false;
    this.lastSig = sig;
    this.frame.contentWindow.postMessage({ src: "brain-graph-host", type: "update", data }, "*");
    return true;
  }

  async render() {
    const page = await this.plugin.page();
    const raw = JSON.stringify(buildData(this.app));
    this.lastSig = raw;
    const data = raw.replace(/</g, "\\u003c");
    const html = page.replace("/*__DATA__*/{\"nodes\":[],\"edges\":[],\"comms\":[]}", () => data);
    this.contentEl.empty();
    // Sandboxed: scripts may run, but the page cannot reach the vault, the network or Obsidian directly.
    // It can only send the three messages handled in onMessage().
    this.frame = this.contentEl.createEl("iframe", {
      attr: { sandbox: "allow-scripts", allow: "fullscreen", allowfullscreen: "", title: "Brain graph" },
    });
    Object.assign(this.frame.style, { width: "100%", height: "100%", border: "0", display: "block" });
    this.frame.srcdoc = html;
  }

  onMessage(e) {
    if (!this.frame || e.source !== this.frame.contentWindow) return;
    const m = e.data || {};
    if (m.src !== "brain-graph") return;
    if (m.type === "rescan") { this.pushUpdate(true); new Notice("Brain graph rescanned"); return; }
    if (m.type === "fullscreen") { this.toggleFullscreen(); return; }
    if (m.type === "open" && typeof m.path === "string") {
      const f = this.app.vault.getAbstractFileByPath(m.path);
      if (f instanceof TFile) this.app.workspace.getLeaf(m.newTab ? "tab" : false).openFile(f);
    }
  }

  // Full screen on the tab's own container; the key press inside the frame counts as the click
  // Chromium needs. Falls back to Electron's window full screen if the element request is refused.
  toggleFullscreen() {
    const doc = this.contentEl.ownerDocument;
    if (doc.fullscreenElement) { doc.exitFullscreen().catch(() => {}); return; }
    this.contentEl.requestFullscreen().catch(() => {
      try {
        const win = require("electron").remote?.getCurrentWindow?.();
        if (win) { win.setFullScreen(!win.isFullScreen()); return; }
      } catch (_) {}
      new Notice("Full screen was blocked here. Drag the Brain graph tab out into its own window and maximise it instead.");
    });
  }

  async onClose() { clearTimeout(this.updateTimer); this.contentEl.empty(); this.frame = null; }
}

module.exports = class BrainGraph extends Plugin {
  async onload() {
    this.registerView(VIEW_TYPE, leaf => new BrainView(leaf, this));
    this.addRibbonIcon("brain-circuit", "Open brain graph", () => this.activate());
    this.addCommand({ id: "open", name: "Open brain graph", callback: () => this.activate() });
  }

  // graph.html with three.js inlined, read once and cached
  async page() {
    if (this._page) return this._page;
    const dir = this.manifest.dir, fs = this.app.vault.adapter;
    const [tpl, three, orbit] = await Promise.all([
      fs.read(dir + "/graph.html"),
      fs.read(dir + "/vendor/three.min.js"),
      fs.read(dir + "/vendor/OrbitControls.js"),
    ]);
    this._page = tpl
      .replace("/*__THREE__*/", () => three)
      .replace("/*__ORBIT__*/", () => orbit);
    return this._page;
  }

  async activate() {
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE)[0];
    if (existing) { this.app.workspace.revealLeaf(existing); return; }
    const leaf = this.app.workspace.getLeaf("tab");
    await leaf.setViewState({ type: VIEW_TYPE, active: true });
    this.app.workspace.revealLeaf(leaf);
  }

  onunload() { this._page = null; }
};
