"use client";

import { ProductStockItemResponse } from "@/types/admin/product-stock";

interface Props {
  data: ProductStockItemResponse[] | null;
  loading: boolean;
  onUpdate: (item: ProductStockItemResponse) => void;
}

export function ProductStockTable({ data, loading, onUpdate }: Props) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500">Carregando stock...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        Nenhum stock encontrado
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border overflow-x-auto">
      <table className="w-full text-sm min-w-[600px] text-center">
        <thead className="bg-secondary text-white">
          <tr>
            <th className="p-4">Produto</th>
            <th>Quantidade</th>
            <th>Última Atualização</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => {
            const formatDate = (dateString?: string) => {
              if (!dateString) return "-";
              const parsedDate = new Date(dateString.replace(" ", "T"));
              if (isNaN(parsedDate.getTime())) return "-";
              return parsedDate.toISOString().split("T")[0];
            };

            return (
              <tr key={item.productId} className="border-t hover:bg-gray-50">
                <td className="p-4">{item.productName}</td>
                <td>{item.quantity}</td>
                <td>{formatDate(item.data)}</td>
                <td className="text-right pr-6">
                  <button
                    onClick={() => onUpdate(item)}
                    className="bg-primary text-white px-4 py-1 rounded hover:bg-primary/80 transition"
                  >
                    Atualizar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}