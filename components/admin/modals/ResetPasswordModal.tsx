"use client";

import { useToast } from "@/ context/ToastContext";
import { resetUserPassword } from "@/service/admin/user";
import { useState } from "react";
import { motion } from "framer-motion";
import { X, Key, Lock, Eye, EyeOff, Shield, AlertCircle } from "lucide-react";

interface Props {
  establishmentId: string;
  user: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function ResetPasswordModal({
  establishmentId,
  user,
  onClose,
  onSuccess,
}: Props) {
  const { showToast } = useToast();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    if (!password || !confirm) {
      showToast("Preencha ambos os campos de senha.", "error");
      return;
    }

    if (password !== confirm) {
      showToast("As senhas não coincidem.", "error");
      return;
    }

    if (password.length < 8) {
      showToast("A senha deve ter pelo menos 8 caracteres.", "error");
      return;
    }

    try {
      setLoading(true);
      await resetUserPassword({
        establishmentId,
        userUid: user.userUid,
        newPassword: password,
      });

      showToast("Senha redefinida com sucesso!", "success");
      onSuccess();
      onClose();
    } catch (error: any) {
      showToast(error.message || "Erro ao redefinir senha", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <Key className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Redefinir Senha</h2>
                <p className="text-white/80 text-sm">
                  Usuário: {user?.nome}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Aviso */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
            <Shield className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-amber-800">Informação de segurança</p>
              <p className="text-xs text-amber-700">
                A nova senha deve ter pelo menos 8 caracteres. Recomendamos uma senha forte com letras, números e símbolos.
              </p>
            </div>
          </div>

          {/* Nova Senha */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              Nova Senha *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Digite a nova senha"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white text-gray-800 placeholder-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirmar Senha */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              Confirmar Senha *
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirme a nova senha"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white text-gray-800 placeholder-gray-400"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Validações visuais */}
          {password && confirm && (
            <div className={`rounded-xl p-3 ${password === confirm ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
              <div className="flex items-center gap-2">
                {password === confirm ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-xs text-green-700">✓ As senhas coincidem</p>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <p className="text-xs text-red-700">✗ As senhas não coincidem</p>
                  </>
                )}
              </div>
            </div>
          )}

          {password && password.length < 8 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <p className="text-xs text-amber-700">⚠️ A senha deve ter pelo menos 8 caracteres</p>
              </div>
            </div>
          )}

          {/* Força da senha (opcional) */}
          {password && password.length >= 8 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <p className="text-xs text-blue-700">
                  ✓ Senha válida! {password.length} caracteres
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer com botões */}
        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
          >
            Cancelar
          </button>

          <button
            onClick={handleReset}
            disabled={loading || !password || !confirm || password !== confirm || password.length < 8}
            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Redefinindo...
              </>
            ) : (
              <>
                <Key className="w-4 h-4" />
                Redefinir Senha
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}