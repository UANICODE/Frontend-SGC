"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";
import Image from "next/image";
import Logo from "@/public/image/logo.png";
import { validateLogin } from "@/utils/validators";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<{ email?: string; password?: string; login?: string }>({});
  const [loading, setLoading] = useState(false);
  const [blockTime, setBlockTime] = useState(0);
  const [maxBlockTime, setMaxBlockTime] = useState(0);

  const redirectByRole = (role: string) => {
    switch (role) {
      case "SUPERADMIN":
        router.push("/superadmin/establishments");
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
          login: "⛔ Este estabelecimento está temporariamente bloqueado. Contacte o administrador." 
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
        setError({ login: err.message || "Erro ao fazer login" });
      }
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled = loading || blockTime > 0 || password.length < 8;
  const progressPercentage = maxBlockTime > 0 ? (blockTime / maxBlockTime) * 100 : 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-white relative overflow-hidden">
      {/* Fundo decorativo com blur e formas geométricas */}
      <div className="absolute top-[-100px] left-[-100px] w-72 h-72 bg-indigo-300 rounded-full opacity-20 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-120px] right-[-80px] w-96 h-96 bg-indigo-200 rounded-full opacity-30 blur-3xl animate-pulse"></div>

      {/* Card principal */}
      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-10 border border-gray-200 overflow-hidden">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image src={Logo} alt="SGC Logo" width={180} height={60} className="object-contain" />
        </div>

        {/* Mensagens de erro */}
        {error.login && (
          <div className="mb-4 text-sm text-red-600 text-center font-medium animate-pulse">
            {error.login}
          </div>
        )}

        {/* Timer de bloqueio */}
        {blockTime > 0 && (
          <div className="mb-4">
            <div className="text-center text-yellow-700 font-semibold mb-2">
              ⏱ Tente novamente em {blockTime}s
            </div>
            <div className="w-full bg-yellow-100 h-2 rounded-full overflow-hidden">
              <div
                className="h-2 bg-yellow-500 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email"
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition shadow-md ${
                error.email ? "border-red-500 animate-shake" : "border-gray-300"
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || blockTime > 0}
            />
            {error.email && <p className="text-red-600 text-sm mt-1">{error.email}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Senha (mínimo 8 caracteres)"
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition shadow-md ${
                error.password ? "border-red-500 animate-shake" : "border-gray-300"
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || blockTime > 0}
            />
            {error.password && <p className="text-red-600 text-sm mt-1">{error.password}</p>}
          </div>

          {/* Botão de login */}
          <button
            type="submit"
            disabled={isButtonDisabled}
            className={`w-full py-3 rounded-xl text-white font-bold text-lg transition-all duration-200
              ${
                isButtonDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0.5"
              }`}
          >
            {blockTime > 0
              ? `Aguarde ${blockTime}s...`
              : loading
              ? "Entrando..."
              : "Entrar"}
          </button>
        </form>

        {/* Rodapé */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} SGC. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
}