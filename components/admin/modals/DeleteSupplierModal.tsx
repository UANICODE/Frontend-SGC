"use client";

import { useToast } from "@/ context/ToastContext";
import { deleteSupplier } from "@/service/admin/supplier";
import { SupplierItemResponse } from "@/types/admin/supplier";
import React from "react";

interface Props {
  establishmentId: string;
  supplier: SupplierItemResponse;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteSupplierModal({
  establishmentId,
  supplier,
  onClose,
  onSuccess,
}: Props) {
  const { showToast } = useToast();
  const [loading, setLoading] = React.useState(false);

  async function handleDelete() {
    try {
      setLoading(true);

      await deleteSupplier({
        establishmentId,
        supplierId: supplier.supplierId,
      });

      showToast("Fornecedor removido com sucesso!", "success");
      onSuccess(); // 🔥 refresh
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message, "error");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md space-y-6">
        <h2 className="text-xl font-bold text-red-600">
          Confirmar Exclusão
        </h2>

        <p className="text-gray-600">
          Tem certeza que deseja remover o fornecedor{" "}
          <span className="font-semibold">{supplier.name}</span>?
        </p>

        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Cancelar
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-6 py-2 bg-red-600 text-white rounded-lg"
          >
            {loading ? "Removendo..." : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}