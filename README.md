# ShadowQA

**An ambient debugging & QA agent that lives inside the web application developers are already using.**

> You break it. ShadowQA understands it. ShadowQA fixes it. ShadowQA proves it. You keep working.

ShadowQA is not a chatbot. It observes a running application from inside the browser, correlates *user intent → UI element → network → runtime error → source location*, retrieves only the relevant code from the developer's workspace, generates a minimal diff with a real LLM, validates it with the project's own tooling, hot-reloads the app, **replays the original interaction**, and reports evidence of recovery — or rolls back.

```
OBSERVE → UNDERSTAND → DIAGNOSE → PLAN → ACT → VALIDATE → REPLAY → VERIFY
```

Everything on the critical path is real: real browser instrumentation, real source-map resolution, real file access, real Claude/GPT diagnosis, real patching with checkpoints, real ESLint/Babel/Jest validation, real replay in the live app, real git branches.

---

## Repository layout

```
frontend/src/shadowqa/      Runtime SDK (vanilla JS, Shadow-DOM overlay) — observation, correlation hints,
                            detector, capture, replay engine, QA runner, memory heartbeat, Zero-UI overlay
frontend/src/demo/          Lumen Supply Co. — the demonstration storefront (two realistic bugs)
backend/shadowqa/           Workspace bridge, source maps, correlation engine, context graph, retrieval,
                            AI orchestrator, patch engine, risk engine, validation engine, git, memory, QA, audit
backend/demo_store/         Demo storefront API (auth, catalog, dashboard, orders, payment, settings)
extension/                  Chrome MV3 extension that injects the same SDK into any localhost app
shadowqa.workspace.json     Explicit workspace authorization (read/write roots, denied paths, limits)
shadowqa.flows.json         Declared QA flows (smoke tests ShadowQA can run in the real browser)
docs/                       Architecture, security/threat model, demo script
scripts/reset_demo.sh       Restore the intentional bugs and clear ShadowQA memory
```

## Quick start

1. `backend/.env` — set `ANTHROPIC_API_KEY` and/or `OPENAI_API_KEY` (primary `anthropic:claude-sonnet-4-6`, fallback `openai:gpt-5.4`), a `SHADOWQA_BRIDGE_TOKEN`, optionally `GITHUB_REPO=owner/repo` + `GITHUB_TOKEN` for real pull requests.
2. `frontend/.env` — `REACT_APP_SHADOWQA_TOKEN` must equal the bridge token.
3. Start backend (`uvicorn server:app --port 8001`) and frontend (`yarn start`). Open the app, sign in with `demo@lumen.supply / lumen-demo`.
4. Break something (see `docs/DEMO.md`). ShadowQA takes it from there.

See `docs/DEMO.md` for the exact demonstration script, `docs/ARCHITECTURE.md` for data flow and component design, and `docs/SECURITY.md` for the threat model.

## Why the environment matters

A standalone chatbot receives an error message. ShadowQA receives **the failing click, the field values (redacted), the route, the React component, the request/response that preceded the exception, the source-mapped frame, the relevant workspace files and the application's memory of prior failures** — and it can act on the workspace and *drive the application to prove the fix*. None of that exists outside the browser + workspace.
