"use client";

import { CashClosingReceipt } from "@/types/attendant/CashRegister";


interface Props {
  receipt: CashClosingReceipt;
  onClose: () => void;
  onPrint: () => void;
}

export function CashClosingReceiptPreview({
  receipt,
  onClose,
  onPrint,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-96 p-6 rounded-xl space-y-4">

        <div className="text-center">
          {receipt.establishmentLogoUrl && (
            <img
              src={receipt.establishmentLogoUrl}
              alt="logo"
              className="h-12 mx-auto mb-2"
            />
          )}

          <h2 className="font-bold">
            {receipt.establishmentName}
          </h2>

          <p className="text-xs text-gray-500">
            {receipt.establishmentAddress}
          </p>

          <p className="text-xs text-gray-500">
            {receipt.establishmentPhone}
          </p>
        </div>

        <div className="border-t pt-3 text-sm space-y-1">
          <p>Operador: {receipt.userName}</p>
          <p>Abertura: {new Date(receipt.openedAt).toLocaleString()}</p>
          <p>Fechamento: {new Date(receipt.closedAt).toLocaleString()}</p>
        </div>

        <div className="border-t pt-3 text-sm space-y-1">
          <p>Total Vendas: € {receipt.totalSales}</p>
          <p>Total Cancelado: € {receipt.totalCancelled}</p>
          <p className="font-bold">
            Total Líquido: € {receipt.netTotal}
          </p>
          <p>Total Transações: {receipt.totalTransactions}</p>
        </div>

        <div className="border-t pt-3 text-sm space-y-1">
          <p className="font-semibold">Por Método:</p>
          {receipt.payments.map((p, index) => (
            <div key={index} className="flex justify-between">
              <span>{p.paymentMethodName}</span>
              <span>€ {p.total}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-4">
          <button
            onClick={onClose}
            className="flex-1 border py-2 rounded-lg"
          >
            Fechar
          </button>

          <button
            onClick={onPrint}
            className="flex-1 bg-black text-white py-2 rounded-lg"
          >
            Imprimir
          </button>
        </div>

      </div>
    </div>
  );
}