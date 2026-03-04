"use client";

import { CreateProductModal } from "@/components/admin/modals/CreateProductModal";
import { ProductFilters } from "@/components/admin/ProductFilters";
import { ProductsTable } from "@/components/admin/tables/ProductsTable";
import { useProducts } from "@/hooks/admin /product/useProducts";
import { ProductItemResponse } from "@/types/admin/product";
import { useState } from "react";

interface PageProps {
  params: {
    establishmentId: string;
  };
}

export default function ProductsPage({ params }: PageProps) {
  const { data, filters, setFilters, refresh } =
    useProducts(params.establishmentId);

  const [openCreate, setOpenCreate] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductItemResponse | null>(null);

  return (
    <div className="space-y-8">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">
          Gestão de Produtos
        </h1>

        <button
          onClick={() => setOpenCreate(true)}
          className="bg-primary text-white px-5 py-2 rounded-lg hover:opacity-90 transition"
        >
          Novo Produto
        </button>
      </div>

      <ProductFilters
        filters={filters}
        setFilters={setFilters}
        establishmentId={params.establishmentId}
      />

      <ProductsTable
        data={data}
        establishmentId={params.establishmentId}
        onEdit={setSelectedProduct}
        onRefresh={refresh}
      />

      {openCreate && (
        <CreateProductModal
          establishmentId={params.establishmentId}
          onClose={() => setOpenCreate(false)}
          onSuccess={refresh}
        />
      )}

      {selectedProduct && (
        <CreateProductModal
          establishmentId={params.establishmentId}
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSuccess={refresh}
        />
      )}
    </div>
  );
}