"use client";

import { CalendarIcon, CheckCircleIcon, XCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface Props {
  today: boolean;
  status: "ABERTO" | "FECHADO" | null;
  onTodayChange: () => void;
  onStatusChange: (status: "ABERTO" | "FECHADO" | null) => void;
}

export function CashRegisterFilters({
  today,
  status,
  onTodayChange,
  onStatusChange,
}: Props) {
  return (
    <div className="flex gap-3 flex-wrap">
      {/* Botão Hoje */}
      <button
        onClick={onTodayChange}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
          today ? "bg-black text-white border border-black" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        <CalendarIcon className="w-5 h-5" />
        Hoje
      </button>

      {/* Botão Abertos */}
      <button
        onClick={() => onStatusChange("ABERTO")}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
          status === "ABERTO"
            ? "bg-green-600 text-white border border-green-600"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        <CheckCircleIcon className="w-5 h-5" />
        Abertos
      </button>

      {/* Botão Fechados */}
      <button
        onClick={() => onStatusChange("FECHADO")}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
          status === "FECHADO"
            ? "bg-red-600 text-white border border-red-600"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        <XCircleIcon className="w-5 h-5" />
        Fechados
      </button>

      {/* Botão Limpar */}
      <button
        onClick={() => onStatusChange(null)}
        className="px-4 py-2 rounded-lg bg-gray-200 text-sm font-medium hover:bg-gray-300 transition-colors flex items-center gap-2"
      >
        <XMarkIcon className="w-5 h-5" />
        Limpar
      </button>
    </div>
  );
}