"use client";

import { useToast } from "@/ context/ToastContext";
import { deleteProductType } from "@/service/admin/product-types";
import { useState } from "react";


interface Props {
  establishmentId: string;
  typeId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteProductTypeModal({
  establishmentId,
  typeId,
  onClose,
  onSuccess,
}: Props) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    try {
      setLoading(true);

      await deleteProductType({
        establishmentId,
        typeId,
      });

      showToast("Tipo excluído com sucesso!", "success");

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
        <p>Deseja excluir este tipo de produto?</p>

        <div className="flex gap-4 justify-end">
          <button
            disabled={loading}
            onClick={onClose}
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