"use client";

import { ProductStockItemResponse } from "@/types/admin/product-stock";

interface Props {
  data: ProductStockItemResponse[];
  onUpdate: (item: ProductStockItemResponse) => void;
}

export function ProductStockTable({ data, onUpdate }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-md border overflow-x-auto">
      <table className="w-full text-sm min-w-[600px]">
        <thead className="bg-secondary text-white">
          <tr>
            <th className="p-4 text-left">Produto</th>
            <th>Quantidade</th>
            <th>Última Atualização</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.productId} className="border-t hover:bg-gray-50">
              <td className="p-4">{item.productName}</td>
              <td>{item.quantity}</td>
              <td>{new Date(item.lastUpdateDate).toLocaleDateString()}</td>
              <td className="text-right pr-6">
                <button
                  onClick={() => onUpdate(item)}
                  className="text-primary"
                >
                  Atualizar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}