"use client";

import { FormEvent, useEffect, useState } from "react";
import { Save } from "lucide-react";
import { UserManagementModal } from "./UserManagementModal";
import { useEditRole } from "@/hooks/superadmin/users/useEditRole";
import { RoleItemResponse } from "@/types/superadmin/users/listRoles";
import { useToast } from "@/ context/ToastContext";

interface EditRoleModalProps {
  role: RoleItemResponse | null;
  onClose: () => void;
  onUpdated: () => Promise<void> | void;
}

export function EditRoleModal({
  role,
  onClose,
  onUpdated,
}: EditRoleModalProps) {
  const [name, setName] = useState("");
  const { execute, loading } = useEditRole();
  const { showToast } = useToast();

  useEffect(() => {
    setName(role?.name || "");
  }, [role]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!role) {
      return;
    }

    try {
      const result = await execute(role.id, name);

      showToast(result.message, "success");

      onClose();
      await onUpdated();
    } catch (error: any) {
      showToast(
        error?.message || "Não foi possível editar a role.",
        "error"
      );
    }
  }

  return (
    <UserManagementModal
      open={Boolean(role)}
      title="Editar role"
      description="Roles internas do sistema não podem ser renomeadas."
      onClose={onClose}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit}>
        <input
          required
          minLength={3}
          maxLength={100}
          pattern="^[A-Za-z][A-Za-z0-9_]*$"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-600"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? "A guardar..." : "Guardar"}
          </button>
        </div>
      </form>
    </UserManagementModal>
  );
}