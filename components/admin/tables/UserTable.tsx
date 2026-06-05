"use client";

import { useState } from "react";
import { toggleUserStatus } from "@/service/admin/user";
import { ListUsersByEstablishmentResponse } from "@/types/admin/user";

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

 async function toggle(user: ListUsersByEstablishmentResponse) {
  try {
    setChangingId(user.userUid);

    await toggleUserStatus({
      establishmentId,
      userUid: user.userUid,
      ativo: !user.ativo, // ← inversão do status
    });

    await onRefresh();
  } finally {
    setChangingId(null);
  }
}

  return (
    <div className="bg-white rounded-2xl shadow overflow-x-auto">

      <table className="min-w-full text-sm">

        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left">Nome</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th className="text-right p-4">Ações</th>
          </tr>
        </thead>

        <tbody>
          {data.map((user) => {
            const isAttendant = user.role === "ATENDENTE";

            return (
              <tr key={user.userUid} className="border-t">

                <td className="p-4 font-medium">
                  {user.nome}
                </td>

                <td>{user.email}</td>

                <td>
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                    {user.role}
                  </span>
                </td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      user.ativo
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.ativo ? "Ativo" : "Inativo"}
                  </span>
                </td>

                <td className="text-right p-4 space-x-4">

                  {isAttendant && (
                    <button
                      onClick={() => toggle(user)}
                      className="text-blue-600"
                      disabled={changingId === user.userUid}
                    >
                      {changingId === user.userUid
                        ? "Alterando..."
                        : "Ativar / Desativar"}
                    </button>
                  )}

                  <button
                    onClick={() => onResetPassword(user)}
                    className="text-yellow-600"
                  >
                    Resetar Senha
                  </button>

                </td>

              </tr>
            );
          })}
        </tbody>

      </table>
    </div>
  );
}