"use client";

import { useToast } from "@/ context/ToastContext";
import { DeleteSupplierModal } from "@/components/admin/modals/DeleteSupplierModal";
import { SupplierFormModal } from "@/components/admin/modals/SupplierFormModal";
import { SupplierTable } from "@/components/admin/tables/SupplierTable";
import { useSuppliers } from "@/hooks/admin /supplier/useSuppliers";
import { changeSupplierStatus } from "@/service/admin/supplier";
import { SupplierItemResponse } from "@/types/admin/supplier";
import { useParams } from "next/navigation";
import { useState } from "react";
import { UserRole } from "@/enum/enum";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";


export default function SuppliersPage() {

    useRoleGuard([UserRole.ADMIN]);
  const params = useParams<{ establishmentId: string }>();

  const establishmentId = params.establishmentId;

  const { data, loading, refresh } = useSuppliers(establishmentId);

  const [selected, setSelected] =
    useState<SupplierItemResponse | null>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<SupplierItemResponse | null>(null);
const { showToast } = useToast();
const [changingStatusId, setChangingStatusId] = useState<string | null>(null);

async function handleChangeStatus(supplier: SupplierItemResponse) {
  try {
    setChangingStatusId(supplier.id);

    const newStatus =
      supplier.status === "ATIVO" ? "INATIVO" : "ATIVO";


     await changeSupplierStatus({
        establishmentId,
        supplierId: supplier.id,
        status: newStatus,
      });


    showToast("Status alterado com sucesso!", "success");

    await refresh();
  } catch {
    showToast("Erro ao alterar status", "error");
  } finally {
    setChangingStatusId(null);
  }
}
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
        <div className="flex flex-col items-center justify-center py-10">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">Carregando fornecedores...</p>
        </div>
      ) : (
        data && (
          <SupplierTable
          data={data.content}
          onEdit={(s) => setSelected(s)}
          onDelete={(s) => setDeleteTarget(s)}
          onChangeStatus={handleChangeStatus}
          changingStatusId={changingStatusId}
        />
        )
      )}
      {selected && (
        <SupplierFormModal
          establishmentId={establishmentId}
          supplier={
            selected.id ? selected : null
          }
          onClose={() => setSelected(null)}
        onSuccess={() => {
        refresh();
        showToast(selected.id ? "Fornecedor atualizado!" : "Fornecedor criado!", "success");
      }}
        />
      )}

      {deleteTarget && (
        <DeleteSupplierModal
          establishmentId={establishmentId}
          supplier={deleteTarget}
          onClose={() => setDeleteTarget(null)}
         onSuccess={() => {
          refresh();
          showToast("Fornecedor removido com sucesso!", "success");
        }}
        />
      )}
    </div>
  );
}