"use client";

interface Props {
  today: boolean;
  status: string | null;
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
      <button
        onClick={onTodayChange}
        className={`px-4 py-2 rounded-lg text-sm ${
          today ? "bg-black text-white" : "bg-gray-100"
        }`}
      >
        Hoje
      </button>

      <button
        onClick={() => onStatusChange("ABERTO")}
        className="px-4 py-2 rounded-lg bg-gray-100 text-sm"
      >
        Abertos
      </button>

      <button
        onClick={() => onStatusChange("FECHADO")}
        className="px-4 py-2 rounded-lg bg-gray-100 text-sm"
      >
        Fechados
      </button>

      <button
        onClick={() => onStatusChange(null)}
        className="px-4 py-2 rounded-lg bg-gray-200 text-sm"
      >
        Limpar
      </button>
    </div>
  );
}