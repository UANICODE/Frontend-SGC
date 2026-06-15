"use client";

import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import { useProductTypes } from "@/hooks/admin/product/types/useProductTypes";
import { ProductTypesTable } from "@/components/admin/tables/ProductTypesTable";
import { ProductTypeModal } from "@/components/admin/modals/ProductTypeModal";
import { ProductTypeResponse } from "@/types/admin/product-types";
import { useToast } from "@/ context/ToastContext";
import { UserRole } from "@/enum/enum";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";
import { Plus, Package, Sparkles, Search, X, Layers } from "lucide-react";
import { div } from "framer-motion/client";

export default function ProductTypesPage() {
  useRoleGuard([UserRole.ADMIN]);
  const params = useParams();
  const { showToast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const establishmentId = params.establishmentId as string;

  if (!establishmentId) {
    return <p className="text-center text-red-500 py-10">ID do estabelecimento não encontrado</p>;
  }

  const { data, loading, refresh } = useProductTypes(establishmentId);
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState<ProductTypeResponse | null>(null);
  const [filterText, setFilterText] = useState("");

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!filterText) return data;
    return data.filter((type) =>
      type.name.toLowerCase().includes(filterText.toLowerCase()) ||
      (type.description && type.description.toLowerCase().includes(filterText.toLowerCase()))
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
    showToast(selected ? "Tipo atualizado com sucesso!" : "Tipo criado com sucesso!", "success");
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
      {/* Header com gradiente */}
<div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">
          Gestão de Tipos de Produto
        </h1>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-primary text-white px-6 py-3 rounded-xl shadow-lg hover:opacity-90 transition"
        >
          Novo Tipo
        </button>
      </div>
              
          
      {/* Filtro */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-gray-700">Filtrar Tipos</h3>
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
            placeholder="Buscar por nome ou descrição..."
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
      <ProductTypesTable
        data={paginatedData}
        loading={loading}
        establishmentId={establishmentId}
        onEdit={setSelected}
        onRefresh={refresh}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={handlePageChange}
      />

      {/* Modal */}
      {(openModal || selected) && (
        <ProductTypeModal
          establishmentId={establishmentId}
          type={selected}
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