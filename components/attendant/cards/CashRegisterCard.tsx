"use client";

import { CashRegister } from "@/types/attendant/CashRegister";
import {
  ShoppingCart,
  Lock,
  Clock,
  DollarSign,
  Ban
} from "lucide-react";
import { useState } from "react";
import { ConfirmCloseCashModal } from "../modals/ConfirmCloseCashModal";

interface Props {
  cash: CashRegister;
  primaryColor: string;
  secondaryColor: string;
  onClose: (cashId: string) => void;
  closing?: boolean;
  onSell: (cashId: string) => void;
  sellingCashId?: string | null;
}

export function CashRegisterCard({
  cash,
  primaryColor,
  secondaryColor,
  onSell,
  onClose,
  closing,
  sellingCashId,
}: Props) {

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmSellOpen, setConfirmSellOpen] = useState(false); // 🔥 NOVO

  const isOpen = cash.status === "ABERTO";
  const isSelling = sellingCashId === cash.id;

  return (
    <>
      <div
        className={`
          bg-white p-6 rounded-2xl shadow border transform transition-all duration-300
          hover:scale-105 hover:shadow-xl cursor-pointer
          ${isOpen ? "border-4 shadow-2xl" : "border-gray-200"}
        `}
        style={isOpen ? { borderColor: primaryColor } : undefined}
      >

        {/* HEADER */}
        <div className="flex justify-between mb-3">
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <Clock size={14} />
            {new Date(cash.openedAt).toLocaleString()}
          </span>

          <span
            className={`text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1 ${
              isOpen
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            <Lock size={14} />
            {cash.status}
          </span>
        </div>

        {/* INFO */}
        <div className="space-y-1 text-sm">
          <p className="flex items-center gap-2">
            <DollarSign size={16} />
            Total Vendas: <strong>MZN {cash.totalSalesCalculated}</strong>
          </p>

          <p className="flex items-center gap-2">
            <Ban size={16} />
            Cancelado: <strong>MZN {cash.totalCancelled}</strong>
          </p>
        </div>

        {isOpen && (
          <>
            {/* BOTÃO VENDER */}
            <button
              onClick={() => setConfirmSellOpen(true)} // 🔥 ALTERADO
              disabled={isSelling}
              className="mt-4 w-full py-2 rounded-xl text-white flex justify-center items-center gap-2
              transform transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: secondaryColor }}
            >
              {isSelling && (
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
              )}

              {!isSelling && <ShoppingCart size={18} />}

              {isSelling ? "Abrindo Venda..." : "Vender"}
            </button>

            {/* BOTÃO FECHAR */}
            <button
              onClick={() => setConfirmOpen(true)}
              disabled={closing}
              className="mt-2 w-full py-2 rounded-xl bg-red-600 text-white flex justify-center items-center gap-2
              transform transition-all duration-200 hover:scale-105 disabled:opacity-50"
            >
              <Lock size={18} />
              {closing ? "Fechando..." : "Fechar Caixa"}
            </button>
          </>
        )}
      </div>

      {/* MODAL FECHAR CAIXA */}
      <ConfirmCloseCashModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        loading={closing}
        onConfirm={() => {
          onClose(cash.id);
          setConfirmOpen(false);
        }}
      />

      {/* 🔥 MODAL CONFIRMAR VENDA (NOVO) */}
          <ConfirmCloseCashModal
          open={confirmSellOpen}
          onClose={() => setConfirmSellOpen(false)}
          loading={isSelling}
          onConfirm={() => {
            onSell(cash.id);
            setConfirmSellOpen(false);
          }}
          title="Iniciar Venda"
          description="Deseja realmente iniciar uma nova venda nesta caixa?"
          confirmText="Sim, iniciar"
          variant="success"
        />
    </>
  );
}