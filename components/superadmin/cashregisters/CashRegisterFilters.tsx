"use client";

import { GlobalCashRegisterStatus } from "@/types/superadmin/cashregisters/listGlobalCashRegisters";
import {
  CalendarDays,
  Search,
  X,
} from "lucide-react";


export interface CashRegisterFilterValues {
  search: string;
  status: "" | GlobalCashRegisterStatus;
  startDate: string;
  endDate: string;
}

interface CashRegisterFiltersProps {
  values: CashRegisterFilterValues;
  loading: boolean;
  onChange: (
    values: CashRegisterFilterValues
  ) => void;
  onApply: () => void;
  onClear: () => void;
}

export function CashRegisterFilters({
  values,
  loading,
  onChange,
  onApply,
  onClear,
}: CashRegisterFiltersProps) {
  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100";

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="relative">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={values.search}
            onChange={(event) =>
              onChange({
                ...values,
                search: event.target.value,
              })
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onApply();
              }
            }}
            placeholder="Estabelecimento ou responsável"
            className={`${inputClass} pl-11`}
          />
        </div>

        <select
          value={values.status}
          onChange={(event) =>
            onChange({
              ...values,
              status: event.target.value as
                | ""
                | GlobalCashRegisterStatus,
            })
          }
          className={inputClass}
        >
          <option value="">Todos os estados</option>
          <option value="ABERTO">Caixas abertas</option>
          <option value="FECHADO">Caixas fechadas</option>
        </select>

        <div className="relative">
          <CalendarDays
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="date"
            value={values.startDate}
            onChange={(event) =>
              onChange({
                ...values,
                startDate: event.target.value,
              })
            }
            className={`${inputClass} pl-11`}
          />
        </div>

        <div className="relative">
          <CalendarDays
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="date"
            value={values.endDate}
            min={values.startDate || undefined}
            onChange={(event) =>
              onChange({
                ...values,
                endDate: event.target.value,
              })
            }
            className={`${inputClass} pl-11`}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-white"
        >
          <X size={17} />
          Limpar
        </button>

        <button
          type="button"
          onClick={onApply}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <Search size={17} />
          Aplicar
        </button>
      </div>
    </div>
  );
}