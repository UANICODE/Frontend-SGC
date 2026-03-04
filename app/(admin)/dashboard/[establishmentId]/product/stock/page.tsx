"use client";

import { AddStockModal } from "@/components/admin/modals/AddStockModal";
import { UpdateStockModal } from "@/components/admin/modals/UpdateStockModal";
import { ProductStockTable } from "@/components/admin/tables/ ProductStockTable";
import { useProductStocks } from "@/hooks/admin /product/stock/ useProductStocks";
import { ProductStockItemResponse } from "@/types/admin/product-stock";
import { useState } from "react";

export default function ProductStockPage({ params }: any) {
  const { data, loading, refresh } =
    useProductStocks(params.establishmentId);

  const [openAdd, setOpenAdd] = useState(false);
  const [selected, setSelected] =
    useState<ProductStockItemResponse | null>(null);

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-primary">
          Gestão de Stock
        </h1>

        <button
          onClick={() => setOpenAdd(true)}
          className="bg-primary text-white px-6 py-3 rounded-xl shadow-lg"
        >
          Adicionar Stock
        </button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        data && (
          <ProductStockTable
            data={data.content}
            onUpdate={setSelected}
          />
        )
      )}

      {openAdd && (
        <AddStockModal
          establishmentId={params.establishmentId}
          onClose={() => setOpenAdd(false)}
          onSuccess={refresh}
        />
      )}

      {selected && (
        <UpdateStockModal
          establishmentId={params.establishmentId}
          item={selected}
          onClose={() => setSelected(null)}
          onSuccess={refresh}
        />
      )}
    </div>
  );
}