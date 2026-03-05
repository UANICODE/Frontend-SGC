"use client";

import { AdminNavbar } from "@/components/admin/layout/AdminNavbar";
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { useEstablishmentTheme } from "@/hooks/auth/useEstablishmentTheme";
import { useLoggedEstablishment } from "@/hooks/auth/useLoggedEstablishment";
import { useParams } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  let establishmentId: string | undefined;

  if (Array.isArray(params?.establishmentId)) {
    establishmentId = params.establishmentId[0]; // pega o primeiro se for array
  } else {
    establishmentId = params?.establishmentId; // se for string
  }


  // só chama o hook se tiver valor
  const { data } = useLoggedEstablishment(establishmentId ?? "");

  useEstablishmentTheme(data?.primaryColor, data?.secondaryColor);

  return (
    <div className="flex h-screen bg-backgroundLight">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminNavbar logo={data?.logoUrl} name={data?.tradeName} />

        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}