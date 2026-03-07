"use client"; // ⚠️ obrigatório para usar hooks no App Router

import { useState } from "react";
import { useParams } from "next/navigation";
import { ProductTypeModal } from "@/components/admin/modals/ProductTypeModal";
import { ProductTypesTable } from "@/components/admin/tables/ProductTypesTable";
import { ProductTypeResponse } from "@/types/admin/product-types";
import { useProductTypes } from "@/hooks/admin /product/types/useProductTypes";
import { UserRole } from "@/enum/enum";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";


export default function ProductTypesPage() {
    useRoleGuard([UserRole.ADMIN]);
  const params = useParams();

  // ✅ Garante que temos apenas uma string
  const establishmentId = Array.isArray(params?.establishmentId)
    ? params.establishmentId[0]
    : params?.establishmentId;

  if (!establishmentId) return <p>ID do estabelecimento não encontrado</p>;

  const { data, loading, refresh } = useProductTypes(establishmentId);

  const [selected, setSelected] = useState<ProductTypeResponse | null>(null);
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
        establishmentId={establishmentId}
      />

      {(openModal || selected) && (
        <ProductTypeModal
          establishmentId={establishmentId}
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