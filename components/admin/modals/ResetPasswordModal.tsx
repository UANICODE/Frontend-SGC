"use client";

import { useToast } from "@/ context/ToastContext";
import { resetUserPassword } from "@/service/admin/user";
import { useState } from "react";

export function ResetPasswordModal({
  establishmentId,
  user,
  onClose,
  onSuccess,
}: any) {
  const { showToast } = useToast();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  async function handleReset() {
    if (password !== confirm) {
      showToast("As senhas não coincidem.", "error");
      return;
    }

    try {
      await resetUserPassword({
        establishmentId,
        userUid: user.userUid,
        newPassword: password,
      });

      showToast("Senha redefinida com sucesso!", "success");
      onSuccess();
      onClose();
    } catch {}
  }

  return (
    <div className="modal">
      <div className="modal-card animate-slideUp">
        <h2 className="text-xl font-bold mb-4">
          Redefinir Senha
        </h2>

        <input
          type="password"
          placeholder="Nova senha"
          className="input"
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirmar senha"
          className="input mt-3"
          onChange={(e) => setConfirm(e.target.value)}
        />

        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose}>Cancelar</button>
          <button
            onClick={handleReset}
            className="bg-primary text-white px-6 py-2 rounded-lg"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}