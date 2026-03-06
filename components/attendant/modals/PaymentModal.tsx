"use client";

import { PaymentMethod } from "@/types/attendant/sale/PaymentMethod";
import { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

interface Props {
  open: boolean;
  methods: PaymentMethod[];
  onClose: () => void;
  onConfirm: (methodId: string) => Promise<void>;
}

export function PaymentModal({
  open,
  methods,
  onClose,
  onConfirm,
}: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function confirm() {
    if (!selected) return;

    setLoading(true);
    await onConfirm(selected);
    setLoading(false);
  }

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
            className={`p-3 border rounded-lg cursor-pointer flex justify-between items-center ${
              selected === m.id ? "border-black bg-gray-100" : ""
            }`}
          >
            <span>{m.name}</span>
            {selected === m.id && <CheckCircleIcon className="w-5 h-5 text-green-600" />}
          </div>
        ))}

        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 border rounded-lg py-2 flex items-center justify-center gap-2"
          >
            Cancelar
          </button>

          <button
            disabled={!selected || loading}
            onClick={confirm}
            className="flex-1 bg-green-600 text-white rounded-lg py-2 flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
            )}
            {!loading && <CheckCircleIcon className="w-5 h-5" />}
            {loading ? "Finalizando..." : "Concluir"}
          </button>
        </div>

      </div>
    </div>
  );
}