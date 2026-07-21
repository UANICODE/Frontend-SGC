"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Building2,
  Plus,
  RefreshCw,
  WalletCards,
} from "lucide-react";

import { UserRole } from "@/enum/enum";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";
import { useToast } from "@/ context/ToastContext";

import { useListEstablishments } from "@/hooks/superadmin/establishments/useListEstablishments";
import { useListBusinessTypes } from "@/hooks/superadmin/establishments/useListBusinessTypes";

import { EstablishmentCard } from "@/components/superadmin/cards/EstablishmentCard";

import { CreateEstablishmentModal } from "@/components/superadmin/modal/CreateEstablishmentModal";
import { EstablishmentFilters, EstablishmentFilterValues } from "@/components/superadmin/establishments/EstablishmentFilters";
import { EstablishmentsPagination } from "@/components/superadmin/establishments/EstablishmentsPagination";
import { EstablishmentListItemResponse } from "@/types/superadmin/establishments/listEstablishments";
import { EditEstablishmentModal } from "@/components/superadmin/modal/EditEstablishmentModal";
import { GlobalCashRegistersModal } from "@/components/superadmin/modal/GlobalCashRegistersModal";

const PAGE_SIZE = 12;

const emptyFilters: EstablishmentFilterValues = {
  search: "",
  active: "",
  businessTypeId: "",
};

export default function ListEstablishmentsPage() {
  useRoleGuard([UserRole.SUPERADMIN]);

  const { showToast } = useToast();

  const {
    data,
    loading,
    execute: loadEstablishments,
  } = useListEstablishments();

  const {
    data: businessTypes,
    loading: businessTypesLoading,
    execute: loadBusinessTypes,
  } = useListBusinessTypes();
  const [
  cashRegistersOpen,
  setCashRegistersOpen,
] = useState(false);

    const [
      selectedCashRegisterEstablishment,
      setSelectedCashRegisterEstablishment,
    ] = useState<EstablishmentListItemResponse | null>(
      null
    );

  const [
      editingEstablishment,
      setEditingEstablishment,
    ] = useState<EstablishmentListItemResponse | null>(
      null
    );
  const [page, setPage] = useState(0);

  const [createOpen, setCreateOpen] =
    useState(false);

  const [filterForm, setFilterForm] =
    useState<EstablishmentFilterValues>(
      emptyFilters
    );

  const [appliedFilters, setAppliedFilters] =
    useState<EstablishmentFilterValues>(
      emptyFilters
    );

    function openAllCashRegisters() {
      setSelectedCashRegisterEstablishment(null);
      setCashRegistersOpen(true);
    }


    function openEstablishmentCashRegisters(
      establishment: EstablishmentListItemResponse
    ) {
      setSelectedCashRegisterEstablishment(
        establishment
      );

      setCashRegistersOpen(true);
    }
  const fetchEstablishments =
    useCallback(async () => {
      try {
        await loadEstablishments({
          page,
          size: PAGE_SIZE,
          search:
            appliedFilters.search.trim() || null,
          active:
            appliedFilters.active === ""
              ? null
              : appliedFilters.active === "true",
          businessTypeId:
            appliedFilters.businessTypeId || null,
        });
      } catch (error: any) {
        showToast(
          error?.message ||
            "Não foi possível carregar os estabelecimentos.",
          "error"
        );
      }
    }, [
      page,
      appliedFilters,
      loadEstablishments,
      showToast,
    ]);

  const fetchBusinessTypes =
    useCallback(async () => {
      try {
        await loadBusinessTypes(true);
      } catch (error: any) {
        showToast(
          error?.message ||
            "Não foi possível carregar os tipos de negócio.",
          "error"
        );
      }
    }, [
      loadBusinessTypes,
      showToast,
    ]);

  useEffect(() => {
    void fetchEstablishments();
  }, [fetchEstablishments]);

  useEffect(() => {
    void fetchBusinessTypes();
  }, [fetchBusinessTypes]);

  const establishments = data?.content || [];

  const activeOnCurrentPage = useMemo(
    () =>
      establishments.filter(
        (establishment) => establishment.active
      ).length,
    [establishments]
  );

  function applyFilters() {
    setPage(0);
    setAppliedFilters(filterForm);
  }

  function clearFilters() {
    setPage(0);
    setFilterForm(emptyFilters);
    setAppliedFilters(emptyFilters);
  }

  async function refreshAfterCreation() {
    setCreateOpen(false);
    await fetchEstablishments();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">

        <section className="overflow-hidden rounded-2xl bg-slate-950 shadow-xl">
          <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:p-8">
            <div>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-600 p-3">
                  <Building2 className="h-6 w-6 text-white" />
                </div>

                <div>
                  <p className="text-sm font-medium text-blue-300">
                    Administração global
                  </p>

                  <h1 className="text-2xl font-bold text-white sm:text-3xl">
                    Gestão de estabelecimentos
                  </h1>
                </div>
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
                Consulte, filtre e administre todos os
                estabelecimentos registados no SGC.
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
                <div className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Total encontrado
                  </p>

                  <p className="text-2xl font-bold text-white">
                    {data?.totalElements || 0}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Ativos nesta página
                  </p>

                  <p className="text-2xl font-bold text-emerald-400">
                    {activeOnCurrentPage}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Plus size={18} />
                Cadastrar estabelecimento
              </button>

                <button
                  type="button"
                  onClick={openAllCashRegisters}
                  className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
                >
                  <WalletCards size={18} />
                  Caixas do sistema
                </button>
              <button
                type="button"
                onClick={fetchEstablishments}
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-600 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                <RefreshCw
                  size={18}
                  className={
                    loading
                      ? "animate-spin"
                      : ""
                  }
                />

                Atualizar
              </button>
            </div>
          </div>
        </section>

        <EstablishmentFilters
          values={filterForm}
          businessTypes={businessTypes}
          loading={
            loading || businessTypesLoading
          }
          onChange={setFilterForm}
          onApply={applyFilters}
          onClear={clearFilters}
        />

        {loading && establishments.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm text-slate-500">
              A carregar estabelecimentos...
            </p>
          </div>
        ) : establishments.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <Building2 className="mx-auto h-12 w-12 text-slate-400" />

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              Nenhum estabelecimento encontrado
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Ajuste os filtros ou cadastre um novo estabelecimento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {establishments.map(
              (establishment) => (
              <EstablishmentCard
              key={establishment.id}
              establishment={establishment}
              onBlockStatusChange={
                fetchEstablishments
              }
              onEdit={setEditingEstablishment}
              onViewCashRegisters={
                openEstablishmentCashRegisters
              }
            />
              )
            )}
          </div>
        )}

        <EstablishmentsPagination
          page={data?.page || 0}
          size={data?.size || PAGE_SIZE}
          totalElements={
            data?.totalElements || 0
          }
          totalPages={data?.totalPages || 0}
          onPageChange={(newPage) => {
            setPage(newPage);

            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
        />
      </div>

          <EditEstablishmentModal
            establishment={editingEstablishment}
            businessTypes={businessTypes}
            onClose={() => setEditingEstablishment(null)}
            onUpdated={async () => {
              setEditingEstablishment(null);
              await fetchEstablishments();
            }}
          />

          <GlobalCashRegistersModal
              open={cashRegistersOpen}
              establishmentId={
                selectedCashRegisterEstablishment?.id ||
                null
              }
              establishmentName={
                selectedCashRegisterEstablishment
                  ?.tradeName || null
              }
              onClose={() => {
                setCashRegistersOpen(false);
                setSelectedCashRegisterEstablishment(
                  null
                );
              }}
            />
      <CreateEstablishmentModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={refreshAfterCreation}
      />
    </div>
  );
}