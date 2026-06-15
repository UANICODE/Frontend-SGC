// app/admin/dashboard/[establishmentId]/product/stock/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import { Search, ListChecks, Package } from "lucide-react";

import { ProductStockTable } from "@/components/admin/tables/ProductStockTable";
import { UpdateStockModal } from "@/components/admin/modals/UpdateStockModal";
import { RemoveStockModal } from "@/components/admin/modals/RemoveStockModal";
import { useProductStocks } from "@/hooks/admin/product/stock/useProductStocks";
import { useToast } from "@/ context/ToastContext";
import { UserRole } from "@/enum/enum";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";
import { useStockMovements } from "@/hooks/admin/product/stock/useStockMovements";
import { StockMovementsModal } from "@/components/admin/modals/StockMovementsModal";
import { useUserEstablishments } from "@/hooks/admin/useUserEstablishments";
import { TransferStockModal } from "@/components/admin/modals/TransferStockModal";

export default function ProductStockPage() {
  useRoleGuard([UserRole.ADMIN]);

  const params = useParams();
  const establishmentId = Array.isArray(params.establishmentId)
    ? params.establishmentId[0]
    : params.establishmentId;

  if (!establishmentId) {
    return <p className="text-center text-red-500 py-10">ID do estabelecimento não encontrado</p>;
  }

  const { data, loading, refresh } = useProductStocks(establishmentId);
  const { data: movements, loading: loadingMovements, fetch: fetchMovements } = useStockMovements();
  const { data: establishments } = useUserEstablishments();
  const { showToast } = useToast();

  // Estados
  const [selected, setSelected] = useState<any>(null);
  const [removeItem, setRemoveItem] = useState<any>(null);
  const [selectedTransfer, setSelectedTransfer] = useState<any>(null);
  const [openMovements, setOpenMovements] = useState(false);
  const [openTransfer, setOpenTransfer] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [quantityFilter, setQuantityFilter] = useState<number | "">("");

  const filteredData = useMemo(() => {
    if (!data?.content) return [];
    return data.content.filter((item: any) => {
      const matchesName = item.productName.toLowerCase().includes(nameFilter.toLowerCase());
      const matchesQuantity = quantityFilter === "" || item.quantity === quantityFilter;
      return matchesName && matchesQuantity;
    });
  }, [data?.content, nameFilter, quantityFilter]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary flex gap-2 items-center">
          <Package className="w-7 h-7" /> Gestão de Stock
        </h1>

        <button
          onClick={async () => {
            setOpenMovements(true);
            await fetchMovements(establishmentId);
          }}
          className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/80 transition"
        >
          Ver Movimentos
        </button>
      </div>

      {/* FILTROS */}
      <div className="flex gap-4">
        <div className="flex items-center border rounded-xl px-3 py-2 flex-1 bg-white">
          <Search className="w-5 h-5 text-gray-400 mr-2" />
          <input
            placeholder="Filtrar por nome do produto"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="outline-none flex-1"
          />
        </div>

        <div className="flex items-center border rounded-xl px-3 py-2 w-40 bg-white">
          <ListChecks className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="number"
            placeholder="Quantidade"
            value={quantityFilter}
            onChange={(e) => setQuantityFilter(e.target.value === "" ? "" : Number(e.target.value))}
            className="outline-none flex-1"
          />
        </div>

        <button
          onClick={() => {
            setNameFilter("");
            setQuantityFilter("");
          }}
          className="text-sm text-primary underline hover:text-primary/80"
        >
          Limpar
        </button>
      </div>

      {/* TABELA */}
      <ProductStockTable
        data={filteredData}
        loading={loading}
        onUpdate={setSelected}
        onRemove={setRemoveItem}
        onTransfer={(item) => {
          setSelectedTransfer(item);
          setOpenTransfer(true);
        }}
      />

      {/* MODAIS */}
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

      {removeItem && (
        <RemoveStockModal
          establishmentId={establishmentId}
          item={removeItem}
          onClose={() => setRemoveItem(null)}
          onSuccess={() => {
            refresh();
            showToast("Stock removido com sucesso!", "success");
          }}
        />
      )}

      {openTransfer && selectedTransfer && (
        <TransferStockModal
          open={openTransfer}
          onClose={() => setOpenTransfer(false)}
          product={selectedTransfer}
          currentEstablishmentId={establishmentId}
          onSuccess={() => {
            refresh();
            showToast("Transferência feita com sucesso!", "success");
          }}
        />
      )}

      <StockMovementsModal
        open={openMovements}
        onClose={() => setOpenMovements(false)}
        data={movements}
        loading={loadingMovements}
      />
    </div>
  );
}