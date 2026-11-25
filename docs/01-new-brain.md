# Path A: I don't have a second brain yet

You will end up with a ready-made vault, an AI that knows who you are, and a glowing
graph of it. About 10 minutes. You click twice and run one command.

> **Prefer to let Claude drive?** Skip to [the one-prompt version](#the-one-prompt-version).

## What you need (one-time)

| Need | Where | Cost |
|---|---|---|
| **Obsidian** | <https://obsidian.md/download> | Free for personal use |
| **Claude Code** (the terminal app, or the Code tab in the Claude desktop app) | Official install page: <https://claude.com/product/claude-code> | Needs a Claude subscription or API access |
| **This repo** | green **Code** button on GitHub, then **Download ZIP** and unzip it (or `git clone`) | Free |
| *Optional:* **Node.js 18+** | <https://nodejs.org> | Free; only for macOS/Linux or the preview tool |

Windows users do not need Node: the installer is a PowerShell script.

## Step by step

### 1. Pick an empty folder for your brain
Anywhere you like, for example `Documents\My Brain`. It must be **empty or not exist yet**.
(If you already keep notes somewhere, use [Path B](02-connect-existing.md) instead.)

### 2. Run the installer
Open a terminal **in the folder you unzipped** and run **one** of these.

**Windows (PowerShell):**
```powershell
powershell -ExecutionPolicy Bypass -File setup\install.ps1 -Vault "$HOME\Documents\My Brain" -Mode New
```

**macOS / Linux:**
```bash
node setup/install.mjs --vault "~/Documents/My Brain" --mode new
```

Want to see first what it would do? Add `-DryRun` (Windows) or `--dry-run` (Mac/Linux).
Nothing is changed in a dry run.

The installer:
- copies the starter vault (folders, skills, helper agents, concept notes),
- installs the **Brain Graph** plugin and switches it on in the vault's list,
- makes **Ctrl+G** (Cmd+G on Mac) open the brain graph (add `-NoHotkey` / `--no-hotkey` to skip),
- **never overwrites** anything that already exists.

### 3. Click 1: open the folder in Obsidian
Open Obsidian, then **Open folder as vault**, then choose the folder from step 1.

### 4. Click 2: allow the plugin
Obsidian starts new vaults in *Restricted mode*, which blocks all community plugins.
If it shows a banner or asks, click **Turn on community plugins**. (Or:
**Settings → Community plugins → Turn on community plugins**.)

Press **Ctrl+G**. You should see your brain: small at first, because it has about 30
starter notes. If nothing opens, see [troubleshooting](05-troubleshooting.md).

### 5. Meet your AI
In a terminal, go into the vault folder and start Claude Code:

```powershell
cd "$HOME\Documents\My Brain"
claude
```

Then just say **`set me up`**. The AI reads the setup marker in `CLAUDE.md`, greets
you and runs the **brain-setup** skill. It asks, one question at a time with examples:

| # | It asks about |
|---|---|
| 0 | A name for your AI (and what to call you) |
| 1 | Who you are and your context |
| 2 | What you want it to do in the vault |
| 3 | How to talk to you |
| 4 | Your strengths and where you need a push |
| 5 | Your goals and where you are now |
| 6 | Projects already in flight |
| 7 | **What it must always ask you first** (money, posting, messaging, deleting...) |
| 8 | Which helper agents to keep, and whether to give them personalities |

You can answer "skip" to any question; it writes a sensible default and tells you so.

When it finishes, it has written your `CLAUDE.md`, `00-goals/goals.md`, your first
memory entries, a welcome journal entry and a note per project. Go back to Obsidian,
press **Ctrl+G** again: the new notes flash in with a **LEARNED** card.

### 6. Use it
Say these in Claude Code from the vault folder:

| Say | What happens |
|---|---|
| "new project" | Interviews you, creates `03-projects/<name>/` |
| "weekly update" | Reviews your week, writes `04-reviews/` |
| "that's all for today" | Writes the journal, mistakes log, memory and open loops |

## The one-prompt version

Open Claude Code **in the unzipped repo folder** and say:

> Set up my second brain. I don't have one yet.

The repo's own [`CLAUDE.md`](../CLAUDE.md) turns Claude into the installer: it asks where
to put the vault, runs the dry run, shows you the result, runs the real install and walks
you through the two clicks. It follows the safety rules in
[using Claude in Chrome safely](04-claude-in-chrome-safely.md) if browser steps are needed.

## What if I get stuck?
[Troubleshooting](05-troubleshooting.md). Or ask the AI: it can read the logs.
