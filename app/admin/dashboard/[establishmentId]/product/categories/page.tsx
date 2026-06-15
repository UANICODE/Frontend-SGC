"use client";

import { CategoryModal } from "@/components/admin/modals/CategoryModal";
import { CategoriesTable } from "@/components/admin/tables/CategoriesTable";
import { CategoryItemResponse } from "@/types/admin/categories";
import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useCategories } from "@/hooks/admin/product/categories/useCategories";
import { useToast } from "@/ context/ToastContext";
import { UserRole } from "@/enum/enum";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";
import { Plus, Package, Sparkles, Search, X } from "lucide-react";

export default function CategoriesPage() {
  useRoleGuard([UserRole.ADMIN]);
  const params = useParams();
  const { showToast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  let establishmentId: string | undefined;

  if (Array.isArray(params?.establishmentId)) {
    establishmentId = params.establishmentId[0];
  } else {
    establishmentId = params?.establishmentId;
  }

  if (!establishmentId) return <p>ID do estabelecimento não encontrado</p>;

  const { data, loading, refresh } = useCategories(establishmentId);
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState<CategoryItemResponse | null>(null);
  const [filterText, setFilterText] = useState("");

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!filterText) return data;
    return data.filter((cat) =>
      cat.name.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [data, filterText]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSuccess = () => {
    refresh();
    setOpenModal(false);
    setSelected(null);
    showToast(selected ? "Categoria atualizada com sucesso!" : "Categoria criada com sucesso!", "success");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setFilterText("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8">
     <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Gestão de Categorias</h1>
        <button
          onClick={() => setOpenModal(true)}
          className="bg-primary text-white px-6 py-3 rounded-xl shadow-lg hover:opacity-90 transition"
        >
          Nova Categoria
        </button>
      </div>
      {/* Filtro */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-gray-700">Filtrar Categorias</h3>
          </div>
          {filterText && (
            <button
              onClick={clearFilters}
              className="text-sm text-red-500 hover:text-red-600 transition flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Limpar
            </button>
          )}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome da categoria..."
            value={filterText}
            onChange={(e) => {
              setFilterText(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
          />
        </div>

        {filterText && (
          <div className="mt-3 flex items-center gap-2 text-sm text-primary">
            <Package className="w-3.5 h-3.5" />
            <span>Filtrando por: <strong>{filterText}</strong></span>
          </div>
        )}
      </div>

      {/* Tabela */}
      <CategoriesTable
        loading={loading}
        establishmentId={establishmentId}
        data={paginatedData}
        onEdit={setSelected}
        onRefresh={refresh}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={handlePageChange}
      />

      {/* Modal */}
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