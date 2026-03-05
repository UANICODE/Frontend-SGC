"use client";

import { CashRegisterCard } from "@/components/admin/cards/CashRegisterCard";
import { useOpenCashRegisters } from "@/hooks/admin /cash-register/useOpenCashRegisters";


export default function OpenCashRegistersPage({
  params,
}: any) {
  const { data, loading } =
    useOpenCashRegisters(params.establishmentId);

  return (
    <div className="space-y-10 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold">
          Caixas Abertos
        </h1>
        <p className="text-gray-500 mt-2">
          Visualize todos os caixas atualmente abertos neste
          estabelecimento.
        </p>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : data.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow text-center">
          <p className="text-gray-500 text-lg">
            Não há nenhum caixa aberto neste estabelecimento.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {data.map((cash) => (
            <CashRegisterCard
              key={cash.cashRegisterId}
              cash={cash}
            />
          ))}
        </div>
      )}
    </div>
  );
}