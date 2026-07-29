import {
  BriefcaseBusiness,
  CalendarDays,
  House,
  Settings,
  type LucideIcon,
} from "lucide-react";
import styles from "./Sidebar.module.css";

interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
  active?: boolean;
}

const navigation: NavigationItem[] = [
  { label: "Panoramica", href: "#overview", icon: House },
  {
    label: "Candidature",
    href: "#application-board",
    icon: BriefcaseBusiness,
    active: true,
  },
  { label: "Colloqui", href: "#interviews", icon: CalendarDays },
  { label: "Impostazioni", href: "#settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <a className={styles.brand} href="#overview" aria-label="Job Tracker">
        {/* <span className={styles.brandMark} aria-hidden="true">
          <span className={styles.sun} />
        </span> */}
        <span className={styles.brandName}>Job Tracker</span>
      </a>

      <nav className={styles.navigation} aria-label="Navigazione principale">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <a
              className={`${styles.navigationItem} ${
                item.active ? styles.navigationItemActive : ""
              }`}
              href={item.href}
              key={item.label}
              aria-current={item.active ? "page" : undefined}
              title={item.label}
            >
              <Icon aria-hidden="true" size={20} strokeWidth={1.9} />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>

      <p className={styles.footerCopy}>Ogni candidatura è un passo avanti.</p>
    </aside>
  );
}
