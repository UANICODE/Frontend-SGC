"use client";

import { useState } from "react";
import { updateProductStock } from "@/service/admin/productStock";
import { useToast } from "@/ context/ToastContext";
import { ProductStockItemResponse } from "@/types/admin/product-stock";

interface Props {
  establishmentId: string;
  item: ProductStockItemResponse;
  onClose: () => void;
  onSuccess: () => void;
}

export function UpdateStockModal({
  establishmentId,
  item,
  onClose,
  onSuccess,
}: Props) {
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(item.quantity);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    try {
      setLoading(true);

      await updateProductStock({
        establishmentId,
        productId: item.productId,
        quantity,
      });

      showToast("Stock atualizado com sucesso!", "success");

      onSuccess(); // 🔥 reload automático
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
      <div className="bg-white p-8 rounded-xl space-y-4 w-full max-w-md">
        <h2 className="text-xl font-bold">Atualizar Stock</h2>

        <input
          type="number"
          className="w-full border p-3 rounded-lg"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />

        <div className="flex justify-end gap-4">
          <button onClick={onClose}>Cancelar</button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-primary text-white px-5 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Atualizando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}