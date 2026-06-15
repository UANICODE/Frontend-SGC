"use client";

import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import { Plus, Package, Sparkles } from "lucide-react";

import { IngredientFilters } from "@/components/admin/IngredientFilters";
import { IngredientItemResponse } from "@/types/admin/ingredients";
import { useIngredients } from "@/hooks/admin/product/ingredient/useIngredients";
import { IngredientModal } from "@/components/admin/modals/IngredientModal";
import { IngredientsTable } from "@/components/admin/tables/IngredientsTable";
import { useToast } from "@/ context/ToastContext";
import { UserRole } from "@/enum/enum";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";

export default function IngredientsPage() {
  useRoleGuard([UserRole.ADMIN]);
  const params = useParams();
  const establishmentId = params.establishmentId as string;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data, loading, filters, setFilters, refresh } = useIngredients(establishmentId);
  const { showToast } = useToast();
  const [selected, setSelected] = useState<IngredientItemResponse | null>(null);
  const [openModal, setOpenModal] = useState(false);

  // Paginação local
  const totalItems = data?.content?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedData = data?.content?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Dados paginados
  const paginatedResponse = data ? {
    ...data,
    content: paginatedData || []
  } : null;

  return (
    <div className="space-y-8">
      {/* Header com gradiente */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative px-8 py-8">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Package className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  Gestão de Ingredientes
                </h1>
              </div>
              <p className="text-white/80 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Controle de estoque de ingredientes para suas receitas
              </p>
            </div>

            <button
              onClick={() => setOpenModal(true)}
              className="group relative overflow-hidden bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2 font-medium"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <Plus className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Novo Ingrediente</span>
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/30 via-white/50 to-white/30"></div>
      </div>

      {/* Filtros */}
      <IngredientFilters filters={filters} setFilters={setFilters} />

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-lg">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="w-6 h-6 text-primary/60 animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-gray-500 font-medium">Carregando ingredientes...</p>
        </div>
      ) : (
        <IngredientsTable
          data={paginatedResponse}
          establishmentId={establishmentId}
          onEdit={setSelected}
          onRefresh={refresh}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={handlePageChange}
        />
      )}

      {/* Modal */}
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