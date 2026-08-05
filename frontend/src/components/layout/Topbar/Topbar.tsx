import { BriefcaseBusiness } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { UserData } from "@/app/(workspace)/layout";
import UserSidebarDisplay from "@/features/login/UserSidebarDisplay";
import styles from "./Topbar.module.css";

export default function Topbar({ userData }: { userData: UserData }) {
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
        <Link className={styles.navigationItem} href="/" aria-current="page">
          <BriefcaseBusiness aria-hidden="true" size={19} />
          Candidature
        </Link>
      </nav>

      <div className={styles.account}>
        <UserSidebarDisplay userData={userData} />
      </div>
    </header>
  );
}
