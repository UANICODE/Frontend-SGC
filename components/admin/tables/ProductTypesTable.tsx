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

  if (loading)
    return <div className="text-secondary">Carregando...</div>;

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
          {data.map((type) => (
            <tr key={type.id} className="border-t hover:bg-gray-50">
              <td className="p-4 font-medium">{type.name}</td>
              <td>{type.description}</td>
              <td className="flex gap-4 justify-end pr-6">
                <button
                  onClick={() => onEdit(type)}
                  className="text-primary"
                >
                  Editar
                </button>

                <button
                  onClick={() => setDeleteId(type.id)}
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