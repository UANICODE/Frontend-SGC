// app/providers/ClientProviders.tsx
"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/hooks/auth/useAuth";
import { ToastProvider } from "@/ context/ToastContext";


export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </AuthProvider>
  );
}