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
  const [quantity, setQuantity] = useState(ingredient?.quantity ?? 0);
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
          minimumLimit
        });

        showToast("Ingrediente atualizado com sucesso!", "success");
      } else {
        await createIngredient({
          establishmentId,
          name,
          unitName,
          unitSymbol,
          quantity,
          minimumLimit
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md p-8 rounded-xl space-y-6">
        <h2 className="text-xl font-bold text-primary">
          {isEdit ? "Editar Ingrediente" : "Novo Ingrediente"}
        </h2>

        <input
          className="w-full border p-3 rounded-lg"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full border p-3 rounded-lg"
          placeholder="Unidade"
          value={unitName}
          onChange={(e) => setUnitName(e.target.value)}
        />

        <input
          className="w-full border p-3 rounded-lg"
          placeholder="Símbolo"
          value={unitSymbol}
          onChange={(e) => setUnitSymbol(e.target.value)}
        />

        <input
          type="number"
          className="w-full border p-3 rounded-lg"
          placeholder="Quantidade"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />

        <input
          type="number"
          className="w-full border p-3 rounded-lg"
          placeholder="Limite Mínimo"
          value={minimumLimit}
          onChange={(e) => setMinimumLimit(Number(e.target.value))}
        />

        <div className="flex justify-end gap-4">
          <button disabled={loading} onClick={onClose}>
            Cancelar
          </button>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="bg-primary text-white px-5 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}