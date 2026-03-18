"use client";

import { AdminNavbar } from "@/components/admin/layout/AdminNavbar";
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { useEstablishmentTheme } from "@/hooks/auth/useEstablishmentTheme";
import { useLoggedEstablishment } from "@/hooks/auth/useLoggedEstablishment";
import { EstablishmentBlockProvider } from "@/providers/EstablishmentBlockProvider";
import { useParams } from "next/navigation";
import { Info, Coffee } from "lucide-react";
import { DashboardFooter } from "@/components/ui/DashboardFooter";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  let establishmentId: string | undefined;

  if (Array.isArray(params?.establishmentId)) {
    establishmentId = params.establishmentId[0];
  } else {
    establishmentId = params?.establishmentId;
  }

  const { data } = useLoggedEstablishment(establishmentId ?? "");

  useEstablishmentTheme(data?.primaryColor, data?.secondaryColor);

  return (
    <EstablishmentBlockProvider>
      <div className="flex h-screen bg-backgroundLight">
        {/* Sidebar */}
        <AdminSidebar logo={data?.logoUrl} name={data?.tradeName} />

        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col">
          <AdminNavbar logo={data?.logoUrl} name={data?.tradeName} />

          <main className="flex-1 p-8 overflow-y-auto">{children}</main>

          {/* Footer */}
             <DashboardFooter version="v1.0.3" />
        </div>
      </div>
    </EstablishmentBlockProvider>
  );
}