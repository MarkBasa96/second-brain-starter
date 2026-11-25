---
type: concept
tags: [architecture]
---
# Two layers

Layer 1 is the root of the vault: strategy. Goals, priorities, the AI's rules. The AI here is a thinking partner, not a task-doer.

Layer 2 is each folder in `03-projects/`: execution. A project has its own CLAUDE.md with its own rules, and its own inputs, process and outputs. Work happens there.

Why split: strategy changes slowly and loads on every turn, so it must stay short ([[context-economics]]). Execution detail is large and situational, so it lives one layer down and loads only when you work on that project.

Part of [[second-brain]].
