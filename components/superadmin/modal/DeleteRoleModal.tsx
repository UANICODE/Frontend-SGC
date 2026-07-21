"use client";

import { Trash2, TriangleAlert } from "lucide-react";
import { UserManagementModal } from "./UserManagementModal";
import { RoleItemResponse } from "@/types/superadmin/users/listRoles";
import { useDeleteRole } from "@/hooks/superadmin/users/useDeleteRole";
import { useToast } from "@/ context/ToastContext";

interface DeleteRoleModalProps {
  role: RoleItemResponse | null;
  onClose: () => void;
  onDeleted: () => Promise<void> | void;
}

export function DeleteRoleModal({
  role,
  onClose,
  onDeleted,
}: DeleteRoleModalProps) {
  const { execute, loading } = useDeleteRole();
  const { showToast } = useToast();

  if (!role) {
    return null;
  }

  async function handleDelete() {
    if (!role) return;

    try {
      const result = await execute(role.id);

      showToast(result.message, "success");

      onClose();
      await onDeleted();
    } catch (error: any) {
      showToast(
        error?.message || "Não foi possível eliminar a role.",
        "error"
      );
    }
  }

  return (
    <UserManagementModal
      open
      title="Eliminar role"
      description="Esta operação não pode ser desfeita."
      onClose={onClose}
      maxWidth="max-w-md"
    >
      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-red-100 p-2">
            <TriangleAlert
              size={20}
              className="text-red-700"
            />
          </div>

          <div>
            <p className="font-semibold text-red-900">
              Eliminar {role.name}?
            </p>

            <p className="mt-1 text-sm leading-6 text-red-700">
              A role só será eliminada quando não estiver
              atribuída a nenhum utilizador.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Role selecionada
        </p>

        <p className="mt-1 font-bold text-slate-900">
          {role.name}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Identificador: {role.id}
        </p>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 size={18} />

          {loading ? "A eliminar..." : "Eliminar role"}
        </button>
      </div>
    </UserManagementModal>
  );
}