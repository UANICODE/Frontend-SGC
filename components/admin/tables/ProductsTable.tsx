"use client";


import { ListProductsResponse, ProductItemResponse } from "@/types/admin/product";
import { useState } from "react";
import { DeleteProductModal } from "../modals/DeleteProductModal";

interface Props {
  data: ListProductsResponse | null;
  establishmentId: string;
  onEdit: (product: ProductItemResponse) => void;
  onRefresh: () => void;
}

export function ProductsTable({
  data,
  establishmentId,
  onEdit,
  onRefresh,
}: Props) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (!data) return null;

  return (
    <div className="bg-white rounded-xl border overflow-hidden">

      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 text-left">Nome</th>
            <th>Preço</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {data.content.map((product) => (
            <tr key={product.id} className="border-t">
              <td className="p-4">{product.name}</td>
              <td>{product.price}</td>
              <td>
                {product.active ? "Ativo" : "Inativo"}
              </td>
              <td className="flex gap-3 justify-end pr-4">
                <button onClick={() => onEdit(product)}>
                  Editar
                </button>

                <button onClick={() => setDeleteId(product.id)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {deleteId && (
        <DeleteProductModal
          establishmentId={establishmentId}
          productId={deleteId}
          onClose={() => setDeleteId(null)}
          onSuccess={onRefresh}
        />
      )}
    </div>
  );
}