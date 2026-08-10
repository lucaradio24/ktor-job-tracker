import PreferencesForm from "@/features/preferences/PreferencesForm";
import styles from "./settings.module.css";

export default function SettingsPage() {
  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <p>Preferenze locali</p>
        <h1>Impostazioni</h1>
        <span>
          Personalizza l’interfaccia su questo dispositivo. Le preferenze non
          modificano i dati delle candidature.
        </span>
      </header>

      <PreferencesForm />
    </section>
  );
}
