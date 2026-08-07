"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "./BackButton.module.css";

export function BackButton() {
  const router = useRouter();

  return (
    <button className={styles.button} type="button" onClick={() => router.back()}>
      <ArrowLeft aria-hidden="true" size={18} strokeWidth={1.8} />
      Indietro
    </button>
  );
}
