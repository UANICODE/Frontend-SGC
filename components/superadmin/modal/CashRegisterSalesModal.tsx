"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Clock3,
  RefreshCw,
  ReceiptText,
  WalletCards,
  X,
} from "lucide-react";
import { GlobalCashRegisterItemResponse } from "@/types/superadmin/cashregisters/listGlobalCashRegisters";
import { CashRegisterSalesFilters, CashRegisterSalesFilterValues } from "../cashregisters/CashRegisterSalesFilters";
import { useToast } from "@/ context/ToastContext";
import { useListCashRegisterSales } from "@/hooks/superadmin/cashregisters/useListCashRegisterSales";
import { CashRegisterSaleCard } from "../cards/CashRegisterSaleCard";
import { CashRegisterSalesPagination } from "../cashregisters/CashRegisterSalesPagination";



interface CashRegisterSalesModalProps {
  cashRegister: GlobalCashRegisterItemResponse | null;
  onClose: () => void;
}

const PAGE_SIZE = 10;

const emptyFilters: CashRegisterSalesFilterValues = {
  search: "",
  status: "",
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("pt-MZ", {
    style: "currency",
    currency: "MZN",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("pt-MZ", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getErrorMessage(
  error: unknown,
  fallback: string
) {
  return error instanceof Error
    ? error.message
    : fallback;
}

export function CashRegisterSalesModal({
  cashRegister,
  onClose,
}: CashRegisterSalesModalProps) {
  const { showToast } = useToast();

  const {
    data,
    loading,
    execute,
    clear,
  } = useListCashRegisterSales();

  const [page, setPage] = useState(0);

  const [filterForm, setFilterForm] =
    useState<CashRegisterSalesFilterValues>(
      emptyFilters
    );

  const [appliedFilters, setAppliedFilters] =
    useState<CashRegisterSalesFilterValues>(
      emptyFilters
    );

  const loadSales = useCallback(async () => {
    if (!cashRegister) {
      return;
    }

    try {
      await execute(cashRegister.id, {
        page,
        size: PAGE_SIZE,
        search:
          appliedFilters.search.trim() ||
          null,
        status:
          appliedFilters.status || null,
      });
    } catch (error) {
      showToast(
        getErrorMessage(
          error,
          "Não foi possível carregar as vendas."
        ),
        "error"
      );
    }
  }, [
    cashRegister,
    page,
    appliedFilters,
    execute,
    showToast,
  ]);

  useEffect(() => {
    if (!cashRegister) {
      return;
    }

    setPage(0);
    setFilterForm(emptyFilters);
    setAppliedFilters(emptyFilters);
    clear();
  }, [cashRegister, clear]);

  useEffect(() => {
    void loadSales();
  }, [loadSales]);

  if (!cashRegister) {
    return null;
  }

  function applyFilters() {
    setPage(0);
    setAppliedFilters(filterForm);
  }

  function clearFilters() {
    setPage(0);
    setFilterForm(emptyFilters);
    setAppliedFilters(emptyFilters);
  }

  const context = data?.cashRegister;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Fechar vendas"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
      />

      <div className="relative flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <header className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3">
              <ReceiptText className="h-6 w-6 text-blue-700" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Vendas do caixa
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {cashRegister.establishmentName}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={loadSales}
              disabled={loading}
              title="Atualizar vendas"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-700 disabled:opacity-50"
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
        </header>

        <div className="overflow-y-auto p-6">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Estado do caixa
              </p>

              <p className="mt-2 font-bold text-slate-900">
                {context?.cashRegisterStatus ||
                  cashRegister.status}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
                <Clock3 size={14} />
                Abertura
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-900">
                {formatDate(
                  context?.openedAt ||
                    cashRegister.openedAt
                )}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Total líquido
              </p>

              <p className="mt-2 text-lg font-bold text-emerald-700">
                {formatMoney(
                  context?.netTotal ??
                    cashRegister.netTotal
                )}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Vendas encontradas
              </p>

              <p className="mt-2 text-lg font-bold text-slate-900">
                {data?.totalElements || 0}
              </p>
            </div>
          </section>

          <div className="mt-5">
            <CashRegisterSalesFilters
              values={filterForm}
              loading={loading}
              onChange={setFilterForm}
              onApply={applyFilters}
              onClear={clearFilters}
            />
          </div>

          <section className="mt-5 space-y-4">
            {loading &&
            (data?.content.length || 0) === 0 ? (
              <div className="rounded-xl border border-slate-200 p-12 text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                <p className="mt-4 text-sm text-slate-500">
                  A carregar vendas...
                </p>
              </div>
            ) : (data?.content.length || 0) === 0 ? (
              <div className="rounded-xl border border-slate-200 p-12 text-center">
                <WalletCards className="mx-auto h-12 w-12 text-slate-300" />

                <h3 className="mt-4 font-semibold text-slate-800">
                  Nenhuma venda encontrada
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Este caixa ainda não possui vendas
                  correspondentes aos filtros.
                </p>
              </div>
            ) : (
              data?.content.map((sale) => (
                <CashRegisterSaleCard
                  key={sale.id}
                  sale={sale}
                />
              ))
            )}
          </section>

          <CashRegisterSalesPagination
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
      </div>
    </div>
  );
}