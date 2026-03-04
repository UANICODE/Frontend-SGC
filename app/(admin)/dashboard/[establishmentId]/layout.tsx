"use client";

import { AdminNavbar } from "@/components/admin/layout/AdminNavbar";
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { useEstablishmentTheme } from "@/hooks/auth/useEstablishmentTheme";
import { useLoggedEstablishment } from "@/hooks/auth/useLoggedEstablishment";

export default function DashboardLayout({
  children,
  params,
}: any) {
  const { data } = useLoggedEstablishment(params.establishmentId);

  useEstablishmentTheme (
    data?.primaryColor,
    data?.secondaryColor
  );

  return (
    <div className="flex h-screen bg-backgroundLight">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminNavbar
          logo={data?.logoUrl}
          name={data?.tradeName}
        />

        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}