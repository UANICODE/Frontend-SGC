"use client";

import { Eye, Calendar, DollarSign } from "lucide-react";
import { OpenCashRegisterResponse } from "@/types/admin/cash-register";

interface Props {
  cash: OpenCashRegisterResponse;
  onDetails: (cash: OpenCashRegisterResponse) => void;
}

export function CashRegisterCard({ cash, onDetails }: Props) {
  const isOpen = cash.status === "ABERTO";

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
          <Calendar size={14} />Abertura:
          <span>{new Date(cash.openedAt).toLocaleString()}</span>
        </div>

        {cash.closedAt && (
          <div className="flex items-center gap-2">
            <Calendar size={14} /> Fecho
            <span>{new Date(cash.closedAt).toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="mb-4">
        <p className="text-sm text-gray-500">Total vendido</p>
        <div className="flex items-center gap-2 text-green-600 text-2xl font-bold">
          <DollarSign size={20} />
          {(cash.totalSold || 0).toLocaleString("pt-MZ", {
            style: "currency",
            currency: "MZN",
          })}
        </div>
      </div>

      {/* Métodos */}
      <div className="space-y-2 border-t pt-3">
        {cash.totalsByPaymentMethod.map((m) => (
          <div
            key={m.paymentMethod}
            className="flex justify-between text-sm bg-gray-50 p-2 rounded-lg"
          >
            <span>{m.paymentMethod}</span>
            <span className="font-medium">
              {(m.total || 0).toLocaleString("pt-MZ", {
                style: "currency",
                currency: "MZN",
              })}
            </span>
          </div>
        ))}
      </div>

      {/* BOTÃO */}
      <button
        onClick={() => onDetails(cash)}
        className="mt-5 flex items-center justify-center gap-2 w-full bg-primary text-white py-2 rounded-xl hover:bg-primary/90 transition"
      >
        <Eye size={16} />
        Ver detalhes
      </button>
    </div>
  );
}