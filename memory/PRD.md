# ShadowQA — PRD

## Original problem statement
Build ShadowQA: a production-quality autonomous debugging and QA agent embedded in the web application developers already use (Zero-UI / ambient agent). Loop: OBSERVE → UNDERSTAND → DIAGNOSE → PLAN → ACT → VALIDATE → REPLAY → VERIFY, with real browser instrumentation, correlation engine, context graph, source maps, secure local workspace bridge, structured AI orchestrator, minimal diffs, risk engine, human control, checkpoints/rollback, adaptive validation, failure replay, autonomous QA mode, application memory, observability, git/PR integration, security model, graceful failure handling, premium minimal UI, a polished demo e-commerce app with realistic bugs, docs and tests. Theme: "Agents are leaving the chatbox" — the browser/dev environment is the place.

## User choices
- LLM: user's own Anthropic key → `claude-sonnet-4-6` (primary), OpenAI `gpt-5.4` fallback (Kimi key not supported by the integration layer).
- Git: real GitHub PR creation (PAT provided) — requires `GITHUB_REPO=owner/repo`; falls back to local branch + PR-ready summary.
- Delivery: embedded runtime SDK + Chrome MV3 extension wrapper.
- Autonomy: auto-apply LOW risk, approval for MEDIUM/HIGH (QA-discovered incidents always queue for review).

## Architecture (implemented 2026-06)
- Frontend `src/shadowqa/` vanilla-JS SDK: observers (runtime/network/interaction), ring buffer, detector, capture, bridge client, replay engine, QA runner, memory heartbeat, Shadow-DOM Zero-UI overlay + 11-tab inspector.
- Backend `shadowqa/`: token-gated API, pipeline state machine, source-map resolver (VLQ), correlation + context graph + replay plan, targeted retrieval, orchestrator (bounded agent loop, JSON schema, injection defenses), LLM fallback, patch engine, risk engine, validation engine (Babel/ESLint/Jest/pyflakes, allow-listed argv), checkpoint/rollback, git plumbing branches + GitHub PR, memory, QA flows, audit, telemetry.
- Demo `Lumen Supply Co.`: login, dashboard, products, product detail, cart (promo bug), checkout (contract bug), orders, settings.
- Config: `shadowqa.workspace.json`, `shadowqa.flows.json`; `scripts/reset_demo.sh`; docs in `docs/`; pytest suite (18 tests) + Jest tests.

## Verified end-to-end (2026-06)
- Checkout bug: detect → correlate → source-map (Checkout.jsx:31) → Claude finds cause in payments.js (97 %) → LOW → auto-apply → Babel/ESLint/Jest pass → reload → replay → POST 200 → confirmation → FIX VERIFIED (~30 s). Undo restores.
- Cart promo bug (pure runtime error): same loop → verified in ~29 s; branch `shadowqa/fix-<id>` created via plumbing.
- QA sweep: 8 flows (7 declared + 1 learned regression) run in the real browser; Cart/Checkout failures filed as incidents with reproducible sequences; approval path (View Fix → Apply Fix) for QA incidents.

## Backlog
- P0: set `GITHUB_REPO` to enable real PR creation (user to provide repo).
- P1: replay "before fix" reproduction step (prove failure reproduces prior to patch); per-tab session isolation; flow discovery from route memory.
- P1: TypeScript typecheck validator when a `tsconfig.json` exists; pytest related tests for backend patches.
- P2: multi-incident queue UI; regression alerts on QA schedule; Slack/GitHub notifications; extension icons/store packaging.

## Next tasks
1. Provide GitHub repo → validate PR flow end-to-end.
2. Testing-agent regression pass after any SDK/overlay change.
