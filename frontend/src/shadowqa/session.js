const KEY = "shadowqa:session";

/** Survives hot reloads and tab re-opens: active incident, phase, and local replay values (never sent to the bridge). */
export const session = {
  load() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || null;
    } catch {
      return null;
    }
  },
  save(state) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage may be unavailable */
    }
  },
  patch(fields) {
    this.save({ ...(this.load() || {}), ...fields });
  },
  clear() {
    localStorage.removeItem(KEY);
  },
};
