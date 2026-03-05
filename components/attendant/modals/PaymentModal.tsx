"use client";

import { PaymentMethod } from "@/types/attendant/sale/PaymentMethod";
import { useState } from "react";

interface Props {
  open: boolean;
  methods: PaymentMethod[];
  onClose: () => void;
  onConfirm: (methodId: string) => void;
}

export function PaymentModal({
  open,
  methods,
  onClose,
  onConfirm,
}: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-96 space-y-4">
        <h2 className="text-lg font-bold">
          Escolher Método de Pagamento
        </h2>

        {methods.map((m) => (
          <div
            key={m.id}
            onClick={() => setSelected(m.id)}
            className={`p-3 border rounded-lg cursor-pointer ${
              selected === m.id
                ? "border-black bg-gray-100"
                : ""
            }`}
          >
            {m.name}
          </div>
        ))}

        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 border rounded-lg py-2"
          >
            Cancelar
          </button>

          <button
            disabled={!selected}
            onClick={() => selected && onConfirm(selected)}
            className="flex-1 bg-green-600 text-white rounded-lg py-2 disabled:opacity-50"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}