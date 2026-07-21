"use client";

import {
  Pencil,
  Power,
  PowerOff,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { UserItemResponse } from "@/types/superadmin/users/listUsers";

interface UsersTableProps {
  users: UserItemResponse[];
  loading: boolean;
  onEdit: (user: UserItemResponse) => void;
  onManageRoles: (user: UserItemResponse) => void;
  onChangeStatus: (user: UserItemResponse) => void;
}

export function UsersTable({
  users,
  loading,
  onEdit,
  onManageRoles,
  onChangeStatus,
}: UsersTableProps) {
  if (loading && users.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
        <p className="mt-4 text-sm text-slate-500">
          A carregar utilizadores...
        </p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
          <UserRound className="h-8 w-8 text-slate-400" />
        </div>

        <h3 className="mt-4 text-lg font-semibold text-slate-900">
          Nenhum utilizador encontrado
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Altere os filtros ou crie um novo utilizador.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-5 py-4">Utilizador</th>
              <th className="px-5 py-4">Contacto</th>
              <th className="px-5 py-4">Roles</th>
              <th className="px-5 py-4">Estado</th>
              <th className="px-5 py-4 text-right">Ações</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.uid} className="hover:bg-slate-50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {user.fotoPerfil ? (
                      <img
                        src={user.fotoPerfil}
                        alt={user.nome}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                        {user.nome.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <p className="font-semibold text-slate-900">
                        {user.nome}
                      </p>
                      <p className="text-xs text-slate-500">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm text-slate-700">
                    {user.telefone || "Sem telefone"}
                  </p>
                  <p className="max-w-xs truncate text-xs text-slate-400">
                    {user.endereco || "Sem endereço"}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <div className="flex max-w-sm flex-wrap gap-2">
                    {user.roles.length === 0 ? (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
                        Sem roles
                      </span>
                    ) : (
                      user.roles.map((role) => (
                        <span
                          key={role.id}
                          className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-medium text-cyan-800"
                        >
                          {role.name}
                        </span>
                      ))
                    )}
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                      user.ativo
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        user.ativo ? "bg-emerald-500" : "bg-red-500"
                      }`}
                    />

                    {user.ativo ? "Ativo" : "Inativo"}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      title="Editar utilizador"
                      onClick={() => onEdit(user)}
                      className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      type="button"
                      title="Gerir roles"
                      onClick={() => onManageRoles(user)}
                      className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700"
                    >
                      <ShieldCheck size={17} />
                    </button>

                    <button
                      type="button"
                      title={user.ativo ? "Desativar" : "Ativar"}
                      onClick={() => onChangeStatus(user)}
                      className={`rounded-lg border p-2 ${
                        user.ativo
                          ? "border-red-200 text-red-600 hover:bg-red-50"
                          : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                      }`}
                    >
                      {user.ativo ? (
                        <PowerOff size={17} />
                      ) : (
                        <Power size={17} />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}