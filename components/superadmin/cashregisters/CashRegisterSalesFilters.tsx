"use client";

import { CashRegisterSaleStatus } from "@/types/superadmin/cashregisters/listCashRegisterSales";
import { Search, X } from "lucide-react";


export interface CashRegisterSalesFilterValues {
  search: string;
  status: "" | CashRegisterSaleStatus;
}

interface CashRegisterSalesFiltersProps {
  values: CashRegisterSalesFilterValues;
  loading: boolean;
  onChange: (
    values: CashRegisterSalesFilterValues
  ) => void;
  onApply: () => void;
  onClear: () => void;
}

export function CashRegisterSalesFilters({
  values,
  loading,
  onChange,
  onApply,
  onClear,
}: CashRegisterSalesFiltersProps) {
  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100";

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="grid gap-4 md:grid-cols-2">
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
            placeholder="Número da venda ou responsável"
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
                | CashRegisterSaleStatus,
            })
          }
          className={inputClass}
        >
          <option value="">Todos os estados</option>
          <option value="FINALIZADO">Finalizadas</option>
          <option value="CANCELADO">Canceladas</option>
          <option value="RASCUNHO">Rascunhos</option>
          <option value="ARQUIVADO">Arquivadas</option>
          <option value="AGUARDANDO_PAGAMENTO">
            Aguardando pagamento
          </option>
        </select>
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