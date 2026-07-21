"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  RefreshCw,
  WalletCards,
  X,
} from "lucide-react";



import { useToast } from "@/ context/ToastContext";
import { CashRegisterFilters, CashRegisterFilterValues } from "../cashregisters/CashRegisterFilters";
import { useListGlobalCashRegisters } from "@/hooks/superadmin/cashregisters/useListGlobalCashRegisters";
import { CashRegistersPagination } from "../cashregisters/CashRegistersPagination";
import { CashRegistersTable } from "../cashregisters/CashRegistersTable";
import { CashRegisterSalesModal } from "./CashRegisterSalesModal";
import { GlobalCashRegisterItemResponse } from "@/types/superadmin/cashregisters/listGlobalCashRegisters";

interface GlobalCashRegistersModalProps {
  open: boolean;
  establishmentId?: string | null;
  establishmentName?: string | null;
  onClose: () => void;
}

const PAGE_SIZE = 10;

const emptyFilters: CashRegisterFilterValues = {
  search: "",
  status: "",
  startDate: "",
  endDate: "",
};

function getErrorMessage(
  error: unknown,
  fallback: string
) {
  return error instanceof Error
    ? error.message
    : fallback;
}

export function GlobalCashRegistersModal({
  open,
  establishmentId = null,
  establishmentName = null,
  onClose,
}: GlobalCashRegistersModalProps) {
  const { showToast } = useToast();

  const {
    data,
    loading,
    execute,
  } = useListGlobalCashRegisters();

  const [page, setPage] = useState(0);

  const [filterForm, setFilterForm] =
    useState<CashRegisterFilterValues>(
      emptyFilters
    );

  const [appliedFilters, setAppliedFilters] =
    useState<CashRegisterFilterValues>(
      emptyFilters
    );
                const [
            selectedCashRegister,
            setSelectedCashRegister,
            ] =
            useState<GlobalCashRegisterItemResponse | null>(
                null
            );

  const loadCashRegisters =
    useCallback(async () => {
      if (!open) {
        return;
      }

      try {
        await execute({
          page,
          size: PAGE_SIZE,
          establishmentId,
          search:
            appliedFilters.search.trim() ||
            null,
          status:
            appliedFilters.status || null,
          startDate:
            appliedFilters.startDate || null,
          endDate:
            appliedFilters.endDate || null,
        });
      } catch (error) {
        showToast(
          getErrorMessage(
            error,
            "Não foi possível carregar as caixas."
          ),
          "error"
        );
      }
    }, [
      open,
      page,
      establishmentId,
      appliedFilters,
      execute,
      showToast,
    ]);

  useEffect(() => {
    void loadCashRegisters();
  }, [loadCashRegisters]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setPage(0);
    setFilterForm(emptyFilters);
    setAppliedFilters(emptyFilters);
  }, [open, establishmentId]);

  function applyFilters() {
    setPage(0);
    setAppliedFilters(filterForm);
  }

  function clearFilters() {
    setPage(0);
    setFilterForm(emptyFilters);
    setAppliedFilters(emptyFilters);
  }

  if (!open) {
    return null;
  }

  const title = establishmentName
    ? `Caixas — ${establishmentName}`
    : "Todas as caixas do sistema";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Fechar modal"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
      />

      <div className="relative flex max-h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3">
              <WalletCards className="h-6 w-6 text-blue-700" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {title}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Consulte caixas abertas, fechadas e os respetivos totais.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadCashRegisters}
              disabled={loading}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-700 disabled:opacity-50"
              title="Atualizar"
            >
              <RefreshCw
                size={20}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-6">
          <CashRegisterFilters
            values={filterForm}
            loading={loading}
            onChange={setFilterForm}
            onApply={applyFilters}
            onClear={clearFilters}
          />

          <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
       <CashRegistersTable
            cashRegisters={data?.content || []}
            loading={loading}
            onViewSales={setSelectedCashRegister}
            />

            <CashRegistersPagination
              page={data?.page || 0}
              size={data?.size || PAGE_SIZE}
              totalElements={
                data?.totalElements || 0
              }
              totalPages={
                data?.totalPages || 0
              }
              onPageChange={setPage}
            />
          </div>
          <CashRegisterSalesModal
        cashRegister={selectedCashRegister}
        onClose={() =>
            setSelectedCashRegister(null)
        }
        />
        </div>
      </div>
    </div>
  );
}