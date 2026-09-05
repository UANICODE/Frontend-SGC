
"use client";

import { useRef, useState } from "react";

import { useAttendantEstablishments } from "@/hooks/attendant/useAttendantEstablishments";
import { EstablishmentCard } from "@/components/attendant/cards/EstablishmentCard";
import { PageLoader } from "@/components/ui/PageLoader";
import { UserRole } from "@/enum/enum";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";

import {
  Activity,
  Building2,
  ShieldCheck,
  Sparkles,
  Store,
} from "lucide-react";

export default function AttendantEstablishmentsPage() {
  useRoleGuard([UserRole.ATENDENTE]);

  const { data, loading } = useAttendantEstablishments();

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

  if (loading) {
    return <PageLoader />;
  }

  return (
    <>
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(25px, -20px, 0);
          }
        }

        @keyframes floatReverse {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(-25px, 18px, 0);
          }
        }

        @keyframes pulseSoft {
          0%,
          100% {
            opacity: 0.18;
          }

          50% {
            opacity: 0.4;
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
           CURSOR FLASHLIGHT
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

          z-index: 5;

          pointer-events: none;

          opacity: 0;

          transition: opacity 0.35s ease;

          background:
            radial-gradient(
              380px circle at var(--cursor-x) var(--cursor-y),
              rgba(255, 255, 255, 0.16),
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
           CARD CONTAINER
        ======================================================== */

        .establishment-wrapper {
          position: relative;
          overflow: hidden;

          border: 1px solid rgba(255, 255, 255, 0.055);

          background: rgba(0, 0, 0, 0.18);

          border-radius: 20px;

          transition:
            transform 0.35s ease,
            border-color 0.35s ease,
            background 0.35s ease,
            box-shadow 0.35s ease;
        }

        .establishment-wrapper:hover {
          transform: translateY(-4px);

          border-color: rgba(255, 255, 255, 0.13);

          background: rgba(255, 255, 255, 0.04);

          box-shadow:
            0 25px 70px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        .establishment-wrapper::before {
          content: "";

          position: absolute;
          inset: 0;

          pointer-events: none;

          opacity: 0;

          background: radial-gradient(
            280px circle at 50% 0%,
            rgba(6, 182, 212, 0.07),
            transparent 70%
          );

          transition: opacity 0.35s ease;
        }

        .establishment-wrapper:hover::before {
          opacity: 1;
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
                <Store className="h-[18px] w-[18px] text-white/50" />
              </div>

              <div>
                <p className="text-sm font-medium tracking-[0.18em] text-white/75">
                  SGC
                </p>

                <p className="text-[9px] uppercase tracking-[0.2em] text-white/20">
                  Área do Atendente
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
                Atendente
              </div>
            </div>
          </header>

          {/* ======================================================
              PAGE INTRO
          ====================================================== */}

          <section className="page-reveal-delay pt-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-px w-6 bg-cyan-300/30" />

                  <span className="text-[9px] uppercase tracking-[0.25em] text-white/25">
                    Ambiente Seguro
                  </span>
                </div>

                <h1 className="text-3xl font-light tracking-[-0.045em] text-white/90 sm:text-4xl">
                  Escolha o estabelecimento
                </h1>

              </div>

              {/* Session status */}
              <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.035]">
                  <Activity className="h-4 w-4 text-emerald-300/45" />
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-[0.18em] text-white/20">
                    Estado
                  </p>

                  <p className="mt-0.5 text-xs text-white/50">
                    Sessão ativa
                  </p>
                </div>

                <span className="ml-3 h-1.5 w-1.5 rounded-full bg-emerald-400/70 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
              </div>
            </div>
          </section>

          {/* ======================================================
              QUICK INFO
          ====================================================== */}

          <section className="page-reveal-delay-2 mt-8">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <div className="flex items-center justify-between">
                  <Store className="h-4 w-4 text-white/25" />

                  <span className="text-[9px] uppercase tracking-[0.18em] text-white/15">
                    Disponíveis
                  </span>
                </div>

                <p className="mt-4 text-2xl font-light tracking-[-0.03em] text-white/80">
                  {data.length}
                </p>

                <p className="mt-1 text-[10px] text-white/20">
                  {data.length === 1
                    ? "estabelecimento"
                    : "estabelecimentos"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <div className="flex items-center justify-between">
                  <ShieldCheck className="h-4 w-4 text-cyan-300/35" />

                  <span className="text-[9px] uppercase tracking-[0.18em] text-white/15">
                    Segurança
                  </span>
                </div>

                <p className="mt-4 text-2xl font-light tracking-[-0.03em] text-white/75">
                  Ativo
                </p>

                <p className="mt-1 text-[10px] text-white/20">
                  acesso verificado
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
                  Acesso
                </p>

                <h2 className="mt-1 text-lg font-light text-white/70">
                Estes são os estabelecimentos onde você trabalha!
                </h2>
              </div>

              <div className="hidden items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-white/20 sm:flex">
                <Building2 className="h-3.5 w-3.5" />

                {data.length}{" "}
                {data.length === 1
                  ? "disponível"
                  : "disponíveis"}
              </div>
            </div>

            {data.length === 0 ? (
              /* ====================================================
                 EMPTY
              ==================================================== */

              <div className="rounded-[26px] border border-white/[0.07] bg-white/[0.025] px-6 py-16 text-center shadow-[0_25px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] border border-white/[0.08] bg-white/[0.035]">
                  <Building2 className="h-8 w-8 text-white/25" />
                </div>

                <p className="mt-7 text-[9px] uppercase tracking-[0.24em] text-white/20">
                  Nenhum acesso
                </p>

                <h2 className="mt-3 text-xl font-light text-white/70">
                  Nenhum estabelecimento encontrado
                </h2>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/30">
                  Você ainda não possui estabelecimentos
                  associados. Contacte o administrador para
                  obter acesso.
                </p>

                <div className="mt-7 flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.17em] text-white/15">
                  <ShieldCheck className="h-3.5 w-3.5" />

                  Acesso controlado pelo administrador
                </div>
              </div>
            ) : (
              /* ====================================================
                 LIST
              ==================================================== */

              <div className="rounded-[26px] border border-white/[0.07] bg-white/[0.025] p-4 shadow-[0_25px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-5 lg:p-6">
                <div className="mb-5 flex items-center justify-between border-b border-white/[0.05] pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-300/50 shadow-[0_0_10px_rgba(103,232,249,0.4)]" />

                    <span className="text-[9px] uppercase tracking-[0.2em] text-white/25">
                      Selecione para continuar
                    </span>
                  </div>

                  <Sparkles className="h-4 w-4 text-white/15" />
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {data.map((est) => (
                    <div
                      key={est.id}
                      className="establishment-wrapper"
                    >
                      <EstablishmentCard
                        establishment={est}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* ======================================================
              FOOTER
          ====================================================== */}

          <footer className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/[0.045] py-5 text-[9px] uppercase tracking-[0.16em] text-white/15 sm:flex-row">
            <span>SGC • Gestão Comercial</span>

            <div className="flex items-center gap-4">
              <span>Ambiente protegido</span>

      

            </div>
          </footer>
        </div>
      </main>
    </>
  );
}
