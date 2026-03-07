"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SuperAdminSidebar() {
  const pathname = usePathname();

  const menu = [
    {
      label: "Dashboard",
      href: "/superadmin/establishments",
    }
    /*
    {
      label: "Estabelecimentos",
      href: "/superadmin/establishments",
    },
    {
      label: "Vendas por Estabelecimento",
      href: "/superadmin/sales-by-establishment",
    },
    {
      label: "Vendas por Período",
      href: "/superadmin/sales-by-period",
    },
    {
      label: "Usuários por Estabelecimento",
      href: "/superadmin/users-by-establishment",
    },*/
  ];

  return (
    <aside className="w-64 border-r bg-card flex flex-col">
      <div className="h-16 flex items-center px-6 border-b">
        <h2 className="font-bold text-lg">
          Super Admin
        </h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menu.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 rounded-lg transition ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}