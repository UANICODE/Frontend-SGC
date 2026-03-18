"use client";

import { X, AlertTriangle } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export function ConfirmCloseCashModal({
  open,
  onClose,
  onConfirm,
  loading,
}: Props) {
  if (!open) return null;

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
            <h2 className="text-lg font-bold flex items-center gap-2 text-red-600">
              <AlertTriangle size={20} />
              Confirmar Fecho
            </h2>
            <button onClick={onClose}>
              <X />
            </button>
          </div>

          {/* Conteúdo */}
          <p className="text-gray-600 text-sm mb-6">
            Tem certeza que deseja fechar este caixa?
            <br />
            <span className="text-red-500 font-semibold">
              Esta ação não pode ser desfeita.
            </span>
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
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition flex items-center gap-2"
            >
              {loading && (
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
              )}
              {loading ? "Fechando..." : "Sim, Fechar"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}