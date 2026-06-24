"use client";

import { useToast } from "@/ context/ToastContext";
import { useAuth } from "@/hooks/auth/useAuth";
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  BarChart3,
  Shield,
  Bell,
  FileText,
  CreditCard,
  Activity,
  Sparkles
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface SuperAdminSidebarProps {
  logo?: string;
  name?: string;
}

export function SuperAdminSidebar({ logo, name }: SuperAdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const { logout } = useAuth();
  const { showToast } = useToast();

  // Caminhos completos para o Super Admin
  const basePath = "/superadmin";
  
  const isActive = (href: string) => {
    // Para o Dashboard
    if (href === `${basePath}/dashboard`) {
      return pathname === href;
    }
    // Para outros links: verifica se o pathname começa com o href
    return pathname.startsWith(href);
  };

  const links = [
    { name: "Dashboard", href: `${basePath}/dashboard`, icon: <LayoutDashboard size={18} /> },
    { name: "Estabelecimentos", href: `${basePath}/establishments`, icon: <Building2 size={18} /> },
    { name: "Usuários", href: `${basePath}/users`, icon: <Users size={18} /> },
    { name: "Planos e Assinaturas", href: `${basePath}/plans`, icon: <CreditCard size={18} /> },
    { name: "Relatórios Globais", href: `${basePath}/reports`, icon: <BarChart3 size={18} /> },
    { name: "Logs de Atividade", href: `${basePath}/logs`, icon: <Activity size={18} /> },
    { name: "Notificações", href: `${basePath}/notifications`, icon: <Bell size={18} /> },
    { name: "Segurança", href: `${basePath}/security`, icon: <Shield size={18} /> },
    { name: "Configurações", href: `${basePath}/settings`, icon: <Settings size={18} /> },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      showToast("Logout feito com sucesso!", "success");
    } catch {
      showToast("Erro ao sair.", "error");
    }
  };

  const SidebarContent = ({ alwaysShowText = false }: { alwaysShowText?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Topo com logo e nome */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          {logo ? (
            <img
              src={logo}
              alt={name || "Super Admin"}
              className="h-16 w-16 rounded-full object-cover mb-2 shadow-md transition-all duration-300"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-2 shadow-md">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          )}
          {/* Bolinha de Online */}
          <div className="absolute -bottom-1 -right-1">
            <div className="relative">
              <div className="w-3.5 h-3.5 bg-green-500 rounded-full animate-pulse-ring"></div>
              <div className="absolute inset-0 w-3.5 h-3.5 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
        {name && (
          <span
            className={`font-bold text-lg text-primary text-center transition-all duration-300 ${
              alwaysShowText || hovered ? "opacity-100" : "opacity-0 max-w-0 overflow-hidden lg:max-w-xs"
            }`}
          >
            {name}
          </span>
        )}
        <span
          className={`text-xs text-gray-400 text-center transition-all duration-300 ${
            alwaysShowText || hovered ? "opacity-100" : "opacity-0 max-w-0 overflow-hidden lg:max-w-xs"
          }`}
        >
          Super Admin
        </span>
      </div>

      {/* Links com scroll */}
      <nav className="flex-1 flex flex-col gap-1.5 text-sm overflow-y-auto">
        {links.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors duration-300 relative
                ${active ? "bg-primary/10 font-bold text-primary" : "text-gray-700 hover:bg-gray-100"}
              `}
            >
              {/* Destaque lateral - APENAS para o item selecionado */}
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
              )}
              {link.icon}
              <span
                className={`transition-all duration-300 whitespace-pre ${
                  alwaysShowText || hovered ? "opacity-100 max-w-xs" : "opacity-0 max-w-0 overflow-hidden lg:max-w-xs"
                }`}
              >
                {link.name}
              </span>
            </Link>
          );
        })}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-3 py-2.5 rounded-md text-red-600 hover:bg-red-600 hover:text-white transition"
        >
          <LogOut size={18} />
          <span
            className={`transition-all duration-300 ${
              alwaysShowText || hovered ? "opacity-100" : "opacity-0 lg:opacity-100"
            }`}
          >
            Sair
          </span>
        </button>
      </nav>
    </div>
  );

  return (
    <>
      {/* Botão hambúrguer mobile */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow-md"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar desktop */}
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-borderLight h-screen overflow-y-auto sticky top-0 z-20 transition-all duration-300 ${
          hovered ? "w-64 p-6" : "w-20 p-2"
        }`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <SidebarContent />
      </aside>

      {/* Sidebar mobile/tablet overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed top-0 left-0 w-64 bg-white h-screen z-50 p-6 shadow-lg overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <button onClick={() => setMobileOpen(false)}>
                <X size={24} />
              </button>
            </div>
            {/* Força mostrar todos os textos no overlay */}
            <SidebarContent alwaysShowText />
          </aside>
        </>
      )}

      <style jsx>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          70% {
            transform: scale(1.5);
            opacity: 0;
          }
          100% {
            transform: scale(0.8);
            opacity: 0;
          }
        }
        .animate-pulse-ring {
          animation: pulse-ring 1.5s ease-out infinite;
        }
      `}</style>
    </>
  );
}