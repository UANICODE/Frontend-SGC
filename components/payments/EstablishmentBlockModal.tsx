"use client";

import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useBlockSchedule } from "@/hooks/payments/useBlockSchedule";


interface Props {
  establishmentId: string;
  establishmentName: string;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EstablishmentBlockModal({
  establishmentId,
  establishmentName,
  open,
  onClose,
  onSuccess
}: Props) {
  const [warningHours, setWarningHours] = useState(48);
  const [totalHours, setTotalHours] = useState(96);
  const [reason, setReason] = useState("Pagamento em atraso");
  
  const { loading, error, scheduleBlock, deactivateBlock } = useBlockSchedule();

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await scheduleBlock({
      establishmentId,
      reason,
      warningHours

    });
    
    if (success) {
      onSuccess();
      onClose();
    }
  };

  const handleDeactivate = async () => {
    if (!confirm("Tem certeza que deseja desativar o bloqueio? O estabelecimento voltará ao normal.")) {
      return;
    }

    const success = await deactivateBlock(establishmentId);
    
    if (success) {
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-bold text-gray-900">
            Bloquear {establishmentName}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motivo do bloqueio
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Horas de aviso prévio
            </label>
            <input
              type="number"
              min="1"
              value={warningHours}
              onChange={(e) => setWarningHours(Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Durante este período, os usuários verão um popup de aviso
            </p>
          </div>

          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Período de aviso:</strong> {warningHours}h<br />
            
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50"
            >
              {loading ? "Processando..." : "Agendar Bloqueio"}
            </button>
            
            <button
              type="button"
              onClick={handleDeactivate}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50"
            >
              Desativar Bloqueio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}