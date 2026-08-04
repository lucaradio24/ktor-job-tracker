import Sidebar from "@/components/layout/Sidebar/Sidebar";
import styles from "./page.module.css";
import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";

export type UserData = {
  name?: string;
  nickname?: string;
  email?: string;
  picture?: string;
};

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className={styles.shell}>
      <Sidebar userData={session.user} />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
