# Path B: I already have a second brain

You keep your notes, your folders and your names. This path **adds** the AI's memory,
the skills and the brain graph on top. **Nothing of yours is moved, renamed, reformatted
or deleted.**

## The promises

1. It looks first and changes nothing until you approve a list.
2. It only **adds** new files, or adds one clearly-marked block to a file you approve.
3. Before it touches any existing file, it copies it to `.brain-connect-backup/<time>/`.
4. Nothing leaves your computer because of this repo. The graph plugin makes no network requests.
5. You can undo everything: the backup folder lists every change.

## What you need
Same as [Path A](01-new-brain.md#what-you-need-one-time): Obsidian, Claude Code, this repo.

> **If your vault is a git repository,** make a commit first. It gives you a clean save point.
> **If it syncs** (OneDrive, iCloud, Dropbox), let it finish syncing first.

## Step by step

### 1. Dry run
Run the installer against your existing vault with the dry-run flag. It prints what it
*would* do and changes nothing.

**Windows:**
```powershell
powershell -ExecutionPolicy Bypass -File setup\install.ps1 -Vault "D:\Notes\MyVault" -Mode Connect -DryRun
```
**macOS / Linux:**
```bash
node setup/install.mjs --vault "~/Notes/MyVault" --mode connect --dry-run
```

### 2. Real run
Same command without the dry-run flag. In **Connect** mode it adds only:

| Added | Where | Visible in your graph? |
|---|---|---|
| The Brain Graph plugin | `.obsidian/plugins/brain-graph/` | no |
| `brain-connect` skill | `.claude/skills/brain-connect/` | no |
| An optional kit (skills, agents, memory template, concept notes) | `.brain-connect-kit/` (hidden folder) | no |
| Plugin enabled + Ctrl+G binding | `.obsidian/community-plugins.json`, `hotkeys.json` | no (backed up first) |

Hidden folders (starting with a dot) are ignored by Obsidian, so your graph and file
list stay exactly as they were. If Ctrl+G is already used by another command in your
vault, the installer leaves your hotkeys alone and tells you.

### 3. Open it in Obsidian
Open your vault in Obsidian. If it asks, click **Turn on community plugins**. Press
**Ctrl+G**: your real notes appear as a brain. The graph groups notes by **top-level
folder**, so it works on any folder layout you already have.

### 4. Let the AI look (read-only)
In a terminal, go into your vault and start Claude Code:

```powershell
cd "D:\Notes\MyVault"
claude
```
Say **`connect my brain`**. The **brain-connect** skill runs in five phases:

| Phase | What happens |
|---|---|
| 1. Look | Read-only scan: note count, folders, existing `CLAUDE.md`, plugins, how linked your notes are, sensitive-*sounding* file names (it reads **names only**, never opens them) |
| 2. Ask | A few short questions: AI name, what the vault is for, what it must always ask first, how to talk to you, where memory should live |
| 3. Propose | A checklist of additions with exact paths. **You strike out anything you don't want.** |
| 4. Apply | Backs up first, then adds only the approved files |
| 5. Verify | Tells you exactly what was added and what was left alone |

The usual additions:

- **`00-brain-map.md`**, a hub note linking your top-level folders and your most-linked
  notes. The graph draws it as the brainstem, so your vault gets a centre.
- **`CLAUDE.md`**: created if you have none. If you already have one, it is **never
  replaced**; one marked block is appended at the very end:
  ```markdown
  <!-- second-brain-starter:begin -->
  ...
  <!-- second-brain-starter:end -->
  ```
  Re-running only updates the text between those markers.
- **`07-memory/`** (or a folder you choose) for the AI's memory.
- Optional skills, helper agents and concept notes from the kit.

### 5. Help the graph fill in
If your notes are many but barely linked, the graph will look sparse. That is normal
(see [graph density](../template/08-concepts/graph-density.md)). Ask the AI:
*"Show me which notes have no links yet."* It will only **suggest**; it never adds links
to your notes without asking.

## Undo
1. Delete the files listed in `.brain-connect-backup/CHANGES.md`.
2. Copy the originals back from `.brain-connect-backup/<time>/`.
3. Delete `.brain-connect-kit/` and `.claude/skills/brain-connect/` if you want them gone.

## Not sure which path you're on?
If you have notes in Obsidian today, it's Path B. If you have an empty folder or
nothing at all, it's [Path A](01-new-brain.md).
