import { UserData } from "@/app/(workspace)/layout";
import Image from "next/image";
import styles from "./UserSidebarDisplay.module.css";
import { ChevronDown } from "lucide-react";

export default function UserSidebarDisplay({
  userData,
}: {
  userData: UserData;
}) {
  const displayName = userData.name || userData.nickname || "Utente";

  return (
    <div className={styles.userSidebarDisplay}>
      {userData.picture ? (
        <Image
          className={styles.avatar}
          src={userData.picture}
          alt=""
          width={40}
          height={40}
        />
      ) : (
        <span className={styles.avatarFallback} aria-hidden="true">
          {displayName.charAt(0).toUpperCase()}
        </span>
      )}

      <div className={styles.userDetails}>
        <p className={styles.userName} title={displayName}>
          {displayName}
        </p>
        {userData.email && (
          <p className={styles.userEmail} title={userData.email}>
            {userData.email}
          </p>
        )}
      </div>
      <details className={styles.userMenu}>
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
    </div>
  );
}
