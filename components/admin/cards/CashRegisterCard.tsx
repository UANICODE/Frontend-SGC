// components/admin/cards/CashRegisterCard.tsx
"use client";

import { Eye, Calendar, DollarSign, Wallet, TrendingUp } from "lucide-react";
import { OpenCashRegisterResponse } from "@/types/admin/cash-register";

interface Props {
  cash: OpenCashRegisterResponse;
  onDetails: (cash: OpenCashRegisterResponse) => void;
  onViewExpenses?: (cashId: string) => void; // 🆕
}

export function CashRegisterCard({ cash, onDetails, onViewExpenses }: Props) {
  const isOpen = cash.status === "ABERTO";

  const formatCurrency = (value: number) => {
    return value.toFixed(2) + " MT";
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all p-6 border-l-4 ${
        isOpen ? "border-green-500" : "border-gray-400"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg text-gray-800">
          {cash.attendantName}
        </h2>

        <span
          className={`text-xs px-3 py-1 rounded-full font-semibold ${
            isOpen
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {cash.status}
        </span>
      </div>

      {/* Datas */}
      <div className="text-sm text-gray-500 space-y-1 mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={14} /> Abertura:
          <span>{new Date(cash.openedAt).toLocaleString()}</span>
        </div>

        {cash.closedAt && (
          <div className="flex items-center gap-2">
            <Calendar size={14} /> Fecho:
            <span>{new Date(cash.closedAt).toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Totais */}
      <div className="space-y-2 mb-4">
        <div>
          <p className="text-sm text-gray-500">Total vendido</p>
          <div className="flex items-center gap-2 text-green-600 text-2xl font-bold">
            <DollarSign size={20} />
            {formatCurrency(cash.totalSold)}
          </div>
        </div>

        {/* 🆕 Total Despesas */}
        <div>
          <p className="text-sm text-gray-500">Total Despesas</p>
          <div className="flex items-center gap-2 text-orange-600 text-xl font-bold">
            <Wallet size={18} />
            {formatCurrency(cash.totalExpenses || 0)}
          </div>
        </div>

        {/* 🆕 Saldo Remanescente */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Saldo Remanescente</p>
          <div className={`flex items-center gap-2 text-2xl font-bold ${
            (cash.remainingBalance || 0) >= 0 ? "text-green-600" : "text-red-600"
          }`}>
            <TrendingUp size={20} />
            {formatCurrency(cash.remainingBalance || 0)}
          </div>
        </div>
      </div>

      {/* Métodos de Pagamento */}
      <div className="space-y-2 border-t pt-3">
        {cash.totalsByPaymentMethod.map((m) => (
          <div
            key={m.paymentMethod}
            className="flex justify-between text-sm bg-gray-50 p-2 rounded-lg"
          >
            <span>{m.paymentMethod}</span>
            <span className="font-medium">
              {formatCurrency(m.total || 0)}
            </span>
          </div>
        ))}
      </div>

      {/* Botões */}
      <div className="mt-5 flex gap-2">
        <button
          onClick={() => onDetails(cash)}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-2 rounded-xl hover:bg-primary/90 transition"
        >
          <Eye size={16} />
          Ver Vendas
        </button>

        {/* 🆕 Botão Ver Despesas */}
        <button
          onClick={() => onViewExpenses?.(cash.cashRegisterId)}
          className="flex-1 flex items-center justify-center gap-2 bg-orange-500 text-white py-2 rounded-xl hover:bg-orange-600 transition"
        >
          <Wallet size={16} />
          Despesas
        </button>
      </div>
    </div>
  );
}