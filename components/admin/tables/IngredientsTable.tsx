"use client";

import { IngredientItemResponse, ListIngredientsResponse } from "@/types/admin/ingredients";
import { useState } from "react";
import { DeleteIngredientModal } from "../modals/ DeleteIngredientModal";

interface Props {
  data: ListIngredientsResponse | null;
  establishmentId: string;
  onEdit: (ingredient: IngredientItemResponse) => void;
  onRefresh: () => void;
}

export function IngredientsTable({
  data,
  establishmentId,
  onEdit,
  onRefresh,
}: Props) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (!data) return null;

  return (
    <div className="bg-white rounded-xl border shadow-md overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-secondary text-white">
          <tr>
            <th className="p-4 text-left">Nome</th>
            <th>Quantidade</th>
            <th>Unidade</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {data.content.map((ing) => (
            <tr key={ing.id} className="border-t hover:bg-gray-50">
              <td className="p-4">{ing.name}</td>
              <td>{ing.quantity}</td>
              <td>{ing.unitSymbol}</td>
              <td className="flex gap-4 justify-end pr-6">
                <button onClick={() => onEdit(ing)} className="text-primary">
                  Editar
                </button>
                <button
                  onClick={() => setDeleteId(ing.id)}
                  className="text-red-600"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {deleteId && (
        <DeleteIngredientModal
          establishmentId={establishmentId}
          ingredientId={deleteId}
          onClose={() => setDeleteId(null)}
          onSuccess={onRefresh}
        />
      )}
    </div>
  );
}