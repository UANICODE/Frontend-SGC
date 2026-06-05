"use client";

import Image from "next/image";
import logo from "@/public/image/logo.png";

export function SuperAdminNavbar() {
  return (
    <header className="h-20 border-b bg-white flex items-center justify-between px-8 shadow-md">
      
      {/* Logo */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-50">
          <Image
            src={logo}
            alt="Logo do Sistema"
            width={64}
            height={64}
            className="object-cover"
          />
        </div>
        <span className="text-2xl font-bold text-gray-900">SGC</span>
      </div>

      {/* Título */}
      <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">
        Painel Global do Sistema
      </h1>

      {/* Usuário */}
      <div className="text-sm sm:text-base text-gray-500">
        Super Administrador
      </div>
    </header>
  );
}