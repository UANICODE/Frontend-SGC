"use client";
import { useState } from "react";
import { ListProductsRequest, ProductItemResponse } from "@/types/admin/product";
import { deleteProduct } from "@/service/admin/products";
import { CreateProductModal } from "../modals/CreateProductModal";
import { ProductFilters } from "../ProductFilters";
import { useToast } from "@/ context/ToastContext";
import { 
  Edit, 
  Trash2, 
  Package, 
  Image as ImageIcon, 
  Tag, 
  Layers, 
  DollarSign, 
  Box, 
  Power, 
  FlaskConical,
  ChevronLeft,
  ChevronRight,
  Search
} from "lucide-react";

interface ProductsTableProps {
  establishmentId: string;
  filters: ListProductsRequest;
  setFilters: (value: ListProductsRequest) => void;
  filteredProducts: ProductItemResponse[];
  loading: boolean;
  refresh: () => void;
}

export function ProductsTable({ 
  establishmentId,
  filters,
  setFilters,
  filteredProducts,
  loading,
  refresh 
}: ProductsTableProps) {
  const { showToast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItemResponse | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (product: ProductItemResponse) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Deseja realmente excluir este produto?")) return;

    try {
      setDeletingId(productId);
      await deleteProduct(establishmentId, productId);
      showToast("Produto excluído com sucesso!", "success");
      await refresh();
    } catch (err) {
      console.error(err);
      showToast("Erro ao excluir produto.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      <ProductFilters
        establishmentId={establishmentId}
        filters={filters}
        setFilters={setFilters}
      />

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" />
            Produtos
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie todos os produtos do seu estabelecimento
          </p>
        </div>
        <button
          onClick={() => { setSelectedProduct(null); setModalOpen(true); }}
          className="group relative overflow-hidden bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 font-medium"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Package className="w-5 h-5 relative z-10" />
          <span className="relative z-10">Novo Produto</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-lg">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="w-6 h-6 text-primary/60 animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-gray-500 font-medium">Carregando produtos...</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[1300px]">
                <thead>
                  <tr className="bg-gradient-to-r from-primary to-secondary text-white">
                    <th className="p-4 text-center rounded-tl-2xl">ID</th>
                    <th className="p-4 text-center">Catálogo</th>
                    <th className="p-4 text-left">Nome</th>
                    <th className="p-4 text-center">Tipo</th>
                    <th className="p-4 text-left">Categoria</th>
                    <th className="p-4 text-center">Preço</th>
                    <th className="p-4 text-center">Estoque</th>
                    <th className="p-4 text-center">Ativo</th>
                    <th className="p-4 text-left">Ingredientes</th>
                    <th className="p-4 text-center rounded-tr-2xl">Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedProducts.map((p) => {
                    const isHovered = hoveredRow === p.id;
                    const isComposite = p.ingredients?.length && p.ingredients.length > 0;
                    
                    return (
                      <tr
                        key={p.id}
                        className={`border-t border-gray-100 transition-all duration-200 ${
                          isHovered ? "bg-gradient-to-r from-primary/5 to-secondary/5" : "hover:bg-gray-50/80"
                        }`}
                        onMouseEnter={() => setHoveredRow(p.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                        <td className="p-4 text-center">
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {p.id.substring(0, 8)}...
                          </span>
                        </td>

                        <td className="p-4 text-center">
                          {p.imageurl ? (
                            <img
                              src={p.imageurl}
                              alt={p.name}
                              className="w-12 h-12 object-cover rounded-xl shadow-md mx-auto"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto">
                              <ImageIcon className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                              isHovered ? "bg-gradient-to-br from-primary/20 to-secondary/20 scale-110" : "bg-gradient-to-br from-primary/10 to-secondary/10"
                            }`}>
                              <Package className={`w-4 h-4 transition-all duration-300 ${
                                isHovered ? "text-primary scale-110" : "text-primary/70"
                              }`} />
                            </div>
                            <span className="font-semibold text-gray-800">
                              {p.name}
                            </span>
                          </div>
                        </td>

                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            isComposite 
                              ? "bg-purple-100 text-purple-700" 
                              : "bg-blue-100 text-blue-700"
                          }`}>
                            <FlaskConical className="w-3 h-3" />
                            {isComposite ? "Composto" : "Simples"}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-gray-600">{p.categoryName || "-"}</span>
                          </div>
                        </td>

                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <DollarSign className="w-3.5 h-3.5 text-green-600" />
                            <span className="font-bold text-gray-800">
                              {p.price?.toFixed(2) || "0.00"} MT
                            </span>
                          </div>
                        </td>

                        <td className="p-4 text-center">
                          {p.stockQuantity !== null && p.stockQuantity !== undefined ? (
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                              p.stockQuantity > 0 
                                ? "bg-green-100 text-green-700" 
                                : "bg-red-100 text-red-700"
                            }`}>
                              <Box className="w-3 h-3" />
                              {p.stockQuantity}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>

                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            p.active 
                              ? "bg-green-100 text-green-700" 
                              : "bg-gray-100 text-gray-500"
                          }`}>
                            <Power className="w-3 h-3" />
                            {p.active ? "Ativo" : "Inativo"}
                          </span>
                        </td>

                        <td className="p-4 max-w-[200px]">
                          {p.ingredients?.length && p.ingredients.length > 0 ? (
                            <div className="space-y-1">
                              {p.ingredients.slice(0, 2).map((i, idx) => (
                                <div key={i.ingredientId || idx} className="text-xs text-gray-600">
                                  <span className="font-medium">{i.ingredientName}:</span> {i.quantityUsed}
                                </div>
                              ))}
                              {p.ingredients.length > 2 && (
                                <div className="text-xs text-gray-400">
                                  +{p.ingredients.length - 2} mais
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs">Sem ingredientes</span>
                          )}
                        </td>

                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(p)}
                              className="group/btn relative overflow-hidden bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-1.5 text-xs font-medium"
                              disabled={loading}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-700 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                              <Edit className="w-3.5 h-3.5 relative z-10" />
                              <span className="relative z-10">Editar</span>
                            </button>

                            <button
                              onClick={() => handleDelete(p.id)}
                              disabled={loading || deletingId === p.id}
                              className="group/btn relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-1.5 text-xs font-medium disabled:opacity-50 disabled:hover:scale-100"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                              {deletingId === p.id ? (
                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin relative z-10" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5 relative z-10" />
                              )}
                              <span className="relative z-10">
                                {deletingId === p.id ? "..." : "Excluir"}
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Total e Paginação */}
            {totalItems > 0 && (
              <>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-sm text-gray-500">
                    Total de produtos: <span className="font-semibold text-gray-700">{totalItems}</span>
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
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
                              onClick={() => handlePageChange(pageNum)}
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
                        onClick={() => handlePageChange(currentPage + 1)}
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

                <div className="px-6 py-2 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-400">
                  Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} produtos
                </div>
              </>
            )}

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                  <Package className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">Nenhum produto encontrado</p>
                <p className="text-sm text-gray-400 mt-1">Tente ajustar os filtros ou crie um novo produto</p>
              </div>
            )}
          </div>
        </>
      )}

      {modalOpen && (
        <CreateProductModal
          establishmentId={establishmentId}
          product={selectedProduct}
          onClose={() => setModalOpen(false)}
          onSuccess={refresh}
        />
      )}
    </div>
  );
}