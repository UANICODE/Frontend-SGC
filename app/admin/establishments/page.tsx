
"use client";

import { CardEstablishment } from "@/components/admin/cards/CardEstablishment";
import { UserRole } from "@/enum/enum";
import { useAdminEstablishments } from "@/hooks/admin/useAdminEstablishments";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";
import { useRouter } from "next/navigation";

import {
  Activity,
  ArrowUpRight,
  Building2,
  Crown,
  Package,
  ShieldCheck,
  Store,
  TrendingUp,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

export default function EstablishmentsPage() {
  useRoleGuard([UserRole.ADMIN]);

  const router = useRouter();
  const { data, loading } = useAdminEstablishments();

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

  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {
    return (
      <>
        <style jsx global>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
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

          .spinner {
            animation: spin 0.9s linear infinite;
          }

          .pulse-soft {
            animation: pulseSoft 4s ease-in-out infinite;
          }

          .tech-grid {
            background-image:
              linear-gradient(
                rgba(255, 255, 255, 0.06) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255, 255, 255, 0.06) 1px,
                transparent 1px
              );

            background-size: 48px 48px;

            mask-image: linear-gradient(
              to bottom,
              black,
              transparent 90%
            );

            -webkit-mask-image: linear-gradient(
              to bottom,
              black,
              transparent 90%
            );
          }
        `}</style>

        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] text-white">
          <div className="pointer-events-none absolute inset-0">
            <div className="tech-grid absolute inset-0 opacity-70" />

            <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-cyan-500/[0.055] blur-[110px]" />

            <div className="pulse-soft absolute bottom-[-250px] right-[-150px] h-[550px] w-[550px] rounded-full bg-blue-600/[0.06] blur-[120px]" />
          </div>

          <div className="relative z-10 text-center">
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
              <div className="spinner absolute inset-0 rounded-full border border-white/[0.08] border-t-white/50" />

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.035]">
                <Building2 className="h-5 w-5 text-white/50" />
              </div>
            </div>

            <p className="mt-6 text-sm font-medium text-white/60">
              Carregando estabelecimentos
            </p>

            <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/20">
              Preparando seu ambiente
            </p>
          </div>
        </main>
      </>
    );
  }

  /* ============================================================
     EMPTY STATE
  ============================================================ */

  if (!data || data.length === 0) {
    return (
      <>
        <style jsx global>{`
          @keyframes pulseSoft {
            0%,
            100% {
              opacity: 0.2;
            }

            50% {
              opacity: 0.4;
            }
          }

          .pulse-soft {
            animation: pulseSoft 5s ease-in-out infinite;
          }

          .tech-grid {
            background-image:
              linear-gradient(
                rgba(255, 255, 255, 0.06) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255, 255, 255, 0.06) 1px,
                transparent 1px
              );

            background-size: 48px 48px;
          }
        `}</style>

        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-6 text-white">
          <div className="pointer-events-none absolute inset-0">
            <div className="tech-grid absolute inset-0 opacity-60" />

            <div className="pulse-soft absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/[0.04] blur-[110px]" />
          </div>

          <div className="relative z-10 w-full max-w-md text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] border border-white/[0.08] bg-white/[0.035] shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
              <Store className="h-8 w-8 text-white/30" />
            </div>

            <p className="mt-8 text-[10px] uppercase tracking-[0.25em] text-white/20">
              Estabelecimentos
            </p>

            <h1 className="mt-3 text-2xl font-light tracking-[-0.03em] text-white/80">
              Nenhum estabelecimento
            </h1>

            <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-white/30">
              Você ainda não possui estabelecimentos cadastrados.
              Entre em contacto com o suporte para adicionar o seu
              primeiro negócio.
            </p>

            <div className="mt-8 flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.18em] text-white/15">
              <ShieldCheck className="h-3.5 w-3.5" />
              Ambiente protegido
            </div>
          </div>
        </main>
      </>
    );
  }

  /* ============================================================
     DATA
  ============================================================ */

  const totalEstabelecimentos = data.length;

  const totalAtivos = data.filter(
    (est) => est.active
  ).length;

  const totalInativos =
    totalEstabelecimentos - totalAtivos;

  /* ============================================================
     PAGE
  ============================================================ */

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
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
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

        .page-reveal {
          animation: reveal 0.7s ease-out both;
        }

        .page-reveal-delay {
          animation: reveal 0.7s 0.12s ease-out both;
        }

        .page-reveal-delay-2 {
          animation: reveal 0.7s 0.2s ease-out both;
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

        /* ========================================================
           GRID
        ======================================================== */

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
            black 65%,
            transparent 100%
          );

          -webkit-mask-image: linear-gradient(
            to bottom,
            black 0%,
            black 65%,
            transparent 100%
          );
        }

        /* ========================================================
           FLASHLIGHT
        ======================================================== */

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

        /* ========================================================
           ESTABLISHMENT CONTAINER
        ======================================================== */

        .establishment-card {
          position: relative;
          overflow: hidden;

          transition:
            transform 0.35s ease,
            border-color 0.35s ease,
            background 0.35s ease,
            box-shadow 0.35s ease;
        }

        .establishment-card:hover {
          transform: translateY(-3px);

          border-color: rgba(255, 255, 255, 0.14);

          background: rgba(255, 255, 255, 0.045);

          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        /* ========================================================
           STAT
        ======================================================== */

        .stat-item {
          transition:
            background 0.3s ease,
            border-color 0.3s ease;
        }

        .stat-item:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.1);
        }
      `}</style>

      <main
        ref={mainRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsCursorInside(true)}
        onMouseLeave={() => setIsCursorInside(false)}
        className="relative min-h-screen overflow-hidden bg-[#050505] text-white"
      >
        {/* ========================================================
            BACKGROUND
        ======================================================== */}

        <div className="pointer-events-none absolute inset-0">
          <div className="tech-grid absolute inset-0 opacity-70" />

          {/* Cursor */}
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

          {/* Ambient */}
          <div className="orb-one absolute -left-48 -top-48 h-[600px] w-[600px] rounded-full bg-cyan-500/[0.045] blur-[120px]" />

          <div className="orb-two absolute -bottom-56 -right-48 h-[620px] w-[620px] rounded-full bg-blue-600/[0.055] blur-[130px]" />

          <div className="pulse-soft absolute left-1/2 top-[45%] h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/[0.025] blur-[120px]" />
        </div>

        {/* ========================================================
            CONTENT
        ======================================================== */}

        <div className="relative z-10 mx-auto w-full max-w-[1380px] px-5 py-6 sm:px-8 lg:px-12">
          {/* ======================================================
              TOP BAR
          ====================================================== */}

          <header className="page-reveal flex items-center justify-between border-b border-white/[0.045] pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035]">
                <Building2 className="h-[18px] w-[18px] text-white/50" />
              </div>

              <div>
                <p className="text-sm font-medium tracking-[0.18em] text-white/75">
                  SGC
                </p>

                <p className="text-[9px] uppercase tracking-[0.2em] text-white/20">
                  Administração
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.025] px-3 py-2 sm:flex">
                <span className="blink h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]" />

                <span className="text-[9px] uppercase tracking-[0.16em] text-white/25">
                 Online
                </span>
              </div>

              <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-white/25">
                Olá, Admin
              </div>
            </div>
          </header>

          {/* ======================================================
              PAGE HEADER
          ====================================================== */}

          <section className="page-reveal-delay pt-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-px w-6 bg-cyan-300/30" />

                  <span className="text-[9px] uppercase tracking-[0.25em] text-white/25">
                    Ambiente Restrito
                  </span>
                </div>

                <h1 className="text-3xl font-light tracking-[-0.04em] text-white/90 sm:text-4xl">
                 Selecione um estabelecimento para entrar no
                  ambiente de gestão.
                </h1>

                
              </div>

              {/* Super Gestão */}
              <button
                onClick={() =>
                  router.push(
                    "/admin/establishments/superdashboard"
                  )
                }
                className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.035] px-5 py-3 text-xs font-medium text-white/60 transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white"
              >
                <Crown className="h-4 w-4 text-amber-300/50" />

                <span>Super Gestão</span>

                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </section>

          {/* ======================================================
              OVERVIEW
          ====================================================== */}

          <section className="page-reveal-delay-2 mt-8">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {/* Total */}
              <div className="stat-item rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <Building2 className="h-4 w-4 text-white/25" />

                  <span className="text-[9px] uppercase tracking-[0.15em] text-white/15">
                    Total
                  </span>
                </div>

                <p className="text-2xl font-light tracking-[-0.03em] text-white/80">
                  {totalEstabelecimentos}
                </p>

                <p className="mt-1 text-[10px] text-white/20">
                  estabelecimentos
                </p>
              </div>

              {/* Ativos */}
              <div className="stat-item rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <Activity className="h-4 w-4 text-emerald-300/40" />

                  <span className="text-[9px] uppercase tracking-[0.15em] text-white/15">
                    Ativos
                  </span>
                </div>

                <p className="text-2xl font-light tracking-[-0.03em] text-emerald-200/75">
                  {totalAtivos}
                </p>

                <p className="mt-1 text-[10px] text-white/20">
                  em operação
                </p>
              </div>

              {/* Inativos */}
              <div className="stat-item rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <Package className="h-4 w-4 text-amber-300/35" />

                  <span className="text-[9px] uppercase tracking-[0.15em] text-white/15">
                    Inativos
                  </span>
                </div>

                <p className="text-2xl font-light tracking-[-0.03em] text-amber-200/70">
                  {totalInativos}
                </p>

                <p className="mt-1 text-[10px] text-white/20">
                  pendentes
                </p>
              </div>

              {/* Gestão */}
              <div className="stat-item rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <TrendingUp className="h-4 w-4 text-cyan-300/35" />

                  <span className="text-[9px] uppercase tracking-[0.15em] text-white/15">
                    Gestão
                  </span>
                </div>

                <p className="text-xl font-light tracking-[-0.03em] text-white/75">
                  Unificada
                </p>

                <p className="mt-1 text-[10px] text-white/20">
                  todos os negócios
                </p>
              </div>
            </div>
          </section>

          {/* ======================================================
              ESTABLISHMENTS
          ====================================================== */}

          <section className="mt-8">
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-[0.22em] text-white/20">
                  Unidades
                </p>

                <h2 className="mt-1 text-lg font-light text-white/70">
                  Meus negócios
                </h2>
              </div>

              <div className="hidden items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-white/20 sm:flex">
                <Store className="h-3.5 w-3.5" />

                {totalEstabelecimentos}{" "}
                {totalEstabelecimentos === 1
                  ? "estabelecimento"
                  : "estabelecimentos"}
              </div>
            </div>

            {/* ====================================================
                CONTAINER
            ==================================================== */}

            <div className="establishment-card rounded-[26px] border border-white/[0.07] bg-white/[0.025] p-4 shadow-[0_25px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-5 lg:p-6">
              <div className="mb-5 flex items-center justify-between border-b border-white/[0.05] pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300/50 shadow-[0_0_10px_rgba(103,232,249,0.4)]" />

                  <span className="text-[9px] uppercase tracking-[0.2em] text-white/25">
                    Estabelecimentos disponíveis
                  </span>
                </div>

                <ShieldCheck className="h-4 w-4 text-white/15" />
              </div>

              {/* Cards existentes */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {data.map((est) => (
                  <CardEstablishment
                    key={est.id}
                    establishment={est}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* ======================================================
              FOOTER
          ====================================================== */}

          <footer className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/[0.045] py-5 text-[9px] uppercase tracking-[0.16em] text-white/15 sm:flex-row">
            <span>SGC • Gestão Comercial</span>

            <div className="flex items-center gap-4">
              <span>Ambiente protegido</span>

              <span className="text-white/10">•</span>

              <span>v2.5.1</span>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}
