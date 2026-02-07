"use client";

import { useState } from "react";
import { FloatingWhatsAppButton } from "@/components/FloatingWhatsAppButton";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { motion, AnimatePresence } from "framer-motion";
import { StoreBadge } from "@/components/StoreBadges";
import Image from "next/image";
import { Eye, CheckCircle2, Globe, Zap, MessageSquare, Building2, MapPin, HelpCircle, Smartphone, ArrowRight, TrendingUp, Users, Clock, DollarSign, ChevronDown, Quote, Star } from "lucide-react";

const BENEFITS = [
  {
    title: "Mais visibilidade local",
    description:
      "O teu restaurante aparece para pessoas que estão mesmo à procura de onde comer agora, perto de ti na Beira.",
    icon: Eye,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Clientes prontos para decidir",
    description:
      "Mostramos os Cardápios, preços e horário de funcionamento para que o cliente chegue já decidido.",
    icon: CheckCircle2,
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Presença digital sem complicação",
    description:
      "Seu estabelecimento digitalizado sem precisar de sites, nem aplicações próprias.",
    icon: Globe,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Recepção de pedidos em tempo real",
    description:
      "Recebe pedidos organizados, com detalhes claros e estado actualizado em poucos toques.",
    icon: Zap,
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Feedback direto dos clientes",
    description:
      "Saiba o que os seus clientes falam sobre o teu estabelecimento.",
    icon: MessageSquare,
    color: "from-indigo-500 to-blue-500",
  },
];

const B2B_TESTIMONIALS = [
  {
    restaurant: "Tudo Pago",
    comment:
      "Com a Foodnect começámos a receber clientes que não nos conheciam, principalmente ao almoço.",
    location: "Beira",
  },
  {
    restaurant: "Ki Sabor Schema",
    comment:
      "Ajudou-nos muito a mostrar o menu do dia, sem depender só da montra física.",
    location: "Beira",
  },
  {
    restaurant: "ADY Bolos",
    comment:
      "Aumentámos significativamente o número de pedidos, especialmente nos horários de pico. A plataforma é muito intuitiva.",
    location: "Beira",
  },
  {
    restaurant: "Ta Legal",
    comment:
      "A Foodnect trouxe-nos novos clientes e facilitou muito a gestão dos pedidos. Recomendamos a todos os restaurantes.",
    location: "Beira",
  },
];

const B2B_FAQ = [
  {
    question: "A Foodnect cobra comissão?",
    answer:
      "Actualmente a Foodnect e totalmente grátis. NOTA: em caso de de aplicação de algum modelo, os estabelecimentos parceiros serão avisados.",
    icon: DollarSign,
  },
  {
    question: "Como faço para cadastrar meu restaurante?",
    answer:
      "Clica em \"Fale Conosco\" e a nossa equipa entra em contacto para guia-lo no seu cadastro.",
    icon: Building2,
  },
  {
    question: "Preciso de equipamento especial?",
    answer:
      "Não. Actualmete com um smartphone android, tablet ou computador com acesso à internet já consegues receber e gerir os pedidos.",
    icon: Smartphone,
  },
];

export default function B2BPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="bg-backgroundLight pb-16">
      <FloatingWhatsAppButton />

      {/* Hero */}
      <section className="border-b border-borderLight/30 bg-gradient-to-br from-white via-backgroundLight to-white relative overflow-hidden">
        <AnimatedBackground variant="hero" intensity="light" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-12 px-4 pt-6 pb-20 md:flex-row md:items-center md:pt-8 md:pb-24 md:px-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-primary border border-primary/20">
              <Building2 className="h-4 w-4" />
              <span>Para Restaurantes na Beira, Moçambique</span>
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-bold tracking-tight text-textPrimaryLight md:text-5xl lg:text-6xl leading-tight"
            >
              <span className="text-[#FF9E3A]">Foodnect</span> o parceiro que faz o teu negócio{" "}
              <span className="text-gradient">vender mais.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl text-lg text-textSecondaryLight leading-relaxed"
            >
              Mais visibilidade, mais clientes, menos esforço. A Foodnect coloca
              o teu restaurante na frente de quem está pronto para decidir onde
              comer agora na Beira.
            </motion.p>
            
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-borderLight/30 shadow-md">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-textSecondaryLight">Crescimento</p>
                  <p className="text-sm font-bold text-textPrimaryLight">+30%</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-borderLight/30 shadow-md">
                <div className="p-2 rounded-lg bg-gradient-to-br from-secondary/20 to-secondary/10">
                  <Users className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-xs text-textSecondaryLight">Novos clientes</p>
                  <p className="text-sm font-bold text-textPrimaryLight">+50%</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-borderLight/30 shadow-md">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-textSecondaryLight">Tempo de setup</p>
                  <p className="text-sm font-bold text-textPrimaryLight">24h</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4"
            >
              <motion.a
                href="#baixar-estabelecimento"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(255, 122, 26, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-primary via-[#FF9E3A] to-primary px-6 py-3 text-sm font-bold text-white shadow-xl shadow-primary/40 transition-all duration-500 relative overflow-hidden"
              >
                <motion.div
                  animate={{ x: [0, 6, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  className="flex items-center gap-2 relative z-10"
              >
                <span>Quero a Foodnect no meu restaurante</span>
                <ArrowRight className="h-4 w-4" />
                </motion.div>
                <motion.div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/0 to-white/10"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.a>
              <span className="text-sm text-textSecondaryLight flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Resposta rápida via WhatsApp.
              </span>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
            className="flex-1 flex justify-center"
          >
            <div className="mx-auto h-[550px] w-[380px] md:h-[650px] md:w-[460px] relative">
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, -0.6, 0.6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.03, rotate: 0 }}
                className="will-change-transform relative h-full w-full"
              >
                <Image
                  src="/images/res2.png"
                  alt="Foodnect"
                  fill
                  sizes="(min-width: 768px) 460px, 380px"
                  priority
                  className="object-contain"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="border-b border-borderLight/30 bg-gradient-to-b from-backgroundLight to-white py-20 md:py-28 relative overflow-hidden">
        <AnimatedBackground variant="section" intensity="light" />
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-4">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-wide">Benefícios</span>
            </div>
            <h2 className="text-4xl font-bold text-textPrimaryLight md:text-5xl mb-4 leading-tight">
              Veja o que a <span className="text-[#FF9E3A]">Foodnect</span> traz de especial para o seu estabelecimento.
            </h2>
            <p className="max-w-3xl text-lg text-textSecondaryLight leading-relaxed">
              A Foodnect foi projectada para fazer crescer negocios que actuam no ramo gastronómico aqui no nosso País sem comprometer o fluxo actual de trabalho.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
            {BENEFITS.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <motion.article
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="p-6 group relative rounded-3xl border-2 border-[#FF7A1A] bg-white/95 backdrop-blur-sm shadow-md transition-all duration-300 hover:shadow-lg"
                  style={{ border: '2px solid #FF7A1A', boxShadow: '0 0 0 1px #FF7A1A inset' }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="mb-5 relative z-10"
                  >
                    <Icon className="h-8 w-8 text-[#FF7A1A]" />
                  </motion.div>
                  <h3 className="text-base font-bold text-textPrimaryLight mb-3 group-hover:text-[#FF7A1A] transition-colors relative z-10">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-textSecondaryLight leading-relaxed relative z-10">
                    {benefit.description}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Baixar App estabelecimento */}
      <section
        id="baixar-estabelecimento"
        className="border-b border-borderLight/30 bg-white py-20 md:py-28 relative overflow-hidden"
      >
        <AnimatedBackground variant="gradient" intensity="light" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-12 px-4 md:flex-row md:px-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FF7A1A]/10 to-[#FF9E3A]/10 border border-[#FF7A1A]/20 mb-4">
              <Smartphone className="h-4 w-4 text-[#FF7A1A]" />
              <span className="text-xs font-bold text-[#FF7A1A] uppercase tracking-wide">Download</span>
            </div>
            <h2 className="text-4xl font-bold text-textPrimaryLight md:text-5xl leading-tight">
              Começa hoje a faturar com a <span className="text-[#FF9E3A]">Foodnect</span>.
            </h2>
            <p className="text-lg text-textSecondaryLight leading-relaxed">
              Instala a app, fala com a nossa equipa e coloca o teu
              estabelecimento em destaque para clientes que estão prontos para
              decidir na Beira, Moçambique.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <StoreBadge variant="play" />
              <StoreBadge variant="app" disabled />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testemunhos B2B */}
      <section className="border-b border-borderLight/30 bg-gradient-to-b from-white via-backgroundLight to-white py-20 md:py-28 relative overflow-hidden">
        <AnimatedBackground variant="section" intensity="light" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-16"
          >
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FF7A1A]/10 to-[#FF9E3A]/10 border border-[#FF7A1A]/20 mb-4">
                <Star className="h-4 w-4 text-[#FF7A1A] fill-[#FF7A1A]" />
                <span className="text-xs font-bold text-[#FF7A1A] uppercase tracking-wide">Testemunhos</span>
              </div>
              <h2 className="text-4xl font-bold text-textPrimaryLight md:text-5xl mb-4 leading-tight">
                Veja quem já conta com a <span className="text-[#FF9E3A]">Foodnect</span> para fazer crescer o seu estabelecimento.
              </h2>
              <p className="text-lg text-textSecondaryLight leading-relaxed">
                Feedback real de restaurantes e lanchonetes que usam a Foodnect para aumentar
                a visibilidade e atrair mais clientes na Beira.
              </p>
            </div>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {B2B_TESTIMONIALS.map((testimonial, idx) => (
              <motion.article
                key={testimonial.restaurant}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="flex flex-col justify-between p-6 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-orange-50/30 to-white backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                style={{ border: '2px solid #FF7A1A', boxShadow: '0 0 0 1px #FF7A1A inset' }}
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-5">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="h-16 w-16 rounded-full bg-gradient-to-br from-[#FF7A1A] to-[#FF9E3A] flex items-center justify-center shadow-lg"
                      style={{ border: '2px solid #FF7A1A', boxShadow: '0 0 0 1px #FF7A1A inset' }}
                    >
                      <Building2 className="h-8 w-8 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-base font-bold text-textPrimaryLight group-hover:text-[#FF9E3A] transition-colors">
                        {testimonial.restaurant}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-textSecondaryLight">
                        <MapPin className="h-3 w-3" />
                        <span>{testimonial.location}, Moçambique</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative mb-4">
                    <Quote className="absolute -top-2 -left-2 h-8 w-8 text-[#FF7A1A]/40" />
                    <p className="text-sm leading-relaxed text-textSecondaryLight pl-6 relative z-10">
                      {testimonial.comment}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ B2B - mesmo estilo accordion da home */}
      <section className="bg-white py-20 md:py-28 relative overflow-hidden">
        <AnimatedBackground variant="gradient" intensity="light" />
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5" />
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
              Perguntas frequentes para restaurantes.
            </h2>
          </motion.div>
          <div className="space-y-3 max-w-4xl mx-auto">
            {B2B_FAQ.map((item, idx) => {
              const Icon = item.icon;
              const isOpen = openFaqIndex === idx;
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
                    onClick={() =>
                      setOpenFaqIndex(isOpen ? null : idx)
                    }
                    className="flex w-full items-center justify-between px-6 py-5 text-left transition-all hover:bg-[#FF7A1A]/5"
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`p-3 rounded-xl transition-all ${
                          isOpen
                            ? "bg-gradient-to-br from-[#FF7A1A] to-[#FF9E3A] shadow-lg"
                            : "bg-[#FF7A1A]/10 group-hover:bg-[#FF7A1A]/15"
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${isOpen ? "text-white" : "text-[#FF7A1A]"}`} />
                      </div>
                      <span
                        className={`text-base font-semibold transition-colors ${
                          isOpen ? "text-[#FF7A1A]" : "text-textPrimaryLight group-hover:text-[#FF7A1A]"
                        }`}
                      >
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
    </div>
  );
}
