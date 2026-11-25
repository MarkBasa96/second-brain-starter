---
name: weekly-update
description: Run the weekly review. Look at the week's journals and projects, update the goals note and current priorities, and write a dated review in 04-reviews/.
when_to_use: When the owner asks for a weekly review or update, or says their goals or priorities have drifted out of date, or when 02-journals/ has had no entry for several days.
---

# Skill: weekly-update

1. **Read** the last seven days of `02-journals/`, `00-goals/goals.md`, and the
   `CLAUDE.md` of each active project.
2. **Ask** (one at a time): "What went well? What stalled? Anything you want to drop
   or add?"
3. **Write** `04-reviews/<YYYY>-W<week>.md`:
   - What happened (3 to 6 lines, plain language)
   - What shipped or moved, and what did not
   - Decisions made
   - **The honest line:** if the week was spread across many things and nothing
     moved forward, say so and propose picking one thing
   - Next week's top three
   - Links to every note and project touched, as `[[wikilinks]]`
4. **Update** `00-goals/goals.md` and the "Current projects" section of the root
   `CLAUDE.md` only with changes the owner approved.
5. **Append** to `07-memory/feedback_mistakes_log.md` any mistake from the week that
   is not in it yet.
