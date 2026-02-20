"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  MapPin,
  Mail,
  Phone,
  Instagram,
  Music2,
  ArrowRight,
  Heart,
  Home,
  UtensilsCrossed,
  Facebook,
  Youtube,
  Twitter,
  Star,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t-2 border-primary/20 bg-gradient-to-b from-white via-backgroundLight to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/8 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/8 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      
      <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 md:flex-row md:justify-between md:px-6 md:py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-sm"
        >
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="relative h-12 w-auto md:h-14"
            >
              <Image
                src="/images/logo5.png"
                alt="Foodnect"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
            <div>
              <span className="text-3xl font-bold block text-[#FF9E3A]">
                Foodnect
              </span>
              <span className="text-xs text-textSecondaryLight -mt-1 flex items-center gap-1.5 mt-1">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                Beira, Moçambique
              </span>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-textSecondaryLight mb-6">
            Descobre onde comer e faz o teu pedido em segundos. <span className="text-[#FF9E3A]">Foodnect</span> nasceu na Beira, Moçambique, para tornar a descoberta de restaurantes mais rápida e simples.
          </p>
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-2 border-primary/30 text-sm font-semibold text-primary shadow-lg hover:shadow-xl hover:border-primary/50 transition-all backdrop-blur-sm"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
               
            </motion.div>
            <span>Fome? Daqui para aqui resolves😎.</span>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex-1 rounded-2xl border border-primary/15 bg-white/90 backdrop-blur-sm shadow-md p-5 md:p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 text-sm">
            {/* Links rápidos */}
            <div>
              <h3 className="font-bold text-textPrimaryLight mb-4 text-base flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-primary" />
                Links rápidos
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    href="/"
                    className="group flex items-center gap-2.5 rounded-xl px-4 py-3 text-base font-medium text-textSecondaryLight transition-all duration-200 hover:bg-primary/5 hover:text-primary hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <Home className="h-5 w-5 text-primary" />
                    <span className="group-hover:translate-x-1 transition-transform">
                      Home
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/b2b"
                    className="group flex items-center gap-2.5 rounded-xl px-4 py-3 text-base font-medium text-textSecondaryLight transition-all duration-200 hover:bg-primary/5 hover:text-primary hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <UtensilsCrossed className="h-5 w-5 text-primary" />
                    <span className="group-hover:translate-x-1 transition-transform">
                      Para Restaurantes
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#testemunhos"
                    className="group flex items-center gap-2.5 rounded-xl px-4 py-3 text-base font-medium text-textSecondaryLight transition-all duration-200 hover:bg-primary/5 hover:text-primary hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById("testemunhos");
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }}
                  >
                    <Star className="h-5 w-5 text-primary" />
                    <span className="group-hover:translate-x-1 transition-transform">
                      Testemunhos
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#contactos"
                    className="group flex items-center gap-2.5 rounded-xl px-4 py-3 text-base font-medium text-textSecondaryLight transition-all duration-200 hover:bg-primary/5 hover:text-primary hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById("contactos");
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }}
                  >
                    <Phone className="h-5 w-5 text-primary" />
                    <span className="group-hover:translate-x-1 transition-transform">
                      Contactos
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contactos */}
            <div className="p-4 rounded-2xl border border-primary/20 bg-white/50 backdrop-blur-sm shadow-sm">
              <h3 className="font-bold text-textPrimaryLight mb-4 text-base flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                Contactos
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href="mailto:info@uanicode.com"
                    className="group flex items-center gap-2.5 rounded-xl px-4 py-3 text-base font-medium text-textSecondaryLight transition-all duration-200 hover:bg-primary/5 hover:text-primary hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <Mail className="h-5 w-5 text-primary" />
                    <span className="group-hover:translate-x-1 transition-transform">
                    info@uanicode.com
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+258873269520"
                    className="group flex items-center gap-2.5 rounded-xl px-4 py-3 text-base font-medium text-textSecondaryLight transition-all duration-200 hover:bg-primary/5 hover:text-primary hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <Phone className="h-5 w-5 text-primary" />
                    <span className="group-hover:translate-x-1 transition-transform">
                      +258 87 326 9520
                    </span>
                  </a>
                </li>
                <li className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-base font-medium text-textSecondaryLight">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>Beira, Moçambique</span>
                </li>
              </ul>
            </div>

            {/* Redes sociais */}
            <div className="p-4 rounded-2xl border border-primary/20 bg-white/50 backdrop-blur-sm shadow-sm">
              <h3 className="font-bold text-textPrimaryLight mb-4 text-base flex items-center gap-2">
                <Instagram className="h-4 w-4 text-primary" />
                Redes sociais
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href="https://www.facebook.com/share/1KAv3im9pU/?mibextid=wwXIfr"
                    className="group flex items-center gap-2.5 rounded-xl px-4 py-3 text-base font-medium text-textSecondaryLight transition-all duration-200 hover:bg-primary/5 hover:text-primary hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <Facebook className="h-5 w-5 text-primary" />
                    <span className="group-hover:translate-x-1 transition-transform">
                      Facebook
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/foodnect.mz?igsh=aGJ1ankwN2hieTQ3&utm_source=qr"
                    className="group flex items-center gap-2.5 rounded-xl px-4 py-3 text-base font-medium text-textSecondaryLight transition-all duration-200 hover:bg-primary/5 hover:text-primary hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <Instagram className="h-5 w-5 text-primary" />
                    <span className="group-hover:translate-x-1 transition-transform">
                      Instagram
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.tiktok.com/@foodnectmz?_r=1&_t=ZS-944vI8zHqvl"
                    className="group flex items-center gap-2.5 rounded-xl px-4 py-3 text-base font-medium text-textSecondaryLight transition-all duration-200 hover:bg-primary/5 hover:text-primary hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <Music2 className="h-5 w-5 text-primary" />
                    <span className="group-hover:translate-x-1 transition-transform">
                      TikTok
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="bg-orange-100 relative w-full">
        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs md:flex-row md:px-6">
          <span className="font-bold text-dark-800 text-center md:text-left">
            © {new Date().getFullYear()} <span className="text-primary">Foodnect</span>. Todos os direitos reservados.
          </span>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3  text-sm"
          >
            <div className="relative h-6 w-auto md:h-8">
              <Image
                src="/images/Parceiros/Uanecode.png"
                alt="Uanicode"
                fill
                className="object-contain"
              />
            </div>
            <span className="black">Desenvolvido pela UANICODE.</span>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
