"use client";

import { ProductTypeModal } from "@/components/admin/modals/ProductTypeModal";
import { ProductTypesTable } from "@/components/admin/tables/ProductTypesTable";
import { useProductTypes } from "@/hooks/admin /product/types/useProductTypes";
import { ProductTypeResponse } from "@/types/admin/product-types";
import { useState } from "react";

interface PageProps {
  params: { establishmentId: string };
}

export default function ProductTypesPage({ params }: PageProps) {
  const { data, loading, refresh } =
    useProductTypes(params.establishmentId);

  const [selected, setSelected] =
    useState<ProductTypeResponse | null>(null);

  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="space-y-10">

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">
          Gestão de Tipos de Produto
        </h1>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-primary text-white px-6 py-3 rounded-xl shadow-lg hover:opacity-90 transition"
        >
          Novo Tipo
        </button>
      </div>

      <ProductTypesTable
        data={data}
        loading={loading}
        onEdit={setSelected}
        onRefresh={refresh}
        establishmentId={params.establishmentId}
      />

      {(openModal || selected) && (
        <ProductTypeModal
          establishmentId={params.establishmentId}
          type={selected}
          onClose={() => {
            setOpenModal(false);
            setSelected(null);
          }}
          onSuccess={refresh}
        />
      )}
    </div>
  );
}