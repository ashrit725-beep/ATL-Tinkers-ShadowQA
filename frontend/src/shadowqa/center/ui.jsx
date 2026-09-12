export const ms = (v) => (v == null ? "—" : v >= 1000 ? `${(v / 1000).toFixed(1)}s` : `${Math.round(v)}ms`);
export const pct = (v) => (v == null ? "—" : `${Math.round(Number(v) * 100)}%`);
export const shortPath = (p) => String(p || "").replace(/^frontend\/src\//, "").replace(/^backend\//, "");
export const clock = (iso) => (iso ? new Date(iso).toLocaleTimeString("en-US", { hour12: false }) : "—");

export const STATUS_TONE = {
  verified: "text-[#4fd6a3] border-[#2fbf8a]/40 bg-[#2fbf8a]/10",
  committed: "text-[#4fd6a3] border-[#2fbf8a]/40 bg-[#2fbf8a]/10",
  diagnosed: "text-[#f2b95a] border-[#e8a33c]/40 bg-[#e8a33c]/10",
  diagnosing: "text-[#f2b95a] border-[#e8a33c]/40 bg-[#e8a33c]/10",
  captured: "text-[#f2b95a] border-[#e8a33c]/40 bg-[#e8a33c]/10",
  validating: "text-[#f2b95a] border-[#e8a33c]/40 bg-[#e8a33c]/10",
  awaiting_replay: "text-[#f2b95a] border-[#e8a33c]/40 bg-[#e8a33c]/10",
  replaying: "text-[#f2b95a] border-[#e8a33c]/40 bg-[#e8a33c]/10",
  validation_failed: "text-[#ff8d7f] border-[#f0533f]/40 bg-[#f0533f]/10",
  replay_failed: "text-[#ff8d7f] border-[#f0533f]/40 bg-[#f0533f]/10",
  diagnosis_failed: "text-[#ff8d7f] border-[#f0533f]/40 bg-[#f0533f]/10",
};

export function Panel({ title, eyebrow, action, children, testid, className = "" }) {
  return (
    <section className={`min-w-0 rounded-lg border border-white/[0.08] bg-[#0f1115] p-5 ${className}`} data-testid={testid}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          {eyebrow && <div className="text-[10px] uppercase tracking-[0.14em] text-[#667081] font-mono">{eyebrow}</div>}
          {title && <h2 className="text-[15px] font-semibold text-[#eef2f6] tracking-tight mt-0.5">{title}</h2>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Stat({ label, value, hint, testid, tone = "" }) {
  return (
    <div className="rounded-md border border-white/[0.08] bg-[#12151a] px-4 py-3" data-testid={testid}>
      <div className={`font-mono text-xl font-semibold tabular-nums ${tone || "text-[#eef2f6]"}`}>{value ?? "—"}</div>
      <div className="text-[10.5px] uppercase tracking-[0.1em] text-[#667081] mt-1">{label}</div>
      {hint && <div className="text-[11px] text-[#98a3b3] mt-0.5">{hint}</div>}
    </div>
  );
}

export function Badge({ children, tone = "text-[#98a3b3] border-white/10", testid }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[10.5px] font-semibold uppercase tracking-[0.06em] ${tone}`} data-testid={testid}>
      {children}
    </span>
  );
}

export function Button({ children, onClick, primary, danger, disabled, testid, href, className = "" }) {
  const base = `inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-[12px] font-medium transition-[background-color,border-color,transform] duration-150 active:translate-y-px disabled:opacity-40 disabled:cursor-default ${
    primary ? "bg-[#eef2f6] text-[#0b0c0f] border-[#eef2f6] hover:bg-white" : danger ? "border-[#f0533f]/50 text-[#ff9c90] bg-[#12151a] hover:bg-[#1a1e26]" : "border-white/[0.16] bg-[#12151a] text-[#eef2f6] hover:bg-[#1a1e26] hover:border-white/30"
  } ${className}`;
  if (href) return <a href={href} className={base} data-testid={testid}>{children}</a>;
  return <button type="button" onClick={onClick} disabled={disabled} className={base} data-testid={testid}>{children}</button>;
}

export const Empty = ({ children }) => <p className="text-[12px] italic text-[#667081]">{children}</p>;
