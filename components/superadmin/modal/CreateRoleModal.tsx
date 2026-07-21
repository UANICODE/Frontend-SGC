"use client";

import { FormEvent, useState } from "react";
import { Plus } from "lucide-react";
import { UserManagementModal } from "./UserManagementModal";
import { useCreateRole } from "@/hooks/superadmin/users/useCreateRole";
import { useToast } from "@/ context/ToastContext";

interface CreateRoleModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => Promise<void> | void;
}

export function CreateRoleModal({
  open,
  onClose,
  onCreated,
}: CreateRoleModalProps) {
  const [name, setName] = useState("");
  const { execute, loading } = useCreateRole();
  const { showToast } = useToast();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    try {
      const result = await execute(name);

      showToast(result.message, "success");

      setName("");
      onClose();
      await onCreated();
    } catch (error: any) {
      showToast(
        error?.message || "Não foi possível criar a role.",
        "error"
      );
    }
  }

  return (
    <UserManagementModal
      open={open}
      title="Criar role"
      description="O nome será convertido para letras maiúsculas."
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
          placeholder="Exemplo: GESTOR_STOCK"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
        />

        <p className="mt-2 text-xs text-slate-500">
          Utilize apenas letras, números e underscore.
        </p>

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
            <Plus size={18} />
            {loading ? "A criar..." : "Criar role"}
          </button>
        </div>
      </form>
    </UserManagementModal>
  );
}