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
  const [quantityToAdd, setQuantityToAdd] = useState("");
  const [loading, setLoading] = useState(false);
const quantityNumber = Number(quantityToAdd || 0);
  async function handleSubmit() {
    try {
      setLoading(true);

      await updateProductStock({
        establishmentId,
        productId: item.productId,
        quantityToAdd: quantityNumber,
      });

      showToast("Stock atualizado com sucesso!", "success");

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

const result = Number(
  (item.quantity + quantityNumber).toFixed(2)
);
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl space-y-5 w-full max-w-md">
        
        <h2 className="text-xl font-bold">Entrada de Stock</h2>

        {/* 🔥 Informação do produto */}
        <div>
          <p className="text-sm text-gray-500">Produto</p>
          <p className="font-semibold">{item.productName}</p>
        </div>

        {/* 🔥 Stock atual */}
        <div>
          <p className="text-sm text-gray-500">Stock atual</p>
          <p className="font-semibold">{item.quantity}</p>
        </div>

        {/* 🔥 Explicação clara */}
        <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm p-3 rounded">
          Informe apenas a <strong>quantidade de entrada</strong>.  
          O sistema irá somar automaticamente ao stock existente.
        </div>

        {/* 🔥 Input */}
    <div>
  <label className="text-sm font-medium text-gray-600">
    Quantidade a adicionar
  </label>

  <div className="relative mt-1">
    <input
      type="number"
      step="0.001"
      placeholder="Ex: 0.500"
      value={quantityToAdd}
      onChange={(e) => setQuantityToAdd(e.target.value)}
      className="
        w-full
        border border-gray-300
        rounded-xl
        px-4 py-3
        text-lg
        font-semibold
        outline-none
        focus:ring-2 focus:ring-primary
        focus:border-primary
        transition
      "
    />

 
  </div>
</div>

        {/* 🔥 Preview do resultado */}
        <div className="text-sm text-gray-600">
          Resultado final:{" "}
          <span className="font-bold">{result}</span>
        </div>

        {/* 🔥 Ações */}
        <div className="flex justify-end gap-4 pt-2">
          <button onClick={onClose}>Cancelar</button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-primary text-white px-5 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Atualizando..." : "Adicionar"}
          </button>
        </div>
      </div>
    </div>
  );
}