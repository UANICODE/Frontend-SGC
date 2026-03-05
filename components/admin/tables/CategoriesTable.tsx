"use client";

import { CategoryItemResponse } from "@/types/admin/categories";
import { useState } from "react";
import { DeleteCategoryModal } from "../modals/DeleteCategoryModal";

interface Props {
  establishmentId: string;
  data: CategoryItemResponse[] | null;
  loading: boolean; // ✅ adicionamos loading
  onEdit: (category: CategoryItemResponse) => void;
  onRefresh: () => void;
}

export function CategoriesTable({ establishmentId, data, loading, onEdit, onRefresh }: Props) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // ⚡ Loader animado centralizado
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500">Carregando categorias...</p>
      </div>
    );
  }

  if (loading) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-500">Carregando categorias...</p>
    </div>
  );
}

// Depois do loading
if (!data) {
  return null; // ainda não chegou nada
}

if (data.length === 0) {
  return (
    <div className="text-center text-gray-500 py-10">
      Nenhuma categoria encontrada
    </div>
  );
}

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
          {data.map((cat) => (
            <tr key={cat.id} className="border-t hover:bg-gray-50">
              <td className="p-4 font-medium">{cat.name}</td>
              <td>{cat.description}</td>
              <td className="flex gap-4 justify-end pr-6">
                <button onClick={() => onEdit(cat)} className="text-primary">
                  Editar
                </button>
                <button onClick={() => setDeleteId(cat.id)} className="text-red-600">
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