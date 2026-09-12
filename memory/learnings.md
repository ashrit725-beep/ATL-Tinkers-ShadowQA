# ShadowQA — learnings & gotchas

- Dev server hot-reloads EVERY open tab when ShadowQA patches a file. Concurrent tabs/users interfere with a running replay. Test in one tab; `restoreSession` resumes an interrupted replay once, then fails+rolls back.
- Claude Sonnet 4.6 often prefixes reasoning prose and fences the JSON. Never `text.find("{")`; use `llm.extract_json` (fenced blocks → balanced objects) + repair round.
- GPT-5.x rejects `temperature` ≠ 1 via litellm → omit temperature for `openai:gpt-5*`.
- Overlay: never rebuild `root.innerHTML` on every poll — the `.card` CSS entrance animation replays and scroll resets ("card spacing out"). Use persistent elements + `patchHtml` (data-volatile spans update in place).
- `pagehide` fetch flushes show as `net::ERR_ABORTED` in Playwright/DevTools. Memory heartbeat is timer-only; flushed explicitly before `location.reload()`.
- `/api/shadowqa/demo/scenarios` compares working files to `scripts/demo_bugs/*` pristine copies — they must exist and be the BUGGY versions.
- Platform pre-completion linter needs `frontend/eslint.config.mjs` (flat config, re-exports `.shadowqa/eslint.config.mjs`). CRA uses its nested eslint 8 and ignores it.
- Always end a test session with `POST /api/shadowqa/demo/reset` (bugs restored, sqa_* collections cleared, autonomy untouched).
- Detector dedupes identical failures for 30 s; `detector.reset()` on dismiss/rollback/verdict so a retry after Undo is detected immediately.
