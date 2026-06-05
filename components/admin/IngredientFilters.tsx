"use client";

import { ListIngredientsRequest } from "@/types/admin/ingredients";



interface Props {
  filters: ListIngredientsRequest;
  setFilters: (value: ListIngredientsRequest) => void;
}

export function IngredientFilters({ filters, setFilters }: Props) {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <input
        placeholder="Buscar por nome..."
        className="w-full border p-3 rounded-lg"
        value={filters.name ?? ""}
        onChange={(e) =>
          setFilters({
            ...filters,
            name: e.target.value,
            page: 0,
          })
        }
      />
    </div>
  );
}