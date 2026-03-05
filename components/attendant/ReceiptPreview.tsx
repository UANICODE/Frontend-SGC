"use client";

import { Receipt } from "@/types/attendant/sale/Receipt";

interface Props {
  receipt: Receipt;
  onPrint: () => void;
  onClose: () => void;
}

export function ReceiptPreview({
  receipt,
  onPrint,
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl">

        <div id="receipt-print" className="receipt">

          <div className="text-center">
            <h2>{receipt.establishmentName}</h2>
            <p>{receipt.establishmentAddress}</p>
            <p>{receipt.establishmentPhone}</p>
          </div>

          <hr />

          {receipt.items.map((item, i) => (
            <div key={i}>
              <div>{item.productName}</div>
              <div className="flex justify-between">
                <span>{item.quantity} x {item.unitPrice}</span>
                <span>{item.subtotal}</span>
              </div>
            </div>
          ))}

          <hr />

          <p>Subtotal: {receipt.subtotal}</p>
          <p>Desconto: {receipt.discount}</p>
          <p><strong>Total: {receipt.total}</strong></p>

          <p>Pagamento: {receipt.paymentMethod}</p>
          <p>{new Date(receipt.date).toLocaleString()}</p>

        </div>

        <div className="flex gap-3 mt-4">
          <button onClick={onClose} className="flex-1 border py-2 rounded">
            Fechar
          </button>

          <button onClick={onPrint} className="flex-1 bg-black text-white py-2 rounded">
            Imprimir
          </button>
        </div>
      </div>
    </div>
  );
}