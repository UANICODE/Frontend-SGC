"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  Mail,
  Search,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";

import { useToast } from "@/ context/ToastContext";
import { useManageAdministrators } from "@/hooks/superadmin/establishments/useManageAdministrators";

interface ManageAdministratorsModalProps {
  establishmentId: string | null;
  establishmentName: string | null;
  onClose: () => void;
}

const PAGE_SIZE = 6;

function getErrorMessage(
  error: unknown,
  fallback: string
) {
  return error instanceof Error
    ? error.message
    : fallback;
}

export function ManageAdministratorsModal({
  establishmentId,
  establishmentName,
  onClose,
}: ManageAdministratorsModalProps) {
  const { showToast } = useToast();

  const {
    linked,
    available,
    loadingLinked,
    loadingAvailable,
    processingUid,
    loadLinked,
    loadAvailable,
    assign,
    remove,
    clear,
  } = useManageAdministrators();

  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] =
    useState("");

  const [page, setPage] = useState(0);

  const loadData = useCallback(async () => {
    if (!establishmentId) {
      return;
    }

    await Promise.all([
      loadLinked(establishmentId),
      loadAvailable(
        establishmentId,
        page,
        PAGE_SIZE,
        appliedSearch
      ),
    ]);
  }, [
    establishmentId,
    page,
    appliedSearch,
    loadLinked,
    loadAvailable,
  ]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    if (establishmentId) {
      return;
    }

    clear();
    setSearch("");
    setAppliedSearch("");
    setPage(0);
  }, [establishmentId, clear]);

  if (!establishmentId) {
    return null;
  }

  async function handleAssign(
    userUid: string
  ) {
    try {
      await assign(
        establishmentId!,
        userUid
      );

      showToast(
        "Administrador atribuído com sucesso.",
        "success"
      );

      await loadData();
    } catch (error) {
      showToast(
        getErrorMessage(
          error,
          "Não foi possível atribuir o administrador."
        ),
        "error"
      );
    }
  }

  async function handleRemove(
    userUid: string
  ) {
    try {
      await remove(
        establishmentId!,
        userUid
      );

      showToast(
        "Administrador removido do estabelecimento.",
        "success"
      );

      setPage(0);
      await loadData();
    } catch (error) {
      showToast(
        getErrorMessage(
          error,
          "Não foi possível remover o administrador."
        ),
        "error"
      );
    }
  }

  function applySearch() {
    setPage(0);
    setAppliedSearch(search.trim());
  }

  function closeModal() {
    clear();
    setSearch("");
    setAppliedSearch("");
    setPage(0);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Fechar"
        onClick={closeModal}
        className="absolute inset-0 bg-slate-950/70"
      />

      <div className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <header className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div className="flex gap-3">
            <div className="rounded-xl bg-blue-100 p-3">
              <Users className="h-6 w-6 text-blue-700" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Gerir administradores
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {establishmentName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeModal}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </header>

        <div className="overflow-y-auto p-6">
          <section>
            <div className="mb-4">
              <h3 className="font-bold text-slate-900">
                Administradores vinculados
              </h3>

              <p className="text-sm text-slate-500">
                {linked.length} administrador
                {linked.length === 1 ? "" : "es"}
              </p>
            </div>

            {loadingLinked ? (
              <div className="rounded-xl border border-slate-200 p-8 text-center text-sm text-slate-500">
                A carregar administradores...
              </div>
            ) : linked.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
                <Users className="mx-auto h-10 w-10 text-slate-300" />

                <p className="mt-3 font-medium text-slate-700">
                  Nenhum administrador vinculado
                </p>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {linked.map((administrator) => (
                  <article
                    key={administrator.userUid}
                    className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {administrator.profilePhotoUrl ? (
                        <img
                          src={
                            administrator.profilePhotoUrl
                          }
                          alt={administrator.name}
                          className="h-11 w-11 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                          {administrator.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900">
                          {administrator.name}
                        </p>

                        <p className="flex items-center gap-1 truncate text-xs text-slate-500">
                          <Mail size={13} />
                          {administrator.email}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={
                        processingUid ===
                        administrator.userUid
                      }
                      onClick={() =>
                        handleRemove(
                          administrator.userUid
                        )
                      }
                      title="Remover administrador"
                      className="rounded-lg bg-red-50 p-2.5 text-red-600 hover:bg-red-100 disabled:opacity-50"
                    >
                      <Trash2 size={17} />
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>

          <div className="my-7 border-t border-slate-200" />

          <section>
            <div>
              <h3 className="font-bold text-slate-900">
                Adicionar administrador
              </h3>

              <p className="text-sm text-slate-500">
                Selecione um utilizador com a função ADMIN.
              </p>
            </div>

            <div className="mt-4 flex gap-3">
              <div className="relative flex-1">
                <Search
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      applySearch();
                    }
                  }}
                  placeholder="Pesquisar por nome ou e-mail"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 pl-11 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <button
                type="button"
                onClick={applySearch}
                disabled={loadingAvailable}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Pesquisar
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {loadingAvailable ? (
                <div className="rounded-xl border border-slate-200 p-8 text-center text-sm text-slate-500">
                  A procurar administradores...
                </div>
              ) : available?.content.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                  Nenhum administrador disponível.
                </div>
              ) : (
                available?.content.map(
                  (administrator) => (
                    <article
                      key={administrator.userUid}
                      className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 hover:bg-slate-50"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">
                          {administrator.name}
                        </p>

                        <p className="text-sm text-slate-500">
                          {administrator.email}
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={
                          processingUid ===
                          administrator.userUid
                        }
                        onClick={() =>
                          handleAssign(
                            administrator.userUid
                          )
                        }
                        className="flex items-center gap-2 rounded-lg bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-200 disabled:opacity-50"
                      >
                        <UserPlus size={17} />
                        Adicionar
                      </button>
                    </article>
                  )
                )
              )}
            </div>

            {(available?.totalPages || 0) > 1 && (
              <div className="mt-5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={available?.first}
                  onClick={() =>
                    setPage((current) =>
                      Math.max(current - 1, 0)
                    )
                  }
                  className="rounded-lg border border-slate-300 p-2 disabled:opacity-40"
                >
                  <ChevronLeft size={18} />
                </button>

                <span className="text-sm text-slate-600">
                  Página {(available?.page || 0) + 1} de{" "}
                  {available?.totalPages}
                </span>

                <button
                  type="button"
                  disabled={available?.last}
                  onClick={() =>
                    setPage(
                      (current) => current + 1
                    )
                  }
                  className="rounded-lg border border-slate-300 p-2 disabled:opacity-40"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}