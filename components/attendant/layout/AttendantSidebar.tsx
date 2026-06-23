"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  HomeIcon, 
  CurrencyDollarIcon, 
  ArchiveBoxIcon, 
  ArrowRightOnRectangleIcon, 
  Bars3Icon, 
  XMarkIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";
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
  const pathname = usePathname();
  const { logout } = useAuth();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const menu = [
    { 
      label: "Caixa e Vendas", 
      path: `/attendant/dashboard/${establishmentId}`, 
      icon: <CurrencyDollarIcon className="w-5 h-5" /> 
    },
    { 
      label: "Vendas Arquivadas", 
      path: `/attendant/dashboard/${establishmentId}/archived-sales`, 
      icon: <ArchiveBoxIcon className="w-5 h-5" /> 
    },
  ];

  const isActive = (path: string) => {
    if (path === `/attendant/dashboard/${establishmentId}`) {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const handleLogout = async () => {
    try {
      await logout();
      showToast("Logout feito com sucesso!", "success");
    } catch {
      showToast("Erro ao sair.", "error");
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Topo com logo e nome */}
      <div className="p-6 flex flex-col items-center border-b border-white/20 relative">
        <div className="relative group">
          <div className="absolute -inset-1 bg-white/20 rounded-xl blur-md opacity-0 group-hover:opacity-60 transition-opacity"></div>
          <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-white/50 shadow-lg relative">
            <img 
              src={logoUrl} 
              alt={`${tradeName} logo`} 
              className="w-full h-full object-contain bg-white/10" 
            />
          </div>
        </div>
        
        <h2 className="text-white mt-4 font-bold text-center text-lg tracking-tight">
          {tradeName}
        </h2>
        
        <div className="flex items-center justify-center gap-1.5 mt-1.5">
          <div className="relative">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping absolute"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full relative"></div>
          </div>
          <p className="text-white/80 text-xs font-medium">Online</p>
        </div>
      </div>

      {/* Links de Navegação */}
      <nav className="flex flex-col p-4 gap-1.5 text-white text-sm flex-1">
        {menu.map((item) => {
          const active = isActive(item.path);
          const isHovered = hoveredItem === item.label;

          return (
            <button
              key={item.path}
              onClick={() => {
                router.push(item.path);
                setOpen(false);
              }}
              onMouseEnter={() => setHoveredItem(item.label)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`
                group relative flex items-center gap-3 px-4 py-2.5 rounded-xl
                transition-all duration-300 overflow-hidden
                ${active 
                  ? "text-white font-medium shadow-lg" 
                  : "text-white/70 hover:text-white"
                }
              `}
              style={active ? {
                background: `linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.05))`,
                boxShadow: `0 4px 15px rgba(0,0,0,0.2)`
              } : {}}
            >
              {/* Efeito de hover */}
              {!active && (
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl"
                  style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))` }}
                />
              )}

              {/* Ícone com animação */}
              <div className={`relative z-10 transition-all duration-300 group-hover:scale-110 ${active ? 'text-white' : 'text-white/70'}`}>
                {item.icon}
              </div>

              {/* Texto do link */}
              <span className="relative z-10 font-medium">
                {item.label}
              </span>

              {/* Destaque lateral - APENAS para o item selecionado */}
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg" />
              )}

              {/* Indicador de ativo */}
              {active && (
                <div className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              )}
            </button>
          );
        })}

        {/* Botão Sair */}
        <button
          onClick={handleLogout}
          className="group relative flex items-center gap-3 mt-auto px-4 py-2.5 rounded-xl text-white/70 hover:text-white transition-all duration-300 overflow-hidden"
        >
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl"
            style={{ background: `linear-gradient(135deg, rgba(239,68,68,0.3), rgba(220,38,38,0.1))` }}
          />
          <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
          </div>
          <span className="relative z-10 font-medium">Sair</span>
        </button>

        {/* Versão do Sistema */}
        
      </nav>
    </div>
  );

  return (
    <>
      {/* ================= BOTÃO HAMBURGER MOBILE ================= */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
        style={{ 
          background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`,
          boxShadow: `0 4px 15px ${primaryColor}60`
        }}
        onClick={() => setOpen(true)}
      >
        <Bars3Icon className="w-6 h-6 text-white" />
      </button>

      {/* ================= OVERLAY MOBILE ================= */}
      {open && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="flex-1 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside
            className="w-72 flex flex-col shadow-2xl animate-slideInRight"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="p-4 flex justify-end">
              <button
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                onClick={() => setOpen(false)}
              >
                <XMarkIcon className="w-6 h-6 text-white" />
              </button>
            </div>
            <div className="px-4 pb-4 flex-1 overflow-y-auto">
              <SidebarContent />
            </div>
          </aside>
        </div>
      )}

      {/* ================= DESKTOP ================= */}
      <aside 
        className="w-64 hidden md:flex flex-col shadow-2xl h-screen sticky top-0"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <SidebarContent />
        </div>
      </aside>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.5);
        }
      `}</style>
    </>
  );
}