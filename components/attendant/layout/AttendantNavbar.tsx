"use client";

import { useRouter } from "next/navigation";
import { Store, LayoutDashboard } from "lucide-react";

interface Props {
  establishmentId: string;
  tradeName: string;
  primaryColor: string;
}

export function AttendantNavbar({
  establishmentId,
  tradeName,
  primaryColor,
}: Props) {
  const router = useRouter();

  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-8">
      <h1
        className="font-bold text-lg flex items-center gap-2"
        style={{ color: primaryColor }}
      >
        <LayoutDashboard size={20} />
        {tradeName} - Painel de vendas
      </h1>

      <button
        onClick={() =>
          router.push("/attendant/establishments")
        }
        className="text-sm text-gray-500 hover:text-black transition flex items-center gap-2"
      >
        <Store size={18} />
        Meus Estabelecimentos
      </button>
    </header>
  );
}