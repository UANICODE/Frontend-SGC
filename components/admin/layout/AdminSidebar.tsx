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
} from "lucide-react";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export function AdminSidebar() {
  const params = useParams();
  const establishmentId = params?.establishmentId;

  // Pegamos a rota atual para destacar item ativo
  const pathname = usePathname();

  if (!establishmentId) return null;

  const basePath = `/admin/dashboard/${establishmentId}`;

  // Função para verificar se o link é ativo
  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <aside className="w-64 bg-white border-r border-borderLight p-6">
      <h2 className="text-lg font-bold mb-8">Admin</h2>

      <nav className="flex flex-col gap-4 text-sm">
        <Link
          href={`${basePath}`}
          className={isActive(`${basePath}`) ? "font-bold text-primary" : ""}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <Link
          href={`${basePath}/product`}
          className={isActive(`${basePath}/product`) ? "font-bold text-primary" : ""}
        >
          <Package size={18} />
          Produtos
        </Link>

        <Link
          href={`${basePath}/product/categories`}
          className={isActive(`${basePath}/product/categories`) ? "font-bold text-primary" : ""}
        >
          <Tags size={18} />
          Categorias
        </Link>

        <Link
          href={`${basePath}/product/types`}
          className={isActive(`${basePath}/product/types`) ? "font-bold text-primary" : ""}
        >
          <Layers size={18} />
          Tipos de Produto
        </Link>

        <Link
          href={`${basePath}/product/ingredient`}
          className={isActive(`${basePath}/product/ingredient`) ? "font-bold text-primary" : ""}
        >
          <FlaskConical size={18} />
          Ingredientes
        </Link>

        <Link
          href={`${basePath}/product/stock`}
          className={isActive(`${basePath}/product/stock`) ? "font-bold text-primary" : ""}
        >
          <Warehouse size={18} />
          Estoque
        </Link>

        <Link
          href={`${basePath}/supplier`}
          className={isActive(`${basePath}/supplier`) ? "font-bold text-primary" : ""}
        >
          <Truck size={18} />
          Fornecedores
        </Link>

        <Link
          href={`${basePath}/users`}
          className={isActive(`${basePath}/users`) ? "font-bold text-primary" : ""}
        >
          <Users size={18} />
          Usuários
        </Link>

        <Link
          href={`${basePath}/cash-registers`}
          className={isActive(`${basePath}/cash-registers`) ? "font-bold text-primary" : ""}
        >
          <Wallet size={18} />
          Caixas Abertos
        </Link>

        <Link
          href={`${basePath}/reports`}
          className={isActive(`${basePath}/reports`) ? "font-bold text-primary" : ""}
        >
          <BarChart3 size={18} />
          Relatórios
        </Link>

        <Link
          href={`${basePath}/settings`}
          className={isActive(`${basePath}/settings`) ? "font-bold text-primary" : ""}
        >
          <Settings size={18} />
          Personalização
        </Link>
      </nav>
    </aside>
  );
}