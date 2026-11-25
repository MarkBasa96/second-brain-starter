---
name: brain-connect
description: Connect an EXISTING Obsidian vault to the second-brain method without moving, renaming or deleting any of the owner's notes. Scans read-only, reports in plain language, proposes additions, and applies only what the owner approves.
when_to_use: When the owner already has an Obsidian vault of their own and wants the AI memory, skills and the brain graph added on top. Not for a brand-new empty vault; that is brain-setup.
---

# Skill: brain-connect

The owner already has a vault. It is theirs and it is precious. **You add; you never
move, rename, reorder, reformat or delete their notes.** Be plain-spoken and calm.

## The promises (say these to the owner up front)

1. I will look first and change nothing until you approve a list.
2. I will only add new files, or add one clearly marked block to a file you approve.
3. Before touching any existing file I copy it to `.brain-connect-backup/<timestamp>/`.
4. Nothing leaves your computer. Nothing is installed except what is already in this vault folder.
5. You can undo everything: delete the files listed in `.brain-connect-backup/CHANGES.md`
   and restore the copies.

If the vault is a git repository, suggest a commit first ("a clean save point").

## Phase 1: look (read-only)

Report these in plain language, as a short list, not a wall of numbers:

- How many notes, in how many folders; the top-level folders and their sizes.
- Is there already a root `CLAUDE.md`, a `.claude/` folder, a memory folder, a
  `.obsidian/` config? Which community plugins are installed?
- How linked is it? Count `[[wikilinks]]` per note. Say honestly if it is sparse
  (many notes, few links) because that decides how the graph looks. See [[graph-density]].
- Naming habits: dates in names, tags, frontmatter, folders vs flat.
- Anything sensitive-looking by *file name only* (passwords, banking, ID, keys). Do not
  open those files. Tell the owner these exist so they can keep them out of anything shared.

## Phase 2: ask (one question at a time)

1. "What do you want to call your AI, and what should it call you?"
2. "In one or two sentences: what is this vault for?"
3. "What should I always ask you about before doing?" (money, posting publicly,
   messaging people, deleting files, installing software)
4. "How should I talk to you?" (blunt, warm, short, detailed)
5. "Where should the AI remember things? I suggest a new folder `07-memory/`, or tell me
   one of your folders to use."

## Phase 3: propose (a checklist the owner approves line by line)

Typical, all additive. Show the exact list with paths, and let them strike lines:

| Add | Why |
|---|---|
| `00-brain-map.md` | A hub note linking each of your top-level folders and your most-linked notes. The brain graph draws it as the brainstem, so your vault gets a centre. |
| `CLAUDE.md` (new), **or** a marked block appended to your existing one | Tells the AI who you are, how to talk to you, the always-ask list |
| `07-memory/MEMORY.md` + `feedback_mistakes_log.md` | The AI's memory, as readable files |
| `.claude/skills/wrap-up/`, `weekly-update/`, `new-project/` | Optional skills (copy from `.brain-connect-kit/.claude/skills/`) |
| `.claude/agents/*` | Optional helper agents (copy from `.brain-connect-kit/.claude/agents/`) |
| `08-concepts/` notes | Optional: 17 short "how the brain works" notes (copy from `.brain-connect-kit/08-concepts/`). They add stars to the graph, so ask before adding. |
| Brain graph plugin settings | Already installed by the installer; enabling needs one click in Obsidian |

If their vault has no `03-projects/` folder, do **not** create one. The graph groups
notes by top-level folder, so it works on any layout. Say so.

### If a CLAUDE.md already exists

Never replace it. Append this block at the very end, and nothing else:

```markdown
<!-- second-brain-starter:begin -->
## Second brain additions
(AI name, how to talk to me, always-ask list, memory location, link to [[00-brain-map]])
<!-- second-brain-starter:end -->
```

Re-running this skill updates only the text between the markers.

## Phase 4: apply

1. Make `.brain-connect-backup/<timestamp>/`. Copy in every existing file you are about
   to touch. Start `CHANGES.md` there listing every file you add or change.
2. Add the approved files. Use plain `[[wikilinks]]` in the notes you create.
3. For `00-brain-map.md`: one heading per top-level folder with `[[links]]` to its ten
   most-linked notes (find them by counting inbound links), plus a "Start here" list.
   Name the file exactly `00-brain-map.md` so the plugin treats it as the hub.
4. Re-read each file you wrote. Confirm no existing note changed (list modification
   times of the originals you did not approve touching).

## Phase 5: verify and hand back

- Tell the owner exactly what was added and what was left alone.
- Tell them the one Obsidian click that remains (turn on community plugins, if it asks)
  and how to open the graph: **Ctrl+G** (Cmd+G on Mac).
- Offer to delete `.brain-connect-kit/` now that the approved parts are copied out (keep it
  if they want to add more later). Delete it only if they say yes.
- Offer: "Want me to show you which of your notes have no links yet, so the graph fills in?"
  Never add links to their notes without asking.

Never write passwords, ID numbers or bank details anywhere. See [[second-brain]] and
[[vault-portability]].
