"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface EstablishmentsPaginationProps {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function EstablishmentsPagination({
  page,
  size,
  totalElements,
  totalPages,
  onPageChange,
}: EstablishmentsPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const start = page * size + 1;
  const end = Math.min(
    (page + 1) * size,
    totalElements
  );

  return (
    <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row">
      <p className="text-sm text-slate-500">
        Mostrando {start} a {end} de {totalElements}
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border border-slate-300 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={18} />
        </button>

        <span className="text-sm font-medium text-slate-700">
          Página {page + 1} de {totalPages}
        </span>

        <button
          type="button"
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border border-slate-300 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}