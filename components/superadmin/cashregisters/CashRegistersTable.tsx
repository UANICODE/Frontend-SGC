"use client";

import { GlobalCashRegisterItemResponse } from "@/types/superadmin/cashregisters/listGlobalCashRegisters";
import {
  Building2,
  Clock3,
  Eye,
  ReceiptText,
  UserRound,
  WalletCards,
} from "lucide-react";


interface CashRegistersTableProps {
  cashRegisters: GlobalCashRegisterItemResponse[];
  loading: boolean;

  onViewSales: (
    cashRegister: GlobalCashRegisterItemResponse
  ) => void;
}
function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("pt-MZ", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("pt-MZ", {
    style: "currency",
    currency: "MZN",
    minimumFractionDigits: 2,
  }).format(value);
}

export function CashRegistersTable({
  cashRegisters,
  loading,
  onViewSales,
}: CashRegistersTableProps) {
  if (loading && cashRegisters.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

        <p className="mt-4 text-sm text-slate-500">
          A carregar caixas...
        </p>
      </div>
    );
  }

  if (cashRegisters.length === 0) {
    return (
      <div className="p-12 text-center">
        <WalletCards className="mx-auto h-12 w-12 text-slate-300" />

        <h3 className="mt-4 font-semibold text-slate-800">
          Nenhuma caixa encontrada
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Altere os filtros para procurar outras caixas.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-slate-50">
          <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
            <th className="px-5 py-4">
              Estabelecimento
            </th>

            <th className="px-5 py-4">
              Responsável
            </th>

            <th className="px-5 py-4">
              Estado
            </th>

            <th className="px-5 py-4">
              Abertura e fecho
            </th>

            <th className="px-5 py-4 text-right">
              Totais
            </th>
            <th className="px-5 py-4 text-right">
                Ações
                </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {cashRegisters.map((cashRegister) => (
            <tr
              key={cashRegister.id}
              className="hover:bg-slate-50"
            >
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  {cashRegister.establishmentLogoUrl ? (
                    <img
                      src={
                        cashRegister.establishmentLogoUrl
                      }
                      alt={
                        cashRegister.establishmentName
                      }
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <Building2
                        size={19}
                        className="text-blue-700"
                      />
                    </div>
                  )}

                  <div>
                    <p className="font-semibold text-slate-900">
                      {
                        cashRegister.establishmentName
                      }
                    </p>

                    <p className="text-xs text-slate-500">
                      {cashRegister.businessTypeName ||
                        "Tipo não definido"}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-5 py-4">
                <div className="flex items-start gap-2">
                  <UserRound
                    size={16}
                    className="mt-0.5 text-slate-400"
                  />

                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {cashRegister.userName ||
                        cashRegister.userUid}
                    </p>

                    <p className="text-xs text-slate-400">
                      {cashRegister.userEmail ||
                        cashRegister.userUid}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-5 py-4">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                    cashRegister.status === "ABERTO"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      cashRegister.status === "ABERTO"
                        ? "bg-emerald-500"
                        : "bg-slate-500"
                    }`}
                  />

                  {cashRegister.status}
                </span>
              </td>

              <td className="px-5 py-4">
                <div className="space-y-1 text-xs text-slate-600">
                  <p className="flex items-center gap-2">
                    <Clock3
                      size={14}
                      className="text-emerald-600"
                    />
                    Aberta:{" "}
                    {formatDate(
                      cashRegister.openedAt
                    )}
                  </p>

                  <p className="flex items-center gap-2">
                    <Clock3
                      size={14}
                      className="text-slate-400"
                    />
                    Fechada:{" "}
                    {formatDate(
                      cashRegister.closedAt
                    )}
                  </p>
                </div>
              </td>

              <td className="px-5 py-4 text-right">
                <p className="font-bold text-slate-900">
                  {formatMoney(
                    cashRegister.netTotal
                  )}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Vendas:{" "}
                  {formatMoney(
                    cashRegister.totalSalesCalculated
                  )}
                </p>

                {cashRegister.totalCancelled > 0 && (
                  <p className="text-xs text-red-500">
                    Cancelado:{" "}
                    {formatMoney(
                      cashRegister.totalCancelled
                    )}
                  </p>
                )}
              </td>
             <td className="px-5 py-4 text-right">
                    <button
                        type="button"
                        onClick={() => onViewSales(cashRegister)}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-200"
                    >
                        <Eye size={17} />
                        Ver vendas
                    </button>
                    </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}