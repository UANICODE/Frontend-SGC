"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  MessageCircle,
} from "lucide-react";
import { AnimatedBackground } from "@/components/AnimatedBackground";

interface ContactInfo {
  icon: any;
  label: string;
  value: string;
  href: string;
}

interface SocialLink {
  icon: any;
  label: string;
  href: string;
}
const ContactInfoItem = ({ info, idx }: { info: ContactInfo; idx: number }) => {
  const Icon = info.icon;
  return (
    <motion.a
      href={info.href}
      target={info.href.startsWith("http") ? "_blank" : "_self"}
      rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1 }}
      whileHover={{ x: 4 }}
      className="flex items-center gap-4 group"
    >
      <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-200 shadow-sm">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-semibold text-textSecondaryLight mb-0.5 uppercase tracking-wide">
          {info.label}
        </p>
        <p className="text-sm md:text-base font-bold text-textPrimaryLight group-hover:text-primary transition-colors">
          {info.value}
        </p>
      </div>
    </motion.a>
  );
};

const SocialIcon = ({ social, idx }: { social: SocialLink; idx: number }) => {
  const Icon = social.icon;
  return (
    <motion.a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.05, type: "spring" }}
      whileHover={{ scale: 1.1, y: -3 }}
      whileTap={{ scale: 0.95 }}
      className="p-3.5 rounded-full border border-primary/25 bg-white hover:border-primary hover:bg-primary/5 transition-all duration-200 group shadow-sm hover:shadow-md"
      aria-label={social.label}
    >
      <Icon className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
    </motion.a>
  );
};

// Componente Principal (sem formulário)
export function ContactSection() {
  const contactInfo: ContactInfo[] = [
    {
      icon: Phone,
      label: "Telefone",
      value: "+258 87 326 9520",
      href: "tel:+258873269520",
    },
    {
      icon: Mail,
      label: "E-mail",
      value: "contacto@foodnect.app",
      href: "mailto:contacto@foodnect.app",
    },
    {
      icon: MapPin,
      label: "Localização",
      value: "Beira, Moçambique",
      href: "https://maps.app.goo.gl/",
    },
  ];

  const socialLinks: SocialLink[] = [
    { icon: Linkedin, label: "LinkedIn", href: "#" },
    { icon: Facebook, label: "Facebook", href: "#" },
    { icon: Instagram, label: "Instagram", href: "#" },
  ];

  return (
    <section
      id="contactos"
      className="border-b border-borderLight/30 bg-gradient-to-b from-backgroundLight via-white to-backgroundLight py-20 md:py-24 relative overflow-hidden scroll-mt-20"
    >
      <AnimatedBackground variant="gradient" intensity="light" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 space-y-10">
        {/* Título da página de contacto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-4">
            <MessageCircle className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-wide">
              Fala conosco
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-textPrimaryLight mb-2">
            Contacta a equipa Foodnect
          </h2>
          <p className="text-sm md:text-base text-textSecondaryLight max-w-2xl mx-auto">
            Tens dúvidas, sugestão, queres usar a Foodnect no teu estabelecimento
            ou propor uma parceria? Envia-nos uma mensagem rápida e respondemos
            por e-mail.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2 items-stretch">
          {/* Informações de Contacto */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="p-7 md:p-8 rounded-3xl bg-white/95 backdrop-blur-sm shadow-md" style={{ border: '2px solid #FF7A1A', boxShadow: '0 0 0 1px #FF7A1A inset' }}>
              <h3 className="text-lg md:text-xl font-bold text-textPrimaryLight mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5 text-[#FF7A1A]" />
                Fala conosco diretamente
              </h3>
              <p className="text-sm text-textSecondaryLight mb-4">
                Preferes não preencher o formulário? Usa um destes contactos
                diretos para falar conosco.
              </p>
              <div className="space-y-4">
                {contactInfo.map((info, idx) => (
                  <ContactInfoItem key={info.label} info={info} idx={idx} />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Redes Sociais */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            <div className="p-7 md:p-8 rounded-3xl bg-white/95 backdrop-blur-sm shadow-md text-center flex flex-col items-center gap-4" style={{ border: '2px solid #FF7A1A', boxShadow: '0 0 0 1px #FF7A1A inset' }}>
              <h3 className="text-lg md:text-xl font-bold text-textPrimaryLight mb-4 flex items-center justify-center gap-2">
                <Instagram className="h-5 w-5 text-[#FF7A1A]" />
                Redes sociais da Foodnect
              </h3>
              <p className="text-sm text-textSecondaryLight mb-2">
                Acompanha as novidades, campanhas e novos restaurantes que vão
                entrando para a plataforma – e muito mais.
              </p>
              {/* Botão destaque para WhatsApp centralizado */}
              <motion.a
                href="https://wa.me/258873269520?text=Olá,%20quero%20falar%20com%20a%20equipa%20Foodnect."
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-secondary via-green-500 to-secondary px-8 py-3 text-sm md:text-base font-semibold text-white shadow-lg hover:shadow-xl transition-all"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Falar conosco pelo WhatsApp</span>
              </motion.a>

              <div className="flex flex-wrap justify-center gap-3 mt-3">
                {socialLinks.map((social, idx) => (
                  <SocialIcon key={social.label} social={social} idx={idx} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}