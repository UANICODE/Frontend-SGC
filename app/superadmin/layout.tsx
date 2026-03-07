"use client";

import { SuperAdminNavbar } from "@/components/superadmin/layout/SuperAdminNavbar";
import { SuperAdminSidebar } from "@/components/superadmin/layout/SuperAdminSidebar";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      
      <div className="flex-1 flex flex-col">
        <SuperAdminNavbar />

        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}