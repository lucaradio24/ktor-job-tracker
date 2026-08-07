"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();

  return (
    <ArrowLeft
      style={{ cursor: "pointer" }}
      onClick={() => router.back()}
      aria-hidden="true"
      size={20}
      strokeWidth={1.8}
    />
  );
}
