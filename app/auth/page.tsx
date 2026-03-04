"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";
import Image from "next/image";
import Logo from "@/public/image/logo.png"; // seu logotipo
import { validateLogin } from "@/utils/validators";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<{ email?: string; password?: string; login?: string }>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação externa
    const validationErrors = validateLogin(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return; // não submete
    }

    try {
      const user = await login(email, password);

      if (user.roles.length > 1) {
        router.push("/select-role");
      } else {
        redirectByRole(user.roles[0]);
      }

    } catch (err: any) {
      setError({ login: err?.response?.data?.message || "Erro ao fazer login" });
    }
  };

  const redirectByRole = (role: string) => {
    switch (role) {
      case "SUPERADMIN":
        router.push("/superadmin/dashboard");
        break;
      case "ADMIN":
        router.push("/admin/dashboard");
        break;
      case "ATENDENTE":
        router.push("/attendant/dashboard");
        break;
      default:
        router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-backgroundLight">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 border border-borderLight">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image 
            src={Logo} 
            alt="SGC Logo" 
            width={150} 
            height={50} 
            className="object-contain"
          />
        </div>


        {error.login && (
          <div className="mb-4 text-sm text-red-600 text-center">
            {error.login}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">

          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-borderLight rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error.email && <p className="text-red-600 text-sm mt-1">{error.email}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Senha"
              className="w-full border border-borderLight rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error.password && <p className="text-red-600 text-sm mt-1">{error.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Entrar
          </button>

        </form>
      </div>
    </div>
  );
}