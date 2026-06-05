"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import { CreateProductModal } from "@/components/admin/modals/CreateProductModal";
import { ProductFilters } from "@/components/admin/ProductFilters";
import { ProductsTable } from "@/components/admin/tables/ProductsTable";
import { ProductItemResponse } from "@/types/admin/product";
import { useProducts } from "@/hooks/admin /product/useProducts";
import { useToast } from "@/ context/ToastContext";
import { UserRole } from "@/enum/enum";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";



export default function ProductsPage() {
    useRoleGuard([UserRole.ADMIN]);
  const params = useParams();
  const establishmentIdParam = params?.establishmentId;
  const establishmentId = Array.isArray(establishmentIdParam)
    ? establishmentIdParam[0]
    : establishmentIdParam;

  const productsHook = establishmentId ? useProducts(establishmentId) : null;
  const { showToast } = useToast();
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItemResponse | null>(null);

  if (!establishmentId) return <p>Carregando...</p>;

  const {  setFilters, refresh, loading } = productsHook!;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Gestão de Produtos</h1>

   
      </div>


      {/* 🔹 Spinner centralizado */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">Carregando produtos...</p>
        </div>
      ) : (
       <ProductsTable
        establishmentId={establishmentId}
        filters={productsHook!.filters}
        setFilters={productsHook!.setFilters}
        filteredProducts={productsHook!.filteredProducts}
        loading={productsHook!.loading}
        refresh={productsHook!.refresh}
      />
      )}

      {openCreate && (
        <CreateProductModal
          establishmentId={establishmentId}
          onClose={() => setOpenCreate(false)}
       onSuccess={() => {
        refresh();
        showToast(selectedProduct ? "Produto atualizado!" : "Produto criado!", "success");
      }}
        />
      )}

      {selectedProduct && (
        <CreateProductModal
          establishmentId={establishmentId}
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSuccess={refresh}
        />
      )}
    </div>
  );
}