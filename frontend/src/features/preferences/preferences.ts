export type ThemePreference = "dark" | "light" | "system";
export type DensityPreference = "comfortable" | "compact";
export type MotionPreference = "system" | "reduced";

export interface Preferences {
  theme: ThemePreference;
  density: DensityPreference;
  motion: MotionPreference;
}

export const PREFERENCES_STORAGE_KEY = "jobtracker.preferences.v1";

export const DEFAULT_PREFERENCES: Preferences = {
  theme: "dark",
  density: "comfortable",
  motion: "system",
};

export const PREFERENCES_INITIALIZER_SCRIPT = `
(() => {
  const defaults = { theme: "dark", density: "comfortable", motion: "system" };
  let preferences = defaults;
  try {
    const stored = JSON.parse(localStorage.getItem("jobtracker.preferences.v1") || "null") || {};
    preferences = {
      theme: ["dark", "light", "system"].includes(stored.theme) ? stored.theme : defaults.theme,
      density: ["comfortable", "compact"].includes(stored.density) ? stored.density : defaults.density,
      motion: ["system", "reduced"].includes(stored.motion) ? stored.motion : defaults.motion,
    };
  } catch {}
  const root = document.documentElement;
  root.dataset.theme = preferences.theme === "system"
    ? (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
    : preferences.theme;
  root.dataset.density = preferences.density;
  root.dataset.motion = preferences.motion;
})();`;

export function parsePreferences(serialized: string | null): Preferences {
  try {
    const value = JSON.parse(serialized ?? "null") as Partial<Preferences> | null;
    return {
      theme:
        value && ["dark", "light", "system"].includes(value.theme ?? "")
          ? value.theme!
          : DEFAULT_PREFERENCES.theme,
      density:
        value && ["comfortable", "compact"].includes(value.density ?? "")
          ? value.density!
          : DEFAULT_PREFERENCES.density,
      motion:
        value && ["system", "reduced"].includes(value.motion ?? "")
          ? value.motion!
          : DEFAULT_PREFERENCES.motion,
    };
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

export function readPreferences(): Preferences {
  try {
    return parsePreferences(localStorage.getItem(PREFERENCES_STORAGE_KEY));
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

export function applyPreferences(preferences: Preferences): void {
  const root = document.documentElement;
  root.dataset.theme =
    preferences.theme === "system"
      ? window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark"
      : preferences.theme;
  root.dataset.density = preferences.density;
  root.dataset.motion = preferences.motion;
}

export function savePreferences(preferences: Preferences): void {
  try {
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    // The preference still applies for the current session when storage is unavailable.
  }
}
