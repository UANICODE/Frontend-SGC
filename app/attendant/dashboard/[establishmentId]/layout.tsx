"use client";

import { AttendantSidebar } from "@/components/attendant/layout/AttendantSidebar";
import { AttendantNavbar } from "@/components/attendant/layout/AttendantNavbar";
import { PageLoader } from "@/components/ui/PageLoader";
import { useEstablishment } from "@/hooks/admin /useEstablishment";
import { useRouter } from "next/navigation";

export default function AttendantLayout({
  children,
  params,
}: any) {
  const { establishmentId } = params;
  const { data, loading } =
    useEstablishment(establishmentId);

  const router = useRouter();

  if (loading) return <PageLoader />;

  if (!data) {
    router.push("/attendant/establishments");
    return null;
  }

  return (
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
  );
}