"use client";

import Link from "next/link";
import { ArrowLeft, Building2, ChevronRight, Home, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface AdminNavbarProps {
  logo?: string;
  name?: string;
}

export function AdminNavbar({ logo, name }: AdminNavbarProps) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  
  const getBreadcrumb = () => {
    const segments = pathname.split("/").filter(Boolean);
    const establishmentIndex = segments.indexOf("dashboard") + 1;
    if (establishmentIndex < segments.length) {
      return segments[establishmentIndex];
    }
    return null;
  };

  const establishmentId = getBreadcrumb();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 shadow-sm transition-all duration-300">
      {/* Logo e Nome do Estabelecimento */}
      <div className="flex items-center gap-4">
        {/* Logo com efeito de brilho */}
        {logo && (
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur-md opacity-0 group-hover:opacity-60 transition-all duration-500 group-hover:scale-110"></div>
            <div className="relative">
              <img
                src={logo}
                alt={name || "Logo"}
                className="relative w-10 h-10 rounded-full object-cover shadow-md ring-2 ring-white transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
          </div>
        )}
        
        {/* Informações do estabelecimento */}
        <div className="flex flex-col">
          {name && (
            <div className="flex items-center gap-2">
              <span className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-sm">
                {name}
              </span>
              {!logo && (
                <Building2 className="w-3.5 h-3.5 text-primary/60" />
              )}
            </div>
          )}
          <span className="text-xs text-gray-400 flex items-center gap-1">

            Painel Administrativo
          </span>
        </div>

        {/* Separador decorativo com gradiente */}
        {(logo || name) && (
          <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent mx-2"></div>
        )}


      </div>

      {/* Botão de Voltar com efeito moderno */}
      <Link
        href="/admin/establishments"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative overflow-hidden px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 bg-white border border-gray-200 shadow-sm hover:shadow-md"
      >
        {/* Efeito de fundo gradiente animado */}
        <div className={`absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
        
        {/* Ícone com animação */}
        <ArrowLeft className={`w-4 h-4 text-primary transition-transform duration-300 ${isHovered ? '-translate-x-1' : ''}`} />
        
        {/* Texto */}
        <span className="relative text-gray-700 group-hover:text-primary transition-colors duration-300">
          Voltar aos Estabelecimentos
        </span>
        
        {/* Linha decorativa no hover */}
        <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
      </Link>
    </header>
  );
}