"use client";

import { AttendantSidebar } from "@/components/attendant/layout/AttendantSidebar";
import { AttendantNavbar } from "@/components/attendant/layout/AttendantNavbar";
import { PageLoader } from "@/components/ui/PageLoader";
import { useRouter, useParams } from "next/navigation";
import { useEstablishment } from "@/hooks/admin /useEstablishment";
import { EstablishmentBlockProvider } from "@/providers/EstablishmentBlockProvider";
import { DashboardFooter } from "@/components/ui/DashboardFooter";

export default function AttendantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const params = useParams();

  const establishmentId = params.establishmentId as string;

  const { data, loading } = useEstablishment(establishmentId);

  if (loading) return <PageLoader />;

  if (!data) {
    router.push("/attendant/establishments");
    return null;
  }

  return (
     <EstablishmentBlockProvider>
  <div className="min-h-screen flex bg-gray-50">
  {/* Sidebar fixa */}
  <AttendantSidebar
    establishmentId={establishmentId}
    tradeName={data.tradeName}
    logoUrl={data.logoUrl}
    primaryColor={data.primaryColor}
  />

  {/* Conteúdo principal */}
  <div className="flex-1 flex flex-col">
    {/* Navbar fixa */}
    <AttendantNavbar
      establishmentId={establishmentId}
      tradeName={data.tradeName}
      primaryColor={data.primaryColor}
    />

    {/* Área de conteúdo com scroll */}
    <main className="flex-1 overflow-auto p-8 animate-fadeIn">
      {children}
    </main>


              {/* Footer */}
                 <DashboardFooter version="v1.0.3" />
  </div>
</div>
    </EstablishmentBlockProvider>
  );
}