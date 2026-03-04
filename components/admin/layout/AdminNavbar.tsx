"use client";

import Link from "next/link";

export function AdminNavbar({
  logo,
  name,
}: {
  logo?: string;
  name?: string;
}) {
  return (
    <header className="h-16 bg-white border-b border-borderLight flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        {logo && (
          <img
            src={logo}
            className="h-8 w-8 rounded-full object-cover"
          />
        )}

        <span className="font-semibold text-primary">
          {name}
        </span>
      </div>

      <Link
        href="/admin/establishments"
        className="text-sm text-textSecondaryLight hover:text-primary"
      >
        ← Voltar aos Estabelecimentos
      </Link>
    </header>
  );
}