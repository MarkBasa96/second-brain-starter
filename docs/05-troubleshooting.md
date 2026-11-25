# Troubleshooting

## Ctrl+G does nothing / opens the old graph
1. **Community plugins are off.** Settings → Community plugins → **Turn on community plugins**,
   then make sure **Brain Graph** is toggled on in the installed list.
2. **Obsidian started before the install.** Reload: Ctrl+P → *Reload app without saving*.
3. **Another command owns Ctrl+G.** The installer leaves your hotkeys alone in that case.
   Bind your own: Settings → Hotkeys → search "Open brain graph".
4. Check the files exist: `<vault>/.obsidian/plugins/brain-graph/` should contain
   `main.js`, `manifest.json`, `graph.html` and a `vendor/` folder.
5. Open the console (Ctrl+Shift+I) and look for a red error mentioning `brain-graph`.

## The graph is a few dots, not a brain
That is expected on a new vault (about 30 notes). The dust keeps the outline readable; the
*real* notes are the coloured stars. It fills in as you write and link. See
[graph density](../template/08-concepts/graph-density.md).

## "New mode only installs into an empty folder"
The folder has files in it. Either pick an empty folder, or, if it is a vault you already
use, run with `-Mode Connect` / `--mode connect`.

## PowerShell says scripts are disabled
Run the installer the way the docs show, with `-ExecutionPolicy Bypass`. That applies to
that one command only and changes no setting.

## `node` is not recognised (macOS/Linux)
Install Node.js 18+ from <https://nodejs.org>, or do the steps by hand: copy
`plugin/brain-graph/` to `<vault>/.obsidian/plugins/brain-graph/`, add `"brain-graph"` to
`<vault>/.obsidian/community-plugins.json`, and (new vault) copy the contents of `template/`
into your vault folder.

## Claude says it doesn't know about brain-setup
Claude Code must be started **inside the vault folder** (`cd` there first). Skills in
`.claude/skills/` only load for sessions started in that folder.

## A new helper agent doesn't show up
Its file probably has Windows line endings (CRLF). Re-save it with LF endings. The
installer does this automatically; files you create by hand may not.

## My vault is slow to sync / Obsidian is slow
If the vault lives in OneDrive, Dropbox or iCloud, keep `node_modules` folders out of it.
Move them elsewhere and leave a link behind. Thousands of tiny files are what hurts.

## I want to undo the install
- **New brain:** delete the folder. Nothing else was touched.
- **Existing vault:** see [Undo](02-connect-existing.md#undo).
- **Just the plugin:** delete `.obsidian/plugins/brain-graph/` and remove `"brain-graph"`
  from `.obsidian/community-plugins.json`.

## Still stuck?
Open an issue on the repo with: your OS, Obsidian version, and the text of any error.
**Do not paste notes, keys or file paths you consider private.**
