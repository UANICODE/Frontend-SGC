"use client";

import { useAuth } from "@/hooks/auth/useAuth";
import { useRouter } from "next/navigation";

export default function SelectRolePage() {

  const { user } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const handleSelect = (role: string) => {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-backgroundLight">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-borderLight">

        <h2 className="text-xl font-semibold mb-6">
          Selecione o perfil
        </h2>

        <div className="space-y-4">
          {user.roles.map((role) => (
            <button
              key={role}
              onClick={() => handleSelect(role)}
              className="w-full bg-gray-900 text-white py-2 rounded-lg"
            >
              {role}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}