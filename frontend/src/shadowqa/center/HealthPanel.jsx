import { Badge, Button, Empty, Panel, clock, ms, shortPath } from "./ui";

export function HealthPanel({ qaRun, flows, onRunQA }) {
  const run = qaRun?.flows ? qaRun : null;
  const all = flows || [];
  return (
    <Panel eyebrow="Autonomous QA" title="Application health" testid="cc-health" action={<Button primary onClick={onRunQA} testid="cc-run-qa-btn">Run QA sweep</Button>}>
      <p className="text-[11.5px] text-[#98a3b3] mb-3">{all.length} flows · {all.filter((f) => f.source === "declared").length} declared · {all.filter((f) => f.source === "learned").length} learned from verified fixes. The sweep drives this very browser tab through every flow and files incidents for failures.</p>
      {run ? (
        <>
          <div className="flex items-center gap-3 mb-3">
            <span className={`font-mono text-2xl font-semibold ${run.failed ? "text-[#ff8d7f]" : "text-[#4fd6a3]"}`} data-testid="cc-health-score">{run.passed}/{run.flows.length}</span>
            <span className="text-[11.5px] text-[#667081]">flows healthy · {clock(run.at)} · {ms(run.duration_ms)}</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-2" data-testid="cc-health-grid">
            {run.flows.map((f) => (
              <div key={f.name} className={`rounded-md border px-3 py-2 bg-[#12151a] ${f.status === "passed" ? "border-[#2fbf8a]/35" : "border-[#f0533f]/45"}`}>
                <div className="flex items-center gap-2 text-[12.5px] text-[#eef2f6]"><span className={f.status === "passed" ? "text-[#2fbf8a]" : "text-[#f0533f]"}>{f.status === "passed" ? "✓" : "✗"}</span>{f.name}</div>
                <div className="text-[11px] text-[#667081] mt-0.5 truncate">{f.error || `${(f.steps || []).length} steps · ${ms(f.duration_ms)}`}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <Empty>No sweep recorded yet.</Empty>
      )}
    </Panel>
  );
}

export function MemoryPanel({ memory }) {
  if (!memory) return <Panel eyebrow="Memory" title="Application memory" testid="cc-memory"><Empty>Loading…</Empty></Panel>;
  const known = Object.values(memory.known_failures || {});
  const apis = Object.values(memory.apis || {}).sort((a, b) => (b.count || 0) - (a.count || 0)).slice(0, 8);
  const routes = Object.values(memory.routes || {}).filter((r) => !String(r.path).startsWith("flow:")).sort((a, b) => (b.count || 0) - (a.count || 0)).slice(0, 8);
  const counts = [["routes", memory.routes], ["apis", memory.apis], ["components", memory.components]].map(([k, v]) => [k, Object.keys(v || {}).length]);
  const Head = ({ children }) => <div className="text-[10px] uppercase tracking-[0.12em] text-[#667081] font-mono mb-1.5 mt-4 first:mt-0">{children}</div>;
  return (
    <Panel eyebrow="Memory" title="What ShadowQA has learned about this app" testid="cc-memory">
      <div className="flex flex-wrap gap-2 mb-4">
        {counts.map(([k, n]) => <Badge key={k} tone="text-[#98a3b3] border-white/10">{n} {k}</Badge>)}
        <Badge tone="text-[#98a3b3] border-white/10">{known.length} known failures</Badge>
        <Badge tone="text-[#98a3b3] border-white/10">{(memory.fixes || []).length} fixes</Badge>
      </div>
      <Head>Known failures</Head>
      <div className="grid gap-1.5" data-testid="cc-known-failures">
        {known.slice(0, 6).map((k) => (
          <div key={`${k.title}${k.file}${k.line}`} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 text-[12px] border-t border-white/[0.05] pt-1.5">
            <span className="text-[#eef2f6] truncate">{k.title}</span>
            <span className="font-mono text-[#667081] whitespace-nowrap">{shortPath(k.file)}:{k.line}</span>
            <span className={`font-mono text-[11px] ${k.status === "fixed" ? "text-[#4fd6a3]" : k.status === "regressed" ? "text-[#ff8d7f]" : "text-[#f2b95a]"}`}>{k.status} ×{k.count}</span>
          </div>
        ))}
        {known.length === 0 && <Empty>No failures observed yet.</Empty>}
      </div>
      <div className="grid sm:grid-cols-2 gap-x-6">
        <div>
          <Head>APIs observed</Head>
          <div className="grid gap-1" data-testid="cc-memory-apis">
            {apis.map((a) => (
              <div key={`${a.method}${a.path}`} className="flex items-center justify-between gap-2 text-[11.5px] font-mono border-t border-white/[0.05] pt-1">
                <span className="text-[#98a3b3] truncate">{a.method} {a.path}</span>
                <span className="text-[#667081] whitespace-nowrap">{Object.entries(a.statuses || {}).map(([s, c]) => <span key={s} className={Number(s) >= 400 || s === "0" ? "text-[#ff8d7f] ml-1.5" : "ml-1.5"}>{s}×{c}</span>)}</span>
              </div>
            ))}
            {apis.length === 0 && <Empty>None yet.</Empty>}
          </div>
        </div>
        <div>
          <Head>Routes visited</Head>
          <div className="grid gap-1" data-testid="cc-memory-routes">
            {routes.map((r) => (
              <div key={r.path} className="flex items-center justify-between gap-2 text-[11.5px] font-mono border-t border-white/[0.05] pt-1">
                <span className="text-[#98a3b3] truncate">{r.path}</span>
                <span className="text-[#667081] whitespace-nowrap">×{r.count}{r.failures ? <span className="text-[#ff8d7f] ml-1.5">{r.failures} failed</span> : null}</span>
              </div>
            ))}
            {routes.length === 0 && <Empty>None yet.</Empty>}
          </div>
        </div>
      </div>
    </Panel>
  );
}
