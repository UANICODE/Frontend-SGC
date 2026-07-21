"use client";

import { FormEvent, useEffect, useState } from "react";
import { Save } from "lucide-react";
import { UserManagementModal } from "./UserManagementModal";
import { useEditUser } from "@/hooks/superadmin/users/useEditUser";
import { UserItemResponse } from "@/types/superadmin/users/listUsers";
import { useToast } from "@/ context/ToastContext";

interface EditUserModalProps {
  user: UserItemResponse | null;
  onClose: () => void;
  onUpdated: () => Promise<void> | void;
}

export function EditUserModal({
  user,
  onClose,
  onUpdated,
}: EditUserModalProps) {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    fotoPerfil: "",
  });

  const { execute, loading } = useEditUser();
  const { showToast } = useToast();

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100";

  useEffect(() => {
    if (!user) {
      return;
    }

    setForm({
      nome: user.nome,
      email: user.email,
      telefone: user.telefone || "",
      endereco: user.endereco || "",
      fotoPerfil: user.fotoPerfil || "",
    });
  }, [user]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!user) {
      return;
    }

    try {
      const result = await execute(user.uid, {
        nome: form.nome,
        email: form.email,
        telefone: form.telefone || null,
        endereco: form.endereco || null,
        fotoPerfil: form.fotoPerfil || null,
      });

      showToast(result.message, "success");

      onClose();
      await onUpdated();
    } catch (error: any) {
      showToast(
        error?.message || "Não foi possível editar o utilizador.",
        "error"
      );
    }
  }

  return (
    <UserManagementModal
      open={Boolean(user)}
      title="Editar utilizador"
      description="A password, as roles e o estado não serão alterados."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required
          minLength={3}
          maxLength={150}
          value={form.nome}
          onChange={(event) =>
            setForm({
              ...form,
              nome: event.target.value,
            })
          }
          placeholder="Nome completo"
          className={inputClass}
        />

        <input
          required
          type="email"
          maxLength={150}
          value={form.email}
          onChange={(event) =>
            setForm({
              ...form,
              email: event.target.value,
            })
          }
          placeholder="E-mail"
          className={inputClass}
        />

        <input
          maxLength={20}
          value={form.telefone}
          onChange={(event) =>
            setForm({
              ...form,
              telefone: event.target.value,
            })
          }
          placeholder="Telefone"
          className={inputClass}
        />

        <input
          maxLength={255}
          value={form.endereco}
          onChange={(event) =>
            setForm({
              ...form,
              endereco: event.target.value,
            })
          }
          placeholder="Endereço"
          className={inputClass}
        />

        <input
          maxLength={255}
          value={form.fotoPerfil}
          onChange={(event) =>
            setForm({
              ...form,
              fotoPerfil: event.target.value,
            })
          }
          placeholder="URL da fotografia"
          className={inputClass}
        />

        <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? "A guardar..." : "Guardar alterações"}
          </button>
        </div>
      </form>
    </UserManagementModal>
  );
}