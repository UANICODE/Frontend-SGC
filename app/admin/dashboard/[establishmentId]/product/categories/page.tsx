"use client";

import { CategoryModal } from "@/components/admin/modals/CategoryModal";
import { CategoriesTable } from "@/components/admin/tables/CategoriesTable";
import { CategoryItemResponse } from "@/types/admin/categories";
import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useCategories } from "@/hooks/admin /product/categories/useCategories";

export default function CategoriesPage() {
  const params = useParams();
  let establishmentId: string | undefined;

  if (Array.isArray(params?.establishmentId)) {
    establishmentId = params.establishmentId[0];
  } else {
    establishmentId = params?.establishmentId;
  }

  if (!establishmentId) return <p>ID do estabelecimento não encontrado</p>;

  // Hook para pegar categorias e refresh
  const { data, loading, refresh } = useCategories(establishmentId);

  // Estados para modais e filtro local
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState<CategoryItemResponse | null>(null);
  const [filterText, setFilterText] = useState("");

  // Filtro local baseado no texto do input
  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!filterText) return data;
    return data.filter((cat) =>
      cat.name.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [data, filterText]);

  const handleSuccess = () => {
    refresh(); // 🔹 Só aqui recarrega do backend
    setOpenModal(false);
    setSelected(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Gestão de Categorias</h1>
        <button
          onClick={() => setOpenModal(true)}
          className="bg-primary text-white px-6 py-3 rounded-xl shadow-lg hover:opacity-90 transition"
        >
          Nova Categoria
        </button>
      </div>

      {/* 🔹 Campo de filtro */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filtrar por nome..."
          className="border p-2 rounded w-full max-w-sm"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      <CategoriesTable
        loading={loading}
        establishmentId={establishmentId}
        data={filteredData}
        onEdit={setSelected}
        onRefresh={refresh} // usado em delete
      />

      {(openModal || selected) && (
        <CategoryModal
          establishmentId={establishmentId}
          category={selected}
          onClose={() => {
            setOpenModal(false);
            setSelected(null);
          }}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}