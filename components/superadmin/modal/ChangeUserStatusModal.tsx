"use client";

import { Power, PowerOff } from "lucide-react";
import { UserManagementModal } from "./UserManagementModal";
import { useChangeUserStatus } from "@/hooks/superadmin/users/useChangeUserStatus";
import { UserItemResponse } from "@/types/superadmin/users/listUsers";
import { useToast } from "@/ context/ToastContext";

interface ChangeUserStatusModalProps {
  user: UserItemResponse | null;
  onClose: () => void;
  onChanged: () => Promise<void> | void;
}

export function ChangeUserStatusModal({
  user,
  onClose,
  onChanged,
}: ChangeUserStatusModalProps) {
  const { execute, loading } = useChangeUserStatus();
  const { showToast } = useToast();

  if (!user) {
    return null;
  }

  const newStatus = !user.ativo;

  async function handleChangeStatus() {
    if (!user) return;
    try {
      const result = await execute(user.uid, newStatus);

      showToast(result.message, "success");

      onClose();
      await onChanged();
    } catch (error: any) {
      showToast(
        error?.message || "Não foi possível alterar o estado.",
        "error"
      );
    }
  }

  return (
    <UserManagementModal
      open
      title={newStatus ? "Ativar utilizador" : "Desativar utilizador"}
      description={`Confirme a alteração do acesso de ${user.nome}.`}
      onClose={onClose}
      maxWidth="max-w-md"
    >
      <div
        className={`rounded-xl border p-4 ${
          newStatus
            ? "border-emerald-200 bg-emerald-50"
            : "border-red-200 bg-red-50"
        }`}
      >
        <p
          className={`text-sm ${
            newStatus ? "text-emerald-800" : "text-red-800"
          }`}
        >
          {newStatus
            ? "O utilizador voltará a conseguir aceder ao sistema."
            : "O utilizador deixará de conseguir aceder ao sistema."}
        </p>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Cancelar
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={handleChangeStatus}
          className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white disabled:opacity-50 ${
            newStatus
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {newStatus ? <Power size={18} /> : <PowerOff size={18} />}

          {loading
            ? "A processar..."
            : newStatus
              ? "Ativar"
              : "Desativar"}
        </button>
      </div>
    </UserManagementModal>
  );
}