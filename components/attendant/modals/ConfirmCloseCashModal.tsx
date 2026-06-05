"use client";

import { X, AlertTriangle, ShoppingCart } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;

  title?: string;
  description?: string;
  confirmText?: string;
  variant?: "danger" | "success";
}

export function ConfirmCloseCashModal({
  open,
  onClose,
  onConfirm,
  loading,
  title = "Confirmar Fecho",
  description = "Tem certeza que deseja fechar este caixa?",
  confirmText = "Sim, Fechar",
  variant = "danger",
}: Props) {
  if (!open) return null;

  const isDanger = variant === "danger";

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fadeIn">

          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2
              className={`text-lg font-bold flex items-center gap-2 ${
                isDanger ? "text-red-600" : "text-green-600"
              }`}
            >
              {isDanger ? <AlertTriangle size={20} /> : <ShoppingCart size={20} />}
              {title}
            </h2>

            <button onClick={onClose}>
              <X />
            </button>
          </div>

          {/* Conteúdo */}
          <p className="text-gray-600 text-sm mb-6">
            {description}
            {isDanger && (
              <>
                <br />
                <span className="text-red-500 font-semibold">
                  Esta ação não pode ser desfeita.
                </span>
              </>
            )}
          </p>

          {/* Ações */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
            >
              Cancelar
            </button>

            <button
              onClick={onConfirm}
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-white transition flex items-center gap-2 ${
                isDanger
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading && (
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
              )}
              {loading ? "Processando..." : confirmText}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}