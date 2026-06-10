// components/attendant/KitchenReceiptPreview.tsx
"use client";

import { Receipt } from "@/types/attendant/sale/Receipt";

interface Props {
  receipt: Receipt;
  onPrint: () => void;
  onClose: () => void;
}

export function KitchenReceiptPreview({ receipt, onPrint, onClose }: Props) {
  return (
    <>
      {/* PRINT STYLES */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }

            #kitchen-receipt-print, #kitchen-receipt-print * {
              visibility: visible;
            }

            #kitchen-receipt-print {
              position: absolute;
              left: 0;
              top: 0;
              width: 72mm;
              color: #000 !important;
              font-weight: 700 !important;
              -webkit-font-smoothing: none;
              filter: contrast(1.4);
            }

            #kitchen-receipt-print hr {
              border-top: 2px solid black !important;
            }
          }
        `}
      </style>

      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 no-print">
        <div className="bg-white p-2 rounded-xl w-72">
          
          <div
            id="kitchen-receipt-print"
            className="receipt text-sm leading-tight"
            style={{
              color: "#000",
              fontWeight: 700,
              fontFamily: "monospace"
            }}
          >
            {/* Cabeçalho da Cozinha */}
            <div className="text-center border-b pb-1 mb-1">
              <h2 className="text-base font-bold">🍳 COZINHA</h2>
              <div className="font-bold">{receipt.establishmentName}</div>
              <div className="text-[10px] mt-1">Data: {new Date(receipt.date).toLocaleString()}</div>
              <div className="text-[10px]">Atendente do caixa: {receipt.cashier}</div>
            </div>

            <hr className="my-1" />

            {/* Itens da Cozinha */}
            <div className="text-center text-[11px] font-bold mb-1">PEDIDO</div>
            
            {receipt.items.map((item, index) => (
              <div key={index} className="mb-2">
                <div className="text-sm font-bold">{item.productName}</div>
                <div className="flex justify-between text-xs mt-0.5">
                  <span>🍽️ Quantidade: {item.quantity}</span>
                  <span>Obs: _______________</span>
                </div>
              </div>
            ))}

            <hr className="my-1" />

            {/* Rodapé */}
            <div className="text-center mt-1">
              <div className="text-[10px]">Total de itens: {receipt.items.length}</div>
              <div className="mt-2 pt-1 border-t border-black border-dashed">
                <div className="text-[10px]">_________________</div>
                <div className="text-[10px] mt-1">Assinatura da Cozinha</div>
              </div>
              <div className="text-center text-[10px] mt-2">----------</div>
              <div className="text-center text-[10px]">Obrigado!</div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-2 mt-2 no-print">
            <button
              onClick={onClose}
              className="flex-1 border py-1 rounded text-xs"
            >
              Fechar
            </button>

            <button
              onClick={onPrint}
              className="flex-1 bg-orange-600 text-white py-1 rounded text-xs flex items-center justify-center gap-1"
            >
              🖨️ Imprimir Cozinha
            </button>
          </div>
        </div>
      </div>
    </>
  );
}