// components/superadmin/cards/EstablishmentCard.tsx

"use client";

import { EstablishmentBlockModal } from "@/components/payments/EstablishmentBlockModal";
import { UnblockEstablishmentModal } from "@/components/superadmin/modal/UnblockEstablishmentModal";
import { useBlockStatus } from "@/hooks/payments/useBlockStatus";
import { EstablishmentListItemResponse } from "@/types/superadmin/establishments/listEstablishments";

import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  Lock,
  Mail,
  MoreVertical,
  Pencil,
  Phone,
  Unlock,
  Users,
  WalletCards,
  XCircle,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

interface Props {
  establishment: EstablishmentListItemResponse;

  onBlockStatusChange?: () => void;

  onEdit: (
    establishment: EstablishmentListItemResponse
  ) => void;

  onViewCashRegisters: (
    establishment: EstablishmentListItemResponse
  ) => void;

  onManageAdministrators: (
    establishment: EstablishmentListItemResponse
  ) => void;
}

export function EstablishmentCard({
  establishment,
  onBlockStatusChange,
  onEdit,
  onViewCashRegisters,
  onManageAdministrators,
}: Props) {
  const [blockModalOpen, setBlockModalOpen] =
    useState(false);

  const [unblockModalOpen, setUnblockModalOpen] =
    useState(false);

  const [actionsOpen, setActionsOpen] =
    useState(false);

  const actionsMenuRef =
    useRef<HTMLDivElement>(null);

  const {
    hasBlock,
    isWarning,
    isBlocked,
    canUnblock,
    refetch,
    status,
  } = useBlockStatus(establishment.id);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (!actionsOpen) {
      return;
    }

    function handleClickOutside(
      event: MouseEvent
    ) {
      const target = event.target as Node;

      if (
        actionsMenuRef.current?.contains(target)
      ) {
        return;
      }

      setActionsOpen(false);
    }

    function handleEscape(
      event: KeyboardEvent
    ) {
      if (event.key !== "Escape") {
        return;
      }

      setActionsOpen(false);
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [actionsOpen]);

  const handleSuccess = () => {
    refetch();
    onBlockStatusChange?.();
  };

  const getBlockActionState = () => {
    if (isBlocked) {
      return {
        text: "Estabelecimento bloqueado",
        icon: Lock,
        className:
          "text-gray-400 cursor-not-allowed",
        disabled: true,
        tooltip:
          "O estabelecimento está bloqueado.",
      };
    }

    if (isWarning) {
      return {
        text: "Gerir aviso de bloqueio",
        icon: AlertTriangle,
        className:
          "text-yellow-700 hover:bg-yellow-50",
        disabled: false,
        tooltip:
          "Visualizar ou gerir o aviso ativo.",
      };
    }

    return {
      text: "Bloquear estabelecimento",
      icon: Lock,
      className:
        "text-red-600 hover:bg-red-50",
      disabled: false,
      tooltip:
        "Agendar o bloqueio deste estabelecimento.",
    };
  };

  const blockActionState =
    getBlockActionState();

  const BlockActionIcon =
    blockActionState.icon;

  function executeAction(
    action: () => void
  ) {
    setActionsOpen(false);
    action();
  }

  return (
    <>
      <div className="relative flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow transition hover:shadow-lg">
        {/* Badge de bloqueio */}
        {hasBlock && (
          <div className="absolute right-2 top-2">
            <span
              className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                isBlocked
                  ? "bg-red-100 text-red-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {isBlocked ? (
                <Lock size={12} />
              ) : (
                <AlertTriangle size={12} />
              )}

              {isBlocked
                ? "Bloqueado"
                : "Aviso"}
            </span>
          </div>
        )}

        {/* Logo e nome */}
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-gray-50">
            {establishment.logoUrl ? (
              <img
                src={establishment.logoUrl}
                alt={establishment.tradeName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xs text-gray-400">
                Sem Logo
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-gray-900">
              {establishment.tradeName}
            </h3>

            <p className="truncate text-sm text-gray-500">
              {establishment.legalName}
            </p>
          </div>
        </div>

        {/* Informações */}
        <div className="space-y-1 text-sm">
          <p className="flex items-center gap-2 truncate">
            <Mail
              size={14}
              className="shrink-0 text-gray-400"
            />

            <span className="truncate">
              {establishment.email}
            </span>
          </p>

          <p className="flex items-center gap-2 truncate">
            <Phone
              size={14}
              className="shrink-0 text-gray-400"
            />

            <span className="truncate">
              {establishment.phone || "-"}
            </span>
          </p>

          <p className="flex items-center gap-2">
            {establishment.active ? (
              <CheckCircle
                size={14}
                className="text-green-500"
              />
            ) : (
              <XCircle
                size={14}
                className="text-red-500"
              />
            )}

            Status:{" "}
            {establishment.active
              ? "Ativo"
              : "Inativo"}
          </p>
        </div>

        {/* Informações do bloqueio */}
        {isBlocked && !canUnblock && (
          <p className="rounded-lg bg-gray-50 px-3 py-2 text-center text-xs text-gray-500">
            Bloqueado. Aguarde o período de
            bloqueio terminar.
          </p>
        )}

        {isWarning && (
          <p className="rounded-lg bg-yellow-50 px-3 py-2 text-center text-xs text-yellow-700">
            Aviso ativo:{" "}
            {status?.remainingMinutes || 0}{" "}
            minutos restantes
          </p>
        )}

        {/* Menu de ações */}
        <div
          ref={actionsMenuRef}
          className="relative mt-auto"
        >
          <button
            type="button"
            onClick={() =>
              setActionsOpen(
                (current) => !current
              )
            }
            aria-haspopup="menu"
            aria-expanded={actionsOpen}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
          >
            <MoreVertical size={17} />

            Ações

            <ChevronDown
              size={16}
              className={`transition-transform ${
                actionsOpen
                  ? "rotate-180"
                  : ""
              }`}
            />
          </button>

          {actionsOpen && (
            <div
              role="menu"
              className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-xl"
            >
              {/* Editar */}
              <button
                type="button"
                role="menuitem"
                onClick={() =>
                  executeAction(() =>
                    onEdit(establishment)
                  )
                }
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-blue-700 transition hover:bg-blue-50"
              >
                <div className="rounded-lg bg-blue-100 p-2">
                  <Pencil size={16} />
                </div>

                <div>
                  <p>Editar estabelecimento</p>

                  <p className="text-xs font-normal text-gray-500">
                    Alterar os dados do negócio
                  </p>
                </div>
              </button>

              {/* Administradores */}
              <button
                type="button"
                role="menuitem"
                onClick={() =>
                  executeAction(() =>
                    onManageAdministrators(
                      establishment
                    )
                  )
                }
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-violet-700 transition hover:bg-violet-50"
              >
                <div className="rounded-lg bg-violet-100 p-2">
                  <Users size={16} />
                </div>

                <div>
                  <p>Gerir administradores</p>

                  <p className="text-xs font-normal text-gray-500">
                    Atribuir ou remover
                    administradores
                  </p>
                </div>
              </button>

              {/* Caixas */}
              <button
                type="button"
                role="menuitem"
                onClick={() =>
                  executeAction(() =>
                    onViewCashRegisters(
                      establishment
                    )
                  )
                }
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-cyan-700 transition hover:bg-cyan-50"
              >
                <div className="rounded-lg bg-cyan-100 p-2">
                  <WalletCards size={16} />
                </div>

                <div>
                  <p>Ver caixas</p>

                  <p className="text-xs font-normal text-gray-500">
                    Consultar caixas e vendas
                  </p>
                </div>
              </button>

              <div className="my-2 border-t border-gray-100" />

              {/* Bloquear ou gerir aviso */}
              <button
                type="button"
                role="menuitem"
                disabled={
                  blockActionState.disabled
                }
                title={
                  blockActionState.tooltip
                }
                onClick={() =>
                  executeAction(() =>
                    setBlockModalOpen(true)
                  )
                }
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition disabled:opacity-60 ${blockActionState.className}`}
              >
                <div
                  className={`rounded-lg p-2 ${
                    isBlocked
                      ? "bg-gray-100"
                      : isWarning
                        ? "bg-yellow-100"
                        : "bg-red-100"
                  }`}
                >
                  <BlockActionIcon size={16} />
                </div>

                <div>
                  <p>
                    {blockActionState.text}
                  </p>

                  <p className="text-xs font-normal text-gray-500">
                    {isBlocked
                      ? "O estabelecimento já está bloqueado"
                      : isWarning
                        ? "Consultar o aviso em vigor"
                        : "Agendar bloqueio do estabelecimento"}
                  </p>
                </div>
              </button>

              {/* Desbloquear */}
              {isBlocked && canUnblock && (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() =>
                    executeAction(() =>
                      setUnblockModalOpen(true)
                    )
                  }
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-green-700 transition hover:bg-green-50"
                >
                  <div className="rounded-lg bg-green-100 p-2">
                    <Unlock size={16} />
                  </div>

                  <div>
                    <p>
                      Desbloquear estabelecimento
                    </p>

                    <p className="text-xs font-normal text-gray-500">
                      Restaurar o acesso ao sistema
                    </p>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de bloqueio */}
      <EstablishmentBlockModal
        establishmentId={establishment.id}
        establishmentName={
          establishment.tradeName
        }
        open={blockModalOpen}
        onClose={() =>
          setBlockModalOpen(false)
        }
        onSuccess={handleSuccess}
      />

      {/* Modal de desbloqueio */}
      <UnblockEstablishmentModal
        establishmentId={establishment.id}
        establishmentName={
          establishment.tradeName
        }
        open={unblockModalOpen}
        onClose={() =>
          setUnblockModalOpen(false)
        }
        onSuccess={handleSuccess}
      />
    </>
  );
}