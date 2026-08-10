"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  applyPreferences,
  DEFAULT_PREFERENCES,
  type DensityPreference,
  type MotionPreference,
  type Preferences,
  readPreferences,
  savePreferences,
  type ThemePreference,
} from "./preferences";
import styles from "./PreferencesForm.module.css";

let currentPreferences =
  typeof window === "undefined" ? DEFAULT_PREFERENCES : readPreferences();
const preferenceListeners = new Set<() => void>();

function subscribe(listener: () => void) {
  preferenceListeners.add(listener);
  return () => {
    preferenceListeners.delete(listener);
  };
}

function getPreferencesSnapshot() {
  return currentPreferences;
}

interface Option<T extends string> {
  value: T;
  label: string;
  description: string;
}

function PreferenceGroup<T extends string>({
  name,
  legend,
  description,
  options,
  value,
  onChange,
}: {
  name: string;
  legend: string;
  description: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className={styles.group} aria-describedby={`${name}-description`}>
      <legend>{legend}</legend>
      <p id={`${name}-description`}>{description}</p>
      <div className={styles.options} data-count={options.length}>
        {options.map((option) => (
          <label key={option.value} className={styles.option}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span>
              <strong>{option.label}</strong>
              <small>{option.description}</small>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

const THEME_OPTIONS: Option<ThemePreference>[] = [
  { value: "dark", label: "Scuro", description: "Grafite e porcellana" },
  { value: "light", label: "Chiaro", description: "Porcellana e grafite" },
  { value: "system", label: "Sistema", description: "Segue il dispositivo" },
];

const DENSITY_OPTIONS: Option<DensityPreference>[] = [
  { value: "comfortable", label: "Comoda", description: "Più respiro" },
  { value: "compact", label: "Compatta", description: "Più dati a schermo" },
];

const MOTION_OPTIONS: Option<MotionPreference>[] = [
  { value: "system", label: "Sistema", description: "Segue il dispositivo" },
  { value: "reduced", label: "Ridotto", description: "Movimento essenziale" },
];

export default function PreferencesForm() {
  const preferences = useSyncExternalStore(
    subscribe,
    getPreferencesSnapshot,
    () => DEFAULT_PREFERENCES,
  );
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (preferences.theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: light)");
    const updateTheme = () => {
      document.documentElement.dataset.theme = media.matches ? "light" : "dark";
    };
    media.addEventListener("change", updateTheme);
    return () => media.removeEventListener("change", updateTheme);
  }, [preferences.theme]);

  function updatePreference<Key extends keyof Preferences>(
    key: Key,
    value: Preferences[Key],
  ) {
    const next = { ...preferences, [key]: value };
    currentPreferences = next;
    applyPreferences(next);
    savePreferences(next);
    preferenceListeners.forEach((listener) => listener());
    setSaved(true);
  }

  return (
    <form className={styles.form}>
      <PreferenceGroup
        name="theme"
        legend="Tema"
        description="Scegli il contrasto dell’interfaccia."
        options={THEME_OPTIONS}
        value={preferences.theme}
        onChange={(value) => updatePreference("theme", value)}
      />
      <PreferenceGroup
        name="density"
        legend="Densità"
        description="Regola lo spazio tra le informazioni senza ridurre i controlli."
        options={DENSITY_OPTIONS}
        value={preferences.density}
        onChange={(value) => updatePreference("density", value)}
      />
      <PreferenceGroup
        name="motion"
        legend="Movimento"
        description="Riduci animazioni e transizioni decorative."
        options={MOTION_OPTIONS}
        value={preferences.motion}
        onChange={(value) => updatePreference("motion", value)}
      />

      <p className={styles.saved} aria-live="polite">
        {saved ? "Salvato" : "Le modifiche vengono salvate automaticamente"}
      </p>
    </form>
  );
}
