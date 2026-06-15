"use client";

import { ProductStockItemResponse } from "@/types/admin/product-stock";
import { Trash2, Plus, ArrowRight, Package, TrendingUp, AlertCircle } from "lucide-react";
import { useState } from "react";

interface Props {
  data: ProductStockItemResponse[] | null;
  loading: boolean;
  onUpdate: (item: ProductStockItemResponse) => void;
  onRemove: (item: ProductStockItemResponse) => void;
  onTransfer: (item: ProductStockItemResponse) => void;
}

export function ProductStockTable({
  data,
  loading,
  onUpdate,
  onRemove,
  onTransfer,
}: Props) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-lg">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="w-6 h-6 text-primary/60 animate-pulse" />
          </div>
        </div>
        <p className="mt-4 text-gray-500 font-medium">Carregando stock...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
          <Package className="w-10 h-10 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">Nenhum stock encontrado</p>
        <p className="text-sm text-gray-400 mt-1">Adicione produtos ao estoque para começar</p>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const parsedDate = new Date(dateString.replace(" ", "T"));
    if (isNaN(parsedDate.getTime())) return "-";
    return parsedDate.toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: "Esgotado", color: "text-red-600 bg-red-100", icon: AlertCircle };
    if (quantity < 10) return { label: "Baixo", color: "text-orange-600 bg-orange-100", icon: AlertCircle };
    return { label: "Normal", color: "text-green-600 bg-green-100", icon: TrendingUp };
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-primary to-secondary text-white">
              <th className="p-4 text-left rounded-tl-2xl">Produto</th>
              <th className="p-4 text-center">Quantidade</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Última Atualização</th>
              <th className="p-4 text-center rounded-tr-2xl">Ações</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => {
              const stockStatus = getStockStatus(item.quantity);
              const StockIcon = stockStatus.icon;
              
              return (
                <tr 
                  key={item.productId} 
                  className="border-t border-gray-100 transition-all duration-200 hover:bg-gray-50/80 group"
                  onMouseEnter={() => setHoveredRow(item.productId)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center">
                        <Package className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-semibold text-gray-800">
                        {item.productName}
                      </span>
                    </div>
                  </td>
                  
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center justify-center px-3 py-1 rounded-lg font-bold text-lg ${
                      item.quantity === 0 
                        ? "bg-red-100 text-red-700" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {item.quantity}
                    </span>
                  </td>
                  
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                      <StockIcon className="w-3 h-3" />
                      {stockStatus.label}
                    </span>
                  </td>
                  
                  <td className="p-4 text-center text-gray-500 text-xs">
                    {formatDate(item.data)}
                  </td>
                  
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onUpdate(item)}
                        className="group/btn relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-1.5 text-xs font-medium"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                        <Plus className="w-3.5 h-3.5 relative z-10" />
                        <span className="relative z-10">Entrada</span>
                      </button>

                      <button
                        onClick={() => onRemove(item)}
                        className="group/btn relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-1.5 text-xs font-medium"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                        <Trash2 className="w-3.5 h-3.5 relative z-10" />
                        <span className="relative z-10">Remover</span>
                      </button>

                      <button
                        onClick={() => onTransfer(item)}
                        disabled={item.quantity <= 0}
                        className={`group/btn relative overflow-hidden px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-1.5 text-xs font-medium ${
                          item.quantity > 0
                            ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-lg hover:scale-105"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {item.quantity > 0 && (
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                        )}
                        <ArrowRight className="w-3.5 h-3.5 relative z-10" />
                        <span className="relative z-10">Transferir</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}