# Inbox

A drop zone for notes written in *other* places: a Claude chat on your phone, the
web, the desktop app. Those chats cannot see your vault, so they write one small
file here and the AI in the vault files it properly next session.

## Format for a chat to write

Ask the chat to produce one file, `YYYY-MM-DD-short-title.md`, like this:

```markdown
---
date: 2026-01-31
source: chat (phone)
project: <project folder name, or "none">
---
# Title
What was decided, learned or made. Plain language.
Links to deliverables if any.
```

## What the AI in the vault does

1. At the start of a session, look in `from-chat/` for unprocessed files and tell you.
2. File each into the right place (project folder, memory, journal), linking it.
3. Move the processed file to `processed/` so it is never handled twice.
4. If something disagrees with what is already in the vault, ask you. Never overwrite.
5. Never store passwords, ID numbers or bank details. Leave them out and tell you.

See [[second-brain]] and [[memory-in-the-vault]].
