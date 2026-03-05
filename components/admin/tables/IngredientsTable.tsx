"use client";

import {
  IngredientItemResponse,
  ListIngredientsResponse,
} from "@/types/admin/ingredients";
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
            <th className="p-4 text-center">Nome</th>
            <th className="text-center">Quantidade</th>
            <th className="text-center">Unidade</th>
            <th className="text-center">Ações</th>
          </tr>
        </thead>

        <tbody>
          {data.content.map((ing) => (
            <tr key={ing.id} className="border-t hover:bg-gray-50">

              <td className="p-4 text-center font-medium">
                {ing.name}
              </td>

              <td className="text-center">
                {ing.quantity}
              </td>

              <td className="text-center">
                {ing.unitSymbol}
              </td>

              <td className="text-center">
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => onEdit(ing)}
                    className="text-primary hover:underline"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => setDeleteId(ing.id)}
                    className="text-red-600 hover:underline"
                  >
                    Excluir
                  </button>
                </div>
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