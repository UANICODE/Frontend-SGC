"use client";

import { CashRegisterCard } from "@/components/attendant/cards/CashRegisterCard";
import { CashClosingReceiptPreview } from "@/components/attendant/CashClosingReceiptPreview";
import { CashRegisterFilters } from "@/components/attendant/CashRegisterFilters";
import { PageLoader } from "@/components/ui/PageLoader";
import { useEstablishment } from "@/hooks/admin /useEstablishment";

import { useCashRegisters } from "@/hooks/attendant/useCashRegisters";
import { useOpenCashRegister } from "@/hooks/attendant/useOpenCashRegister";

import { closeCashRegister } from "@/service/attendant/closeCash";
import { createSale } from "@/service/attendant/sale";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { CashClosingReceipt } from "@/types/attendant/CashRegister";
import { useToast } from "@/ context/ToastContext";

import { ArrowPathIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function AttendantHome() {
  const { establishmentId } = useParams() as any;
  const router = useRouter();
  const [sellingCashId, setSellingCashId] = useState<string | null>(null);
  const { data: establishment } = useEstablishment(establishmentId);
  const toast = useToast();
  const [closingReceipt, setClosingReceipt] = useState<CashClosingReceipt | null>(null);
  const [closingId, setClosingId] = useState<string | null>(null);

  const { execute: executeOpenCash, loading: opening } = useOpenCashRegister();

  const [today, setToday] = useState(false);
  const [status, setStatus] = useState<"ABERTO" | "FECHADO" | null>(null);

  const { data, loading, error, openCash, refresh } = useCashRegisters({
    establishmentId,
    today,
    status,
  });

  const [page, setPage] = useState(1);
  const pageSize = 6;

  // Filtra duplicatas antes de paginar
  const uniqueCashRegisters = useMemo(() => {
    return Array.from(new Map(data.map(item => [item.id, item])).values());
  }, [data]);

  const paginated = useMemo(() => {
    return uniqueCashRegisters.slice((page - 1) * pageSize, page * pageSize);
  }, [uniqueCashRegisters, page]);

  const totalPages = Math.ceil(uniqueCashRegisters.length / pageSize);

  async function handleOpenCash() {
    try {
      await executeOpenCash(establishmentId);
      toast.showToast("Caixa aberto com sucesso!", "success");
      await refresh();
    } catch (error: any) {
      toast.showToast(error.message || "Erro ao abrir caixa", "error");
    }
  }

  async function handleCloseCash(cashId: string) {
    try {
      setClosingId(cashId);
      const receipt = await closeCashRegister(cashId);
      setClosingReceipt(receipt);
      toast.showToast("Caixa fechado com sucesso!", "success");
      await refresh();
    } catch (error: any) {
      toast.showToast(error.message || "Erro ao fechar caixa", "error");
    } finally {
      setClosingId(null);
    }
  }

  async function handleSell(cashId: string) {
    try {
      setSellingCashId(cashId);
      const sale = await createSale({ establishmentId, cashRegisterId: cashId });
      toast.showToast("Venda iniciada!", "success");
      router.push(
        `/attendant/dashboard/${establishmentId}/sales?saleId=${sale.saleId}&cashRegisterId=${cashId}`
      );
    } catch (error: any) {
      toast.showToast(error.message || "Erro ao iniciar venda", "error");
    } finally {
      setSellingCashId(null);
    }
  }

  if (loading || !establishment) return <PageLoader />;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold" style={{ color: establishment.primaryColor }}>
          Meus Caixas
        </h1>

        <button
          onClick={refresh}
          className="px-4 py-2 rounded-lg border text-sm flex items-center gap-2 hover:bg-gray-100"
        >
          <ArrowPathIcon className="w-5 h-5" />
          Atualizar
        </button>
      </div>

      <CashRegisterFilters
        today={today}
        status={status}
        onTodayChange={() => setToday(prev => !prev)}
        onStatusChange={setStatus}
      />

      {!openCash && (
        <button
          onClick={handleOpenCash}
          disabled={opening}
          className="px-6 py-3 rounded-xl text-white flex items-center justify-center gap-2 disabled:opacity-50"
          style={{ backgroundColor: establishment.primaryColor }}
        >
          <PlusIcon className="w-5 h-5" />
          {opening ? "Abrindo..." : "Abrir Caixa"}
        </button>
      )}

      {error && <div className="bg-red-100 text-red-600 p-4 rounded-xl">{error}</div>}

      {paginated.length === 0 ? (
        <div className="bg-gray-100 border rounded-xl p-8 text-center text-gray-500">
          Não existem caixas para os filtros selecionados.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((cash, idx) => (
            <CashRegisterCard
              key={`${cash.id}-${idx}`}
              cash={cash}
              primaryColor={establishment.primaryColor}
              secondaryColor={establishment.secondaryColor}
              onSell={handleSell}
              onClose={handleCloseCash}
              closing={closingId === cash.id}
              sellingCashId={sellingCashId}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${page === i + 1 ? "bg-black text-white" : "bg-gray-200"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {closingReceipt && (
        <CashClosingReceiptPreview
          receipt={closingReceipt}
          onClose={() => setClosingReceipt(null)}
        />
      )}
    </div>
  );
}