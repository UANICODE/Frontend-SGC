"use client";

import { useState } from "react";
import {
  createIngredient,
  updateIngredient,
} from "@/service/admin/ingredients";
import { IngredientItemResponse } from "@/types/admin/ingredients";
import { useToast } from "@/ context/ToastContext";


interface Props {
  establishmentId: string;
  ingredient: IngredientItemResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function IngredientModal({
  establishmentId,
  ingredient,
  onClose,
  onSuccess,
}: Props) {
  const { showToast } = useToast();

  const [name, setName] = useState(ingredient?.name ?? "");
  const [unitName, setUnitName] = useState(ingredient?.unitName ?? "");
  const [unitSymbol, setUnitSymbol] = useState(ingredient?.unitSymbol ?? "");
const [quantity, setQuantity] = useState<number | undefined>(
  ingredient?.quantity
);
  const [minimumLimit, setMinimumLimit] = useState(
    ingredient?.minimumLimit ?? 0
  );
  const [loading, setLoading] = useState(false);

  const isEdit = !!ingredient;

  async function handleSubmit() {
    if (!name.trim()) {
      showToast("Nome é obrigatório.", "error");
      return;
    }

    try {
      setLoading(true);

      if (isEdit) {
        await updateIngredient({
          establishmentId,
          ingredientId: ingredient!.id,
          name,
          unitName,
          unitSymbol,
          quantity,
          minimumLimit,
        });

        showToast("Ingrediente atualizado com sucesso!", "success");
      } else {
        await createIngredient({
          establishmentId,
          name,
          unitName,
          unitSymbol,
          quantity: quantity ?? 0,
          minimumLimit,
        });

        showToast("Ingrediente criado com sucesso!", "success");
      }

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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-8 rounded-xl space-y-6 shadow-xl">

        <h2 className="text-xl font-bold text-primary">
          {isEdit ? "Editar Ingrediente" : "Novo Ingrediente"}
        </h2>

        {/* Nome */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            Nome do ingrediente
          </label>
          <input
            id="name"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Unidade */}
        <div className="space-y-2">
          <label htmlFor="unitName" className="text-sm font-medium text-gray-700">
            Nome da unidade
          </label>
          <input
            id="unitName"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            value={unitName}
            onChange={(e) => setUnitName(e.target.value)}
          />
        </div>

        {/* Símbolo */}
        <div className="space-y-2">
          <label htmlFor="unitSymbol" className="text-sm font-medium text-gray-700">
            Símbolo da unidade
          </label>
          <input
            id="unitSymbol"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            value={unitSymbol}
            onChange={(e) => setUnitSymbol(e.target.value)}
          />
        </div>

        {/* Quantidade */}
        <div className="space-y-2">
          <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
            Quantidade disponível
          </label>
         <input
        id="quantity"
        type="number"
        className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
        value={quantity ?? ""}
        onChange={(e) =>
          setQuantity(
            e.target.value === "" ? undefined : Number(e.target.value)
          )
        }
        placeholder="Ex: 10.5"
      />
        </div>

        {/* Limite mínimo */}
        <div className="space-y-2">
          <label htmlFor="minimumLimit" className="text-sm font-medium text-gray-700">
            Limite mínimo de estoque
          </label>
          <input
            id="minimumLimit"
            type="number"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            value={minimumLimit}
            onChange={(e) => setMinimumLimit(Number(e.target.value))}
          />
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            disabled={loading}
            onClick={onClose}
            className="px-5 py-2 rounded-lg border hover:bg-gray-50"
          >
            Cancelar
          </button>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="bg-primary text-white px-5 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            {loading && (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>

      </div>
    </div>
  );
}