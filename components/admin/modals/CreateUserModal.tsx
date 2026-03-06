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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!form.password || !form.confirmPassword) {
      showToast("Preencha ambos os campos de senha.", "error");
      return;
    }

    if (form.password !== form.confirmPassword) {
      showToast("As senhas não coincidem.", "error");
      return;
    }

    try {
      setLoading(true);

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
    } catch (error) {
      showToast("Erro ao criar usuário.", "error");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition";

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">
      <div className="bg-white p-8 rounded-2xl w-full max-w-lg space-y-4 shadow-lg animate-fadeIn">
        <h2 className="text-xl font-bold">Novo Usuário</h2>

        <input
          placeholder="Nome"
          className={inputClass}
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
        />

        <input
          placeholder="Email"
          className={inputClass}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        {/* Campo de senha com toggle */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
            className={`${inputClass} pr-12`}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {/* Confirmar senha com toggle */}
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirmar Senha"
            className={`${inputClass} pr-12`}
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <select
          className={inputClass}
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:scale-105 transition disabled:opacity-60"
          >
            {loading ? "Criando..." : "Criar"}
          </button>
        </div>
      </div>
    </div>
  );
}