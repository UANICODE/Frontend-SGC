// components/superadmin/modal/UnblockEstablishmentModal.tsx
"use client";

import { useState } from "react";
import { X, AlertTriangle, CheckCircle, Unlock } from "lucide-react";
import { blockService } from "@/service/payments/blockService"; // ✅ Importando blockService

interface UnblockEstablishmentModalProps {
  establishmentId: string;
  establishmentName: string;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UnblockEstablishmentModal({
  establishmentId,
  establishmentName,
  open,
  onClose,
  onSuccess,
}: UnblockEstablishmentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const handleUnblock = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log("🔓 Tentando desbloquear:", establishmentId);
      // ✅ Usando blockService em vez de unblockService
      await blockService.unblockEstablishment(establishmentId);
      console.log("✅ Desbloqueio realizado com sucesso!");
      setSuccess(true);
      
      setTimeout(() => {
        onClose();
        onSuccess();
      }, 1500);
    } catch (err: any) {
      console.error("❌ Erro:", err);
      setError(err.message || "Erro ao desbloquear estabelecimento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slideInUp">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <Unlock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Desbloquear Estabelecimento</h2>
                <p className="text-white/80 text-sm">{establishmentName}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {success ? (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="p-3 bg-green-100 rounded-full mb-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-center text-gray-700 font-medium">
                Estabelecimento desbloqueado com sucesso!
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {establishmentName} agora está liberado.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Atenção!</p>
                  <p className="text-sm text-yellow-700">
                    Você está prestes a desbloquear o estabelecimento <strong>{establishmentName}</strong>
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-700">
                  Esta ação irá remover o bloqueio atual do estabelecimento, 
                  permitindo que ele volte a funcionar normalmente no sistema.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600">
                  Tem certeza que deseja desbloquear <strong>{establishmentName}</strong>?
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Esta ação é irreversível e restaura o acesso imediatamente
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!success && (
          <div className="flex gap-3 p-6 pt-0">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300"
            >
              Cancelar
            </button>

            <button
              onClick={handleUnblock}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Desbloqueando...
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  Desbloquear Agora
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}