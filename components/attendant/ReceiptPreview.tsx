"use client";

import { Receipt } from "@/types/attendant/sale/Receipt";
import { QRCodeCanvas } from "qrcode.react";

interface Props {
  receipt: Receipt;
  onPrint: () => void;
  onClose: () => void;
}

export function ReceiptPreview({ receipt, onPrint, onClose }: Props) {
  return (
    <>
      {/* PRINT STYLES */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }

            #receipt-print, #receipt-print * {
              visibility: visible;
            }

            #receipt-print {
              position: absolute;
              left: 0;
              top: 0;
              width: 72mm;
              color: #000 !important;
              font-weight: 700 !important;
              -webkit-font-smoothing: none;
              filter: contrast(1.4);
            }

            #receipt-print hr {
              border-top: 2px solid black !important;
            }
          }
        `}
      </style>

      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="bg-white p-2 rounded-xl w-72">

          <div
            id="receipt-print"
            className="receipt text-sm leading-tight"
            style={{
              color: "#000",
              fontWeight: 700,
              fontFamily: "monospace"
            }}
          >

            {/* LOGO E INFO */}
            <div className="text-center mb-1">
              {receipt.establishmentLogoUrl && (
                <img
                  src={receipt.establishmentLogoUrl}
                  alt="Logo"
                  className="mx-auto h-12 w-auto mb-1"
                />
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

            <hr className="my-1" />

            {/* TOTAIS */}
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{receipt.subtotal} MT</span>
            </div>
            <div className="flex justify-between">
              <span>Desconto:</span>
              <span>{receipt.discount} MT</span>
            </div>

            <div className="flex justify-between text-base">
              <span>TOTAL:</span>
              <span>{receipt.total} MT</span>
            </div>

            <div>Metodos: {receipt.paymentMethod}</div>
            <div>{new Date(receipt.date).toLocaleString()}</div>

            <hr className="my-1" />

            {/* QR + MENSAGEM */}
            <div className="flex flex-col items-center mt-1">
              <QRCodeCanvas
                value="https://www.uanicode.com"
                size={90}
                level="H"
              />
              <div className="text-[10px] mt-1">Visite-nos</div>

              <div className="text-center">----------</div>
              <div className="text-center">Obrigado, volte sempre!</div>
              <div className="text-center">----------</div>
            </div>
          </div>

          {/* BOTÕES */}
          <div className="flex gap-2 mt-2 no-print">
            <button
              onClick={onClose}
              className="flex-1 border py-1 rounded text-xs"
            >
              Fechar
            </button>

            <button
              onClick={onPrint}
              className="flex-1 bg-black text-white py-1 rounded text-xs"
            >
              Imprimir
            </button>
          </div>
        </div>
      </div>
    </>
  );
}