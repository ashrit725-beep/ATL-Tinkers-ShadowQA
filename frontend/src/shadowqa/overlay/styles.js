export const STYLES = `
:host { all: initial; }
:host, .root {
  --bg: rgba(10, 11, 14, 0.94); --card: #0d0f13; --sub: #12151a; --line: rgba(255,255,255,0.09); --line-strong: rgba(255,255,255,0.16);
  --text: #eef2f6; --muted: #98a3b3; --dim: #667081; --red: #f0533f; --green: #2fbf8a; --amber: #e8a33c; --cyan: #37b6d3; --indigo: #7c83f5;
  font-family: "IBM Plex Sans", system-ui, sans-serif; font-size: 12.5px; line-height: 1.5; color: var(--text);
}
* { box-sizing: border-box; }
button { font: inherit; color: inherit; background: none; border: 0; cursor: pointer; }
.mono { font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace; }
.dock { position: fixed; right: 20px; bottom: 20px; z-index: 2147483000; display: flex; flex-direction: column; align-items: flex-end; gap: 10px; pointer-events: none; }
.dock > * { pointer-events: auto; }

.dot { width: 22px; height: 22px; border-radius: 999px; display: grid; place-items: center; opacity: 0.38; transition: opacity 0.25s, transform 0.25s; }
.dot:hover { opacity: 1; transform: scale(1.05); }
.dot i { width: 8px; height: 8px; border-radius: 999px; background: var(--green); box-shadow: 0 0 0 4px rgba(47,191,138,0.14); display: block; }
.dot.busy i { background: var(--amber); box-shadow: 0 0 0 4px rgba(232,163,60,0.16); animation: pulse 1.4s ease-in-out infinite; }
@keyframes pulse { 0%,100% { transform: scale(1); opacity: 1 } 50% { transform: scale(0.72); opacity: 0.6 } }

.card { width: 392px; max-width: calc(100vw - 32px); max-height: calc(100vh - 72px); overflow-y: auto; background: var(--bg); backdrop-filter: blur(18px) saturate(1.2); -webkit-backdrop-filter: blur(18px) saturate(1.2);
  border: 1px solid var(--line-strong); border-radius: 10px; box-shadow: 0 24px 60px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,0,0,0.6); overflow: hidden;
  animation: rise 0.28s cubic-bezier(0.16,1,0.3,1); }
@keyframes rise { from { opacity: 0; transform: translateY(10px) scale(0.985) } to { opacity: 1; transform: none } }
.card-head { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-bottom: 1px solid var(--line); }
.card-head .led { width: 8px; height: 8px; border-radius: 999px; background: var(--red); box-shadow: 0 0 10px var(--red); }
.card-head .led.green { background: var(--green); box-shadow: 0 0 10px var(--green); }
.card-head .led.amber { background: var(--amber); box-shadow: 0 0 10px var(--amber); animation: pulse 1.4s ease-in-out infinite; }
.card-head .brand { font-weight: 600; letter-spacing: 0.02em; font-size: 12px; }
.card-head .phase { margin-left: auto; font-size: 10.5px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
.card-body { padding: 14px 14px 12px; }
.title { font-size: 15px; font-weight: 600; letter-spacing: -0.01em; margin: 0 0 8px; }
.sub { color: var(--muted); margin: 0 0 10px; }
.label { font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--dim); margin: 10px 0 4px; }
.kv { display: grid; grid-template-columns: auto 1fr; gap: 3px 12px; font-size: 12px; }
.kv .k { color: var(--dim); }
.chain { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 6px; font-size: 11.5px; color: var(--muted); }
.chain .node { padding: 2px 7px; border: 1px solid var(--line); border-radius: 4px; background: var(--sub); color: var(--text); white-space: nowrap; max-width: 100%; overflow: hidden; text-overflow: ellipsis; }
.chain .node.bad { border-color: rgba(240,83,63,0.5); color: #ff8d7f; }
.chain .arrow { color: var(--dim); }
.loc { font-size: 12.5px; color: var(--cyan); word-break: break-all; }
.meta { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-top: 10px; }
.badge { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 4px; font-size: 10.5px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; border: 1px solid; }
.badge-low { color: #4fd6a3; border-color: rgba(47,191,138,0.35); background: rgba(47,191,138,0.1); }
.badge-medium { color: #f2b95a; border-color: rgba(232,163,60,0.4); background: rgba(232,163,60,0.1); }
.badge-high { color: #ff8d7f; border-color: rgba(240,83,63,0.45); background: rgba(240,83,63,0.12); }
.badge-— { color: var(--muted); border-color: var(--line); }
.conf { font-size: 11.5px; color: var(--muted); }
.conf b { color: var(--text); font-weight: 600; }
.actions { display: flex; gap: 8px; align-items: center; margin-top: 14px; }
.btn { padding: 7px 12px; border-radius: 6px; border: 1px solid var(--line-strong); background: var(--sub); font-size: 12px; font-weight: 500; transition: background-color 0.15s, border-color 0.15s, transform 0.1s; }
.btn:hover { background: #1a1e26; border-color: rgba(255,255,255,0.28); }
.btn:active { transform: translateY(1px); }
.btn.primary { background: var(--text); color: #0b0c0f; border-color: var(--text); }
.btn.primary:hover { background: #ffffff; }
.btn.danger { border-color: rgba(240,83,63,0.5); color: #ff9c90; }
.btn.link { border: 0; background: none; color: var(--muted); padding: 7px 4px; margin-left: auto; }
.btn.link:hover { color: var(--text); }
.btn:disabled { opacity: 0.45; cursor: default; }
.spin { display: inline-block; width: 12px; height: 12px; border: 1.5px solid var(--line-strong); border-top-color: var(--cyan); border-radius: 999px; animation: spin 0.8s linear infinite; vertical-align: -2px; margin-right: 6px; }
@keyframes spin { to { transform: rotate(360deg) } }

.diff { background: #07080a; border: 1px solid var(--line); border-radius: 6px; padding: 8px 10px; margin: 8px 0; font-size: 11.5px; line-height: 1.55; overflow-x: auto; white-space: pre; max-height: 260px; }
.diff .d-add { display: block; color: #5fe0aa; background: rgba(47,191,138,0.1); }
.diff .d-del { display: block; color: #ff8d7f; background: rgba(240,83,63,0.1); }
.diff .d-ctx { display: block; color: var(--dim); }
.diff .d-hunk { display: block; color: var(--indigo); margin-top: 4px; }
.file { font-size: 11.5px; color: var(--muted); margin-top: 8px; }
.file b { color: var(--text); font-weight: 500; }

.check { list-style: none; margin: 6px 0 0; padding: 0; }
.check-item { display: flex; align-items: baseline; gap: 8px; padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 12px; }
.check-item:last-child { border-bottom: 0; }
.check-item.running .check-label { color: var(--text); }
.check-item.pending .check-label { color: var(--dim); }
.check-label { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.check-detail { color: var(--dim); font-size: 11px; max-width: 46%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ic { width: 14px; display: inline-block; text-align: center; font-weight: 700; flex: none; }
.ic-ok { color: var(--green); } .ic-bad { color: var(--red); } .ic-skip, .ic-pending { color: var(--dim); }
.ic-run { width: 10px; height: 10px; border: 1.5px solid var(--line-strong); border-top-color: var(--cyan); border-radius: 999px; animation: spin 0.8s linear infinite; position: relative; top: 1px; margin-right: 4px; }
.verdict { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 6px; margin-top: 12px; font-weight: 600; letter-spacing: 0.02em; }
.verdict.ok { background: rgba(47,191,138,0.12); border: 1px solid rgba(47,191,138,0.35); color: #5fe0aa; }
.verdict.bad { background: rgba(240,83,63,0.1); border: 1px solid rgba(240,83,63,0.4); color: #ff9c90; }
.verdict.warn { background: rgba(232,163,60,0.1); border: 1px solid rgba(232,163,60,0.4); color: #f2b95a; }
.hint { font-size: 11px; color: var(--dim); margin-top: 8px; }
.factors { margin: 6px 0 0; padding-left: 16px; color: var(--muted); font-size: 11.5px; }
.factors li { margin: 1px 0; }
.policy { font-size: 11px; color: var(--amber); margin-top: 6px; }

.drawer { position: fixed; top: 0; right: 0; bottom: 0; width: 720px; max-width: 100vw; background: #090a0d; border-left: 1px solid var(--line-strong); z-index: 2147483001;
  box-shadow: -30px 0 80px rgba(0,0,0,0.6); display: flex; flex-direction: column; animation: slide 0.3s cubic-bezier(0.16,1,0.3,1); }
@keyframes slide { from { transform: translateX(40px); opacity: 0 } to { transform: none; opacity: 1 } }
.drawer-head { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-bottom: 1px solid var(--line); }
.drawer-head .brand { font-weight: 600; white-space: nowrap; }
.drawer-head .sub { margin: 0; font-size: 11.5px; white-space: nowrap; }
.drawer-head select { max-width: 300px; margin-left: auto; overflow: hidden; text-overflow: ellipsis; }
.drawer-head .close { color: var(--muted); font-size: 16px; padding: 4px 8px; }
.tabs { display: flex; gap: 2px; padding: 0 10px; border-bottom: 1px solid var(--line); overflow-x: auto; }
.tab { padding: 9px 10px; font-size: 11.5px; color: var(--muted); border-bottom: 2px solid transparent; white-space: nowrap; transition: color 0.15s, border-color 0.15s; }
.tab:hover { color: var(--text); }
.tab.active { color: var(--text); border-bottom-color: var(--cyan); }
.pane { flex: 1; overflow: auto; padding: 16px; }
.pane h3 { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--dim); margin: 16px 0 8px; font-weight: 600; }
.pane h3:first-child { margin-top: 0; }
.pane p { margin: 6px 0; color: var(--muted); }
.pane p b { color: var(--text); font-weight: 500; }
.tl { list-style: none; margin: 0; padding: 0; }
.tl li { display: grid; grid-template-columns: 92px 84px 1fr; gap: 10px; padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 12px; align-items: baseline; }
.tl .t { color: var(--dim); font-size: 11px; }
.tl .kind { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--dim); }
.tl li.error .kind, .tl li.error .l { color: #ff8d7f; }
.tl li.source .kind { color: var(--cyan); }
.tl li.user .kind { color: var(--indigo); }
.graph { display: flex; flex-direction: column; align-items: flex-start; gap: 0; }
.gnode { border: 1px solid var(--line-strong); background: var(--sub); border-radius: 6px; padding: 7px 12px; min-width: 240px; }
.gnode .gt { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--dim); }
.gnode .gl { font-size: 12.5px; word-break: break-all; }
.gnode.runtime_error { border-color: rgba(240,83,63,0.5); } .gnode.source_location, .gnode.file { border-color: rgba(55,182,211,0.5); } .gnode.user_action { border-color: rgba(124,131,245,0.5); }
.gedge { width: 1px; height: 16px; background: var(--line-strong); margin-left: 18px; position: relative; }
.gedge::after { content: ""; position: absolute; bottom: -1px; left: -3px; border: 3.5px solid transparent; border-top-color: var(--line-strong); }
.code { background: #07080a; border: 1px solid var(--line); border-radius: 6px; padding: 8px 0; font-size: 11.5px; line-height: 1.55; overflow: auto; max-height: 420px; }
.code .ln { display: grid; grid-template-columns: 44px 1fr; }
.code .ln .n { color: var(--dim); text-align: right; padding-right: 10px; user-select: none; }
.code .ln.hl { background: rgba(240,83,63,0.12); }
.code .ln.hl .n { color: var(--red); }
.code .ln pre { margin: 0; white-space: pre; }
table.grid { width: 100%; border-collapse: collapse; font-size: 12px; }
table.grid th { text-align: left; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--dim); padding: 4px 6px; border-bottom: 1px solid var(--line); font-weight: 600; }
table.grid td { padding: 5px 6px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: top; }
.s-ok { color: var(--green); } .s-bad { color: var(--red); } .s-warn { color: var(--amber); }
.health { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px; }
.hcard { border: 1px solid var(--line); border-radius: 6px; padding: 10px 12px; background: var(--sub); display: flex; flex-direction: column; gap: 4px; }
.hcard .hn { display: flex; align-items: center; gap: 8px; font-weight: 500; }
.hcard .hd { font-size: 11px; color: var(--dim); }
.hcard.failed { border-color: rgba(240,83,63,0.45); }
.hcard.passed { border-color: rgba(47,191,138,0.35); }
.stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 8px; }
.stat { border: 1px solid var(--line); border-radius: 6px; padding: 10px 12px; background: var(--sub); }
.stat .sv { font-size: 18px; font-weight: 600; }
.stat .sl { font-size: 10.5px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--dim); }
.empty { color: var(--dim); font-style: italic; }
pre.raw { white-space: pre-wrap; word-break: break-word; color: var(--muted); font-size: 11.5px; background: #07080a; border: 1px solid var(--line); border-radius: 6px; padding: 8px 10px; margin: 6px 0; max-height: 220px; overflow: auto; }
.row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
@media (max-width: 640px) { .card { width: calc(100vw - 24px); } .dock { right: 12px; bottom: 12px; } .drawer { width: 100vw; } }
`;
