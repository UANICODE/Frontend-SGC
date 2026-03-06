"use client";

import { CashClosingReceipt } from "@/types/attendant/CashRegister";

interface Props {
  receipt: CashClosingReceipt;
  onClose: () => void;
}

export function CashClosingReceiptPreview({
  receipt,
  onClose,
}: Props) {

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 print:bg-white print:block">

      <div className="bg-white w-96 p-6 rounded-xl space-y-4 print:w-[80mm] print:p-2 print:shadow-none print:rounded-none">

        {/* RECIBO POS */}
        <div id="cash-closing-receipt" className="text-xs leading-tight font-mono">

          <div className="text-center mb-2">
            {receipt.establishmentLogoUrl && (
              <img
                src={receipt.establishmentLogoUrl}
                alt="logo"
                className="h-12 mx-auto mb-1"
              />
            )}

            <p className="font-bold">{receipt.establishmentName}</p>
            <p>{receipt.establishmentAddress}</p>
            <p>{receipt.establishmentPhone}</p>
          </div>

          <hr className="border-black my-1" />

          <div className="space-y-1">
            <p>Operador: {receipt.userName}</p>
            <p>Abertura: {new Date(receipt.openedAt).toLocaleString()}</p>
            <p>Fechamento: {new Date(receipt.closedAt).toLocaleString()}</p>
          </div>

          <hr className="border-black my-1" />

          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Total Vendas</span>
              <span>{receipt.totalSales} MZN</span>
            </div>

            <div className="flex justify-between">
              <span>Total Cancelado</span>
              <span>{receipt.totalCancelled} MZN</span>
            </div>

            <div className="flex justify-between font-bold">
              <span>Total Líquido</span>
              <span>{receipt.netTotal} MZN</span>
            </div>

            <div className="flex justify-between">
              <span>Transações</span>
              <span>{receipt.totalTransactions}</span>
            </div>
          </div>

          <hr className="border-black my-1" />

          <div>
            <p className="font-semibold mb-1">Por Método</p>

            {receipt.payments.map((p, index) => (
              <div key={index} className="flex justify-between">
                <span>{p.paymentMethod}</span>
                <span>{p.amount} MZN</span>
              </div>
            ))}
          </div>

          <hr className="border-black my-2" />

          <p className="text-center italic">
            Fecho de Caixa
          </p>

          <p className="text-center italic">
            SGC-Sistema de Gestao Comercial
          </p>

        </div>

        {/* BOTÕES (não aparecem na impressão) */}
        <div className="flex gap-2 pt-4 print:hidden">
          <button
            onClick={onClose}
            className="flex-1 border py-2 rounded-lg"
          >
            Fechar
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 bg-black text-white py-2 rounded-lg"
          >
            Imprimir
          </button>
        </div>

      </div>

    </div>
  );
}