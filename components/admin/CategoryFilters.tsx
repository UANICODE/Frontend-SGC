"use client";

import { ListCategoriesRequest } from "@/types/admin/categories";

interface Props {
  filters: ListCategoriesRequest;
  setFilters: (value: ListCategoriesRequest) => void;
}

export function CategoryFilters({
  filters,
  setFilters,
}: Props) {
  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col md:flex-row gap-4">

      <input
        placeholder="Buscar por nome..."
        className="flex-1 border p-3 rounded-lg focus:ring-2 focus:ring-primary"
        value={filters.name ?? ""}
        onChange={(e) =>
          setFilters({
            ...filters,
            name: e.target.value
          })
        }
      />

    </div>
  );
}