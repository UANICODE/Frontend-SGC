"use client";

import { useState } from "react";

import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  ReceiptText,
  Table2,
  UserRound,
  Utensils,
} from "lucide-react";
import { CashRegisterSaleResponse } from "@/types/superadmin/cashregisters/listCashRegisterSales";

interface CashRegisterSaleCardProps {
  sale: CashRegisterSaleResponse;
}

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

function getStatusClass(status: string) {
  switch (status) {
    case "FINALIZADO":
      return "bg-emerald-100 text-emerald-700";

    case "CANCELADO":
      return "bg-red-100 text-red-700";

    case "RASCUNHO":
      return "bg-amber-100 text-amber-700";

    case "ARQUIVADO":
      return "bg-slate-200 text-slate-700";

    default:
      return "bg-blue-100 text-blue-700";
  }
}

export function CashRegisterSaleCard({
  sale,
}: CashRegisterSaleCardProps) {
  const [expanded, setExpanded] =
    useState(false);

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() =>
          setExpanded((current) => !current)
        }
        className="flex w-full items-start justify-between gap-4 p-5 text-left hover:bg-slate-50"
      >
        <div className="flex min-w-0 gap-3">
          <div className="rounded-lg bg-blue-100 p-2.5">
            <ReceiptText
              size={20}
              className="text-blue-700"
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-bold text-slate-900">
                {sale.saleNumber}
              </p>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                  sale.status
                )}`}
              >
                {sale.status}
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              {formatDate(sale.saleDate)}
            </p>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <UserRound size={14} />
                {sale.userName || sale.userUid}
              </span>

              {sale.paymentMethodName && (
                <span className="flex items-center gap-1.5">
                  <CreditCard size={14} />
                  {sale.paymentMethodName}
                </span>
              )}

              {sale.tableNumber && (
                <span className="flex items-center gap-1.5">
                  <Table2 size={14} />
                  Mesa {sale.tableNumber}
                </span>
              )}

              {sale.waiterName && (
                <span className="flex items-center gap-1.5">
                  <Utensils size={14} />
                  {sale.waiterName}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-slate-500">
              Total
            </p>

            <p className="text-lg font-bold text-slate-900">
              {formatMoney(sale.total)}
            </p>

            <p className="text-xs text-slate-400">
              {sale.items.length} item
              {sale.items.length === 1 ? "" : "s"}
            </p>
          </div>

          {expanded ? (
            <ChevronUp
              size={20}
              className="text-slate-500"
            />
          ) : (
            <ChevronDown
              size={20}
              className="text-slate-500"
            />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-200 bg-slate-50 p-5">
          {sale.items.length === 0 ? (
            <p className="text-center text-sm text-slate-500">
              Esta venda não possui itens.
            </p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <table className="min-w-full">
                <thead className="bg-slate-100">
                  <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-3">
                      Produto
                    </th>

                    <th className="px-4 py-3 text-right">
                      Quantidade
                    </th>

                    <th className="px-4 py-3 text-right">
                      Preço
                    </th>

                    <th className="px-4 py-3 text-right">
                      Subtotal
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {sale.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-sm font-medium text-slate-800">
                        {item.productName}
                      </td>

                      <td className="px-4 py-3 text-right text-sm text-slate-600">
                        {item.quantity}
                      </td>

                      <td className="px-4 py-3 text-right text-sm text-slate-600">
                        {formatMoney(item.unitPrice)}
                      </td>

                      <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                        {formatMoney(item.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 ml-auto max-w-xs space-y-2 rounded-xl bg-white p-4">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <span>
                {formatMoney(sale.subtotal)}
              </span>
            </div>

            <div className="flex justify-between text-sm text-slate-600">
              <span>Desconto</span>
              <span>
                {formatMoney(sale.discount)}
              </span>
            </div>

            <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-900">
              <span>Total</span>
              <span>
                {formatMoney(sale.total)}
              </span>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}