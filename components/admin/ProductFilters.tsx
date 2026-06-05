"use client";

import { useProductDependencies } from "@/hooks/admin /product/useProductDependencies";
import { ListProductsRequest } from "@/types/admin/product";


interface Props {
  filters: ListProductsRequest;
  setFilters: (value: ListProductsRequest) => void;
  establishmentId: string;
}

export function ProductFilters({
  filters,
  setFilters,
  establishmentId,
}: Props) {
  const { categories, types } =
    useProductDependencies(establishmentId);

  return (
    <div className="bg-white p-6 rounded-xl border grid md:grid-cols-4 gap-4">

      <input
        placeholder="Nome"
        className="border p-2 rounded"
        value={filters.name ?? ""}
        onChange={(e) =>
          setFilters({ ...filters, name: e.target.value, page: 0 })
        }
      />

      <select
        className="border p-2 rounded"
        value={filters.categoryId ?? ""}
        onChange={(e) =>
          setFilters({
            ...filters,
            categoryId: e.target.value || undefined,
            page: 0,
          })
        }
      >
        <option value="">Categoria</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <select
        className="border p-2 rounded"
        value={filters.productTypeId ?? ""}
        onChange={(e) =>
          setFilters({
            ...filters,
            productTypeId: e.target.value || undefined,
            page: 0,
          })
        }
      >
        <option value="">Tipo</option>
        {types.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      <select
        className="border p-2 rounded"
        value={
          filters.active === undefined ? "" : String(filters.active)
        }
        onChange={(e) =>
          setFilters({
            ...filters,
            active:
              e.target.value === ""
                ? undefined
                : e.target.value === "true",
            page: 0,
          })
        }
      >
        <option value="">Status</option>
        <option value="true">Ativo</option>
        <option value="false">Inativo</option>
      </select>

    </div>
  );
}