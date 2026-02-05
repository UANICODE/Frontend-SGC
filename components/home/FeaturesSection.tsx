"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { List, MapPin, BookOpen, ShoppingCart, Package, CheckCircle2, ArrowRight } from "lucide-react";

const FEATURES = [
  {
    id: "lista",
    title: "Decide onde comer em segundos",
    subtitle: "Lista de restaurantes",
    description:
      "Vê uma lista clara de restaurantes e snack-bares perto de ti na Beira, com avaliação e tempo médio.",
    icon: List,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "mapa",
    title: "Vê restaurantes perto de ti",
    subtitle: "Mapa / localização",
    description:
      "Explora no mapa quais opções estão mais perto, ideal para quem não quer andar muito.",
    icon: MapPin,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "cardapio",
    title: "Consulta cardápios e preços reais",
    subtitle: "Cardápio detalhado",
    description:
      "Cardápios reais, com fotos, preços e categorias sem surpresas na hora de pagar.",
    icon: BookOpen,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "pedido",
    title: "Entrega ou retirada? Tu escolhes",
    subtitle: "Opções de pedido",
    description:
      "Escolhe se quer receber em casa ou levantar no balcão, sempre com informação clara de tempo e taxa.",
    icon: ShoppingCart,
    color: "from-orange-500 to-red-500",
  },
  {
    id: "tracking",
    title: "Acompanha o estado do teu pedido",
    subtitle: "Status / rastreamento",
    description:
      "Segue o pedido em tempo real: aceite, em preparação, a caminho e entregue.",
    icon: Package,
    color: "from-indigo-500 to-blue-500",
  },
];

export function FeaturesSection() {
  const [index, setIndex] = useState(0);

  // Troca automática de funcionalidade e imagem a cada 2 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % FEATURES.length);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const current = FEATURES[index];

  return (
    <section className="border-b border-borderLight/30 bg-gradient-to-b from-backgroundLight via-white to-backgroundLight py-20 md:py-28 relative overflow-hidden">
      <AnimatedBackground variant="section" intensity="light" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-4">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-wide">O que a Foodnect oferece para si</span>
          </div>
          <h2 className="text-4xl font-bold text-textPrimaryLight md:text-5xl mb-4 leading-tight">
            Tudo o que precisas para decidir e pedir em segundos.
          </h2>
          <p className="text-lg text-textSecondaryLight leading-relaxed">
            A Foodnect junta descoberta de restaurantes e lanchonetes, cardápios reais,
            pedidos e rastreamento em tempo real num único lugar. Tu só deslizas, escolhes e
            confirmas.
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Card único com o conteúdo da funcionalidade atual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
                  <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-[92%] sm:w-full
max-w-sm md:max-w-lg lg:max-w-xl
mx-auto
rounded-3xl
bg-gradient-to-br from-white via-orange-50/30 to-white
backdrop-blur-sm
shadow-lg hover:shadow-2xl
transition-all duration-500
p-3 md:p-9"
              style={{ border: '2px solid #FF7A1A', boxShadow: '0 0 0 1px #FF7A1A inset' }}
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  <div className={`p-2.5 md:p-3.5 rounded-xl bg-gradient-to-br ${current.color} shadow-md`}>
                    <current.icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase text-[#FF7A1A] tracking-wide">
                    {current.subtitle}
                        </p>
                  <h3 className="text-lg md:text-2xl font-bold text-textPrimaryLight">
                    {current.title}
                  </h3>
                  <p className="text-xs md:text-base text-textSecondaryLight leading-relaxed">
                    {current.description}
                  </p>
                      </div>
                    </div>
                    </motion.div>
          </motion.div>

          {/* Phone Mockup sincronizado com o texto */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
        >
          <div className="relative mx-auto h-[420px] w-[250px] md:h-[500px] md:w-[280px] lg:h-[520px] lg:w-[300px]">
            <motion.div
              animate={{
                rotate: [0, 2, -2, 0],
                scale: [1, 1.02, 1],
                opacity: [0.6, 0.8, 0.6],
              }}
              transition={{
                rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute inset-0 translate-x-6 translate-y-6 rounded-[36px] border-2 border-borderLight/30 bg-gradient-to-br from-white/80 to-backgroundLight/80 shadow-2xl backdrop-blur-sm"
            />
              <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                  initial={{ opacity: 0, y: 20, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.96 }}
                  transition={{ duration: 0.4 }}
                className="absolute inset-0 rounded-[36px] border-2 border-borderLight/50 bg-white shadow-2xl"
              >
                <div className="flex h-full flex-col rounded-[32px] bg-backgroundLight p-4">
                  <div className="mb-3 flex items-center justify-between text-[11px] text-textSecondaryLight">
                    <span className="font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#FF7A1A]" />
                      Foodnect
                    </span>
                    <span className="text-[#FF7A1A] font-semibold">{current.subtitle}</span>
                  </div>
                  {current.id === "lista" && <ListScreen />}
                  {current.id === "mapa" && <MapScreen />}
                  {current.id === "cardapio" && <MenuScreen />}
                  {current.id === "pedido" && <OrderOptionsScreen />}
                  {current.id === "tracking" && <TrackingScreen />}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
        </div>
      </div>
    </section>
  );
}

function ListScreen() {
  return (
    <div className="mt-2 flex-1 rounded-2xl bg-white p-2 text-[10px] overflow-hidden">
      <motion.div
        whileHover={{ scale: 1.03, rotate: -1 }}
        whileTap={{ scale: 0.98, rotate: 1 }}
        className="relative h-full w-full overflow-hidden rounded-xl bg-backgroundLight cursor-pointer"
      >
        <motion.div
          className="absolute inset-2 rounded-xl bg-gradient-to-br from-[#FF7A1A]/10 via-transparent to-[#FF9E3A]/10"
          style={{ mixBlendMode: "soft-light" }}
          aria-hidden="true"
        />
        <Image
          src="/images/app.jpeg"
          alt="Lista de restaurantes na app Foodnect"
          fill
          sizes="250px"
          className="object-cover transition-transform duration-300"
        />
        <motion.div
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute inset-x-2 bottom-2 flex items-center justify-between rounded-full bg-gradient-to-r from-[#FF7A1A]/90 to-[#FF9E3A]/90 backdrop-blur-md px-4 py-2.5 text-[10px] text-white shadow-xl border border-white/20"
        >
          <span className="font-bold">Restaurantes perto de ti</span>
          <span className="text-white font-bold flex items-center gap-1">
            Ver todos
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight className="h-3 w-3" />
            </motion.div>
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}

function MapScreen() {
  return (
    <div className="mt-2 flex-1 rounded-2xl bg-white p-2 text-[10px] overflow-hidden">
      <motion.div
        whileHover={{ scale: 1.03, rotate: -1 }}
        whileTap={{ scale: 0.98, rotate: 1 }}
        className="relative h-full w-full overflow-hidden rounded-xl bg-backgroundLight cursor-pointer"
      >
        <motion.div
          className="absolute inset-2 rounded-xl bg-gradient-to-br from-[#FF7A1A]/10 via-transparent to-[#FF9E3A]/10"
          style={{ mixBlendMode: "soft-light" }}
          aria-hidden="true"
        />
        <Image
          src="/images/app4.jpeg"
          alt="Mapa de restaurantes na app Foodnect"
          fill
          sizes="250px"
          className="object-cover transition-transform duration-300"
        />
        <div className="pointer-events-none absolute inset-x-2 bottom-2 flex items-center justify-between rounded-full bg-gradient-to-r from-[#FF7A1A]/90 to-[#FF9E3A]/90 backdrop-blur-md px-4 py-2.5 text-[10px] text-white shadow-xl border border-white/20">
          <span className="font-bold">Restaurantes perto de ti</span>
          <span className="text-white font-bold flex items-center gap-1">
            500 m
            <MapPin className="h-3 w-3" />
          </span>
        </div>
      </motion.div>
    </div>
  );
}

function MenuScreen() {
  return (
    <div className="mt-2 flex-1 rounded-2xl bg-white p-2 text-[10px] overflow-hidden">
      <motion.div
        whileHover={{ scale: 1.03, rotate: -1 }}
        whileTap={{ scale: 0.98, rotate: 1 }}
        className="relative h-full w-full overflow-hidden rounded-xl bg-backgroundLight cursor-pointer"
      >
        <motion.div
          className="absolute inset-2 rounded-xl bg-gradient-to-br from-[#FF7A1A]/10 via-transparent to-[#FF9E3A]/10"
          style={{ mixBlendMode: "soft-light" }}
          aria-hidden="true"
        />
        <Image
          src="/images/app2.jpeg"
          alt="Cardápio de restaurante na app Foodnect"
          fill
          sizes="250px"
          className="object-cover transition-transform duration-300"
        />
        <div className="pointer-events-none absolute inset-x-2 bottom-2 flex items-center justify-between rounded-full bg-gradient-to-r from-[#FF7A1A]/90 to-[#FF9E3A]/90 backdrop-blur-md px-4 py-2.5 text-[10px] text-white shadow-xl border border-white/20">
          <span className="font-bold flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            Cardápio
          </span>
          <span className="text-white font-bold flex items-center gap-1">
            Ver mais
            <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </motion.div>
    </div>
  );
}

function OrderOptionsScreen() {
  return (
    <div className="mt-2 flex-1 rounded-2xl bg-white p-2 text-[10px] overflow-hidden">
      <motion.div
        whileHover={{ scale: 1.03, rotate: -1 }}
        whileTap={{ scale: 0.98, rotate: 1 }}
        className="relative h-full w-full overflow-hidden rounded-xl bg-backgroundLight cursor-pointer"
      >
        <motion.div
          className="absolute inset-2 rounded-xl bg-gradient-to-br from-[#FF7A1A]/10 via-transparent to-[#FF9E3A]/10"
          style={{ mixBlendMode: "soft-light" }}
          aria-hidden="true"
        />
        <Image
          src="/images/app4.jpeg"
          alt="Opções de pedido na app Foodnect"
          fill
          sizes="250px"
          className="object-cover transition-transform duration-300"
        />
        <div className="pointer-events-none absolute inset-x-2 bottom-2 flex items-center justify-between rounded-full bg-gradient-to-r from-[#FF7A1A]/90 to-[#FF9E3A]/90 backdrop-blur-md px-4 py-2.5 text-[10px] text-white shadow-xl border border-white/20">
          <span className="font-bold flex items-center gap-1">
            <ShoppingCart className="h-3 w-3" />
            Opções de pedido
          </span>
          <span className="text-white font-bold flex items-center gap-1">
            Escolher
            <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </motion.div>
    </div>
  );
}

function TrackingScreen() {
  return (
    <div className="mt-2 flex-1 rounded-2xl bg-white p-2 text-[10px] overflow-hidden">
      <motion.div
        whileHover={{ scale: 1.03, rotate: -1 }}
        whileTap={{ scale: 0.98, rotate: 1 }}
        className="relative h-full w-full overflow-hidden rounded-xl bg-backgroundLight cursor-pointer"
      >
        <motion.div
          className="absolute inset-2 rounded-xl bg-gradient-to-br from-[#FF7A1A]/10 via-transparent to-[#FF9E3A]/10"
          style={{ mixBlendMode: "soft-light" }}
          aria-hidden="true"
        />
        <Image
          src="/images/app3.jpeg"
          alt="Rastreamento de pedido na app Foodnect"
          fill
          sizes="250px"
          className="object-cover transition-transform duration-300"
        />
        <div className="pointer-events-none absolute inset-x-2 bottom-2 flex items-center justify-between rounded-full bg-gradient-to-r from-[#FF7A1A]/90 to-[#FF9E3A]/90 backdrop-blur-md px-4 py-2.5 text-[10px] text-white shadow-xl border border-white/20">
          <span className="font-bold flex items-center gap-1">
            <Package className="h-3 w-3" />
            Acompanhar pedido
          </span>
          <span className="text-white font-bold">6 min</span>
        </div>
      </motion.div>
    </div>
  );
}
