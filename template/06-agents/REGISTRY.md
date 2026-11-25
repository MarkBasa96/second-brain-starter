# Agent roster

The single source of truth for the helper agents. Read this before adding,
retiring or changing one. The working files live in `.claude/agents/`.

## The team

| Agent | Does | Never does |
|---|---|---|
| [[researcher]] (`.claude/agents/researcher.md`) | Finds evidence for a decision | Decide for you |
| [[reviewer]] (`.claude/agents/reviewer.md`) | Audits security and quality | Fix things on its own |
| [[writer]] (`.claude/agents/writer.md`) | Drafts anything with an audience | Publish or send |
| [[team-lead]] (`.claude/agents/team-lead.md`) | Audits this roster | Edit another agent's file |

## Rules

1. **Cap: six agents.** More than that and the main AI cannot tell who to hand a
   task to. Each agent costs tokens every time one is started. See [[roster-cap]].
2. **One job each.** If two agents' descriptions overlap, merge or sharpen them.
3. **The main AI routes.** You talk to the main AI; it hands work to the right helper.
4. **Only the team lead audits** the roster. Everyone else stays in their lane.
5. **No overwriting.** An agent may propose exact wording for another agent's file;
   the main AI applies it, so one place is accountable for changes.
6. **Personality is optional.** To give an agent a voice (a favourite character,
   a profession), add a short "Voice" section to its file. It changes the tone,
   never the rules. See [[namesake-voice]].

## To add an agent

1. Write `.claude/agents/<name>.md` with frontmatter (`name`, `description`, `tools`, `model`).
   Use LF line endings. CRLF can make the file silently drop out of the roster.
2. Add a row to the table above.
3. Ask [[team-lead]] to audit the roster.

See also [[delegation]], [[agent-teams]], [[second-brain]].
