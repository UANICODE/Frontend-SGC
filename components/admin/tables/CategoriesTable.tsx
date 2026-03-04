"use client";

import {
  ListCategoriesResponse,
  CategoryItemResponse,
} from "@/types/admin/categories";

import { useState } from "react";
import { DeleteCategoryModal } from "../modals/DeleteCategoryModal";

interface Props {
  establishmentId: string;
  data: ListCategoriesResponse | null;
  onEdit: (category: CategoryItemResponse) => void;
  onRefresh: () => void;
}

export function CategoriesTable({
establishmentId,
  data,
  onEdit,
  onRefresh,
}: Props) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (!data) return null;

  return (
    <div className="bg-white rounded-2xl border shadow-md overflow-hidden">

      <table className="w-full text-sm">
        <thead className="bg-secondary text-white">
          <tr>
            <th className="p-4 text-left">Nome</th>
            <th>Descrição</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {data.content.map((cat) => (
            <tr key={cat.id} className="border-t hover:bg-gray-50">
              <td className="p-4 font-medium">{cat.name}</td>
              <td>{cat.description}</td>
              <td className="flex gap-4 justify-end pr-6">
                <button
                  onClick={() => onEdit(cat)}
                  className="text-primary"
                >
                  Editar
                </button>

                <button
                  onClick={() => setDeleteId(cat.id)}
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
        <DeleteCategoryModal
         establishmentId={establishmentId}
          categoryId={deleteId}
          onClose={() => setDeleteId(null)}
          onSuccess={onRefresh}
        />
      )}
    </div>
  );
}