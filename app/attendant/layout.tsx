"use client";

import { useEstablishmentTheme } from "@/hooks/auth/useEstablishmentTheme";


export default function AttendantLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  useEstablishmentTheme();

  return (
    <div className="min-h-screen bg-backgroundLight text-textPrimaryLight">
      {children}
    </div>
  );
}