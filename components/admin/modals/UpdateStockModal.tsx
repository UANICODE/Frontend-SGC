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
  const [quantityToAdd, setQuantityToAdd] = useState(0);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    try {
      setLoading(true);

      await updateProductStock({
        establishmentId,
        productId: item.productId,
        quantityToAdd,
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

  const result = item.quantity + quantityToAdd;

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
          <label className="text-sm text-gray-500">
            Quantidade a adicionar
          </label>
          <input
            type="number"
            className="w-full border p-3 rounded-lg mt-1"
            value={quantityToAdd}
            onChange={(e) => setQuantityToAdd(Number(e.target.value))}
          />
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