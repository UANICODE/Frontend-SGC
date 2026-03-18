"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HomeIcon, CurrencyDollarIcon, ArchiveBoxIcon, ArrowRightOnRectangleIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/hooks/auth/useAuth";
import { useToast } from "@/ context/ToastContext";

interface Props {
  establishmentId: string;
  tradeName: string;
  logoUrl: string;
  primaryColor: string;
}

export function AttendantSidebar({ establishmentId, tradeName, logoUrl, primaryColor }: Props) {
  const router = useRouter();
  const { logout } = useAuth();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false); // controle hamburger mobile

  const menu = [
    { label: "Dashboard", path: `/attendant/dashboard/${establishmentId}`, icon: <HomeIcon className="w-5 h-5" /> },
    { label: "Caixa e Vendas", path: `/attendant/dashboard/${establishmentId}`, icon: <CurrencyDollarIcon className="w-5 h-5" /> },
    { label: "Vendas Arquivadas", path: `/attendant/dashboard/${establishmentId}/archived-sales`, icon: <ArchiveBoxIcon className="w-5 h-5" /> },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      showToast("Logout feito com sucesso!", "success");
    } catch {
      showToast("Erro ao sair.", "error");
    }
  };

  return (
    <>
      {/* ================= BOTÃO HAMBURGER MOBILE ================= */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow"
        onClick={() => setOpen(true)}
      >
        <Bars3Icon className="w-6 h-6 text-gray-800" />
      </button>

      {/* ================= OVERLAY MOBILE ================= */}
      {open && (
        <div className="fixed inset-0 z-40 flex">
          {/* overlay */}
          <div
            className="flex-1 bg-black/40"
            onClick={() => setOpen(false)}
          ></div>

          {/* menu lateral */}
          <aside
            className="w-64 bg-white flex flex-col shadow-xl"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="p-6 flex flex-col items-center border-b border-white/20 relative">
              <button
                className="absolute top-4 right-4 p-1 text-white"
                onClick={() => setOpen(false)}
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/50">
                <img src={logoUrl} alt={`${tradeName} logo`} className="w-full h-full object-contain" />
              </div>
              <h2 className="text-white mt-4 font-bold text-center">{tradeName}</h2>
              <div className="flex items-center justify-center gap-1 mt-1">
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                <p className="text-white/80 text-xs font-medium">Online</p>
              </div>
            </div>

            <nav className="flex flex-col p-4 gap-3 text-white text-sm flex-1">
              {menu.map((item) => (
                <button
                  key={item.path}
                  onClick={() => { router.push(item.path); setOpen(false); }}
                  className="flex items-center gap-2 text-left px-4 py-2 rounded-lg hover:bg-white/20 transition"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}

              <button
                onClick={handleLogout}
                className="mt-auto flex items-center gap-2 text-left px-4 py-2 rounded-lg hover:bg-white/20 transition"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span>Sair</span>
              </button>
            </nav>
          </aside>
        </div>
      )}

      {/* ================= DESKTOP ================= */}
      <aside className="w-64 hidden md:flex flex-col shadow-xl" style={{ backgroundColor: primaryColor }}>
        <div className="p-6 flex flex-col items-center border-b border-white/20">
          <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/50">
            <img src={logoUrl} alt={`${tradeName} logo`} className="w-full h-full object-contain" />
          </div>
          <h2 className="text-white mt-4 font-bold text-center">{tradeName}</h2>
          <div className="flex items-center justify-center gap-1 mt-1">
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
            <p className="text-white/80 text-xs font-medium">Online</p>
          </div>
        </div>

        <nav className="flex flex-col p-4 gap-3 text-white text-sm flex-1">
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

          <button
            onClick={handleLogout}
            className="mt-auto flex items-center gap-2 text-left px-4 py-2 rounded-lg hover:bg-white/20 transition"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </nav>
      </aside>
    </>
  );
}