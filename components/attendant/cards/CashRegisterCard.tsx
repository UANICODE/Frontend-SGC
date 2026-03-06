"use client";

import { CashRegister } from "@/types/attendant/CashRegister";

interface Props {
  cash: CashRegister;
  primaryColor: string;
  secondaryColor: string;
  onClose: (cashId: string) => void;
  closing?: boolean;
  onSell: (cashId: string) => void;
  sellingCashId?: string | null;
}

export function CashRegisterCard({
  cash,
  primaryColor,
  secondaryColor,
  onSell,
  onClose,
  closing,
  sellingCashId,
}: Props) {
  const isOpen = cash.status === "ABERTO";
  const isSelling = sellingCashId === cash.id;

  return (
    <div
      className={`
        bg-white p-6 rounded-2xl shadow border transform transition-all duration-300
        hover:scale-105 hover:shadow-xl cursor-pointer
        ${isOpen ? "border-4 shadow-2xl" : "border-gray-200"}
      `}
      style={isOpen ? { borderColor: primaryColor } : undefined}
    >
      <div className="flex justify-between mb-3">
        <span className="text-sm text-gray-500">
          {new Date(cash.openedAt).toLocaleString()}
        </span>

        <span
          className={`text-xs px-3 py-1 rounded-full font-semibold ${
            isOpen
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {cash.status}
        </span>
      </div>

      <div className="space-y-1 text-sm">
        <p>Total Vendas: <strong>MZN {cash.totalSalesCalculated}</strong></p>
        <p>Cancelado: <strong>MZN {cash.totalCancelled}</strong></p>
      </div>

      {isOpen && (
        <>
          <button
            onClick={() => onSell(cash.id)}
            disabled={isSelling}
            className={`
              mt-4 w-full py-2 rounded-xl text-white flex justify-center items-center gap-2
              transform transition-all duration-200 hover:scale-105
            `}
            style={{ backgroundColor: secondaryColor }}
          >
            {isSelling && (
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
            )}
            {isSelling ? "Abrindo Venda..." : "Vender"}
          </button>

          <button
            onClick={() => onClose(cash.id)}
            disabled={closing}
            className="mt-2 w-full py-2 rounded-xl bg-red-600 text-white transform transition-all duration-200 hover:scale-105 disabled:opacity-50"
          >
            {closing ? "Fechando..." : "Fechar Caixa"}
          </button>
        </>
      )}
    </div>
  );
}