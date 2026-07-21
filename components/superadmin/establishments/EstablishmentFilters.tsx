"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { BusinessTypeItemResponse } from "@/types/superadmin/establishments/listBusinessTypes";

export interface EstablishmentFilterValues {
  search: string;
  active: "" | "true" | "false";
  businessTypeId: string;
}

interface EstablishmentFiltersProps {
  values: EstablishmentFilterValues;
  businessTypes: BusinessTypeItemResponse[];
  loading: boolean;
  onChange: (values: EstablishmentFilterValues) => void;
  onApply: () => void;
  onClear: () => void;
}

export function EstablishmentFilters({
  values,
  businessTypes,
  loading,
  onChange,
  onApply,
  onClear,
}: EstablishmentFiltersProps) {
  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <SlidersHorizontal
          size={19}
          className="text-blue-600"
        />

        <h2 className="font-semibold text-slate-900">
          Filtrar estabelecimentos
        </h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="relative">
          <Search
            size={18}
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
            placeholder="Nome, e-mail ou NUIT"
            className={`${inputClass} pl-11`}
          />
        </div>

        <select
          value={values.active}
          onChange={(event) =>
            onChange({
              ...values,
              active: event.target.value as
                | ""
                | "true"
                | "false",
            })
          }
          className={inputClass}
        >
          <option value="">Todos os estados</option>
          <option value="true">Ativos</option>
          <option value="false">Inativos</option>
        </select>

        <select
          value={values.businessTypeId}
          onChange={(event) =>
            onChange({
              ...values,
              businessTypeId: event.target.value,
            })
          }
          className={inputClass}
        >
          <option value="">Todos os tipos de negócio</option>

          {businessTypes.map((businessType) => (
            <option
              key={businessType.id}
              value={businessType.id}
            >
              {businessType.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
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
          Aplicar filtros
        </button>
      </div>
    </div>
  );
}