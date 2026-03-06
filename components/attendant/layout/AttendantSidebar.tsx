"use client";

import { useRouter } from "next/navigation";
import { HomeIcon, CurrencyDollarIcon, ArchiveBoxIcon } from "@heroicons/react/24/outline";

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
      icon: <HomeIcon className="w-5 h-5" />,
    },
    {
      label: "Caixa e Vendas",
      path: `/attendant/dashboard/${establishmentId}`,
      icon: <CurrencyDollarIcon className="w-5 h-5" />,
    },
    {
      label: "Vendas Arquivadas",
      path: `/attendant/dashboard/${establishmentId}/archived-sales`,
      icon: <ArchiveBoxIcon className="w-5 h-5" />,
    },
  ];

  return (
    <aside
      className="w-64 hidden md:flex flex-col shadow-xl"
      style={{ backgroundColor: primaryColor }}
    >
      {/* HEADER COM LOGO */}
      <div className="p-6 flex flex-col items-center border-b border-white/20">
        <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/50">
          <img
            src={logoUrl}
            alt={`${tradeName} logo`}
            className="w-full h-full object-contain"
          />
        </div>
        <h2 className="text-white mt-4 font-bold text-center">{tradeName}</h2>
      </div>

      {/* MENU */}
      <nav className="flex flex-col p-4 gap-3 text-white text-sm">
        {menu.map((item) => (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className="flex items-center gap-2 text-left px-4 py-2 rounded-lg hover:bg-white/20 transition"
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}