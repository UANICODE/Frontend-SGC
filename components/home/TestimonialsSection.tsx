"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star, Quote, MapPin, ExternalLink } from "lucide-react";
import { AnimatedBackground } from "@/components/AnimatedBackground";

interface Testimonial {
  name: string;
  role: string;
  rating: number;
  comment: string;
  location: string;
  image?: string;
  source?: "manual" | "google";
  googleReviewUrl?: string;
  date?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Adriana Johane",
    role: "Utilizador Foodnect",
    rating: 5,
    comment:
      "Eu uso frequentemente a foodnect e ela ta me ajudando muito a descobrir lugares quando estou com fome e ate a fazer pedidos diretamente. Eu recomendo a foodnect",
    location: "Beira",
    image: "",
    source: "manual",
  },
  {
    name: "Rachid",
    role: "Utilizador Foodnect",
    rating: 4,
    comment:
      "Uso sempre que saio do trabalho. Vejo logo o que está aberto perto de mim e quanto vou gastar.",
    location: "Beira",
    image: "/images/rachid.jpeg",
    source: "manual",
  },
  {
    name: "Zeca Sati",
    role: "Utilizador Foodnect",
    rating: 5,
    comment:
      "Gosto de ver o cardápio antes de sair de casa. A app é simples e rápida, não complica.",
    location: "Beira",
    image: "/images/zeca.png",
    source: "manual",
  },
  // ============================================
  // COMO ADICIONAR TESTEMUNHOS DO GOOGLE:
  // ============================================
  // 
  // 1. Vá ao Google Maps e encontre o seu negócio
  // 2. Clique em "Reviews" ou "Avaliações"
  // 3. Encontre o review que quer adicionar
  // 4. Clique com botão direito no review e "Copiar link" ou pegue a URL
  // 5. Copie o nome do cliente, comentário e rating
  // 6. Adicione no array abaixo seguindo este formato:
  //
  // {
  //   name: "Nome Completo do Cliente",        // Nome que aparece no Google
  //   role: "Cliente Google",                  // Sempre "Cliente Google"
  //   rating: 5,                                // 1 a 5 estrelas
  //   comment: "Texto completo do comentário...", // Comentário exato do Google
  //   location: "Beira",                        // Localização
  //   source: "google",                         // Sempre "google"
  //   googleReviewUrl: "https://g.page/r/...", // URL completa do review (opcional mas recomendado)
  //   date: "Há 2 semanas",                    // Quando foi feito (opcional)
  // },
  //
  // EXEMPLO REAL:
  // {
  //   name: "Maria Silva",
  //   role: "Cliente Google",
  //   rating: 5,
  //   comment: "Excelente aplicação! Encontrei vários restaurantes perto de mim.",
  //   location: "Beira",
  //   source: "google",
  //   googleReviewUrl: "https://g.page/r/ABC123XYZ/review",
  //   date: "Há 1 semana",
  // },
  //
  // NOTA: Não precisa adicionar imagem - o sistema gera automaticamente um avatar
  // com a inicial do nome em um gradiente laranja/verde.
  // ============================================
];

export function TestimonialsSection() {
  return (
    <section id="testemunhos" className="border-b border-borderLight/30 bg-gradient-to-b from-white via-backgroundLight to-white py-20 md:py-28 relative overflow-hidden scroll-mt-20">
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
              Veja alguns clientes que ja contam com a <span className="text-[#FF9E3A]">Foodnect</span> no seu dia a dia
            </h2>
            <p className="text-lg text-textSecondaryLight leading-relaxed">
              Feedback real de pessoas que usam a app para decidir mais rápido
              onde comer na cidade da Beira.
            </p>
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, idx) => (
            <motion.article
              key={`${t.name}-${idx}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="flex flex-col justify-between p-6 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-orange-50/30 to-white backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              style={{ border: '2px solid #FF7A1A', boxShadow: '0 0 0 1px #FF7A1A inset' }}
            >
              {/* Borda laranja suave sem glow forte */}
              {/* Badge Google Reviews */}
              {t.source === "google" && (
                <div className="absolute top-4 right-4 z-20">
                  <motion.a
                    href={t.googleReviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FF7A1A] to-[#FF9E3A] text-white text-[10px] font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span>Google</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </motion.a>
                </div>
              )}
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-5">
                  {t.image ? (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="relative h-16 w-16 rounded-full overflow-hidden shadow-lg"
                      style={{ border: '2px solid #FF7A1A', boxShadow: '0 0 0 1px #FF7A1A inset' }}
                    >
                      <Image
                        src={t.image}
                        alt={t.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="h-16 w-16 rounded-full bg-gradient-to-br from-[#FF7A1A] to-[#FF9E3A] flex items-center justify-center shadow-lg"
                      style={{ border: '2px solid #FF7A1A', boxShadow: '0 0 0 1px #FF7A1A inset' }}
                    >
                      <span className="text-xl font-bold text-white">
                        {t.name.charAt(0).toUpperCase()}
                      </span>
                    </motion.div>
                  )}
                  <div className="flex-1">
                    <p className="text-base font-bold text-textPrimaryLight group-hover:text-[#FF9E3A] transition-colors">
                      {t.name}
                    </p>
                    <p className="text-xs text-textSecondaryLight mb-1">{t.role}</p>
                    <div className="flex items-center gap-1 text-[10px] text-textSecondaryLight">
                      <MapPin className="h-3 w-3" />
                      <span>{t.location}, Moçambique</span>
                      {t.date && <span className="ml-2">• {t.date}</span>}
                    </div>
                  </div>
                </div>
                
                <div className="relative mb-4">
                  <Quote className="absolute -top-2 -left-2 h-8 w-8 text-[#FF7A1A]/40" />
                  <p className="text-sm leading-relaxed text-textSecondaryLight pl-6 relative z-10">
                    {t.comment}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 + i * 0.05 }}
                        whileHover={{ scale: 1.2, rotate: 10 }}
                      >
                        <Star
                          className={`h-5 w-5 ${
                            i < t.rating
                              ? "text-[#FF7A1A] fill-[#FF7A1A] drop-shadow-sm"
                              : "text-backgroundSkeleton"
                          } transition-all`}
                        />
                      </motion.div>
                    ))}
                    <span className="ml-2 text-xs font-bold text-textSecondaryLight">
                      {t.rating}.0
                    </span>
                  </div>
                  {t.source === "google" && t.googleReviewUrl && (
                    <motion.a
                      href={t.googleReviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      className="text-[10px] text-[#FF9E3A] hover:text-[#FF7A1A] font-semibold transition-colors flex items-center gap-1"
                    >
                      Ver no Google
                      <ExternalLink className="h-3 w-3" />
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
