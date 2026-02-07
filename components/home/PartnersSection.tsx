"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";

const PARTNERS = [
  {
    name: "Uanicode",
    logo: "/images/Parceiros/Uanecode.png",
  },
  {
    name: "Helpdesk Multi-Service",
    logo: "/images/Parceiros/helpdesk2.png",
  },
  {
    name: "HelpDesk Consultoria e Serviços",
    logo: "/images/Parceiros/helpdesk1.png",
  },
];

export function PartnersSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Carrossel vertical automático tipo "anel"
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % PARTNERS.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="border-b border-borderLight/30 bg-gradient-to-b from-white to-backgroundLight py-16 md:py-20 relative overflow-hidden">
      {/* Background animado suave */}
      <motion.div
        animate={{
          background: [
            "radial-gradient(circle at 50% 50%, rgba(244, 81, 30, 0.05) 0%, transparent 70%)",
            "radial-gradient(circle at 50% 50%, rgba(244, 81, 30, 0.09) 0%, transparent 70%)",
            "radial-gradient(circle at 50% 50%, rgba(244, 81, 30, 0.05) 0%, transparent 70%)",
          ],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0"
      />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center mb-14 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
            <Building2 className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-wide">
              Parceiros
            </span>
          </div>
          <h2 className="text-4xl font-bold text-textPrimaryLight md:text-5xl leading-tight">
            Parceiros que caminham conosco
          </h2>
        </motion.div>

        {/* Carrossel de logotipos em anel (sem cards) */}
        <div className="mx-auto max-w-xl">
          <div className="relative h-40 flex items-center justify-center overflow-hidden">
            {PARTNERS.map((partner, idx) => {
              const isActive = idx === activeIndex;
              return (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, y: -60, scale: 0.7 }}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    y: isActive ? 0 : 60,
                    scale: isActive ? 1.1 : 0.8,
                  }}
                  transition={{ duration: 0.5 }}
                  className="absolute flex flex-col items-center justify-center"
                >
                  <div className="relative h-24 w-40 md:h-28 md:w-48 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-primary opacity-70" />
                    <div className="relative h-20 w-36 md:h-24 md:w-44">
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        fill
                        className={`object-contain ${partner.name === "Uanecode" ? "scale-110" : ""}`}
                      />
                    </div>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-textPrimaryLight">
                    {partner.name}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}


