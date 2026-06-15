"use client";

import { ProductTypeResponse } from "@/types/admin/product-types";
import { useState } from "react";
import { DeleteProductTypeModal } from "../modals/DeleteProductTypeModal";
import { Edit, Trash2, Layers, ChevronLeft, ChevronRight, Package, AlignLeft } from "lucide-react";

interface Props {
  data: ProductTypeResponse[];
  loading: boolean;
  establishmentId: string;
  onEdit: (type: ProductTypeResponse) => void;
  onRefresh: () => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function ProductTypesTable({
  data,
  loading,
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

  // Loader animado
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-lg">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Layers className="w-6 h-6 text-primary/60 animate-pulse" />
          </div>
        </div>
        <p className="mt-4 text-gray-500 font-medium">Carregando tipos de produto...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
          <Layers className="w-10 h-10 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">Nenhum tipo de produto cadastrado</p>
        <p className="text-sm text-gray-400 mt-1">
          {totalItems > 0 ? "Tente ajustar os filtros" : "Clique em 'Novo Tipo' para começar"}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-primary to-secondary text-white">
                <th className="p-4 text-left rounded-tl-2xl">Nome</th>
                <th className="p-4 text-left">Descrição</th>
                <th className="p-4 text-center rounded-tr-2xl w-32">Ações</th>
               </tr>
            </thead>

            <tbody>
              {data.map((type) => {
                const isHovered = hoveredRow === type.id;

                return (
                  <tr
                    key={type.id}
                    className={`border-t border-gray-100 transition-all duration-200 group ${
                      isHovered ? "bg-gradient-to-r from-primary/5 to-secondary/5" : "hover:bg-gray-50/80"
                    }`}
                    onMouseEnter={() => setHoveredRow(type.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isHovered ? "bg-gradient-to-br from-primary/20 to-secondary/20 scale-110" : "bg-gradient-to-br from-primary/10 to-secondary/10"
                        }`}>
                          <Layers className={`w-5 h-5 transition-all duration-300 ${
                            isHovered ? "text-primary scale-110" : "text-primary/70"
                          }`} />
                        </div>
                        <span className="font-semibold text-gray-800">
                          {type.name}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      {type.description ? (
                        <div className="flex items-start gap-2">
                          <AlignLeft className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-600 line-clamp-2 max-w-md">
                            {type.description}
                          </p>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          Sem descrição
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => onEdit(type)}
                          className="group/btn relative overflow-hidden bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-1.5 text-xs font-medium"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                          <Edit className="w-3.5 h-3.5 relative z-10" />
                          <span className="relative z-10">Editar</span>
                        </button>

                        <button
                          onClick={() => setDeleteId(type.id)}
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
        {totalItems > 0 && (
          <>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-500">
                Total de tipos: <span className="font-semibold text-gray-700">{totalItems}</span>
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
            <div className="px-6 py-2 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-400">
              Mostrando {((currentPage - 1) * 10) + 1} a {Math.min(currentPage * 10, totalItems)} de {totalItems} registros
            </div>
          </>
        )}
      </div>

      {/* Modal de exclusão */}
      {deleteId && (
        <DeleteProductTypeModal
          establishmentId={establishmentId}
          typeId={deleteId}
          onClose={() => setDeleteId(null)}
          onSuccess={onRefresh}
        />
      )}
    </>
  );
}