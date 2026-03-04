"use client";

import { IngredientFilters } from "@/components/admin/IngredientFilters";
import { IngredientModal } from "@/components/admin/modals/ IngredientModal";
import { IngredientsTable } from "@/components/admin/tables/IngredientsTable";
import { useIngredients } from "@/hooks/admin /product/ingredient/useIngredients";
import { IngredientItemResponse } from "@/types/admin/ingredients";
import { useState } from "react";

export default function IngredientsPage({ params }: any) {
  const { data, loading, filters, setFilters, refresh } =
    useIngredients(params.establishmentId);

  const [selected, setSelected] =
    useState<IngredientItemResponse | null>(null);
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">
          Gestão de Ingredientes
        </h1>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-primary text-white px-6 py-3 rounded-xl shadow-lg"
        >
          Novo Ingrediente
        </button>
      </div>

      <IngredientFilters
        filters={filters}
        setFilters={setFilters}
      />

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <IngredientsTable
          data={data}
          establishmentId={params.establishmentId}
          onEdit={setSelected}
          onRefresh={refresh}
        />
      )}

      {(openModal || selected) && (
        <IngredientModal
          establishmentId={params.establishmentId}
          ingredient={selected}
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