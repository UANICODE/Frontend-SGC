"use client";

import Link from "next/link";
import { ArrowLeft, Home, Sparkles, Shield, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/auth/useAuth";

interface SuperAdminNavbarProps {
  logo?: string;
  name?: string;
}

export function SuperAdminNavbar({ logo, name }: SuperAdminNavbarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  
  const getBreadcrumb = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 1) {
      return segments[segments.length - 1];
    }
    return null;
  };

  const currentPage = getBreadcrumb();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 shadow-sm transition-all duration-300">
      {/* Logo e Nome */}
      <div className="flex items-center gap-4">
        {/* Logo com efeito */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur-md opacity-0 group-hover:opacity-60 transition-all duration-500 group-hover:scale-110"></div>
          <div className="relative">
            {logo ? (
              <img
                src={logo}
                alt={name || "Super Admin"}
                className="relative w-10 h-10 rounded-full object-cover shadow-md ring-2 ring-white transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-md ring-2 ring-white transition-transform duration-300 group-hover:scale-105">
                <Shield className="w-5 h-5 text-white" />
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          </div>
        </div>
        
        {/* Informações */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-sm">
              {name || "Super Admin"}
            </span>
          </div>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Painel de Controle Global
          </span>
        </div>

        {/* Separador decorativo */}
        <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent mx-2"></div>

        {/* Breadcrumb */}
        {currentPage && (
          <div className="hidden md:flex items-center gap-2 text-sm">
            <Home className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">/</span>
            <span className="text-primary font-medium capitalize">
              {currentPage}
            </span>
          </div>
        )}
      </div>

      {/* Info do Super Admin */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
          <User className="w-4 h-4" />
          <span className="font-medium">{user?.nome || user?.email || "Super Admin"}</span>
        </div>

        <Link
          href="/auth"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative overflow-hidden px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 bg-white border border-gray-200 shadow-sm hover:shadow-md"
        >
          <div className={`absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
          
          <ArrowLeft className={`w-4 h-4 text-primary transition-transform duration-300 ${isHovered ? '-translate-x-1' : ''}`} />
          
          <span className="relative text-gray-700 group-hover:text-primary transition-colors duration-300">
            Sair
          </span>
          
          <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
        </Link>
      </div>
    </header>
  );
}