"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import { IngredientFilters } from "@/components/admin/IngredientFilters";
import { IngredientItemResponse } from "@/types/admin/ingredients";
import { useIngredients } from "@/hooks/admin /product/ingredient/useIngredients";
import { IngredientModal } from "@/components/admin/modals/ IngredientModal";
import { IngredientsTable } from "@/components/admin/tables/IngredientsTable";
import { useToast } from "@/ context/ToastContext";

export default function IngredientsPage() {
  const params = useParams();
  const establishmentId = params.establishmentId as string;

  const { data, loading, filters, setFilters, refresh } =
    useIngredients(establishmentId);
  const { showToast } = useToast();
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
        <div className="flex justify-center py-20">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <IngredientsTable
          data={data}
          establishmentId={establishmentId}
          onEdit={setSelected}
          onRefresh={refresh}
        />
      )}

      {(openModal || selected) && (
        <IngredientModal
          establishmentId={establishmentId}
          ingredient={selected}
          onClose={() => {
            setOpenModal(false);
            setSelected(null);
          }}
          onSuccess={() => {
        refresh();
        showToast(selected ? "Ingrediente atualizado!" : "Ingrediente criado!", "success");
          }}
        />
      )}

    </div>
  );
}