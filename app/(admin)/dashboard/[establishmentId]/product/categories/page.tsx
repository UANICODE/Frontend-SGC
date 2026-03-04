"use client";

import { CategoryFilters } from "@/components/admin/CategoryFilters";
import { CategoryModal } from "@/components/admin/modals/CategoryModal";
import { CategoriesTable } from "@/components/admin/tables/CategoriesTable";
import { useCategories } from "@/hooks/admin /product/categories/useCategories";
import { CategoryItemResponse } from "@/types/admin/categories";
import { useState } from "react";

interface PageProps {
  params: { establishmentId: string };
}

export default function CategoriesPage({ params }: PageProps) {
  const { data, filters, setFilters, refresh } =
    useCategories(params.establishmentId);

  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] =
    useState<CategoryItemResponse | null>(null);

  return (
    <div className="space-y-10">

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">
          Gestão de Categorias
        </h1>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-primary text-white px-6 py-3 rounded-xl shadow-lg hover:opacity-90 transition"
        >
          Nova Categoria
        </button>
      </div>

      <CategoryFilters
        filters={filters}
        setFilters={setFilters}
      />

      <CategoriesTable
        establishmentId={params.establishmentId} 
        data={data}
        onEdit={(cat) => setSelected(cat)}
        onRefresh={refresh}
      />

      {(openModal || selected) && (
        <CategoryModal
          establishmentId={params.establishmentId}
          category={selected}
          onClose={() => {
            setOpenModal(false);
            setSelected(null);
          }}
          onSuccess={refresh}
        />
      )}
    </div>
  );
}