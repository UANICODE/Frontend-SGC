"use client";

import { useRouter } from "next/navigation";

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
        className="font-bold text-lg"
        style={{ color: primaryColor }}
      >
        {tradeName} - Painel do Atendente
      </h1>

      <button
        onClick={() =>
          router.push("/attendant/establishments")
        }
        className="text-sm text-gray-500 hover:text-black transition"
      >
        Trocar Estabelecimento
      </button>
    </header>
  );
}