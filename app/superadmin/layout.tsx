// app/superadmin/layout.tsx
"use client";


import { SuperAdminNavbar } from "@/components/superadmin/layout/SuperAdminNavbar";
import { SuperAdminSidebar } from "@/components/superadmin/layout/SuperAdminSidebar";
import { UserRole } from "@/enum/enum";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useRoleGuard([UserRole.SUPERADMIN]);

  return (
    <div className="flex h-screen bg-gray-100">
      <SuperAdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <SuperAdminNavbar />
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 via-white to-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}