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
      setDeletingId(productId); // ativar loading no botão
      await deleteProduct(establishmentId, productId);
      showToast("Produto excluído com sucesso!", "success");
      await refresh();
    } catch (err) {
      console.error(err);
      showToast("Erro ao excluir produto.", "error");
    } finally {
      setDeletingId(null); // desativar loading
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
          className="bg-primary text-white px-4 py-2 rounded-lg"
        >
          Novo Produto
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loader"></span>
        </div>
      ) : (
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
                <th className="p-2 border">Catalogo</th>
              <th className="p-2 border">Nome</th>
              <th className="p-2 border">Tipo</th>
              <th className="p-2 border">Categoria</th>
              <th className="p-2 border">Preço</th>
              <th className="p-2 border">Estoque</th>
              <th className="p-2 border">Ativo</th>
              <th className="p-2 border">Ingredientes</th>
              <th className="p-2 border">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="p-2 border">{p.id}</td>
                 <td className="p-2 border"> {p.imageurl && (
                    <img
                      src={p.imageurl}
                      alt={p.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}</td>
                <td className="p-2 border flex items-center gap-2">
                 
                  {p.name}
                </td>
                <td className="p-2 border">{p.ingredients?.length ? "Composto" : "Simples"}</td>
                <td className="p-2 border">{p.categoryName}</td>
                <td className="p-2 border">{p.price.toFixed(2)} MT</td>
                <td className="p-2 border">{p.stockQuantity ?? "-"}</td>
                <td className="p-2 border">{p.active ? "Sim" : "Não"}</td>
                <td className="p-2 border">
              {p.ingredients?.length ? (
                <ul className="list-disc pl-4 space-y-1">
                  {p.ingredients.map(i => (
                    <li key={i.ingredientId} className="text-sm">
                      {i.ingredientName} — {i.quantityUsed}
                    </li>
                  ))}
                </ul>
              ) : "-"}
            </td>
                <td className="p-2 border flex gap-2">
                  <button
                    disabled={loading}
                    onClick={() => handleEdit(p)}
                    className="bg-yellow-400 px-2 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button
                    disabled={loading || deletingId === p.id}
                    onClick={() => handleDelete(p.id)}
                    className={`px-2 py-1 rounded text-white ${deletingId === p.id ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500'}`}
                  >
                    {deletingId === p.id ? "Excluindo..." : "Excluir"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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