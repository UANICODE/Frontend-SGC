"use client";

import { FormEvent, useState } from "react";
import { UserPlus } from "lucide-react";
import { UserManagementModal } from "./UserManagementModal";
import { useCreateUser } from "@/hooks/superadmin/users/useCreateUser";
import { useToast } from "@/ context/ToastContext";

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => Promise<void> | void;
}

const initialForm = {
  nome: "",
  email: "",
  password: "",
  confirmPassword: "",
  telefone: "",
  endereco: "",
  fotoPerfil: "",
};

export function CreateUserModal({
  open,
  onClose,
  onCreated,
}: CreateUserModalProps) {
  const [form, setForm] = useState(initialForm);
  const { execute, loading } = useCreateUser();
  const { showToast } = useToast();

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    try {
      await execute({
        nome: form.nome,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        telefone: form.telefone || null,
        endereco: form.endereco || null,
        fotoPerfil: form.fotoPerfil || null,
      });

      showToast("Utilizador criado com sucesso!", "success");

      setForm(initialForm);
      onClose();
      await onCreated();
    } catch (error: any) {
      showToast(
        error?.message || "Não foi possível criar o utilizador.",
        "error"
      );
    }
  }

  return (
    <UserManagementModal
      open={open}
      title="Criar utilizador"
      description="O utilizador será criado ativo e sem roles."
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

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            required
            type="password"
            minLength={8}
            maxLength={100}
            value={form.password}
            onChange={(event) =>
              setForm({
                ...form,
                password: event.target.value,
              })
            }
            placeholder="Password"
            className={inputClass}
          />

          <input
            required
            type="password"
            value={form.confirmPassword}
            onChange={(event) =>
              setForm({
                ...form,
                confirmPassword: event.target.value,
              })
            }
            placeholder="Confirmar password"
            className={inputClass}
          />
        </div>

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
            <UserPlus size={18} />
            {loading ? "A criar..." : "Criar utilizador"}
          </button>
        </div>
      </form>
    </UserManagementModal>
  );
}