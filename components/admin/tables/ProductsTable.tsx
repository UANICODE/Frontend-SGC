"use client";
import { useState } from "react";
import { ProductItemResponse } from "@/types/admin/product";
import { deleteProduct } from "@/service/admin/products";
import { CreateProductModal } from "../modals/CreateProductModal";
import { ProductFilters } from "../ProductFilters";
import { useToast } from "@/ context/ToastContext";
import { useProducts } from "@/hooks/admin /product/useProducts";

interface ProductsTableProps {
  establishmentId: string;
}

export function ProductsTable({ establishmentId }: ProductsTableProps) {
  const { showToast } = useToast();
  const { filters, setFilters, filteredProducts, loading, refresh } = useProducts(establishmentId);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItemResponse | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  return (
    <div className="space-y-4">
      <ProductFilters
        establishmentId={establishmentId}
        filters={filters}
        setFilters={setFilters}
      />

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Produtos</h2>
        <button
          onClick={() => { setSelectedProduct(null); setModalOpen(true); }}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Novo Produto
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full border-collapse text-left min-w-[1200px]">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border-b font-semibold text-sm">ID</th>
                <th className="p-3 border-b font-semibold text-sm">Catálogo</th>
                <th className="p-3 border-b font-semibold text-sm">Nome</th>
                <th className="p-3 border-b font-semibold text-sm">Tipo</th>
                <th className="p-3 border-b font-semibold text-sm">Categoria</th>
                <th className="p-3 border-b font-semibold text-sm">Preço</th>
                <th className="p-3 border-b font-semibold text-sm">Estoque</th>
                <th className="p-3 border-b font-semibold text-sm">Ativo</th>
                <th className="p-3 border-b font-semibold text-sm">Ingredientes</th>
                <th className="p-3 border-b font-semibold text-sm">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p, index) => (
               <tr 
                key={p.id} 
                className="border-b transition-colors"
              >
                  <td className="p-3 text-sm text-gray-600">{p.id.substring(0, 8)}...</td>
                  <td className="p-3">
                    {p.imageurl ? (
                      <img
                        src={p.imageurl}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                        <span className="text-xs text-gray-400">Sem img</span>
                      </div>
                    )}
                  </td>
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      p.ingredients?.length && p.ingredients.length > 0
                        ? "bg-purple-100 text-purple-700" 
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {p.ingredients?.length && p.ingredients.length > 0 ? "Composto" : "Simples"}
                    </span>
                  </td>
                  <td className="p-3 text-sm">{p.categoryName || "-"}</td>
                  <td className="p-3 font-medium">{p.price?.toFixed(2) || "0.00"} MT</td>
                  <td className="p-3">
                    {p.stockQuantity !== null && p.stockQuantity !== undefined ? (
                      <span className={`text-sm ${
                        p.stockQuantity > 0 ? "text-green-600" : "text-red-600"
                      }`}>
                        {p.stockQuantity}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      p.active 
                        ? "bg-green-100 text-green-700" 
                        : "bg-red-100 text-red-700"
                    }`}>
                      {p.active ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="p-3">
                    {p.ingredients?.length && p.ingredients.length > 0 ? (
                      <div className="max-w-[200px]">
                        {p.ingredients.slice(0, 2).map((i, idx) => (
                          <div key={i.ingredientId || idx} className="text-xs mb-1 text-gray-600">
                            <span className="font-medium">{i.ingredientName}:</span> {i.quantityUsed}
                          </div>
                        ))}
                        {p.ingredients.length > 2 && (
                          <div className="text-xs text-gray-500 mt-1">
                            +{p.ingredients.length - 2} mais
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="px-3 py-1.5 bg-yellow-400 text-white rounded-md text-sm font-medium hover:bg-yellow-500 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                        disabled={loading}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={loading || deletingId === p.id}
                        className={`px-3 py-1.5 rounded-md text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 ${
                          deletingId === p.id
                            ? "bg-gray-400 cursor-not-allowed focus:ring-gray-300"
                            : "bg-red-500 hover:bg-red-600 focus:ring-red-300"
                        }`}
                      >
                        {deletingId === p.id ? "..." : "Excluir"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Nenhum produto encontrado
            </div>
          )}
        </div>
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