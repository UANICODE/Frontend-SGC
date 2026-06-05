"use client";

import { useToast } from "@/ context/ToastContext";
import { deleteProduct } from "@/service/admin/products";
import { useState } from "react";

interface Props {
  establishmentId: string;
  productId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteProductModal({
  establishmentId,
  productId,
  onClose,
  onSuccess,
}: Props) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    try {
      setLoading(true);

      await deleteProduct(establishmentId, productId);

      showToast("Produto excluído com sucesso!", "success");
      onSuccess();
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl space-y-4">
        <p>Deseja realmente excluir?</p>

        <div className="flex gap-3">
          <button
            disabled={loading}
            onClick={onClose}
            className="border px-4 py-2 rounded"
          >
            Cancelar
          </button>

          <button
            disabled={loading}
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Excluindo..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}