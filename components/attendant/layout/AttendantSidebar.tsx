"use client";

import { useRouter } from "next/navigation";

interface Props {
  establishmentId: string;
  tradeName: string;
  logoUrl: string;
  primaryColor: string;
}

export function AttendantSidebar({
  establishmentId,
  tradeName,
  logoUrl,
  primaryColor,
}: Props) {
  const router = useRouter();

  const menu = [
    {
      label: "Dashboard",
      path: `/attendant/dashboard/${establishmentId}`,
    },
    {
      label: "Vendas",
      path: `/attendant/dashboard/${establishmentId}/sales`,
    },
    {
      label: "Caixa",
      path: `/attendant/dashboard/${establishmentId}`,
    },
    {
      label: "Vendas Arquivadas",
      path: `/attendant/dashboard/${establishmentId}/archived-sales`,
    },
  ];

  return (
    <aside
      className="w-64 hidden md:flex flex-col shadow-xl"
      style={{ backgroundColor: primaryColor }}
    >
      <div className="p-6 flex flex-col items-center border-b border-white/20">
        <img
          src={logoUrl}
          className="w-20 h-20 object-contain bg-white rounded-xl p-2"
        />
        <h2 className="text-white mt-4 font-bold text-center">
          {tradeName}
        </h2>
      </div>

      <nav className="flex flex-col p-4 gap-3 text-white text-sm">
        {menu.map((item) => (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className="text-left px-4 py-2 rounded-lg hover:bg-white/20 transition"
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}