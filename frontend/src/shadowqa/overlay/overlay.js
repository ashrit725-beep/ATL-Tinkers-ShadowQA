import { STYLES } from "./styles";
import { renderInspector } from "./inspector";
import * as views from "./views";

const TRANSIENT_VIEWS = new Set(["capturing", "bridge_error", "qa", "qa_summary", "fix"]);

/** Zero-UI overlay host: a Shadow DOM island that stays invisible until there is something worth saying. */
export class Overlay {
  constructor({ actions }) {
    this.actions = actions;
    this.state = { view: null, incident: null, replaySteps: null, inspector: false, tab: "timeline", sourceFile: null, busy: false, qa: null, qaRun: null, memory: null, telemetry: null, audit: null, flows: null, recent: null, error: null };
  }

  mount() {
    if (this.host) return;
    this.host = document.createElement("shadowqa-root");
    this.shadow = this.host.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = STYLES;
    this.root = document.createElement("div");
    this.root.className = "root";
    this.shadow.append(style, this.root);
    document.documentElement.appendChild(this.host);
    this.root.addEventListener("click", (e) => this.onClick(e));
    this.root.addEventListener("change", (e) => {
      const sel = e.target.closest("[data-action='select-incident']");
      if (sel) this.actions.selectIncident(sel.value);
    });
    window.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "q") {
        e.preventDefault();
        this.toggleInspector();
      }
    });
    this.render();
  }

  set(fields) {
    Object.assign(this.state, fields);
    this.render();
  }

  setIncident(incident) {
    const view = this.state.view;
    const keepFix = view === "fix" && incident?.status === "diagnosed";
    this.set({ incident, view: keepFix ? "fix" : TRANSIENT_VIEWS.has(view) && view !== "fix" && !incident ? view : null });
  }

  setReplayProgress(steps) {
    this.set({ replaySteps: steps });
  }

  toggleInspector(tab) {
    this.set({ inspector: !this.state.inspector || Boolean(tab && tab !== this.state.tab), tab: tab || this.state.tab });
    if (this.state.inspector) this.actions.inspectorOpened(this.state.tab);
  }

  onClick(e) {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;
    const a = this.actions;
    const map = {
      inspector: () => this.toggleInspector(btn.dataset.tab),
      "close-inspector": () => this.set({ inspector: false }),
      tab: () => {
        this.set({ tab: btn.dataset.tab });
        a.inspectorOpened(btn.dataset.tab);
      },
      "view-fix": () => this.set({ view: "fix" }),
      apply: () => a.apply(),
      reject: () => a.dismiss(),
      dismiss: () => a.dismiss(),
      rollback: () => a.rollback(),
      "create-pr": () => a.createPr(),
      retry: () => a.retry(),
      "run-qa": () => a.runQA(),
      investigate: () => a.investigate(btn.dataset.id),
      dot: () => this.toggleInspector("health"),
    };
    map[action]?.();
  }

  cardHtml() {
    const s = this.state;
    const inc = s.incident;
    if (s.view === "capturing") return views.renderCapturing(s);
    if (s.view === "bridge_error") return views.renderBridgeError(s.error);
    if (s.view === "qa") return views.renderQA(s.qa || {});
    if (s.view === "qa_summary") return views.renderQASummary(s.qaRun || {});
    if (!inc) return null;
    if (s.view === "fix" && inc.status === "diagnosed") return views.renderFix(inc);
    switch (inc.status) {
      case "captured":
      case "diagnosing":
        return views.renderAnalyzing(inc);
      case "diagnosed":
        return views.renderDiagnosed(inc);
      case "applying":
      case "validating":
        return views.renderValidating(inc);
      case "awaiting_replay":
        return views.renderReloading(inc);
      case "replaying":
        return views.renderReplaying(inc, s.replaySteps);
      case "verified":
      case "committed":
        return views.renderVerified(inc);
      case "validation_failed":
      case "replay_failed":
        return views.renderFailed(inc);
      case "no_safe_fix":
      case "diagnosis_failed":
      case "superseded":
        return views.renderUnsafe(inc);
      case "rolled_back":
        return views.renderRolledBack(inc);
      default:
        return null;
    }
  }

  render() {
    if (!this.root) return;
    const card = this.cardHtml();
    const busy = this.state.incident && !["verified", "committed", "dismissed", "rolled_back", "validation_failed", "replay_failed", "no_safe_fix", "diagnosis_failed", "superseded"].includes(this.state.incident.status);
    const dock = `<div class="dock">${card ? `<div class="card">${card}</div>` : ""}<button class="dot ${busy || this.state.view === "qa" ? "busy" : ""}" data-action="dot" data-testid="sqa-status-dot" title="ShadowQA · ${busy ? "working" : "watching"} (Ctrl+Shift+Q)"><i></i></button></div>`;
    const drawer = this.state.inspector ? renderInspector(this.state) : "";
    this.root.innerHTML = dock + drawer;
  }
}
