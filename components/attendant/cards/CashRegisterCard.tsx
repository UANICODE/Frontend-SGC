"use client";

import { CashRegister } from "@/types/attendant/CashRegister";

interface Props {
  cash: CashRegister;
  primaryColor: string;
  secondaryColor: string;
  onClose: (cashId: string) => void;
  closing?: boolean;
  onSell: (cashId: string) => void;
}

export function CashRegisterCard({
  cash,
  primaryColor,
  secondaryColor,
  onSell,
  onClose,
  closing,
}: Props) {

  const isOpen = cash.status === "ABERTO";

  return (
    <div
      className={`bg-white p-6 rounded-2xl shadow border ${
        isOpen ? "border-2" : "border-gray-200"
      }`}
      style={
        isOpen
          ? { borderColor: primaryColor }
          : undefined
      }
    >
      <div className="flex justify-between mb-3">
        <span className="text-sm text-gray-500">
          {new Date(cash.openedAt).toLocaleString()}
        </span>

        <span
          className={`text-xs px-3 py-1 rounded-full ${
            isOpen
              ? "bg-green-100 text-green-600"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {cash.status}
        </span>
      </div>

      <div className="space-y-1 text-sm">
        <p>
          Total Vendas:{" "}
          <strong>€ {cash.totalSalesCalculated}</strong>
        </p>

        <p>
          Cancelado:{" "}
          <strong>€ {cash.totalCancelled}</strong>
        </p>
      </div>

      {isOpen && (
        <>
          <button
            onClick={() => onSell(cash.id)}
            className="mt-4 w-full py-2 rounded-xl text-white"
            style={{ backgroundColor: secondaryColor }}
          >
            Vender
          </button>

          <button
            onClick={() => onClose(cash.id)}
            disabled={closing}
            className="mt-2 w-full py-2 rounded-xl bg-red-600 text-white disabled:opacity-50"
          >
            {closing ? "Fechando..." : "Fechar Caixa"}
          </button>
        </>
      )}
    </div>
  );
}