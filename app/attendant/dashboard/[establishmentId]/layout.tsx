"use client";

import { AttendantSidebar } from "@/components/attendant/layout/AttendantSidebar";
import { AttendantNavbar } from "@/components/attendant/layout/AttendantNavbar";
import { PageLoader } from "@/components/ui/PageLoader";
import { useRouter, useParams } from "next/navigation";
import { useEstablishment } from "@/hooks/admin /useEstablishment";
import { EstablishmentBlockProvider } from "@/providers/EstablishmentBlockProvider";

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

      <AttendantSidebar
        establishmentId={establishmentId}
        tradeName={data.tradeName}
        logoUrl={data.logoUrl}
        primaryColor={data.primaryColor}
      />

      <div className="flex-1 flex flex-col">
        <AttendantNavbar
          establishmentId={establishmentId}
          tradeName={data.tradeName}
          primaryColor={data.primaryColor}
        />

        <main className="p-8 animate-fadeIn">
          {children}
        </main>
      </div>
    </div>
    </EstablishmentBlockProvider>
  );
}