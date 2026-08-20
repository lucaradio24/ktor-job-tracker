"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import ToastViewport, { type ToastMessage } from "./ToastViewport";

type NewToast = Omit<ToastMessage, "id" | "durationMs"> & {
  durationMs?: number;
};

type ToastContextValue = {
  showToast: (toast: NewToast) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function createToastId() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  function showToast(newToast: NewToast) {
    setToast({
      ...newToast,
      id: createToastId(),
      durationMs: newToast.durationMs ?? 6_000,
    });
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastViewport toast={toast} onClose={() => setToast(null)} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast deve essere usato dentro ToastProvider");
  }

  return context;
}
