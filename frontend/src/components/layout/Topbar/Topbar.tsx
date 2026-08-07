"use client";

import { BarChart3, BriefcaseBusiness, Settings2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { UserData } from "@/app/(workspace)/layout";
import UserSidebarDisplay from "@/features/login/UserSidebarDisplay";
import styles from "./Topbar.module.css";

export default function Topbar({ userData }: { userData: UserData }) {
  const pathname = usePathname();
  const applicationsActive =
    pathname === "/" || pathname.startsWith("/applications/");
  const statisticsActive =
    pathname === "/statistics" || pathname.startsWith("/statistics/");
  const settingsActive =
    pathname === "/settings" || pathname.startsWith("/settings/");

  return (
    <header className={styles.topbar}>
      <Link className={styles.brand} href="/" aria-label="JobTracker">
        <Image
          src="/jobtracker-logo.png"
          alt=""
          width={40}
          height={40}
          priority
        />
        <span>JobTracker</span>
      </Link>

      <nav className={styles.navigation} aria-label="Navigazione principale">
        <Link
          className={styles.navigationItem}
          href="/"
          aria-current={applicationsActive ? "page" : undefined}
        >
          <BriefcaseBusiness aria-hidden="true" size={18} />
          <span>Candidature</span>
        </Link>
        <Link
          className={styles.navigationItem}
          href="/statistics"
          aria-current={statisticsActive ? "page" : undefined}
        >
          <BarChart3 aria-hidden="true" size={18} />
          <span>Statistiche</span>
        </Link>
        <Link
          className={styles.navigationItem}
          href="/settings"
          aria-current={settingsActive ? "page" : undefined}
        >
          <Settings2 aria-hidden="true" size={18} />
          <span>Impostazioni</span>
        </Link>
      </nav>

      <div className={styles.account}>
        <UserSidebarDisplay userData={userData} />
      </div>
    </header>
  );
}
