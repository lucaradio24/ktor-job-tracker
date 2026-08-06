import { UserData } from "@/app/(workspace)/layout";
import Image from "next/image";
import styles from "./UserSidebarDisplay.module.css";
import { ChevronDown, User } from "lucide-react";
import UserDropdown from "./UserDropdown";

export default function UserSidebarDisplay({
  userData,
}: {
  userData: UserData;
}) {
  const displayName =
    userData.name === userData.email
      ? userData.nickname
      : userData.name || "Utente";

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
          {displayName?.charAt(0)}
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
      <UserDropdown />
    </div>
  );
}
