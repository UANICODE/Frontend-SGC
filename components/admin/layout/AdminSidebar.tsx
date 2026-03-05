"use client";

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
} from "lucide-react";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";

export function AdminSidebar() {
  const params = useParams();
  const establishmentId = params?.establishmentId;
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

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

  return (
    <>
      {/* Botão hambúrguer apenas mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow-md"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-borderLight p-6 h-screen">
        <h2 className="text-lg font-bold mb-8">Admin</h2>
        <nav className="flex flex-col gap-4 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 ${
                isActive(link.href) ? "font-bold text-primary" : ""
              }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Sidebar mobile overlay */}
      {mobileOpen && (
        <>
          {/* Fundo escuro */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => setMobileOpen(false)}
          />

          {/* Menu lateral */}
          <aside className="fixed top-0 left-0 w-64 bg-white h-screen z-50 p-6 shadow-lg">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-bold">Admin</h2>
              <button onClick={() => setMobileOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-col gap-4 text-sm">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 ${
                    isActive(link.href) ? "font-bold text-primary" : ""
                  }`}
                  onClick={() => setMobileOpen(false)} // fecha ao clicar
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
            </nav>
          </aside>
        </>
      )}
    </>
  );
}