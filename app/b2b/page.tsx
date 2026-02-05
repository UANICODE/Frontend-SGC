"use client";

import { useState } from "react";
import { FloatingWhatsAppButton } from "@/components/FloatingWhatsAppButton";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { motion, AnimatePresence } from "framer-motion";
import { StoreBadge } from "@/components/StoreBadges";
import { Eye, CheckCircle2, Globe, Zap, MessageSquare, Building2, MapPin, HelpCircle, Smartphone, ArrowRight, TrendingUp, Users, Clock, DollarSign, ChevronDown } from "lucide-react";

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
    restaurant: "Burger Spot",
    comment:
      "Com a Foodnect começámos a receber clientes que não nos conheciam, principalmente ao almoço.",
    location: "Beira",
  },
  {
    restaurant: "Café Central",
    comment:
      "Ajudou-nos muito a mostrar o menu de almoço do dia, sem depender só da montra física.",
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
      "Clica em \"Fale Connosco\" e a nossa equipa entra em contacto para guia-lo no seu cadastro.",
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
        <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-12 px-4 pt-20 pb-20 md:flex-row md:items-center md:pt-28 md:pb-28 md:px-6">
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
              <span className="text-primary">Foodnect</span> o parceiro que faz o teu negócio{" "}
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
            <div className="mx-auto h-[420px] max-w-sm rounded-3xl border-2 border-borderLight/30 bg-gradient-to-br from-backgroundDark via-zinc-900 to-backgroundDark p-5 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-50" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="h-4 w-4 text-textSecondaryDark" />
                  <p className="text-xs text-textSecondaryDark">
                    Vista para estabelecimentos
                  </p>
                </div>
                <p className="text-base font-bold mb-6">
                  Recebe e organiza pedidos num só ecrã.
                </p>
                <div className="mt-4 space-y-3 text-[11px]">
                  {["Novo pedido", "Em preparação", "Entregue"].map((status, i) => (
                    <motion.div
                      key={status}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      className="flex items-center justify-between rounded-xl bg-white/10 backdrop-blur-sm px-4 py-3 border border-white/10"
                    >
                      <div>
                        <p className="text-[12px] font-bold">
                          Pedido #{120 + i}
                        </p>
                        <p className="text-[10px] text-textSecondaryDark mt-1">
                          2x Cheeseburger • 1x Batata média
                        </p>
                      </div>
                      <span className="rounded-full bg-primary/80 px-3 py-1 text-[10px] font-semibold">
                        {status}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
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
              Veja o que a Foodnect traz de especial para o seu estabelecimento.
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
              Começa hoje a faturar com a Foodnect.
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
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 flex justify-center"
          >
            <div className="mx-auto h-[420px] w-[250px] rounded-[36px] border-2 border-borderLight/30 bg-white p-4 shadow-2xl md:h-[480px] md:w-[280px]">
              <div className="flex h-full flex-col rounded-[32px] bg-gradient-to-br from-backgroundLight via-white to-backgroundLight p-4 text-[11px]">
                <p className="text-[12px] font-bold text-textPrimaryLight mb-1 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#FF7A1A]" />
                  Painel do estabelecimento
                </p>
                <p className="text-[10px] text-textSecondaryLight mb-4">
                  Resumo do dia, pedidos e receita.
                </p>
                <div className="grid flex-1 grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-gradient-to-br from-white to-backgroundLight p-3 border border-borderLight/30 shadow-md">
                    <p className="text-[10px] text-textSecondaryLight mb-2 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Pedidos hoje
                    </p>
                    <p className="text-2xl font-bold text-[#FF7A1A]">32</p>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-white to-backgroundLight p-3 border border-borderLight/30 shadow-md">
                    <p className="text-[10px] text-textSecondaryLight mb-2 flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Receita
                    </p>
                    <p className="text-2xl font-bold text-secondary">€540</p>
                  </div>
                  <div className="col-span-2 rounded-2xl bg-gradient-to-br from-white to-backgroundLight p-3 border border-borderLight/30 shadow-md">
                    <p className="text-[10px] text-textSecondaryLight mb-2 flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      Pedidos em fila
                    </p>
                    <p className="text-[10px] text-textPrimaryLight font-semibold mb-3">
                      #132 2x Menu Duplo • 1x Refrigerante
                    </p>
                    <div className="flex gap-2 text-[10px]">
                      <span className="flex-1 rounded-full bg-gradient-to-r from-[#FF7A1A] to-[#FF9E3A] px-3 py-2 text-center font-bold text-white shadow-md">
                        Aceitar
                      </span>
                      <span className="flex-1 rounded-full border-2 border-borderLight px-3 py-2 text-center font-semibold text-textSecondaryLight">
                        Ver detalhes
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testemunhos B2B */}
      <section className="border-b border-borderLight/30 bg-gradient-to-b from-backgroundLight to-white py-20 md:py-28 relative overflow-hidden">
        <AnimatedBackground variant="section" intensity="light" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-textPrimaryLight md:text-5xl mb-16"
          >
            O que dizem os que ja contam com a Foodnect para o crescimento do seu negócio.
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            {B2B_TESTIMONIALS.map((t, idx) => (
              <motion.article
                key={t.restaurant}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="p-6 group relative rounded-3xl border-2 border-[#FF7A1A] bg-white/95 backdrop-blur-sm shadow-md transition-all duration-300 hover:shadow-lg"
                style={{ border: '2px solid #FF7A1A', boxShadow: '0 0 0 1px #FF7A1A inset' }}
              >
                <div className="flex items-center gap-4 mb-5">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="h-16 w-16 rounded-full bg-gradient-to-br from-[#FF7A1A]/20 via-[#FF9E3A]/20 to-[#FF7A1A]/20 flex items-center justify-center text-xl font-bold text-[#FF7A1A] border-2 border-[#FF7A1A]/20 group-hover:border-[#FF7A1A]/40 transition-all shadow-lg"
                  >
                    <Building2 className="h-8 w-8" />
                  </motion.div>
                  <div>
                    <p className="text-base font-bold text-textPrimaryLight group-hover:text-[#FF7A1A] transition-colors">
                      {t.restaurant}
                    </p>
                    <p className="text-xs text-textSecondaryLight mb-1">Parceiro Foodnect</p>
                    <div className="flex items-center gap-1 text-[10px] text-textSecondaryLight">
                      <MapPin className="h-3 w-3" />
                      <span>{t.location}, Moçambique</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-textSecondaryLight relative z-10">
                  "{t.comment}"
                </p>
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
