"use client";

import { motion } from "framer-motion";
import { MessageCircle, Phone } from "lucide-react";

interface FloatingWhatsAppButtonProps {
  phone?: string;
  message?: string;
}

export function FloatingWhatsAppButton({
  phone = "258873269520",
  message = "Olá, quero saber como colocar o meu restaurante na Foodnect.",
}: FloatingWhatsAppButtonProps) {
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-secondary via-[#5DAF62] to-secondary bg-size-200 bg-pos-0 hover:bg-pos-100 px-6 py-4 text-sm font-bold text-white shadow-2xl shadow-secondary/40 transition-all duration-500 group"
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.5, delay: 0.5, type: "spring" }}
      whileHover={{ scale: 1.1, boxShadow: "0 15px 40px rgba(102, 187, 106, 0.5)" }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20" />
        <MessageCircle className="h-5 w-5 relative z-10" />
      </motion.div>
      <span className="group-hover:translate-x-1 transition-transform relative z-10">
        Fale Conosco
      </span>
      <motion.div
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="relative z-10"
      >
        <Phone className="h-4 w-4" />
      </motion.div>
    </motion.a>
  );
}
