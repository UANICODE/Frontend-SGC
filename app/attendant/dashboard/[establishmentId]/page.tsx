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

import { CashClosingReceipt } from "@/types/attendant/CashRegister";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function AttendantHome() {
  const { establishmentId } = useParams() as any;
  const router = useRouter();

  const { data: establishment } =
    useEstablishment(establishmentId);

  const [closingReceipt, setClosingReceipt] =
    useState<CashClosingReceipt | null>(null);

  const [closingId, setClosingId] =
    useState<string | null>(null);

  const { execute: executeOpenCash, loading: opening } =
    useOpenCashRegister();

  const [today, setToday] = useState(false);
  const [status, setStatus] =
    useState<"ABERTO" | "FECHADO" | null>(null);

  const {
    data,
    loading,
    error,
    openCash,
    refresh,
  } = useCashRegisters({
    establishmentId,
    today,
    status,
  });

  const [page, setPage] = useState(1);
  const pageSize = 6;

  const paginated = data.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalPages = Math.ceil(data.length / pageSize);

  async function handleOpenCash() {
    try {
      await executeOpenCash(establishmentId);
      await refresh();
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function handleCloseCash(cashId: string) {
    try {
      setClosingId(cashId);

      const receipt = await closeCashRegister(cashId);

      setClosingReceipt(receipt);

      await refresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setClosingId(null);
    }
  }

  async function handleSell(cashId: string) {
    try {
      const sale = await createSale({
        establishmentId,
        cashRegisterId: cashId,
      });

      router.push(
        `/attendant/${establishmentId}/sales?saleId=${sale.saleId}&cashRegisterId=${cashId}`
      );
    } catch (error: any) {
      alert(error.message);
    }
  }

  if (loading || !establishment) return <PageLoader />;

  return (
    <div className="space-y-8">

      <div className="flex justify-between items-center">
        <h1
          className="text-2xl font-bold"
          style={{ color: establishment.primaryColor }}
        >
          Meus Caixas
        </h1>

        <button
          onClick={refresh}
          className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-100"
        >
          Atualizar
        </button>
      </div>

      <CashRegisterFilters
        today={today}
        status={status}
        onTodayChange={() => setToday((prev) => !prev)}
        onStatusChange={setStatus}
      />

      {!openCash && (
        <button
          onClick={handleOpenCash}
          disabled={opening}
          className="px-6 py-3 rounded-xl text-white font-medium disabled:opacity-50"
          style={{
            backgroundColor: establishment.primaryColor,
          }}
        >
          {opening ? "Abrindo..." : "Abrir Caixa"}
        </button>
      )}

      {error && (
        <div className="bg-red-100 text-red-600 p-4 rounded-xl">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginated.map((cash) => (
          <CashRegisterCard
            key={cash.id}
            cash={cash}
            primaryColor={establishment.primaryColor}
            secondaryColor={establishment.secondaryColor}
            onSell={handleSell}
            onClose={handleCloseCash}
            closing={closingId === cash.id}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }).map(
            (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  page === i + 1
                    ? "bg-black text-white"
                    : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      )}

      {closingReceipt && (
        <CashClosingReceiptPreview
          receipt={closingReceipt}
          onClose={() => setClosingReceipt(null)}
          onPrint={() => window.print()}
        />
      )}

    </div>
  );
}