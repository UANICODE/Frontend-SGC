"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { HeroMockup } from "@/components/home/HeroMockup";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FaqSection } from "@/components/home/FaqSection";
import { PartnersSection } from "@/components/home/PartnersSection";
import { ContactSection } from "@/components/home/ContactSection";
import { StoreBadge } from "@/components/StoreBadges";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { ArrowRight, Sparkles, Store, MapPin, X } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function HomePage() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Mostrar popup após um pequeno delay
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-backgroundLight"
    >
      {/* Popup com Slogan - Design Glass Morphism */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop com blur e gradiente animado */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowPopup(false)}
              className="absolute inset-0"
            >
              
              {/* Overlay escuro com blur */}
              <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            </motion.div>

            {/* Popup centralizado */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                mass: 0.8,
              }}
              className="relative z-10 w-full max-w-md mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
     

              {/* Container do popup com glass morphism */}
              <div className="relative rounded-3xl bg-white/90 backdrop-blur-2xl border border-white/60 shadow-2xl p-8 md:p-10 text-center overflow-hidden">
                {/* Padrão de fundo sutil */}
                <div className="absolute inset-0 opacity-[0.03]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(244,81,30,0.5)_1px,_transparent_0)] bg-[length:24px_24px]" />
                </div>

            

                {/* Botão fechar */}
                <motion.button
                  onClick={() => setShowPopup(false)}
                  whileHover={{ scale: 1.15, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-sm border border-white/60 hover:bg-white hover:border-primary/40 transition-all shadow-lg z-20"
                >
                  <X className="h-5 w-5 text-textSecondaryLight hover:text-primary transition-colors" />
                </motion.button>

                {/* Conteúdo */}
                <div className="relative z-10">
                  {/* Ícone animado */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.2,
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                    }}
                    className="mb-6"
                  >
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.08, 1],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="inline-flex items-center justify-center rounded-full bg-white border-[6px] md:border-4 border-white shadow-xl p-1"
                    >
                      <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-full overflow-hidden border-[6px] md:border-4 border-white">
                        <Image
                          src="/images/logo5.png"
                          alt="Foodnect"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Texto principal */}
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-xl md:text-2xl font-bold text-textPrimaryLight mb-3 leading-tight px-2"
                  >
                    Fome?
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-lg md:text-xl font-bold mb-8 px-2 text-[#FF9E3A]"
                  >
                    Daqui para aqui resolves.
                  </motion.p>

                  {/* Botão CTA */}
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPopup(false)}
                    className="relative w-full rounded-xl bg-gradient-to-r from-primary via-[#FF7043] to-primary bg-[length:200%_100%] text-white font-bold py-4 px-6 shadow-xl hover:shadow-2xl transition-all overflow-hidden group"
                    style={{
                      backgroundPosition: "0% 50%",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundPosition = "100% 50%";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundPosition = "0% 50%";
                    }}
                  >
                    {/* Efeito de brilho no hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.7 }}
                    />
                    <span className="relative z-10">Começar agora</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section
        id="download"
        className="gradient-hero border-b border-borderLight/30 relative overflow-hidden"
      >
        <AnimatedBackground variant="hero" intensity="medium" />
        
        {/* Decorative elements animados melhorados */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
            x: [0, 80, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.6, 0.2],
            x: [0, -60, 0],
            y: [0, 60, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-3xl"
        />
        
        {/* Elementos adicionais de profundidade */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
            x: [0, 40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
        />
        
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-16 px-4 pt-6 pb-20 md:flex-row md:pt-8 md:pb-32 md:px-6">
          <div className="flex-1 space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-black via-zinc-900 to-black text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider shadow-xl hover:shadow-2xl transition-shadow"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-4 w-4" />
                </motion.div>
                <span>Descobre restaurantes na cidade da Beira.</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl font-bold tracking-tight text-textPrimaryLight md:text-5xl lg:text-6xl leading-tight"
              >
                Com fome e sem paciência?
                <br />
                <span className="text-[#FF9E3A]"> A Foodnect</span> decide por ti.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="max-w-2xl text-lg text-textSecondaryLight leading-relaxed"
              >
                Vê restaurantes e lanchonetes reais perto de ti na Beira, compara cardápios, preços, faz o
                teu pedido e rastree, sem perder tempo a decidir.
              </motion.p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-wrap items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <StoreBadge variant="play" />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <StoreBadge variant="app" disabled />
                </motion.div>
              </div>

              {/* CTA para estabelecimentos - mais visível e destacado */}
              <motion.a
                href="/b2b"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary via-[#FF9E3A] to-primary px-4 py-2 text-xs font-semibold text-white shadow-lg hover:shadow-xl transition-all overflow-hidden relative max-w-fit"
              >
                <motion.div
                  animate={{ x: [0, 6, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  className="flex items-center gap-2 relative z-10"
                >
                  <Store className="h-3.5 w-3.5" />
                  <span>Como a Foodnect pode beneficiar o meu estabelecimento</span>
                  <ArrowRight className="h-3 w-3 opacity-90" />
                </motion.div>
                <motion.div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/0 to-white/10"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.a>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.6, type: "spring" }}
            className="flex-1 flex justify-center"
          >
            <HeroMockup />
          </motion.div>
        </div>
      </section>

      {/* Sobre */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="border-b border-borderLight/30 bg-white relative overflow-hidden"
      >
        <AnimatedBackground variant="section" intensity="light" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-4 py-20 md:flex-row md:items-center md:py-28 md:px-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex-1"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-6">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-wide">Sobre Nós</span>
            </div>
            <h2 className="text-4xl font-bold text-textPrimaryLight md:text-5xl mb-6 leading-tight">
              <span className="text-[#FF9E3A]">Foodnect</span> nasceu na <span className="text-gradient">Beira</span> para acabar com a perda de tempo na hora de comer.
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1"
          >
            <p className="text-lg leading-relaxed text-textSecondaryLight mb-6">
              Em vez de procurares alguém para perguntar "onde vamos comer?", ou "Peço sugestão de um restaurante?"{" "}
              <span className="text-[#FF9E3A]">Foodnect</span> mostra restaurantes e lanchonetes reais perto de ti na Beira, com
              preços, cardápios, localização e horários tudo num só lugar. Tu vês,
              decide e pedes em poucos toques.
            </p>
         
          </motion.div>
        </div>
      </motion.section>

      <FeaturesSection />
      <TestimonialsSection />
      <FaqSection />
      <PartnersSection />
      <ContactSection />
    </motion.div>
  );
}
