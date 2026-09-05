// app/auth/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";
import Image from "next/image";
import Logo from "@/public/image/logo.png";
import { validateLogin } from "@/utils/validators";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Shield,
  ArrowUpRight,
  Building2,
} from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<{
    email?: string;
    password?: string;
    login?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [blockTime, setBlockTime] = useState(0);
  const [maxBlockTime, setMaxBlockTime] = useState(0);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [cursorLight, setCursorLight] = useState({ x: 0, y: 0 });
  const [isCursorInside, setIsCursorInside] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  const redirectByRole = (role: string) => {
    switch (role) {
      case "SUPERADMIN":
        router.push("/superadmin/dashboard");
        break;
      case "ADMIN":
        router.push("/admin/establishments");
        break;
      case "ATENDENTE":
        router.push("/attendant/establishments");
        break;
      default:
        router.push("/");
    }
  };

  useEffect(() => {
    if (blockTime <= 0) return;

    const timer = setInterval(() => {
      setBlockTime((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [blockTime]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError({});
    setLoading(true);

    const validationErrors = validateLogin(email, password);

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const user = await login(email, password);

      if (user.roles.length > 1) {
        router.push("/select-role");
      } else {
        redirectByRole(user.roles[0]);
      }
    } catch (err: any) {
      if (
        err.message?.includes(
          "estabelecimento está temporariamente bloqueado"
        )
      ) {
        setError({
          login:
            "Este estabelecimento está temporariamente bloqueado. Contacte o administrador.",
        });
      } else if (err.message?.includes("Muitas tentativas")) {
        const secondsMatch = err.message.match(/(\d+)/);

        if (secondsMatch) {
          const secs = parseInt(secondsMatch[0], 10);
          setBlockTime(secs);
          setMaxBlockTime(secs);
        }

        setError({ login: err.message });
      } else {
        setError({
          login: err.message || "Email ou senha incorretos",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled =
    loading || blockTime > 0 || password.length < 8;

  const progressPercentage =
    maxBlockTime > 0 ? (blockTime / maxBlockTime) * 100 : 0;

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!mainRef.current) return;

    const rect = mainRef.current.getBoundingClientRect();

    setCursorLight({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

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

        @keyframes reveal {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.25;
          }
          50% {
            opacity: 0.55;
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-4px);
          }
          75% {
            transform: translateX(4px);
          }
        }

        .login-reveal {
          animation: reveal 0.75s ease-out both;
        }

        .login-reveal-delay {
          animation: reveal 0.75s 0.12s ease-out both;
        }

        .orb-one {
          animation: float 11s ease-in-out infinite;
        }

        .orb-two {
          animation: floatReverse 14s ease-in-out infinite;
        }

        .pulse-soft {
          animation: pulse 5s ease-in-out infinite;
        }

        .login-shake {
          animation: shake 0.3s ease-in-out;
        }

        .spinner {
          animation: spin 0.8s linear infinite;
        }

        .tech-grid {
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.075) 1px, transparent 1px),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.075) 1px,
              transparent 1px
            );
          background-size: 48px 48px;
          mask-image: linear-gradient(to bottom, black, transparent 92%);
          -webkit-mask-image: linear-gradient(
            to bottom,
            black,
            transparent 92%
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
            rgba(255, 255, 255, 0.10) 0%,
            rgba(255, 255, 255, 0.035) 28%,
            transparent 68%
          );
          filter: blur(2px);
          transition: left 0.08s ease-out, top 0.08s ease-out;
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
            linear-gradient(rgba(255, 255, 255, 0.09) 1px, transparent 1px),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.09) 1px,
              transparent 1px
            );
          background-size: auto, 48px 48px, 48px 48px;
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
      `}</style>

      <main
        ref={mainRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsCursorInside(true)}
        onMouseLeave={() => setIsCursorInside(false)}
        className="relative min-h-screen overflow-hidden bg-[#050505] text-white"
      >
        {/* Background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="tech-grid absolute inset-0 opacity-80" />

          {/* Cursor flashlight */}
          <div
            className={`flashlight ${isCursorInside ? "active" : ""}`}
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

          <div className="orb-one absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-cyan-500/[0.07] blur-[110px]" />
          <div className="orb-two absolute -bottom-48 -right-40 h-[560px] w-[560px] rounded-full bg-blue-600/[0.08] blur-[120px]" />

          <div className="pulse-soft absolute left-[52%] top-[45%] h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/[0.045] blur-[100px]" />

          <span className="star left-[12%] top-[17%]" />
          <span className="star left-[28%] top-[11%] opacity-50" />
          <span className="star left-[44%] top-[24%] opacity-40" />
          <span className="star left-[73%] top-[14%]" />
          <span className="star left-[88%] top-[30%] opacity-40" />
          <span className="star left-[66%] top-[72%]" />
          <span className="star left-[17%] top-[78%]" />
          <span className="star left-[39%] top-[88%]" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1380px] items-center px-6 py-10 sm:px-10 lg:px-16">
          <div className="grid w-full items-center gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
            {/* Left / Hero */}
            <section className="login-reveal hidden lg:block">
              <div className="mb-12 flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.035]">
                  <Building2 className="h-5 w-5 text-white/70" />
                </div>

                <div>
                  <p className="text-sm font-medium tracking-[0.22em] text-white/80">
                    SGC
                  </p>
          
                </div>
              </div>

              <div className="max-w-2xl">
               

                <h1 className="text-[clamp(3.8rem,6.5vw,7rem)] font-light leading-[0.92] tracking-[-0.055em]">
                  Gestão
                  <br />
                  <span className="text-white/35">mais simples.</span>
                  <br />
                  Resultados
                  <br />
                  <span className="bg-gradient-to-r from-white via-white/75 to-white/25 bg-clip-text text-transparent">
                    melhores.
                  </span>
                </h1>

                <p className="mt-9 max-w-lg text-base leading-7 text-white/40">
                  Um sistema moderno para centralizar operações,
                  acompanhar o seu negócio e tomar decisões com mais
                  confiança.
                </p>
              </div>

              <div className="mt-14 flex items-center gap-8 text-xs uppercase tracking-[0.2em] text-white/25">
                <span>Vendas</span>
                <span className="h-px w-8 bg-white/10" />
                <span>Dados</span>
                <span className="h-px w-8 bg-white/10" />
                <span>Decisão</span>
              </div>
            </section>

            {/* Login */}
            <section className="login-reveal-delay w-full max-w-[470px] justify-self-center lg:justify-self-end">
              <div className="mb-8 lg:hidden">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                    <Building2 className="h-5 w-5 text-white/70" />
                  </div>
                  <div>
                    <p className="text-sm font-medium tracking-[0.2em]">
                      SGC
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/30">
                      Gestão Comercial
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-px rounded-[30px] bg-gradient-to-b from-white/10 via-white/[0.025] to-transparent" />

                <div className="relative rounded-[30px] border border-white/[0.09] bg-white/[0.035] p-7 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-9">
                  <div className="mb-10">
                    <div className="mb-7 flex items-center justify-between">
                      <div className="overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.045] px-4 py-3 shadow-[0_10px_35px_rgba(0,0,0,0.18)]">
                        <Image
                          src={Logo}
                          alt="SGC"
                          width={125}
                          height={45}
                          className="h-auto max-h-9 w-auto rounded-xl object-contain opacity-80"
                        />
                      </div>

                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/25">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                        Online
                      </div>
                    </div>

                    <p className="mb-2 text-xs uppercase tracking-[0.25em] text-white/30">
                      Bem-vindo
                    </p>

                    <h2 className="text-3xl font-light tracking-[-0.03em] text-white/90">
                      Acesse sua conta
                    </h2>

     
                  </div>

                  {error.login && (
                    <div className="login-shake mb-5 rounded-2xl border border-red-400/10 bg-red-400/[0.045] p-4">
                      <p className="flex items-start gap-2.5 text-sm leading-5 text-red-300/70">
                        <Shield className="mt-0.5 h-4 w-4 shrink-0" />
                        {error.login}
                      </p>
                    </div>
                  )}

                  {blockTime > 0 && (
                    <div className="mb-5 rounded-2xl border border-amber-300/10 bg-amber-300/[0.035] p-4">
                      <div className="mb-2.5 flex items-center justify-between text-xs text-amber-200/60">
                        <span>Temporariamente bloqueado</span>
                        <span>{blockTime}s</span>
                      </div>

                      <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className="h-full rounded-full bg-white/30 transition-all duration-1000"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleLogin} className="space-y-4">
                    {/* Email */}
                    <div>
                      <div
                        className={`rounded-2xl border bg-black/20 transition-all duration-300 ${
                          activeField === "email"
                            ? "border-white/20 bg-white/[0.055] shadow-[0_0_0_4px_rgba(255,255,255,0.02)]"
                            : "border-white/[0.07] hover:border-white/[0.12]"
                        }`}
                      >
                        <div className="flex items-center px-4">
                          <Mail
                            className={`h-[18px] w-[18px] transition-colors ${
                              activeField === "email"
                                ? "text-white/65"
                                : "text-white/25"
                            }`}
                          />

                          <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setActiveField("email")}
                            onBlur={() => setActiveField(null)}
                            disabled={loading || blockTime > 0}
                            className="w-full bg-transparent px-3 py-4 text-sm text-white/80 outline-none placeholder:text-white/20"
                          />
                        </div>
                      </div>

                      {error.email && (
                        <p className="mt-2 px-2 text-xs text-red-300/60">
                          {error.email}
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <div
                        className={`rounded-2xl border bg-black/20 transition-all duration-300 ${
                          activeField === "password"
                            ? "border-white/20 bg-white/[0.055] shadow-[0_0_0_4px_rgba(255,255,255,0.02)]"
                            : "border-white/[0.07] hover:border-white/[0.12]"
                        }`}
                      >
                        <div className="flex items-center px-4">
                          <Lock
                            className={`h-[18px] w-[18px] transition-colors ${
                              activeField === "password"
                                ? "text-white/65"
                                : "text-white/25"
                            }`}
                          />

                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setActiveField("password")}
                            onBlur={() => setActiveField(null)}
                            disabled={loading || blockTime > 0}
                            className="w-full bg-transparent px-3 py-4 text-sm text-white/80 outline-none placeholder:text-white/20"
                          />

                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="rounded-lg p-1.5 text-white/25 transition-colors hover:text-white/65"
                            aria-label={
                              showPassword
                                ? "Ocultar password"
                                : "Mostrar password"
                            }
                          >
                            {showPassword ? (
                              <EyeOff className="h-[18px] w-[18px]" />
                            ) : (
                              <Eye className="h-[18px] w-[18px]" />
                            )}
                          </button>
                        </div>
                      </div>

                      {error.password && (
                        <p className="mt-2 px-2 text-xs text-red-300/60">
                          {error.password}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isButtonDisabled}
                      className="group mt-2 flex w-full items-center justify-between rounded-2xl bg-white px-5 py-4 text-sm font-medium text-black transition-all duration-300 hover:bg-white/90 hover:shadow-[0_15px_45px_rgba(255,255,255,0.08)] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <span>
                        {blockTime > 0
                          ? `Aguarde ${blockTime}s...`
                          : loading
                            ? "A entrar..."
                            : "Entrar"}
                      </span>

                      {loading ? (
                        <span className="spinner h-4 w-4 rounded-full border-2 border-black/20 border-t-black" />
                      ) : (
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/[0.07] transition-transform duration-300 group-hover:translate-x-0.5">
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      )}
                    </button>
                  </form>

                  <div className="mt-9 border-t border-white/[0.07] pt-6">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-white/20">
         
                      <span>v2.5.1</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-center text-[11px] leading-5 text-white/20">
                Acesso protegido. Utilize apenas as suas credenciais
                autorizadas.
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
