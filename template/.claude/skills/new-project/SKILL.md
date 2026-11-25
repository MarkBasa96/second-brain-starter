---
name: new-project
description: Set up a new project folder under 03-projects/ by interviewing the owner, then write that project's own CLAUDE.md and its inputs / process / outputs folders.
when_to_use: When the owner wants to start a new project inside the brain. Not for work inside a project that already exists.
---

# Skill: new-project

## Interview (one question at a time, with an example each)

1. "What is the project called, and what is it in one sentence?"
2. "What does 'done' look like? What would you point at and say it worked?"
3. "What do you already have: files, links, ideas, a deadline?"
4. "What is the first small step?"
5. "Is there anything I must always ask you about before doing, just for this project?"

## Create

Use a lowercase-hyphen folder name: `03-projects/<name>/`.

```
03-projects/<name>/
  CLAUDE.md        <- the project's own rules (from the template below)
  01-inputs/       <- things you collect: references, raw material
  02-process/      <- notes, drafts, decisions as you go
  03-outputs/      <- finished things
```

Put a `.gitkeep` in each empty folder. Then:

- Link the project from the root `CLAUDE.md` ("Current projects") as `[[<name>]]`.
- Add one line to today's journal in `02-journals/`.
- Tell the owner the folder is ready and what the first step is.

## Project CLAUDE.md template

```markdown
# <Project name>

## What this is
<one sentence>

## Done looks like
<answer 2>

## Inputs I have
<answer 3>

## Next step
<answer 4>

## Rules for this project
- Everything in the root CLAUDE.md still applies.
- <extra always-ask items from answer 5, or "none">

Part of [[second-brain]].
```
