"use client";

import { useState } from "react";
import { addProductStock } from "@/service/admin/productStock";
import { useToast } from "@/ context/ToastContext";

interface Props {
  establishmentId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddStockModal({
  establishmentId,
  onClose,
  onSuccess,
}: Props) {
  const { showToast } = useToast();

  const [productId, setProductId] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [quantityToAdd, setQuantityToAdd] = useState(0);
  const [referenceDocument, setReferenceDocument] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!productId || !supplierId || quantityToAdd <= 0) {
      showToast("Preencha todos os campos obrigatórios.", "error");
      return;
    }

    try {
      setLoading(true);

      await addProductStock({
        establishmentId,
        productId,
        supplierId,
        quantityToAdd,
        referenceDocument,
      });

      showToast("Stock adicionado com sucesso!", "success");

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
      <div className="bg-white w-full max-w-md p-8 rounded-xl space-y-4">
        <h2 className="text-xl font-bold">Adicionar Stock</h2>

        <input
          placeholder="Product ID"
          className="w-full border p-3 rounded-lg"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />

        <input
          placeholder="Supplier ID"
          className="w-full border p-3 rounded-lg"
          value={supplierId}
          onChange={(e) => setSupplierId(e.target.value)}
        />

        <input
          type="number"
          placeholder="Quantidade"
          className="w-full border p-3 rounded-lg"
          value={quantityToAdd}
          onChange={(e) => setQuantityToAdd(Number(e.target.value))}
        />

        <input
          placeholder="Documento (opcional)"
          className="w-full border p-3 rounded-lg"
          value={referenceDocument}
          onChange={(e) => setReferenceDocument(e.target.value)}
        />

        <div className="flex justify-end gap-4">
          <button onClick={onClose}>Cancelar</button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-primary text-white px-5 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}