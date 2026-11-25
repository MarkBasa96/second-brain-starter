# How we built our second brain

This is the story and the reasoning behind the starter in this repo. It is written
for someone who has never done this. You do not need to read it to *use* the starter
(see the [README](../README.md)), but if you want to know why every folder and rule is
there, this is it.

"We" means a person and their AI working together over a few months, one small
improvement at a time. Nothing here was planned in advance. Every rule exists because
something went wrong without it.

**Contents**
1. [The problem: the AI forgets](#1-the-problem-the-ai-forgets)
2. [Step 1: a folder of plain notes](#2-step-1-a-folder-of-plain-notes)
3. [Step 2: two layers, strategy and execution](#3-step-2-two-layers-strategy-and-execution)
4. [Step 3: a root CLAUDE.md written by an interview](#4-step-3-a-root-claudemd-written-by-an-interview)
5. [Step 4: memory as files, and a mistakes log](#5-step-4-memory-as-files-and-a-mistakes-log)
6. [Step 5: skills instead of a bigger CLAUDE.md](#6-step-5-skills-instead-of-a-bigger-claudemd)
7. [Step 6: a small team of helper agents](#7-step-6-a-small-team-of-helper-agents)
8. [Step 7: autonomy, grown not switched on](#8-step-7-autonomy-grown-not-switched-on)
9. [Step 8: an inbox for notes written elsewhere](#9-step-8-an-inbox-for-notes-written-elsewhere)
10. [Step 9: seeing the brain (the graph)](#10-step-9-seeing-the-brain-the-graph)
11. [Rules we learned the hard way](#11-rules-we-learned-the-hard-way)
12. [The order we suggest you build it in](#12-the-order-we-suggest-you-build-it-in)

---

## 1. The problem: the AI forgets

A chat with an AI is brilliant for an hour and then it is gone. Tomorrow you explain
yourself again: who you are, what you are working on, what you decided, what already
failed. The AI is a very capable stranger every morning.

A **second brain** fixes that by giving the AI somewhere to read and write that
survives the chat. In our case that somewhere is a folder of markdown files, opened in
[Obsidian](https://obsidian.md) so a human can browse and link them, and read by
[Claude Code](https://claude.com/product/claude-code) so the AI can use them.

The whole trick is boring on purpose: **plain text files in a folder.** No database,
no account, no lock-in. If a better tool shows up next year, you copy the folder.

## 2. Step 1: a folder of plain notes

We started with the nine numbered folders you see in the starter:

```
00-goals/     what you are aiming at, kept current
00-inbox/     a drop zone for notes written in other chats
01-notes/     books, courses, videos
02-journals/  one entry per day or session
03-projects/  one folder per project
04-reviews/   weekly and monthly reviews
05-skills/    notes about your skills
06-agents/    the roster of helper agents
07-memory/    what the AI should remember
08-concepts/  one idea per note, linked together
```

The numbers are not decoration. They keep the folders in a fixed order in every file
browser, and the AI learns "memory is always `07`". Rename them if you like, but keep
them stable once the AI has learned them.

## 3. Step 2: two layers, strategy and execution

We split the vault into two layers:

- **Layer 1 (the root):** strategy. Goals, priorities, the AI's rules. Here the AI is a
  *thinking partner*: it helps you decide what matters. It does not do project work.
- **Layer 2 (`03-projects/<name>/`):** execution. Each project has its own
  `CLAUDE.md`, and its own `01-inputs/`, `02-process/`, `03-outputs/`. Work happens here.

Why split? Claude Code reads the root `CLAUDE.md` on **every single message**. Strategy
changes slowly and is short, so it can live there. Project detail is large and only
matters when you work on that project, so it lives one layer down and loads only then.
We call this *context economics*: every line in the root file is paid for on every turn
([concept note](../template/08-concepts/context-economics.md)).

## 4. Step 3: a root CLAUDE.md written by an interview

`CLAUDE.md` is a file Claude Code reads automatically. We use it as the AI's job
description and your user manual:

- **Who you are** and what the AI should know about your life or work
- **Its role** (thinking partner? researcher? both?)
- **How to talk to you**: blunt or warm, short or detailed, what you hate seeing
- **Where you are strong and where you need a push**
- **Your goals**
- **Standing rules**: what it must *always ask you first* about (money, posting
  publicly, messaging people, deleting files), and what it may just do and report

Writing that cold is hard, so we do not. The **`brain-setup` skill** interviews you,
one question at a time, with an example answer for each, and writes the file for you.
One question at a time matters: a form gets half-hearted answers, a conversation
gets real ones.

Two small touches that paid off:

- **Give the AI a name.** It makes the relationship feel like working with someone and
  makes it obvious which "voice" is speaking when you add helpers later.
- **Tell it your preferred communication style in plain terms.** If long jargon hurts
  to read, say so. "Plain language, short sentences" in the root file changed every
  answer after it.

## 5. Step 4: memory as files, and a mistakes log

Claude Code has a private memory store of its own. We deliberately do **not** rely on
it. Memory lives in `07-memory/` as markdown files, with a short index
(`MEMORY.md`) the AI reads first.

Why files and not hidden settings?

1. **Any tool can read it.** If you switch AI tools, or models, the memory comes along.
2. **You can read it.** You can open, correct or delete a memory yourself. Hidden
   memory you cannot inspect is a liability.
3. **It is searchable and linkable** like any other note.

The most valuable single file turned out to be the **mistakes log**
(`07-memory/feedback_mistakes_log.md`). The rule: *a wrong assumption, a broken
command, a gotcha that cost time gets one dated entry before you move on*: what
happened, the root cause, and the rule that prevents it. A mistake that only exists in
a chat dies when the chat closes and gets repeated. Written down, the next session
reads it first.

## 6. Step 5: skills instead of a bigger CLAUDE.md

When the root file grew past 200 lines we noticed it was slow and costly: all of it was
loaded on every turn, though most of it was situational ("how to run a weekly review").

Claude Code **skills** solve this. A skill is a folder with a `SKILL.md`. Only its name
and a one-line description are always loaded; the body loads **only when the skill is
used**. Trimming the root file from 209 to 133 lines cut roughly 1,250 tokens off every
exchange.

The rule we follow: **situational detail goes in a skill; only what is true on every
single turn goes in `CLAUDE.md`.**

The starter ships four skills:

| Skill | When it runs |
|---|---|
| `brain-setup` | Once, to interview you and write your brain |
| `new-project` | When you start a project |
| `weekly-update` | When you ask for a weekly review |
| `wrap-up` | When you say "that's all for today": it writes the journal, the mistakes log, the memory and the open loops |

`wrap-up` is the quiet hero. A long session's decisions otherwise live only in a
conversation that is about to close.

## 7. Step 6: a small team of helper agents

Claude Code can hand a whole task to a **sub-agent**: a helper with its own clean
context and its own instructions. We started with one and ended with a handful, each
with one job: a researcher, a security/quality reviewer, a writer, a design critic, a
video critic, a money watchdog, and one **team lead** who audits the roster.

What we learned:

- **Cap the roster.** Past about six agents the main AI can no longer tell who to hand
  a task to, and every helper costs tokens each time it starts. A number beats a vibe.
- **One job each.** If two descriptions overlap, merge them.
- **You talk to the main AI; it routes.** You can also address a helper by name.
- **Only one agent audits the others.** Otherwise oversight turns into a committee.
- **A voice is optional but fun.** We gave each helper the personality of a character
  we liked. It changes the tone, never the rules, and it makes it obvious who is
  speaking.
- **Line endings matter.** An agent file saved with Windows CRLF line endings silently
  dropped out of the roster once. Keep agent files LF. (The installer does this for you.)
- **Cross-agent edits go through the main AI.** A helper may *propose* exact wording
  for another helper's file, but the main AI applies it. One accountable place for changes.

The starter gives you four generic agents so you can see the pattern. Rename or remove
them in the `brain-setup` interview.

## 8. Step 7: autonomy, grown not switched on

We wanted the AI to eventually run things on its own, including while we slept. The
honest facts: an AI session only runs while a session is open. Anything that must happen
overnight belongs to a scheduler or automation tool, which the AI can help you *build*.

What you control is **how much it does without asking**. We use an *always-ask list*
that you set once: spending money, publishing anything public, contacting real people,
deleting or overwriting files, installing software. Everything else, the AI does and
then reports. As it proves reliable, you shorten the list. That is the whole idea of
[autonomy](../template/08-concepts/autonomy.md): a lane you widen as trust builds.

## 9. Step 8: an inbox for notes written elsewhere

You will also chat with Claude on your phone and in the browser, where it cannot see
your vault. The **inbox** (`00-inbox/`) is a drop zone: those chats write one small
file in a fixed format, and the AI in your vault files it properly next session and
moves it to `processed/` so nothing is handled twice. If something in a chat file
contradicts what is already in the vault, the AI asks you; it never overwrites.

## 10. Step 9: seeing the brain (the graph)

This is the part people ask about most.

**Attempt 1: make Obsidian's own graph pretty.** We wrote a CSS snippet and tuned the
physics (low centre force, high repel force, long link distance) so it drifted like a
galaxy. It helped, but we learned the real lesson: **styling cannot fix a sparse
graph.** 49 long documents with 41 links look like scattered dots. 60 *short* notes
with 300 links look like a web. The thing that makes a graph alive is
[graph density](../template/08-concepts/graph-density.md), which comes from
[atomic notes](../template/08-concepts/atomic-notes.md) (one idea per note) and the
habit of linking as you write. A link to a note that does not exist yet is fine: it
shows as a dim ghost star and marks work worth doing.

**Attempt 2: a tool called Graphify.** A short demo of Obsidian plus Graphify (a 3D
knowledge-graph look) was the spark. We did not install it. We decided to build our own
inside Obsidian so we owned it, could keep it private, and could shape it to the vault.

**The result: [Brain Graph](03-brain-graph.md)**, an Obsidian plugin that draws your
real notes and links as a glowing 3D brain over a night sky:

- notes are stars, sized by how many links they have
- each top-level folder is a *community* with its own colour and its own patch of cortex
- root files and the concept map run down the brainstem as the "core"
- hover a note and its links light up; click it and it opens
- click a community in the legend and it glows and sparks
- **live updates:** about 2.5 seconds after Obsidian re-indexes, a new note flashes in
  with a "LEARNED" card, without moving the camera
- **Ctrl+G** opens it, replacing the core graph's hotkey

Engineering decisions worth copying:

- It reads Obsidian's **own link index**, so it shows the real graph, not a re-parse.
- The 3D page runs in a **sandboxed frame** that can only send three messages (open a
  note, rescan, full screen). It cannot read your files or reach the network.
- three.js is **vendored** (shipped inside the plugin), downloaded once from the package
  registry and checked against the registry's integrity hash. No CDN at runtime.
- About 3,200 faint specks inside the brain shape are decoration so the outline reads
  even when you have few notes. They are not notes, and we say so.

## 11. Rules we learned the hard way

These are in the root `CLAUDE.md` the interview writes for you, because each one cost
us real time:

- **Ask clarifying questions until you are about 95% sure, one at a time.** A wrong
  assumption caught in a question costs one line; caught after the work, it costs the work.
- **Test before declaring.** Before saying something is *impossible*, *good enough*,
  *a certain kind of thing*, or *done*, run the cheapest check that could prove it
  wrong. A returned "success" is not proof of an effect. And design the test so it can
  fail: a test everything passes has measured nothing.
- **After two failed fixes, stop patching.** Print the real values, show the raw
  output, state one root-cause guess, *then* edit again. Guessing in a loop burned hours.
- **Verify downloads.** Publisher or signature, official source over mirrors,
  dependency audit. Never skip it to save time.
- **Link as you write.** Related notes get `[[wikilinks]]`. It is what builds the graph.
- **Never store passwords, ID numbers or bank details in the vault.**
- **If your vault syncs through OneDrive, Dropbox or similar,** keep `node_modules`
  folders *out* of it (move them elsewhere and leave a directory junction). Thousands
  of tiny files make sync crawl and break things.
- **Do not publish, spend or message anyone** without showing the owner first.

## 12. The order we suggest you build it in

You do not need all of this on day one. The starter installs everything, but *use* it
in this order:

1. **Day 1:** run the installer, answer the `brain-setup` interview, open the graph.
2. **Week 1:** keep the mistakes log. Say "that's all for today" at the end of sessions.
3. **Week 2:** start a project with `new-project`. Do one weekly update.
4. **Month 1:** write concept notes for ideas you keep re-explaining. Watch the graph fill in.
5. **When it hurts:** add a helper agent for the job you hand off most. Not before.
6. **Later:** widen the AI's autonomy by shortening the always-ask list, one item at a time.

---

Built by Joe and Claude. MIT licensed. Take it, change it, make it yours.
