"use client";

import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import { Search, ListChecks } from "lucide-react"; // ícones

import { ProductStockItemResponse } from "@/types/admin/product-stock";
import { ProductStockTable } from "@/components/admin/tables/ ProductStockTable";
import { UpdateStockModal } from "@/components/admin/modals/UpdateStockModal";
import { useProductStocks } from "@/hooks/admin /product/stock/ useProductStocks";
import { useToast } from "@/ context/ToastContext";
import { UserRole } from "@/enum/enum";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";

export default function ProductStockPage() {
  useRoleGuard([UserRole.ADMIN]);

  const params = useParams();
  const establishmentId = Array.isArray(params.establishmentId)
    ? params.establishmentId[0]
    : params.establishmentId;

  if (!establishmentId) return <p>ID do estabelecimento não encontrado.</p>;

  const { data, loading, refresh } = useProductStocks(establishmentId);
  const [selected, setSelected] = useState<ProductStockItemResponse | null>(
    null
  );
  const { showToast } = useToast();

  const [nameFilter, setNameFilter] = useState("");
  const [quantityFilter, setQuantityFilter] = useState<number | "">("");

  const filteredData = useMemo(() => {
    if (!data?.content) return [];
    return data.content.filter((item) => {
      const matchesName =
        item.productName.toLowerCase().includes(nameFilter.toLowerCase());
      const matchesQuantity =
        quantityFilter === "" || item.quantity === quantityFilter;
      return matchesName && matchesQuantity;
    });
  }, [data?.content, nameFilter, quantityFilter]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">Gestão de Stock</h1>

      {/* Filtros com ícones */}
      <div className="flex gap-4 mb-4">
        <div className="flex items-center border rounded px-3 py-2 flex-1">
          <Search className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Filtrar por nome"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="outline-none flex-1"
          />
        </div>

        <div className="flex items-center border rounded px-3 py-2 w-40">
          <ListChecks className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="number"
            placeholder="Quantidade"
            value={quantityFilter}
            onChange={(e) =>
              setQuantityFilter(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="outline-none flex-1"
          />
        </div>
      </div>

      <ProductStockTable
        data={filteredData}
        loading={loading}
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