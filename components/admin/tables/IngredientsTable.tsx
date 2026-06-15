"use client";

import {
  IngredientItemResponse,
  ListIngredientsResponse,
} from "@/types/admin/ingredients";
import { useState } from "react";
import { DeleteIngredientModal } from "../modals/DeleteIngredientModal";
import { Edit, Trash2, Package, AlertTriangle, TrendingDown, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  data: ListIngredientsResponse | null;
  establishmentId: string;
  onEdit: (ingredient: IngredientItemResponse) => void;
  onRefresh: () => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function IngredientsTable({
  data,
  establishmentId,
  onEdit,
  onRefresh,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: Props) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  if (!data || data.content.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
          <Package className="w-10 h-10 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">Nenhum ingrediente cadastrado</p>
        <p className="text-sm text-gray-400 mt-1">Clique em "Novo Ingrediente" para começar</p>
      </div>
    );
  }

  const getStockStatus = (quantity: number, minimumLimit: number) => {
    if (quantity <= 0) return { label: "Esgotado", color: "text-red-600 bg-red-100", icon: AlertTriangle };
    if (quantity <= minimumLimit) return { label: "Stock Baixo", color: "text-amber-600 bg-amber-100", icon: TrendingDown };
    return { label: "Normal", color: "text-green-600 bg-green-100", icon: Package };
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-primary to-secondary text-white">
                <th className="p-4 text-left rounded-tl-2xl">Nome</th>
                <th className="p-4 text-center">Quantidade</th>
                <th className="p-4 text-center">Unidade</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center rounded-tr-2xl">Ações</th>
               </tr>
            </thead>

            <tbody>
              {data.content.map((ing, idx) => {
                const status = getStockStatus(ing.quantity, ing.minimumLimit);
                const StatusIcon = status.icon;
                const isHovered = hoveredRow === ing.id;

                return (
                  <tr
                    key={ing.id}
                    className={`border-t border-gray-100 transition-all duration-200 group ${
                      isHovered ? "bg-gradient-to-r from-primary/5 to-secondary/5" : "hover:bg-gray-50/80"
                    }`}
                    onMouseEnter={() => setHoveredRow(ing.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isHovered ? "bg-gradient-to-br from-primary/20 to-secondary/20 scale-110" : "bg-gradient-to-br from-primary/10 to-secondary/10"
                        }`}>
                          <Package className={`w-5 h-5 transition-all duration-300 ${
                            isHovered ? "text-primary scale-110" : "text-primary/70"
                          }`} />
                        </div>
                        <span className="font-semibold text-gray-800">
                          {ing.name}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center justify-center px-3 py-1 rounded-lg font-bold ${
                        ing.quantity <= ing.minimumLimit && ing.quantity > 0
                          ? "bg-amber-100 text-amber-700"
                          : ing.quantity <= 0
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {ing.quantity}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-medium text-gray-700">{ing.unitSymbol}</span>
                        <span className="text-xs text-gray-400">{ing.unitName}</span>
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                      {ing.minimumLimit > 0 && (
                        <p className="text-xs text-gray-400 mt-1">
                          Mínimo: {ing.minimumLimit} {ing.unitSymbol}
                        </p>
                      )}
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => onEdit(ing)}
                          className="group/btn relative overflow-hidden bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-1.5 text-xs font-medium"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                          <Edit className="w-3.5 h-3.5 relative z-10" />
                          <span className="relative z-10">Editar</span>
                        </button>

                        <button
                          onClick={() => setDeleteId(ing.id)}
                          className="group/btn relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-1.5 text-xs font-medium"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                          <Trash2 className="w-3.5 h-3.5 relative z-10" />
                          <span className="relative z-10">Excluir</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Info de total e Paginação */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            Total de ingredientes: <span className="font-semibold text-gray-700">{totalItems}</span>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-primary hover:text-white hover:border-primary"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                    if (i === 4) pageNum = totalPages;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  if (pageNum === undefined) return null;

                  if (i === 3 && totalPages > 5 && currentPage <= 3) {
                    return <span key="dots1" className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>;
                  }
                  if (i === 1 && totalPages > 5 && currentPage >= totalPages - 2) {
                    return <span key="dots2" className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>;
                  }
                  if (i === 2 && totalPages > 5 && currentPage > 3 && currentPage < totalPages - 2) {
                    return <span key="dots3" className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${
                        currentPage === pageNum
                          ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md scale-105"
                          : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-primary hover:text-white hover:border-primary"
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Info de registros exibidos */}
        {totalItems > 0 && (
          <div className="px-6 py-2 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-400">
            Mostrando {((currentPage - 1) * 10) + 1} a {Math.min(currentPage * 10, totalItems)} de {totalItems} registros
          </div>
        )}
      </div>

      {/* Modal de exclusão */}
      {deleteId && (
        <DeleteIngredientModal
          establishmentId={establishmentId}
          ingredientId={deleteId}
          onClose={() => setDeleteId(null)}
          onSuccess={onRefresh}
        />
      )}
    </>
  );
}