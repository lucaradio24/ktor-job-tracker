import {
  BriefcaseBusiness,
  CalendarDays,
  House,
  Settings,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import styles from "./Sidebar.module.css";
import Link from "next/link";
import UserSidebarDisplay from "@/features/login/UserSidebarDisplay";
import { UserData } from "@/app/(workspace)/layout";

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

export default function Sidebar({ userData }: { userData: UserData }) {
  return (
    <aside className={styles.sidebar}>
      <Link className={styles.brand} href="/" aria-label="Job Tracker">
        <Image
          src="/jobtracker-logo.png"
          alt=""
          width={40}
          height={40}
          loading="eager"
        />
        <span className={styles.brandName}>Job Tracker</span>
      </Link>

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

      <div className={styles.footerCopy}>
        <UserSidebarDisplay userData={userData} />
      </div>
    </aside>
  );
}
