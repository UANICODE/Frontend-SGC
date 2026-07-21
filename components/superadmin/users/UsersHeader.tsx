"use client";

import { Plus, RefreshCw, ShieldCheck, Users } from "lucide-react";

interface UsersHeaderProps {
  totalUsers: number;
  activeUsers: number;
  loading: boolean;
  onCreateUser: () => void;
  onManageRoles: () => void;
  onRefresh: () => void;
}

export function UsersHeader({
  totalUsers,
  activeUsers,
  loading,
  onCreateUser,
  onManageRoles,
  onRefresh,
}: UsersHeaderProps) {
  return (
    <div className="overflow-hidden rounded-2xl bg-slate-950 shadow-xl">
      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:p-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 p-3">
              <Users className="h-6 w-6 text-white" />
            </div>

            <div>
              <p className="text-sm font-medium text-blue-300">
                Administração global
              </p>

              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                Gestão de utilizadores
              </h1>
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
            Crie utilizadores, edite dados, controle o acesso e
            administre as roles disponíveis no SGC.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <div className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Total
              </p>
              <p className="text-2xl font-bold text-white">{totalUsers}</p>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Ativos nesta página
              </p>
              <p className="text-2xl font-bold text-emerald-400">
                {activeUsers}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <button
            type="button"
            onClick={onCreateUser}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Novo utilizador
          </button>

          <button
            type="button"
            onClick={onManageRoles}
            className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
          >
            <ShieldCheck size={18} />
            Gerir roles
          </button>

          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-600 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            <RefreshCw
              size={18}
              className={loading ? "animate-spin" : ""}
            />
            Atualizar
          </button>
        </div>
      </div>
    </div>
  );
}