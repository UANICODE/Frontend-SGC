"use client";

import { ProductTypeResponse } from "@/types/admin/product-types";
import { useState } from "react";
import { DeleteProductTypeModal } from "../modals/DeleteProductTypeModal";

interface Props {
  data: ProductTypeResponse[];
  loading: boolean;
  establishmentId: string;
  onEdit: (type: ProductTypeResponse) => void;
  onRefresh: () => void;
}

export function ProductTypesTable({
  data,
  loading,
  establishmentId,
  onEdit,
  onRefresh,
}: Props) {

  const [deleteId, setDeleteId] = useState<string | null>(null);

  // ⚡ Loader com spinner
  if (loading)
    return (
      <div className="flex justify-center items-center py-10">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  // ✅ Caso não haja dados
  if (!data || data.length === 0)
    return (
      <div className="text-center text-gray-500 py-10">
        Nenhum tipo de produto cadastrado
      </div>
    );

  return (
    <div className="bg-white rounded-2xl border shadow-md overflow-hidden">

      <table className="w-full text-sm">

        <thead className="bg-secondary text-white">
          <tr>
            <th className="p-4 text-center">Nome</th>
            <th className="text-center">Descrição</th>
            <th className="text-center">Ações</th>
          </tr>
        </thead>

        <tbody>
          {data.map((type) => (
            <tr key={type.id} className="border-t hover:bg-gray-50">

              <td className="p-4 text-center font-medium">
                {type.name}
              </td>

              <td className="text-center">
                {type.description}
              </td>

              <td className="text-center">
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => onEdit(type)}
                    className="text-primary hover:underline"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => setDeleteId(type.id)}
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
        <DeleteProductTypeModal
          establishmentId={establishmentId}
          typeId={deleteId}
          onClose={() => setDeleteId(null)}
          onSuccess={onRefresh}
        />
      )}
    </div>
  );
}