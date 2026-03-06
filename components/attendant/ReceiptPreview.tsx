"use client";

import { Receipt } from "@/types/attendant/sale/Receipt";

interface Props {
  receipt: Receipt;
  onPrint: () => void;
  onClose: () => void;
}

export function ReceiptPreview({ receipt, onPrint, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-2 rounded-xl w-72"> {/* largura reduzida para POS */}

        <div id="receipt-print" className="receipt text-xs leading-tight"> {/* fonte menor e compacta */}

          {/* LOGO E INFO */}
          <div className="text-center mb-1">
            {receipt.establishmentLogoUrl && (
              <img src={receipt.establishmentLogoUrl} alt="Logo" className="mx-auto h-12 w-auto mb-1"/>
            )}
            <div>{receipt.establishmentName}</div>
            <div>{receipt.establishmentAddress}</div>
            <div>{receipt.establishmentPhone}</div>
          </div>

          {/* ITENS */}
          {receipt.items.map((item, i) => (
            <div key={i} className="mb-0.5">
              <div>{item.productName}</div>
              <div className="flex justify-between">
                <span>{item.quantity} x {item.unitPrice}</span>
                <span>{item.subtotal} MT</span>
              </div>
            </div>
          ))}

          <hr className="my-1 border-t border-black"/>

          {/* TOTAIS */}
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{receipt.subtotal} MT</span>
          </div>
          <div className="flex justify-between">
            <span>Desconto:</span>
            <span>{receipt.discount} MT</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>{receipt.total} MT</span>
          </div>

          <div>Pagamento: {receipt.paymentMethod}</div>
          <div>{new Date(receipt.date).toLocaleString()}</div>

          {/* LINHA DE SEPARAÇÃO E MENSAGEM FINAL */}
          <hr className="my-1 border-t border-black"/>
          <div className="text-center italic">----------</div>
          <div className="text-center italic">Obrigado, volte sempre!</div>

        </div>

        {/* BOTÕES */}
        <div className="flex gap-2 mt-2">
          <button onClick={onClose} className="flex-1 border py-1 rounded text-xs">
            Fechar
          </button>

          <button onClick={onPrint} className="flex-1 bg-black text-white py-1 rounded text-xs">
            Imprimir
          </button>
        </div>
      </div>
    </div>
  );
}