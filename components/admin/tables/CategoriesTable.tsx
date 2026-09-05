// components/admin/tables/CategoriesTable.tsx
"use client";

import { CategoryItemResponse } from "@/types/admin/categories";
import { useState } from "react";
import { 
  Edit, 
  Package, 
  ChevronLeft, 
  ChevronRight, 
  Tag, 
  CheckCircle, 
  XCircle, 
  Eye,
  EyeOff,
  Loader2
} from "lucide-react";

// ============================================================
// TIPOS
// ============================================================

interface Props {
  establishmentId: string;
  data: CategoryItemResponse[] | null;
  loading: boolean;
  onEdit: (category: CategoryItemResponse) => void;
  onRefresh: () => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onToggleStatus: (categoryId: string) => void;
  togglingStatusId?: string | null;  // 🆕 ID da categoria que está sendo alterada
}

// ============================================================
// COMPONENTES AUXILIARES
// ============================================================

const Loader = () => (
  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-lg">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Package className="w-6 h-6 text-primary/60 animate-pulse" />
      </div>
    </div>
    <p className="mt-4 text-gray-500 font-medium">Carregando categorias...</p>
  </div>
);

const EmptyState = ({ totalItems }: { totalItems: number }) => (
  <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
    <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
      <Tag className="w-10 h-10 text-gray-400" />
    </div>
    <p className="text-gray-500 font-medium">Nenhuma categoria encontrada</p>
    <p className="text-sm text-gray-400 mt-1">
      {totalItems > 0 ? "Tente ajustar os filtros" : "Clique em 'Nova Categoria' para começar"}
    </p>
  </div>
);

const StatusBadge = ({ isActive }: { isActive: boolean }) => {
  const config = isActive
    ? { bg: "bg-green-100", text: "text-green-700", border: "border-green-200", icon: CheckCircle, label: "Ativo" }
    : { bg: "bg-red-100", text: "text-red-600", border: "border-red-200", icon: XCircle, label: "Inativo" };
  
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};

const ActionButtons = ({ 
  category, 
  onEdit, 
  onToggleStatus,
  isToggling 
}: { 
  category: CategoryItemResponse; 
  onEdit: (cat: CategoryItemResponse) => void; 
  onToggleStatus: (id: string) => void;
  isToggling: boolean;
}) => {
  const isActive = category.active !== false;

  return (
    <div className="flex justify-center gap-2">
      <EditButton onClick={() => onEdit(category)} />
      
    </div>
  );
};

const EditButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="group/btn relative overflow-hidden bg-gradient-to-r from-primary to-secondary text-white px-3.5 py-2 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-1.5 text-xs font-medium"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover/btn:opacity-100 transition-opacity" />
    <Edit className="w-3.5 h-3.5 relative z-10" />
    <span className="relative z-10">Editar</span>
  </button>
);



const CategoryRow = ({ 
  category, 
  isHovered, 
  onHover, 
  onEdit, 
  onToggleStatus,
  isToggling
}: { 
  category: CategoryItemResponse; 
  isHovered: boolean; 
  onHover: (id: string | null) => void; 
  onEdit: (cat: CategoryItemResponse) => void; 
  onToggleStatus: (id: string) => void;
  isToggling: boolean;
}) => {
  const isActive = category.active !== false;
  const isHoveredClass = isHovered ? "bg-gradient-to-r from-primary/5 to-secondary/5" : "hover:bg-gray-50/80";
  const inactiveClass = !isActive ? "opacity-70" : "";

  return (
    <tr
      className={`border-t border-gray-100 transition-all duration-200 group ${isHoveredClass} ${inactiveClass}`}
      onMouseEnter={() => onHover(category.id)}
      onMouseLeave={() => onHover(null)}
    >
      <td className="p-4">
        <div className="flex items-center gap-3">
          <IconWithHover isHovered={isHovered} />
          <div>
            <span className={`font-semibold ${isActive ? "text-gray-800" : "text-gray-400 line-through"}`}>
              {category.name}
            </span>
            {!isActive && (
              <span className="ml-2 text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full">Inativa</span>
            )}
          </div>
        </div>
      </td>
      <td className="p-4">
        {category.description ? (
          <p className={`${isActive ? "text-gray-600" : "text-gray-400"} line-clamp-2 max-w-md`}>
            {category.description}
          </p>
        ) : (
          <span className="text-gray-400 italic">Sem descrição</span>
        )}
      </td>
      <td className="p-4 text-center">
        <StatusBadge isActive={isActive} />
      </td>
      <td className="p-4 text-center">
        <ActionButtons 
          category={category} 
          onEdit={onEdit} 
          onToggleStatus={onToggleStatus}
          isToggling={isToggling}
        />
      </td>
    </tr>
  );
};

const IconWithHover = ({ isHovered }: { isHovered: boolean }) => {
  const bgClass = isHovered 
    ? "bg-gradient-to-br from-primary/20 to-secondary/20 scale-110" 
    : "bg-gradient-to-br from-primary/10 to-secondary/10";
  
  const iconClass = isHovered 
    ? "text-primary scale-110" 
    : "text-primary/70";

  return (
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${bgClass}`}>
      <Tag className={`w-5 h-5 transition-all duration-300 ${iconClass}`} />
    </div>
  );
};

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void;
}) => {
  if (totalPages <= 1) return null;

  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  return (
    <div className="flex items-center gap-2">
      <PaginationButton 
        direction="prev" 
        disabled={isFirst} 
        onClick={() => onPageChange(currentPage - 1)} 
      />
      <PaginationNumbers currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      <PaginationButton 
        direction="next" 
        disabled={isLast} 
        onClick={() => onPageChange(currentPage + 1)} 
      />
    </div>
  );
};

const PaginationButton = ({ 
  direction, 
  disabled, 
  onClick 
}: { 
  direction: "prev" | "next"; 
  disabled: boolean; 
  onClick: () => void;
}) => {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-lg transition-all duration-300 ${
        disabled
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-white border border-gray-200 text-gray-700 hover:bg-primary hover:text-white hover:border-primary"
      }`}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
};

const PaginationNumbers = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void;
}) => {
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const isNearStart = currentPage <= 3;
    const isNearEnd = currentPage >= totalPages - 2;

    if (isNearStart) {
      return [1, 2, 3, 4, "...", totalPages];
    }

    if (isNearEnd) {
      return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex gap-1">
      {pageNumbers.map((page, index) => {
        if (typeof page === "string") {
          return (
            <span key={`dots-${index}`} className="w-10 h-10 flex items-center justify-center text-gray-400">
              {page}
            </span>
          );
        }

        const isActive = page === currentPage;

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${
              isActive
                ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md scale-105"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        );
      })}
    </div>
  );
};

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export function CategoriesTable({ 
  establishmentId, 
  data, 
  loading, 
  onEdit, 
  onRefresh,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  onToggleStatus,
  togglingStatusId
}: Props) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  // Early returns
  if (loading) return <Loader />;
  if (!data) return null;
  if (data.length === 0) return <EmptyState totalItems={totalItems} />;

  // Derived state
  const activeCount = data.filter(cat => cat.active !== false).length;
  const inactiveCount = data.filter(cat => cat.active === false).length;
  const hasPagination = totalPages > 1;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <TableHeader totalItems={totalItems} activeCount={activeCount} inactiveCount={inactiveCount} />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-primary to-secondary text-white">
              <th className="p-4 text-left rounded-tl-2xl">Categoria</th>
              <th className="p-4 text-left">Descrição</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center rounded-tr-2xl w-48">Ações</th>
            </tr>
          </thead>
          <tbody>
            {data.map((category) => (
              <CategoryRow
                key={category.id}
                category={category}
                isHovered={hoveredRow === category.id}
                onHover={setHoveredRow}
                onEdit={onEdit}
                onToggleStatus={onToggleStatus}
                isToggling={togglingStatusId === category.id}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <TableFooter 
        totalItems={totalItems}
        activeCount={activeCount}
        inactiveCount={inactiveCount}
        currentPage={currentPage}
        totalPages={totalPages}
        hasPagination={hasPagination}
        onPageChange={onPageChange}
      />
    </div>
  );
}

// ============================================================
// COMPONENTES DO FOOTER
// ============================================================

const TableHeader = ({ 
  totalItems, 
  activeCount, 
  inactiveCount 
}: { 
  totalItems: number; 
  activeCount: number; 
  inactiveCount: number;
}) => (
  <div className="px-6 py-4 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <Tag className="w-5 h-5 text-primary" />
        <span className="font-semibold text-gray-700">
          {totalItems} {totalItems === 1 ? 'categoria' : 'categorias'}
        </span>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />
          <span className="text-gray-600">Ativas: <strong className="text-gray-800">{activeCount}</strong></span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-red-400 rounded-full" />
          <span className="text-gray-600">Inativas: <strong className="text-gray-800">{inactiveCount}</strong></span>
        </span>
      </div>
    </div>
  </div>
);

const TableFooter = ({ 
  totalItems, 
  activeCount, 
  inactiveCount,
  currentPage,
  totalPages,
  hasPagination,
  onPageChange
}: { 
  totalItems: number; 
  activeCount: number; 
  inactiveCount: number;
  currentPage: number;
  totalPages: number;
  hasPagination: boolean;
  onPageChange: (page: number) => void;
}) => {
  if (totalItems === 0) return null;

  return (
    <>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-500 flex items-center gap-4">
          <span>
            Total: <span className="font-semibold text-gray-700">{totalItems}</span>
          </span>
          <span className="hidden sm:inline text-gray-300">|</span>
          <span className="text-xs text-gray-400">
            {activeCount} ativa{activeCount !== 1 ? 's' : ''} · {inactiveCount} inativa{inactiveCount !== 1 ? 's' : ''}
          </span>
        </div>

        {hasPagination && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        )}
      </div>

      <div className="px-6 py-2 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-400">
        Mostrando {((currentPage - 1) * 10) + 1} a {Math.min(currentPage * 10, totalItems)} de {totalItems} registros
      </div>
    </>
  );
};