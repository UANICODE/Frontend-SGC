
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  Building2,
  ShoppingCart,
  Package,
  WalletCards,
  Users,
  ShieldCheck,
  Activity,
  ChevronRight,
} from "lucide-react";

import Logo from "@/public/image/logo.png";

export default function HomePage() {
  const mainRef = useRef<HTMLElement>(null);

  const [cursorLight, setCursorLight] = useState({
    x: 0,
    y: 0,
  });

  const [isCursorInside, setIsCursorInside] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!mainRef.current) return;

    const rect = mainRef.current.getBoundingClientRect();

    setCursorLight({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const modules = [
    {
      icon: ShoppingCart,
      title: "Vendas",
      description: "Operações de venda",
      href: "/auth",
    },
    {
      icon: Package,
      title: "Stock",
      description: "Produtos e inventário",
      href: "/auth",
    },
    {
      icon: WalletCards,
      title: "Caixa",
      description: "Movimentos financeiros",
      href: "/auth",
    },
    {
      icon: BarChart3,
      title: "Relatórios",
      description: "Dados e desempenho",
      href: "/auth",
    },
    {
      icon: Building2,
      title: "Estabelecimentos",
      description: "Gestão centralizada de multiplos estabelecimentos",
      href: "/auth",
    },
    {
      icon: Users,
      title: "Utilizadores",
      description: "Acessos e permissões",
      href: "/auth",
    },
  ];

  return (
    <>
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(25px, -22px, 0);
          }
        }

        @keyframes floatReverse {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(-30px, 20px, 0);
          }
        }

        @keyframes pulseSoft {
          0%,
          100% {
            opacity: 0.2;
          }

          50% {
            opacity: 0.45;
          }
        }

        @keyframes reveal {
          from {
            opacity: 0;
            transform: translateY(20px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes revealScale {
          from {
            opacity: 0;
            transform: scale(0.97) translateY(15px);
          }

          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes blink {
          0%,
          100% {
            opacity: 0.35;
          }

          50% {
            opacity: 1;
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .home-reveal {
          animation: reveal 0.75s ease-out both;
        }

        .home-reveal-delay-1 {
          animation: reveal 0.75s 0.1s ease-out both;
        }

        .home-reveal-delay-2 {
          animation: reveal 0.75s 0.2s ease-out both;
        }

        .home-reveal-delay-3 {
          animation: reveal 0.75s 0.3s ease-out both;
        }

        .home-scale {
          animation: revealScale 0.8s 0.15s ease-out both;
        }

        .orb-one {
          animation: float 12s ease-in-out infinite;
        }

        .orb-two {
          animation: floatReverse 15s ease-in-out infinite;
        }

        .pulse-soft {
          animation: pulseSoft 5s ease-in-out infinite;
        }

        .blink {
          animation: blink 2s ease-in-out infinite;
        }

        .tech-grid {
          background-image:
            linear-gradient(
              rgba(255, 255, 255, 0.065) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.065) 1px,
              transparent 1px
            );

          background-size: 48px 48px;

          mask-image: linear-gradient(
            to bottom,
            black 0%,
            black 60%,
            transparent 100%
          );

          -webkit-mask-image: linear-gradient(
            to bottom,
            black 0%,
            black 60%,
            transparent 100%
          );
        }

        .flashlight {
          position: absolute;
          inset: 0;
          z-index: 4;
          pointer-events: none;
          opacity: 0;

          transition: opacity 0.35s ease;

          background: radial-gradient(
            430px circle at var(--cursor-x) var(--cursor-y),
            rgba(255, 255, 255, 0.095) 0%,
            rgba(255, 255, 255, 0.045) 18%,
            rgba(255, 255, 255, 0.018) 34%,
            transparent 62%
          );
        }

        .flashlight.active {
          opacity: 1;
        }

        .flashlight-core {
          position: absolute;

          left: var(--cursor-x);
          top: var(--cursor-y);

          width: 155px;
          height: 155px;

          transform: translate(-50%, -50%);

          border-radius: 999px;

          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.035) 28%,
            transparent 68%
          );

          filter: blur(2px);

          transition:
            left 0.08s ease-out,
            top 0.08s ease-out;
        }

        .flashlight-grid {
          position: absolute;
          inset: 0;

          opacity: 0;

          transition: opacity 0.35s ease;

          background:
            radial-gradient(
              380px circle at var(--cursor-x) var(--cursor-y),
              rgba(255, 255, 255, 0.18),
              transparent 70%
            ),
            linear-gradient(
              rgba(255, 255, 255, 0.09) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.09) 1px,
              transparent 1px
            );

          background-size:
            auto,
            48px 48px,
            48px 48px;

          -webkit-mask-image: radial-gradient(
            390px circle at var(--cursor-x) var(--cursor-y),
            black 0%,
            transparent 72%
          );

          mask-image: radial-gradient(
            390px circle at var(--cursor-x) var(--cursor-y),
            black 0%,
            transparent 72%
          );
        }

        .flashlight-grid.active {
          opacity: 1;
        }

        .star {
          position: absolute;

          width: 2px;
          height: 2px;

          border-radius: 999px;

          background: rgba(255, 255, 255, 0.55);

          box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
        }

        .module-card {
          position: relative;
          overflow: hidden;

          transition:
            transform 0.35s ease,
            border-color 0.35s ease,
            background 0.35s ease,
            box-shadow 0.35s ease;
        }

        .module-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.14);
          background: rgba(255, 255, 255, 0.055);

          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        .module-card::before {
          content: "";

          position: absolute;
          inset: 0;

          opacity: 0;

          background: radial-gradient(
            250px circle at 50% 0%,
            rgba(6, 182, 212, 0.08),
            transparent 65%
          );

          transition: opacity 0.35s ease;

          pointer-events: none;
        }

        .module-card:hover::before {
          opacity: 1;
        }

        .module-icon {
          transition:
            transform 0.35s ease,
            background 0.35s ease;
        }

        .module-card:hover .module-icon {
          transform: scale(1.06);
          background: rgba(255, 255, 255, 0.08);
        }
      `}</style>

      <main
        ref={mainRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsCursorInside(true)}
        onMouseLeave={() => setIsCursorInside(false)}
        className="relative min-h-screen overflow-hidden bg-[#050505] text-white"
      >
        {/* ========================================================= */}
        {/* BACKGROUND */}
        {/* ========================================================= */}

        <div className="pointer-events-none absolute inset-0">
          {/* Grid */}
          <div className="tech-grid absolute inset-0 opacity-80" />

          {/* Cursor flashlight */}
          <div
            className={`flashlight ${
              isCursorInside ? "active" : ""
            }`}
            style={
              {
                "--cursor-x": `${cursorLight.x}px`,
                "--cursor-y": `${cursorLight.y}px`,
              } as React.CSSProperties
            }
          >
            <div className="flashlight-core" />
          </div>

          <div
            className={`flashlight-grid ${
              isCursorInside ? "active" : ""
            }`}
            style={
              {
                "--cursor-x": `${cursorLight.x}px`,
                "--cursor-y": `${cursorLight.y}px`,
              } as React.CSSProperties
            }
          />

          {/* Ambient lights */}
          <div className="orb-one absolute -left-48 -top-48 h-[600px] w-[600px] rounded-full bg-cyan-500/[0.055] blur-[120px]" />

          <div className="orb-two absolute -bottom-56 -right-48 h-[620px] w-[620px] rounded-full bg-blue-600/[0.065] blur-[130px]" />

          <div className="pulse-soft absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/[0.035] blur-[120px]" />

          {/* Stars */}
          <span className="star left-[9%] top-[17%]" />
          <span className="star left-[19%] top-[31%] opacity-40" />
          <span className="star left-[31%] top-[12%] opacity-50" />
          <span className="star left-[48%] top-[19%] opacity-30" />
          <span className="star left-[67%] top-[12%]" />
          <span className="star left-[83%] top-[25%] opacity-40" />
          <span className="star left-[91%] top-[65%]" />
          <span className="star left-[74%] top-[83%]" />
          <span className="star left-[23%] top-[86%]" />
          <span className="star left-[46%] top-[91%]" />
        </div>

        {/* ========================================================= */}
        {/* CONTENT */}
        {/* ========================================================= */}

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1280px] flex-col px-5 py-6 sm:px-8 lg:px-12">
          {/* ======================================================= */}
          {/* TOP BAR */}
          {/* ======================================================= */}

          <header className="home-reveal flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.09] bg-white/[0.035] shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-all duration-300 group-hover:border-white/[0.15] group-hover:bg-white/[0.055]">
                <Image
                  src={Logo}
                  alt="SGC"
                  width={100}
                  height={42}
                  className="h-auto max-h-7 w-auto object-contain opacity-90"
                />
              </div>

              <div>
                <p className="text-sm font-medium tracking-[0.2em] text-white/80">
                  SGC
                </p>

                <p className="text-[9px] uppercase tracking-[0.2em] text-white/25">
                  Gestão Comercial
                </p>
              </div>
            </Link>

            {/* System Status */}
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-2 sm:flex">
                <span className="blink h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />

                <span className="text-[9px] uppercase tracking-[0.18em] text-white/30">
                  Online
                </span>
              </div>

              <Link
                href="/auth"
                className="group flex items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.045] px-4 py-2.5 text-xs font-medium text-white/65 transition-all duration-300 hover:border-white/[0.16] hover:bg-white/[0.075] hover:text-white"
              >
                Entrar

                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </header>

          {/* ======================================================= */}
          {/* MAIN */}
          {/* ======================================================= */}

          <div className="flex flex-1 items-center justify-center py-14 lg:py-10">
            <div className="w-full">
              {/* Intro */}
              <section className="home-reveal-delay-1 mx-auto mb-10 max-w-3xl text-center">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3.5 py-2">
                  <Building2 className="h-3.5 w-3.5 text-cyan-300/50" />

                  <span className="text-[9px] uppercase tracking-[0.25em] text-white/30">
                    Sistema de Gestão Comercial
                  </span>
                </div>

                <h1 className="text-[clamp(2.8rem,6vw,5.5rem)] font-light leading-[0.95] tracking-[-0.055em] text-white">
                  O sistema que evoluí com o seu negócio!
           
                </h1>

            
              </section>

              {/* =================================================== */}
              {/* SYSTEM PANEL */}
              {/* =================================================== */}

              <section className="home-scale mx-auto w-full max-w-[980px]">
                <div className="relative">
                  {/* Outer glow */}
                  <div className="absolute -inset-px rounded-[30px] bg-gradient-to-b from-white/[0.10] via-white/[0.025] to-transparent" />

                  <div className="relative rounded-[30px] border border-white/[0.08] bg-white/[0.025] p-4 shadow-[0_35px_100px_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:p-6 lg:p-7">
                    {/* Panel header */}
                    <div className="mb-5 flex items-center justify-between border-b border-white/[0.06] pb-5">
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.24em] text-white/25">
                          Área principal
                        </p>

                        <h2 className="mt-1 text-lg font-light tracking-[-0.02em] text-white/80">
                          Aceder ao sistema
                        </h2>
                      </div>

                      <div className="hidden items-center gap-2 sm:flex">
                        <ShieldCheck className="h-4 w-4 text-white/25" />

                        <span className="text-[9px] uppercase tracking-[0.16em] text-white/25">
                          Ambiente protegido
                        </span>
                      </div>
                    </div>

                    {/* ================================================= */}
                    {/* MODULES */}
                    {/* ================================================= */}

                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                      {modules.map((module, index) => {
                        const Icon = module.icon;

                        return (
                          <Link
                            key={module.title}
                            href={module.href}
                            className="module-card group rounded-2xl border border-white/[0.065] bg-black/20 p-4 sm:p-5"
                            style={{
                              animationDelay: `${index * 0.05}s`,
                            }}
                          >
                            <div className="relative z-10">
                              <div className="module-icon mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035]">
                                <Icon className="h-[18px] w-[18px] text-white/45 transition-colors duration-300 group-hover:text-cyan-200/70" />
                              </div>

                              <div className="flex items-end justify-between gap-2">
                                <div>
                                  <h3 className="text-sm font-medium text-white/70 transition-colors duration-300 group-hover:text-white/90">
                                    {module.title}
                                  </h3>

                                  <p className="mt-1 text-[10px] leading-4 text-white/25">
                                    {module.description}
                                  </p>
                                </div>

                                <ChevronRight className="mb-0.5 h-3.5 w-3.5 shrink-0 text-white/15 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-white/50" />
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    {/* ================================================= */}
                    {/* BOTTOM ACTION */}
                    {/* ================================================= */}

                    <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
                      {/* Info */}
                      <div className="flex items-center gap-3 rounded-2xl border border-white/[0.055] bg-black/15 px-4 py-3.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.035]">
                          <Activity className="h-4 w-4 text-emerald-300/45" />
                        </div>

                        <div>
                          <p className="text-[9px] uppercase tracking-[0.18em] text-white/20">
                            Estado
                          </p>

                          <p className="mt-0.5 text-xs text-white/45">
                            Todos os serviços funcionando normalmente
                          </p>
                        </div>

                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400/60 shadow-[0_0_10px_rgba(52,211,153,0.45)]" />
                      </div>

                      {/* Main button */}
                      <Link
                        href="/auth"
                        className="group flex min-h-[58px] items-center justify-between gap-8 rounded-2xl bg-white px-5 text-sm font-medium text-black transition-all duration-300 hover:bg-white/90 hover:shadow-[0_15px_50px_rgba(255,255,255,0.08)]"
                      >
                        <span>Entrar no sistema</span>

                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/[0.07] transition-transform duration-300 group-hover:translate-x-0.5">
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </section>

              {/* =================================================== */}
              {/* BOTTOM INFO */}
              {/* =================================================== */}

              <section className="home-reveal-delay-3 mx-auto mt-8 flex max-w-[980px] flex-col items-center justify-between gap-3 text-[9px] uppercase tracking-[0.18em] text-white/20 sm:flex-row">
                <div className="flex items-center gap-3">
                  <span>Vendas</span>

                  <span className="h-px w-5 bg-white/[0.08]" />

                  <span>Stock</span>

                  <span className="h-px w-5 bg-white/[0.08]" />

                  <span>Caixa</span>

                  <span className="h-px w-5 bg-white/[0.08]" />

                  <span>Dados</span>

                <span className="h-px w-5 bg-white/[0.08]" />
                  <span>Decisão</span>
                </div>

                <div className="flex items-center gap-4">
                  <span>SGC</span>

                  <span className="text-white/10">•</span>

                  <span>v2.5.1</span>
                </div>
              </section>
            </div>
          </div>

          {/* ========================================================= */}
          {/* FOOTER MINIMAL */}
          {/* ========================================================= */}

          <footer className="home-reveal-delay-3 flex items-center justify-between border-t border-white/[0.045] pt-4">
            <p className="text-[9px] text-white/15">
              © {new Date().getFullYear()} SGC
            </p>

            <p className="text-[9px] uppercase tracking-[0.15em] text-white/15">
               Todos os direitos reservados - www.uanicode.com
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
