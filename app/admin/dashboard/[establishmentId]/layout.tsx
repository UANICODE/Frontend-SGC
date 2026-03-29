"use client";

import { AdminNavbar } from "@/components/admin/layout/AdminNavbar";
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { useLoggedEstablishment } from "@/hooks/auth/useLoggedEstablishment";
import { EstablishmentBlockProvider } from "@/providers/EstablishmentBlockProvider";
import { useParams } from "next/navigation";
import { DashboardFooter } from "@/components/ui/DashboardFooter";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  let establishmentId = Array.isArray(params?.establishmentId)
    ? params.establishmentId[0]
    : params?.establishmentId;

  const { data } = useLoggedEstablishment(establishmentId ?? "");

  return (
    <EstablishmentBlockProvider>
     <div
  className="flex h-screen bg-backgroundLight"
  style={{
    "--color-primary": data?.primaryColor || "#1F2937",
    "--color-secondary": data?.secondaryColor || "#4B5563",
  } as React.CSSProperties}
>
        {/* Sidebar */}
        <AdminSidebar logo={data?.logoUrl} name={data?.tradeName} />

        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col">
          <AdminNavbar logo={data?.logoUrl} name={data?.tradeName} />

          <main className="flex-1 p-8 overflow-y-auto">{children}</main>

          <DashboardFooter version="v1.0.3" />
        </div>
      </div>
    </EstablishmentBlockProvider>
  );
}