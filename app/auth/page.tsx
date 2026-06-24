// app/auth/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/image/logo.png";
import { validateLogin } from "@/utils/validators";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Shield, 
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<{ email?: string; password?: string; login?: string }>({});
  const [loading, setLoading] = useState(false);
  const [blockTime, setBlockTime] = useState(0);
  const [maxBlockTime, setMaxBlockTime] = useState(0);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const redirectByRole = (role: string) => {
    switch (role) {
      case "SUPERADMIN":
        router.push("/superadmin/dashboard");
        break;
      case "ADMIN":
        router.push("/admin/establishments");
        break;
      case "ATENDENTE":
        router.push(`/attendant/establishments`);
        break;
      default:
        router.push("/");
    }
  };

  useEffect(() => {
    if (blockTime <= 0) return;
    const timer = setInterval(() => setBlockTime(prev => prev - 1), 1000);
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
      if (err.message?.includes("estabelecimento está temporariamente bloqueado")) {
        setError({ 
          login: "Este estabelecimento está temporariamente bloqueado. Contacte o administrador." 
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
        setError({ login: err.message || "Email ou senha incorretos" });
      }
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled = loading || blockTime > 0 || password.length < 8;
  const progressPercentage = maxBlockTime > 0 ? (blockTime / maxBlockTime) * 100 : 0;

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(20px) translateX(-10px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-blue-50 relative overflow-hidden">
        
        {/* Animated Background Orbs */}
        <div className="absolute top-[-150px] left-[-150px] w-96 h-96 bg-blue-300 rounded-full opacity-20 blur-3xl animate-float"></div>
        <div className="absolute bottom-[-150px] right-[-150px] w-96 h-96 bg-cyan-300 rounded-full opacity-20 blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-200 rounded-full opacity-10 blur-3xl animate-pulse"></div>

        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%233b82f6\" fill-opacity=\"0.03\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
          }}
        ></div>

        {/* Main Card */}
        <div className="relative w-full max-w-md mx-4">
          
          {/* Decorative Borders - Multiple layered borders */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-1000"></div>
          
          <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            
            {/* Top Decorative Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500"></div>
            
            {/* Inner Border Effect */}
            <div className="absolute inset-2 rounded-2xl border border-blue-100/50 pointer-events-none"></div>

            {/* Content */}
            <div className="relative p-8 md:p-10">
              
              {/* Logo Section */}
              <div className="flex justify-center mb-8">
                <div className="relative group">
                  
                  <div className="relative bg-white rounded-full p-4 shadow-xl">
                    <Image src={Logo} alt="SGC Logo" width={140} height={50} className="object-contain" />
                  </div>
                </div>
              </div>

              {/* Welcome Text */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Bem-vindo de volta
                </h1>
                <p className="text-gray-500 mt-2 text-sm">
                  Acesse sua conta para continuar
                </p>
              </div>

              {/* Error Message */}
              {error.login && (
                <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg animate-shake">
                  <p className="text-red-600 text-sm font-medium flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    {error.login}
                  </p>
                </div>
              )}

              {/* Block Timer */}
              {blockTime > 0 && (
                <div className="mb-6 p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                  <div className="text-center text-yellow-700 font-semibold text-sm mb-2">
                    ⏱ Tente novamente em {blockTime} segundos
                  </div>
                  <div className="w-full bg-yellow-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-yellow-500 rounded-full transition-all duration-1000 ease-linear"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email Field */}
                <div className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur transition-opacity duration-300 ${
                    focusedField === "email" ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                  }`}></div>
                  <div className="relative bg-white rounded-xl border-2 transition-all duration-200 overflow-hidden">
                    <div className="flex items-center px-4">
                      <Mail className={`w-5 h-5 transition-colors duration-200 ${
                        focusedField === "email" ? "text-blue-500" : "text-gray-400"
                      }`} />
                      <input
                        type="email"
                        placeholder="Seu email"
                        className="w-full py-3 px-3 focus:outline-none bg-transparent"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        disabled={loading || blockTime > 0}
                      />
                    </div>
                    <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300 ${
                      focusedField === "email" ? "w-full" : "w-0"
                    }`}></div>
                  </div>
                  {error.email && (
                    <p className="text-red-500 text-xs mt-1 ml-2">{error.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur transition-opacity duration-300 ${
                    focusedField === "password" ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                  }`}></div>
                  <div className="relative bg-white rounded-xl border-2 transition-all duration-200 overflow-hidden">
                    <div className="flex items-center px-4">
                      <Lock className={`w-5 h-5 transition-colors duration-200 ${
                        focusedField === "password" ? "text-blue-500" : "text-gray-400"
                      }`} />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password (mínimo 8 caracteres)"
                        className="w-full py-3 px-3 focus:outline-none bg-transparent"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField("password")}
                        onBlur={() => setFocusedField(null)}
                        disabled={loading || blockTime > 0}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300 ${
                      focusedField === "password" ? "w-full" : "w-0"
                    }`}></div>
                  </div>
                  {error.password && (
                    <p className="text-red-500 text-xs mt-1 ml-2">{error.password}</p>
                  )}
                </div>

           

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isButtonDisabled}
                  className={`w-full py-3.5 rounded-xl text-white font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 group ${
                    isButtonDisabled
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0.5"
                  }`}
                >
                  {blockTime > 0 ? (
                    `Aguarde ${blockTime}s...`
                  ) : loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Entrando...
                    </>
                  ) : (
                    <>
                      Entrar
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

            
              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">

                  <span>SGC - Sistema de Gestão Comercial</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Decorative Element */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full"></div>
        </div>
      </div>
    </>
  );
}