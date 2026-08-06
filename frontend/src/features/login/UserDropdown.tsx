"use client";

import styles from "./UserSidebarDisplay.module.css";
import { ChevronDown } from "lucide-react";

export default function UserDropdown() {
  return (
    <details
      onBlur={(e) => {
        const nextTarget = e.relatedTarget as Node | null;

        if (!nextTarget || !e.currentTarget.contains(nextTarget)) {
          e.currentTarget.removeAttribute("open");
        }
      }}
      className={styles.userMenu}
    >
      <summary className={styles.userMenuSummary}>
        <span className={styles.summaryLabel}>Apri menu utente</span>
        <ChevronDown
          className={styles.chevron}
          aria-hidden="true"
          size={18}
          strokeWidth={1.8}
        />
      </summary>
      <a href="/auth/logout" className={styles.logout}>
        Logout
      </a>
    </details>
  );
}
