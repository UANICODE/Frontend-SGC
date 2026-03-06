"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import { ProductStockItemResponse } from "@/types/admin/product-stock";
import { ProductStockTable } from "@/components/admin/tables/ ProductStockTable";
import { UpdateStockModal } from "@/components/admin/modals/UpdateStockModal";
import { useProductStocks } from "@/hooks/admin /product/stock/ useProductStocks";
import { useToast } from "@/ context/ToastContext";

export default function ProductStockPage() {
  const params = useParams();
  const establishmentId = Array.isArray(params.establishmentId)
    ? params.establishmentId[0]
    : params.establishmentId;

  if (!establishmentId) return <p>ID do estabelecimento não encontrado.</p>;

  const { data, loading, refresh } = useProductStocks(establishmentId);
  const [selected, setSelected] =
    useState<ProductStockItemResponse | null>(null);
  const { showToast } = useToast();
  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-primary">Gestão de Stock</h1>

      <ProductStockTable
        data={data?.content || []}
        loading={loading} // ✅ Passando loading
        onUpdate={setSelected}
      />

      {selected && (
        <UpdateStockModal
          establishmentId={establishmentId}
          item={selected}
          onClose={() => setSelected(null)}
         onSuccess={() => {
        refresh();
        showToast("Stock atualizado com sucesso!", "success");
      }}
        />
      )}
    </div>
  );
}