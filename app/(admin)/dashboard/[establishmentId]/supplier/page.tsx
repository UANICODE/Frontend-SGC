"use client";

import { DeleteSupplierModal } from "@/components/admin/modals/DeleteSupplierModal";
import { SupplierFormModal } from "@/components/admin/modals/SupplierFormModal";
import { SupplierTable } from "@/components/admin/tables/SupplierTable";
import { useSuppliers } from "@/hooks/admin /supplier/useSuppliers";
import { SupplierItemResponse } from "@/types/admin/supplier";
import { useState } from "react";

export default function SuppliersPage({ params }: any) {
  const { data, loading, refresh } =
    useSuppliers(params.establishmentId);

  const [selected, setSelected] =
    useState<SupplierItemResponse | null>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<SupplierItemResponse | null>(null);

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">
          Gestão de Fornecedores
        </h1>

        <button
          onClick={() => setSelected({} as any)}
          className="bg-primary text-white px-6 py-3 rounded-xl"
        >
          Novo Fornecedor
        </button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        data && (
          <SupplierTable
            data={data.content}
            onEdit={(s) => setSelected(s)}
            onDelete={(s) => setDeleteTarget(s)}
            onChangeStatus={() => {}}
          />
        )
      )}

      {selected && (
        <SupplierFormModal
          establishmentId={params.establishmentId}
          supplier={
            selected.supplierId ? selected : null
          }
          onClose={() => setSelected(null)}
          onSuccess={refresh}
        />
      )}

      {deleteTarget && (
        <DeleteSupplierModal
          establishmentId={params.establishmentId}
          supplier={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onSuccess={refresh}
        />
      )}
    </div>
  );
}