"use client";

import { useToast } from "@/ context/ToastContext";
import { useAuth } from "@/hooks/auth/useAuth";
import {
  LayoutDashboard,
  Package,
  Tags,
  Layers,
  FlaskConical,
  Warehouse,
  Truck,
  Users,
  Wallet,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut
} from "lucide-react";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";

export function AdminSidebar({ logo, name }: { logo?: string; name?: string }) {
  const params = useParams();
  const establishmentId = params?.establishmentId;
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { logout } = useAuth();
  const { showToast } = useToast();

  if (!establishmentId) return null;

  const basePath = `/admin/dashboard/${establishmentId}`;
  const isActive = (path: string) => pathname.startsWith(path);

  const links = [
    { name: "Dashboard", href: `${basePath}`, icon: <LayoutDashboard size={18} /> },
    { name: "Produtos", href: `${basePath}/product`, icon: <Package size={18} /> },
    { name: "Categorias", href: `${basePath}/product/categories`, icon: <Tags size={18} /> },
    { name: "Tipos de Produto", href: `${basePath}/product/types`, icon: <Layers size={18} /> },
    { name: "Ingredientes", href: `${basePath}/product/ingredient`, icon: <FlaskConical size={18} /> },
    { name: "Estoque", href: `${basePath}/product/stock`, icon: <Warehouse size={18} /> },
    { name: "Fornecedores", href: `${basePath}/supplier`, icon: <Truck size={18} /> },
    { name: "Usuários", href: `${basePath}/users`, icon: <Users size={18} /> },
    { name: "Caixas Abertos", href: `${basePath}/cash-registers`, icon: <Wallet size={18} /> },
    { name: "Relatórios", href: `${basePath}/reports`, icon: <BarChart3 size={18} /> },
    { name: "Personalização", href: `${basePath}/settings`, icon: <Settings size={18} /> },
  ];

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
      <div className="flex flex-col items-center mb-4">
        {logo && (
          <img
            src={logo}
            alt={name}
            className="h-16 w-16 rounded-full object-cover mb-2 shadow-md"
          />
        )}
        {name && <span className="font-bold text-lg text-primary text-center">{name}</span>}
      </div>

      {/* Links com scroll */}
      <nav className="flex-1 flex flex-col gap-2 text-sm overflow-y-auto">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`
              flex items-center gap-3 px-3 py-2 rounded-md transition-colors
              ${isActive(link.href) ? "bg-primary/10 font-bold text-primary" : "text-gray-700 hover:bg-gray-100"}
            `}
          >
            {link.icon}
            <span>{link.name}</span>
          </Link>
        ))}

        {/* Logout no final */}
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-3 py-2 rounded-md text-red-600 hover:bg-red-600 hover:text-white transition"
        >
          <LogOut size={18} />
          <span>Sair</span>
        </button>
      </nav>
    </div>
  );

  return (
    <>
      {/* Botão hambúrguer mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow-md"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-borderLight p-6 h-screen overflow-y-auto sticky top-0 z-20">
        <SidebarContent />
      </aside>

      {/* Sidebar mobile overlay */}
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
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}