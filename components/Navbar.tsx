"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Home,
  UtensilsCrossed,
  Phone,
  Download,
  Star,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Para Restaurantes", href: "/b2b", icon: UtensilsCrossed },
  { label: "Testemunhos", href: "/#testemunhos", icon: Star },
  { label: "Contactos", href: "/#contactos", icon: Phone },
];

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/"); // link ativo inicial

  // --- LÓGICA DE SCROLL PARA DESTACAR LINKS ---
  useEffect(() => {
    if (pathname !== "/") {
      setActiveLink(pathname);
      return;
    }

    function handleScroll() {
      const scrollY = window.scrollY;
      let current = "/";

      const testemunhos = document.getElementById("testemunhos");
      const contactos = document.getElementById("contactos");

      if (contactos && scrollY >= contactos.offsetTop - 120) {
        current = "/#contactos";
      } else if (testemunhos && scrollY >= testemunhos.offsetTop - 120) {
        current = "/#testemunhos";
      }

      setActiveLink(current);
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // ativa no load
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 border-b border-borderLight/30 glass-effect shadow-lg backdrop-blur-xl"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4 md:px-6">
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link href="/" className="flex items-center group">
            <div className="relative h-12 w-40 md:h-14 md:w-48">
              <Image
                src="/images/logo5.png"
                alt="Foodnect"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </motion.div>

        {/* Navegação desktop */}
        <div className="hidden items-center gap-2 text-sm font-medium md:flex">
          {navItems.map((item, idx) => {
            const isActive = activeLink === item.href;
            const Icon = item.icon;

            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link
                  href={item.href}
                  onClick={(e) => {
                    if (item.href.startsWith("#") && pathname === "/") {
                      e.preventDefault();
                      const sectionId = item.href.replace("/#", "");
                      const element = document.getElementById(sectionId);
                      if (element)
                        element.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                    }

                    if (item.href === "/" && pathname === "/") {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "text-[#FF9E3A] font-semibold"
                      : "text-textPrimaryLight"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 transition-all duration-200 group-hover:scale-110 group-hover:text-primary ${
                      isActive ? "text-[#FF9E3A]" : "text-textSecondaryLight"
                    }`}
                  />
                  <span className="transition-colors duration-200 group-hover:text-primary">
                    {item.label}
                  </span>

                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl -z-10 border border-primary/20"
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* CTA + menu mobile */}
        <div className="flex items-center gap-2">
          <motion.a
            className="hidden md:flex items-center gap-2 rounded-full bg-gradient-to-r from-primary via-[#FF9E3A] to-primary bg-size-200 bg-pos-0 hover:bg-pos-100 px-6 py-2.5 text-sm font-bold text-white shadow-xl shadow-primary/50 transition-all duration-500 animate-pulse-glow"
            whileHover={{
              scale: 1.07,
              boxShadow: "0 12px 34px rgba(255, 122, 26, 0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            href="#download"
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById("download");
              if (element)
                element.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            <Download className="h-4 w-4" />
            <span>Download App</span>
          </motion.a>

          <button
            type="button"
            aria-label="Abrir menu"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="inline-flex items-center justify-center rounded-full border border-borderLight/60 p-2 text-textSecondaryLight md:hidden bg-white/80 backdrop-blur-sm"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-borderLight/40 bg-white/95 backdrop-blur-sm shadow-lg">
          <div className="mx-auto max-w-7xl px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeLink === item.href;

              const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                if (item.href.startsWith("#") && pathname === "/") {
                  e.preventDefault();
                  const sectionId = item.href.replace("/#", "");
                  const element = document.getElementById(sectionId);
                  if (element)
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                }

                if (item.href === "/" && pathname === "/") {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }

                setIsMenuOpen(false);
              };

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleClick}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors duration-200 ${
                    isActive
                      ? "text-[#FF9E3A] font-semibold"
                      : "text-textSecondaryLight hover:text-primary hover:bg-backgroundLight"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-[#FF9E3A]" : "text-textSecondaryLight"} group-hover:text-primary`} />
                  <span className="transition-colors duration-200 group-hover:text-primary">{item.label}</span>
                </Link>
              );
            })}

            <Link
              href="#download"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById("download");
                if (element)
                  element.scrollIntoView({ behavior: "smooth", block: "start" });
                setIsMenuOpen(false);
              }}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary via-[#FF7043] to-primary px-4 py-2 text-sm font-bold text-white shadow-md"
            >
              <Download className="h-4 w-4" />
              <span>Download App</span>
            </Link>
          </div>
        </div>
      )}
    </motion.header>
  );
}
