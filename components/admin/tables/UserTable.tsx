"use client";

import { useState } from "react";
import { toggleUserStatus } from "@/service/admin/user";
import { ListUsersByEstablishmentResponse } from "@/types/admin/user";
import { 
  Users, 
  Mail, 
  Shield, 
  Power, 
  Key, 
  CheckCircle, 
  XCircle,
  UserCog,
  RefreshCw
} from "lucide-react";

interface Props {
  data: ListUsersByEstablishmentResponse[];
  establishmentId: string;
  onResetPassword: (user: ListUsersByEstablishmentResponse) => void;
  onRefresh: () => void;
}

export function UserTable({
  data,
  establishmentId,
  onResetPassword,
  onRefresh,
}: Props) {
  const [changingId, setChangingId] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  async function toggle(user: ListUsersByEstablishmentResponse) {
    try {
      setChangingId(user.userUid);
      await toggleUserStatus({
        establishmentId,
        userUid: user.userUid,
        ativo: !user.ativo,
      });
      await onRefresh();
    } finally {
      setChangingId(null);
    }
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
          <Users className="w-10 h-10 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">Nenhum usuário encontrado</p>
        <p className="text-sm text-gray-400 mt-1">Clique em "Novo Usuário" para começar</p>
      </div>
    );
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return { label: "Administrador", color: "bg-purple-100 text-purple-700", icon: Shield };
      case "ATENDENTE":
        return { label: "Atendente", color: "bg-blue-100 text-blue-700", icon: UserCog };
      default:
        return { label: role, color: "bg-gray-100 text-gray-700", icon: Users };
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-primary to-secondary text-white">
              <th className="p-4 text-left rounded-tl-2xl">Nome</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-center">Perfil</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center rounded-tr-2xl">Ações</th>
            </tr>
          </thead>

          <tbody>
            {data.map((user) => {
              const isHovered = hoveredRow === user.userUid;
              const roleBadge = getRoleBadge(user.role);
              const RoleIcon = roleBadge.icon;
              const isAttendant = user.role === "ATENDENTE";

              return (
                <tr
                  key={user.userUid}
                  className={`border-t border-gray-100 transition-all duration-200 ${
                    isHovered ? "bg-gradient-to-r from-primary/5 to-secondary/5" : "hover:bg-gray-50/80"
                  }`}
                  onMouseEnter={() => setHoveredRow(user.userUid)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        isHovered ? "bg-gradient-to-br from-primary/20 to-secondary/20 scale-110" : "bg-gradient-to-br from-primary/10 to-secondary/10"
                      }`}>
                        <Users className={`w-5 h-5 transition-all duration-300 ${
                          isHovered ? "text-primary scale-110" : "text-primary/70"
                        }`} />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800">
                          {user.nome}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-gray-600">{user.email}</span>
                    </div>
                  </td>

                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${roleBadge.color}`}>
                      <RoleIcon className="w-3 h-3" />
                      {roleBadge.label}
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.ativo
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {user.ativo ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {user.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      {isAttendant && (
                        <button
                          onClick={() => toggle(user)}
                          disabled={changingId === user.userUid}
                          className={`group/btn relative overflow-hidden px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-1.5 text-xs font-medium ${
                            user.ativo
                              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                              : "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                          }`}
                        >
                          <div className={`absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity ${
                            user.ativo
                              ? "bg-gradient-to-r from-amber-600 to-orange-600"
                              : "bg-gradient-to-r from-green-600 to-emerald-600"
                          }`}></div>
                          {changingId === user.userUid ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin relative z-10" />
                          ) : (
                            <Power className="w-3.5 h-3.5 relative z-10" />
                          )}
                          <span className="relative z-10">
                            {changingId === user.userUid ? "..." : (user.ativo ? "Desativar" : "Ativar")}
                          </span>
                        </button>
                      )}

                      <button
                        onClick={() => onResetPassword(user)}
                        className="group/btn relative overflow-hidden bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-1.5 text-xs font-medium"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                        <Key className="w-3.5 h-3.5 relative z-10" />
                        <span className="relative z-10">Resetar Senha</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Total de registros */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-sm text-gray-500">
        Total de usuários: <span className="font-semibold text-gray-700">{data.length}</span>
      </div>
    </div>
  );
}