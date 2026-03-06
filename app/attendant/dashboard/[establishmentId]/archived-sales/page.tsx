"use client";

import { useParams, useRouter } from "next/navigation";
import { PageLoader } from "@/components/ui/PageLoader";
import { useArchivedSales } from "@/hooks/attendant/useArchivedSales";
import { useSale } from "@/hooks/attendant/useSale";
import { useToast } from "@/ context/ToastContext";

import { ArrowPathIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/outline";

export default function ArchivedSalesPage() {
  const { establishmentId, cashRegisterId } = useParams() as any;
  const router = useRouter();
  const toast = useToast();
  const { data, loading, error, restore: restoreSaleFromHook, restoringId } =
    useArchivedSales(establishmentId, cashRegisterId);

  const { sale } = useSale(establishmentId);

  const handleRestore = async (saleId: string) => {
    try {
      await restoreSaleFromHook(saleId);
      router.push(
        `/attendant/dashboard/${establishmentId}/sales?saleId=${saleId}&cashRegisterId=${cashRegisterId}`
      );
    } catch (e: any) {
      toast.showToast(e.message || "Não foi possível recuperar a venda", "error");
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Vendas Arquivadas</h1>

      {error && <div className="bg-red-100 text-red-600 p-4 rounded-xl">{error}</div>}

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
              <p className="font-medium">Venda: #{sale.saleId.slice(0, 8)}</p>
              <p className="font-medium">Subtotal: {sale.subtotal} MZN</p>
              <p className="font-medium">Desconto: {sale.discount} MZN</p>
              <p className="text-sm text-gray-500">Total: MZN {sale.total}</p>
            </div>

            <button
              disabled={restoringId === sale.saleId}
              onClick={() => handleRestore(sale.saleId)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              {restoringId === sale.saleId ? (
                <>
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
                  Restaurando...
                </>
              ) : (
                <>
                  <ArrowUturnLeftIcon className="w-5 h-5" />
                  Recuperar
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}