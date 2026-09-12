import { Panel, ms } from "./ui";

const STAGES = [
  ["OBSERVE", "click · request · exception", "detection_ms"],
  ["UNDERSTAND", "correlation + context graph", "correlation_ms"],
  ["DIAGNOSE", "source-mapped root cause", "ai_ms"],
  ["ACT", "minimal patch + checkpoint", "patch_ms"],
  ["VALIDATE", "babel · eslint · jest", "validation_ms"],
  ["REPLAY", "your exact gesture, again", "replay_ms"],
  ["VERIFY", "evidence → verdict", "total_ms"],
];

const REACHED = {
  captured: 1, diagnosing: 2, diagnosed: 3, no_safe_fix: 3, diagnosis_failed: 3, applying: 4, validating: 5, validation_failed: 5,
  awaiting_replay: 5, replaying: 6, replay_failed: 6, verified: 7, committed: 7, rolled_back: 7, dismissed: 3, superseded: 3,
};

export function LoopPanel({ incidents }) {
  const latest = (incidents || [])[0];
  const t = latest?.telemetry || {};
  const reached = latest ? REACHED[latest.status] || 0 : 0;
  const ok = latest && ["verified", "committed"].includes(latest.status);
  const bad = latest && /failed|no_safe_fix|rolled_back/.test(latest.status);
  return (
    <Panel eyebrow="The loop" title={latest ? `Latest incident · ${latest.title}` : "Waiting for the first failure"} testid="cc-loop"
      action={latest && <span className={`font-mono text-[11px] ${ok ? "text-[#4fd6a3]" : bad ? "text-[#ff8d7f]" : "text-[#f2b95a]"}`} data-testid="cc-loop-status">{latest.status.replace(/_/g, " ")}{t.total_ms ? ` · ${ms(t.total_ms)}` : ""}</span>}>
      <ol className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2" data-testid="cc-loop-stages">
        {STAGES.map(([name, sub, key], i) => {
          const done = i < reached;
          const active = i === reached - 1 && !ok && !bad;
          const tone = bad && i === reached - 1 ? "border-[#f0533f]/50" : done ? (ok ? "border-[#2fbf8a]/40" : "border-[#37b6d3]/40") : "border-white/[0.06] opacity-55";
          return (
            <li key={name} className={`relative rounded-md border bg-[#12151a] px-3 py-2.5 transition-[border-color,opacity] duration-300 ${tone}`} data-testid={`cc-stage-${name.toLowerCase()}`}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10.5px] tracking-[0.12em] text-[#eef2f6]">{name}</span>
                {active && <span className="h-1.5 w-1.5 rounded-full bg-[#e8a33c] animate-pulse" />}
              </div>
              <div className="text-[10.5px] text-[#667081] mt-0.5 leading-snug">{sub}</div>
              <div className="font-mono text-[12px] text-[#98a3b3] mt-1.5 tabular-nums">{done && key !== "detection_ms" ? ms(t[key]) : done ? "live" : "—"}</div>
            </li>
          );
        })}
      </ol>
    </Panel>
  );
}
