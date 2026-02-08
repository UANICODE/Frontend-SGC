"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { HelpCircle, ChevronDown, MapPin, CheckCircle2 } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "A Foodnect é gratuita?",
    answer:
      "Sim. Podes com a Foodnect ver restaurantes e lanchonetes, fazer pedidos e rastrear o seu pedido em tempo real.",
    icon: CheckCircle2,
  },
  {
    question: "Posso pedir ou só ver restaurantes?",
    answer:
      "Podes fazer as duas coisas: explorar restaurantes e também fazer o pedido directamente pela app, quando disponível no estabelecimento.",
    icon: CheckCircle2,
  },
  {
    question: "Funciona em que cidades?",
    answer:
      "Actualmete a Foodnect esta disponivel para a cidade da Beira, e estamos expandido para as outras cidades de Moçambique.",
    icon: MapPin,
  },
  {
    question: "Preciso criar conta?",
    answer:
      "Podes explorar restaurantes sem criar conta. Para pedidos e histórico, pedimos um registo rápido para tua segurança.",
    icon: CheckCircle2,
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="border-b border-borderLight/30 bg-gradient-to-b from-backgroundLight via-white to-backgroundLight py-16 md:py-20 relative overflow-hidden">
      <AnimatedBackground variant="gradient" intensity="light" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FF7A1A]/10 to-[#FF9E3A]/10 border border-[#FF7A1A]/20 mb-4">
            <HelpCircle className="h-4 w-4 text-[#FF7A1A]" />
            <span className="text-xs font-bold text-[#FF7A1A] uppercase tracking-wide">FAQ</span>
          </div>
          <h2 className="text-4xl font-bold text-textPrimaryLight md:text-5xl mb-4 leading-tight">
            Perguntas frequentes
          </h2>
          <p className="text-lg text-textSecondaryLight leading-relaxed">
            Dúvidas rápidas sobre como usar a <span className="text-[#FF9E3A]">Foodnect</span> no dia a dia.
          </p>
        </motion.div>

        <div className="space-y-3 max-w-4xl mx-auto">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            const Icon = item.icon;
            return (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="overflow-hidden rounded-2xl bg-white/95 backdrop-blur-sm transition-all duration-300 group relative"
                style={{ border: '2px solid #FF7A1A', boxShadow: '0 0 0 1px #FF7A1A inset' }}
              >
                <motion.button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left transition-all hover:bg-[#FF7A1A]/5"
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <motion.div
                      animate={isOpen ? { scale: 1.1, rotate: [0, 5, -5, 0] } : { scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`p-3 rounded-xl transition-all ${
                        isOpen 
                          ? "bg-gradient-to-br from-[#FF7A1A] to-[#FF9E3A] shadow-lg" 
                          : "bg-[#FF7A1A]/10 group-hover:bg-[#FF7A1A]/15"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${isOpen ? "text-white" : "text-[#FF7A1A]"}`} />
                    </motion.div>
                    <span className={`text-base font-semibold transition-colors ${
                      isOpen ? "text-[#FF7A1A]" : "text-textPrimaryLight group-hover:text-[#FF7A1A]"
                    }`}>
                      {item.question}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`ml-4 flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isOpen 
                        ? "bg-gradient-to-br from-[#FF7A1A] to-[#FF9E3A] text-white shadow-lg" 
                        : "bg-[#FF7A1A]/10 text-[#FF7A1A] group-hover:bg-[#FF7A1A]/20"
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.div>
                </motion.button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pl-20 border-t border-[#FF7A1A]/20 bg-gradient-to-b from-transparent to-[#FF7A1A]/5">
                        <p className="text-sm leading-relaxed text-textSecondaryLight pt-4">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
