"use client";

import { useToast } from "@/ context/ToastContext";
import { createUser } from "@/service/admin/user";
import React, { useState } from "react";

const ROLES = ["ADMIN", "ATENDENTE"];

export function CreateUserModal({
  establishmentId,
  onClose,
  onSuccess,
}: any) {
  const { showToast } = useToast();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "EMPLOYEE",
  });

  async function handleSubmit() {
    if (form.password !== form.confirmPassword) {
      showToast("As senhas não coincidem.", "error");
      return;
    }

    try {
      await createUser({
        establishmentId,
        nome: form.nome,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      showToast("Usuário criado com sucesso!", "success");
      onSuccess();
      onClose();
    } catch (error) {}
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4">
      <div className="bg-white p-8 rounded-2xl w-full max-w-lg space-y-4">
        <h2 className="text-xl font-bold">Novo Usuário</h2>

        <input
          placeholder="Nome"
          className="input"
          onChange={(e) =>
            setForm({ ...form, nome: e.target.value })
          }
        />

        <input
          placeholder="Email"
          className="input"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Senha"
          className="input"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Confirmar Senha"
          className="input"
          onChange={(e) =>
            setForm({
              ...form,
              confirmPassword: e.target.value,
            })
          }
        />

        <select
          className="input"
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
        >
          {ROLES.map((role) => (
            <option key={role}>{role}</option>
          ))}
        </select>

        <div className="flex justify-end gap-4 pt-4">
          <button onClick={onClose}>Cancelar</button>
          <button
            onClick={handleSubmit}
            className="bg-primary text-white px-6 py-2 rounded-lg"
          >
            Criar
          </button>
        </div>
      </div>
    </div>
  );
}