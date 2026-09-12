import { checklist, escapeHtml as esc, pct, renderDiff, riskBadge, shortPath } from "./util";

const head = (led, phase) => `<div class="card-head"><span class="led ${led}"></span><span class="brand">ShadowQA</span><span class="phase">${esc(phase)}</span></div>`;

function contextChain(inc) {
  const nodes = (inc.graph?.nodes || []).filter((n) => ["user_action", "network_request", "network_response", "runtime_error"].includes(n.type));
  if (!nodes.length) return "";
  return `<div class="chain">${nodes
    .map((n, i) => `${i ? '<span class="arrow">→</span>' : ""}<span class="node ${n.type === "runtime_error" || (n.type === "network_response" && (n.meta?.status ?? 0) >= 400) ? "bad" : ""}">${esc(n.label)}</span>`)
    .join("")}</div>`;
}

function locationLine(inc) {
  const loc = inc.source_location;
  if (!loc) return "";
  return `<div class="label">${loc.resolved ? "Source" : "Location (no source map)"}</div><div class="loc mono" data-testid="sqa-source-location">${esc(shortPath(loc.file))}:${esc(loc.line)}</div>`;
}

const footer = (buttons) => `<div class="actions">${buttons}</div>`;
const detailsBtn = `<button class="btn link" data-action="inspector" data-testid="sqa-details-btn">Details</button>`;
const dismissBtn = `<button class="btn" data-action="dismiss" data-testid="sqa-dismiss-btn">Dismiss</button>`;

export function renderCapturing(state) {
  return `${head("amber", "detected")}<div class="card-body"><p class="title" data-testid="sqa-card-title">Failure detected</p><p class="sub"><span class="spin"></span>Correlating interaction, network and runtime context…</p></div>`;
}

export function renderAnalyzing(inc) {
  return `${head("amber", "analyzing")}<div class="card-body" data-testid="sqa-analyzing">
    <p class="title" data-testid="sqa-card-title">${esc(inc.title)}</p>
    ${contextChain(inc)}
    ${locationLine(inc)}
    <p class="sub" style="margin-top:12px"><span class="spin"></span>Diagnosing root cause…</p>
    ${footer(`${dismissBtn}${detailsBtn}`)}</div>`;
}

export function renderDiagnosed(inc) {
  const d = inc.diagnosis || {};
  const r = inc.risk || {};
  const loc = d.cause_location || (inc.source_location ? `${inc.source_location.file}:${inc.source_location.line}` : "");
  return `${head("", "diagnosed")}<div class="card-body" data-testid="sqa-incident-card">
    <p class="title" data-testid="sqa-card-title">${esc(inc.title)}</p>
    <div class="label">Root cause</div>
    <div class="loc mono" data-testid="sqa-root-cause-location">${esc(shortPath(loc))}</div>
    <p class="sub" style="margin-top:6px" data-testid="sqa-root-cause">${esc(d.root_cause || "")}</p>
    <div class="meta"><span class="conf" data-testid="sqa-confidence">Confidence <b>${pct(d.confidence)}</b></span>${riskBadge(r.level)}<span class="conf">${r.files || 0} file · ${r.lines || 0} lines</span></div>
    ${inc.policy?.auto_applied ? `<p class="policy">LOW risk · eligible for autonomous application</p>` : ""}
    ${footer(`<button class="btn primary" data-action="view-fix" data-testid="sqa-view-fix-btn">View Fix</button>${dismissBtn}${detailsBtn}`)}</div>`;
}

export function renderFix(inc) {
  const p = inc.patch || {};
  const r = inc.risk || {};
  const d = inc.diagnosis || {};
  return `${head("", "proposed fix")}<div class="card-body" data-testid="sqa-fix-view">
    <p class="title">${esc(inc.title)}</p>
    ${(p.files || []).map((f) => `<div class="file"><b>${esc(shortPath(f.path))}</b> · +${f.added} −${f.removed}</div><div class="diff mono" data-testid="sqa-diff">${renderDiff(f.diff)}</div>`).join("")}
    <p class="sub" data-testid="sqa-fix-reason">${esc(p.reason || d.fix_plan || "")}</p>
    <div class="meta">${riskBadge(r.level)}<span class="conf">Confidence <b>${pct(d.confidence)}</b></span></div>
    <ul class="factors">${(r.factors || []).slice(0, 5).map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
    ${footer(`<button class="btn primary" data-action="apply" data-testid="sqa-apply-fix-btn">Apply Fix</button><button class="btn" data-action="reject" data-testid="sqa-reject-btn">Reject</button>${detailsBtn}`)}</div>`;
}

export function renderValidating(inc) {
  const steps = inc.validation?.steps || [];
  const phase = inc.status === "applying" ? "applying" : "validating";
  return `${head("amber", phase)}<div class="card-body" data-testid="sqa-validating">
    <p class="title">${esc(inc.title)}</p>
    ${inc.policy?.auto_applied ? `<p class="policy">Applied autonomously (LOW risk) — checkpoint created, you can undo.</p>` : `<p class="sub">Checkpoint created · patch applied · running validation</p>`}
    <div class="label">Validation</div>
    ${steps.length ? checklist(steps, "sqa-validation-list") : '<p class="sub"><span class="spin"></span>Preparing checks…</p>'}
    ${footer(`<button class="btn danger" data-action="rollback" data-testid="sqa-undo-btn">Undo</button>${detailsBtn}`)}</div>`;
}

export function renderReloading(inc) {
  return `${head("amber", "reloading")}<div class="card-body" data-testid="sqa-reloading">
    <p class="title">${esc(inc.title)}</p>
    ${checklist((inc.validation?.steps || []).map((s) => ({ ...s, label: s.name })), "sqa-validation-list")}
    <p class="sub" style="margin-top:10px"><span class="spin"></span>Validation passed · hot reloading application to replay the original failure…</p></div>`;
}

export function renderReplaying(inc, steps) {
  const list = steps && steps.length ? steps : (inc.replay_plan?.steps || []).map((s) => ({ ...s, status: "pending" }));
  return `${head("amber", "replaying")}<div class="card-body" data-testid="sqa-replaying">
    <p class="title">${esc(inc.title)}</p>
    <div class="label">Replaying original failure</div>
    ${checklist(list, "sqa-replay-list")}
    <p class="hint">ShadowQA is driving the application. Evidence is collected live.</p></div>`;
}

export function renderVerified(inc) {
  const replay = inc.replay || {};
  const items = [...(replay.steps || []), ...(replay.evidence || [])];
  const git = inc.git;
  return `${head("green", "verified")}<div class="card-body" data-testid="sqa-verified">
    <p class="title">${esc(inc.title)}</p>
    ${checklist(items, "sqa-evidence-list")}
    <div class="verdict ok" data-testid="sqa-verdict">🟢 FIX VERIFIED <span style="font-weight:400;color:var(--muted);margin-left:auto;font-size:11px">${(inc.validation?.steps || []).filter((s) => s.status === "passed").length} checks · replay ${replay.duration_ms ? `${(replay.duration_ms / 1000).toFixed(1)}s` : ""}</span></div>
    ${git ? `<p class="hint" data-testid="sqa-git-info">Branch <b class="mono">${esc(git.branch)}</b> · ${esc(git.commit)}${git.pr?.url ? ` · <a href="${esc(git.pr.url)}" target="_blank" rel="noreferrer" style="color:var(--cyan)">PR #${esc(git.pr.number)}</a>` : git.pr_error ? ` · ${esc(git.pr_error)}` : ""}</p>` : ""}
    ${footer(`<button class="btn danger" data-action="rollback" data-testid="sqa-undo-btn">Undo</button>${git ? "" : `<button class="btn" data-action="create-pr" data-testid="sqa-create-pr-btn">${inc.pr_enabled ? "Create PR" : "Commit to branch"}</button>`}<button class="btn" data-action="dismiss" data-testid="sqa-done-btn">Done</button>${detailsBtn}`)}</div>`;
}

export function renderFailed(inc) {
  const isValidation = inc.status === "validation_failed";
  const steps = isValidation ? inc.validation?.steps || [] : [...(inc.replay?.steps || []), ...(inc.replay?.evidence || [])];
  return `${head("", "rolled back")}<div class="card-body" data-testid="sqa-failed">
    <p class="title">${esc(inc.title)}</p>
    ${checklist(steps, "sqa-failed-list")}
    <div class="verdict bad" data-testid="sqa-verdict">✗ ${isValidation ? "VALIDATION FAILED" : "REPLAY DID NOT CONFIRM RECOVERY"}</div>
    <p class="hint">The proposed change was reverted from the checkpoint. Workspace is back to its previous state.</p>
    ${footer(`<button class="btn" data-action="inspector" data-tab="diagnosis" data-testid="sqa-view-diagnosis-btn">View Diagnosis</button><button class="btn" data-action="retry" data-testid="sqa-retry-btn">Re-diagnose</button>${dismissBtn}`)}</div>`;
}

export function renderUnsafe(inc) {
  const d = inc.diagnosis || {};
  const aiDown = inc.status === "diagnosis_failed";
  return `${head("", aiDown ? "degraded" : "needs review")}<div class="card-body" data-testid="sqa-unsafe">
    <p class="title">${esc(inc.title)}</p>
    ${locationLine(inc)}
    <div class="verdict warn">${aiDown ? "I captured the failure, but the diagnosis engine is unavailable." : "I found the likely failure, but I cannot safely verify a fix."}</div>
    ${d.root_cause ? `<p class="sub" style="margin-top:8px">${esc(d.root_cause)}</p>` : ""}
    ${inc.error ? `<p class="hint mono">${esc(inc.error)}</p>` : ""}
    ${footer(`<button class="btn" data-action="inspector" data-tab="diagnosis" data-testid="sqa-view-diagnosis-btn">View Diagnosis</button><button class="btn" data-action="retry" data-testid="sqa-retry-btn">Retry</button>${dismissBtn}`)}</div>`;
}

export function renderRolledBack(inc) {
  return `${head("", "undone")}<div class="card-body" data-testid="sqa-rolled-back">
    <p class="title">${esc(inc.title)}</p>
    <div class="verdict warn">Change undone — files restored from checkpoint.</div>
    ${footer(`${dismissBtn}${detailsBtn}`)}</div>`;
}

export function renderBridgeError(error) {
  return `${head("", "offline")}<div class="card-body" data-testid="sqa-bridge-error">
    <p class="title">Failure detected, bridge unreachable</p>
    <p class="sub mono">${esc(error)}</p>
    ${footer(`<button class="btn" data-action="dismiss" data-testid="sqa-dismiss-btn">Dismiss</button>`)}</div>`;
}

export function renderQA(progress) {
  const results = progress.results || [];
  const items = results.map((r) => ({ label: r.name, status: r.status, detail: r.error ? String(r.error).slice(0, 60) : `${(r.duration_ms / 1000).toFixed(1)}s` }));
  if (progress.current) items.push({ label: progress.current, status: "running" });
  return `${head("amber", "qa mode")}<div class="card-body" data-testid="sqa-qa-running">
    <p class="title">Exploring application flows</p>
    ${checklist(items, "sqa-qa-list")}
    <p class="hint">${results.length}/${progress.total || "?"} flows · ShadowQA is driving the application.</p></div>`;
}

export function renderQASummary(run) {
  const items = (run.flows || []).map((f) => ({ label: f.name, status: f.status, detail: f.error ? String(f.error).slice(0, 60) : `${((f.duration_ms || 0) / 1000).toFixed(1)}s` }));
  const failed = (run.flows || []).filter((f) => f.status === "failed");
  return `${head(failed.length ? "" : "green", "application health")}<div class="card-body" data-testid="sqa-qa-summary">
    <p class="title">${run.passed}/${(run.flows || []).length} flows healthy</p>
    ${checklist(items, "sqa-health-list")}
    ${failed.length ? `<p class="sub" style="margin-top:10px">Reproducible sequences captured for ${failed.length} failure${failed.length > 1 ? "s" : ""}.</p>` : `<div class="verdict ok">🟢 ALL FLOWS HEALTHY</div>`}
    ${footer(`${failed
      .filter((f) => f.incident_id)
      .slice(0, 2)
      .map((f) => `<button class="btn primary" data-action="investigate" data-id="${esc(f.incident_id)}" data-testid="sqa-investigate-${esc(f.incident_id)}">Investigate ${esc(f.name)}</button>`)
      .join("")}<button class="btn" data-action="dismiss" data-testid="sqa-dismiss-btn">Close</button>${detailsBtn}`)}</div>`;
}
