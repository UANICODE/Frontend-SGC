"use client";

import { useParams } from "next/navigation";
import { PageLoader } from "@/components/ui/PageLoader";
import { useArchivedSales } from "@/hooks/attendant/useArchivedSales";

export default function ArchivedSalesPage() {
  const { establishmentId, cashRegisterId } = useParams() as any;

  const {
    data,
    loading,
    error,
    restore,
    restoringId,
  } = useArchivedSales(establishmentId, cashRegisterId);

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Vendas Arquivadas
      </h1>

      {error && (
        <div className="bg-red-100 text-red-600 p-4 rounded-xl">
          {error}
        </div>
      )}

      {data.length === 0 && (
        <div className="bg-gray-100 p-6 rounded-xl text-gray-500 text-center">
          Não existem vendas arquivadas.
        </div>
      )}

      <div className="space-y-4">
        {data.map((sale) => (
          <div
            key={sale.saleId}
            className="bg-white p-6 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <p className="font-medium">
                Venda #{sale.saleId.slice(0, 8)}
              </p>
              <p className="text-sm text-gray-500">
                Total: € {sale.total}
              </p>
            </div>

            <button
              disabled={restoringId === sale.saleId}
              onClick={() => restore(sale.saleId)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              {restoringId === sale.saleId
                ? "Restaurando..."
                : "Recuperar"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}