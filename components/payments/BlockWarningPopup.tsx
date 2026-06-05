// components/payments/BlockWarningPopup.tsx
"use client";

import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface Props {
  establishmentId: string;
  blockStartTime: string;
  blockEffectiveTime: string;
  reason: string;
  remainingMinutes: number;
  onClose: () => void;
}

export function BlockWarningPopup({
  blockStartTime,
  blockEffectiveTime,
  reason,
  remainingMinutes,
  onClose
}: Props) {
  const [timeLeft, setTimeLeft] = useState("");
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const blockEnd = new Date(blockEffectiveTime);
      const blockStart = new Date(blockStartTime);
      
      const totalDuration = blockEnd.getTime() - blockStart.getTime();
      const remaining = blockEnd.getTime() - now.getTime();
      
      if (remaining <= 0) {
        setTimeLeft("Expirado");
        setProgress(0);
        return;
      }

      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours}h ${minutes}min ${seconds}s`);
      setProgress((remaining / totalDuration) * 100);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [blockEffectiveTime, blockStartTime]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        
        {/* 🔵 Cabeçalho com azul escuro do logo */}
        <div className="bg-[#1e3a8a] p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-white text-2xl">⚡</span>
            <h3 className="text-white font-bold text-lg">Aviso de Bloqueio</h3>
          </div>
          <button onClick={onClose} className="text-white hover:text-blue-200">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-gray-700 mb-4">{reason}</p>
          
          {/* 🔵 Área do tempo com azul claro */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-[#1e3a8a] mb-2 font-medium">
              ⏳ Tempo restante para regularizar:
            </p>
            <p className="text-3xl font-bold text-[#1e3a8a] text-center font-mono">
              {timeLeft}
            </p>
          </div>

          {/* 🔵 Barra de progresso com gradiente do logo */}
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-4">
            <div 
              className="h-full bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-sm text-gray-600">
            Após este prazo, o sistema será bloqueado automaticamente. 
            Entre em contacto para regularizar.
          </p>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-[#1e3a8a] font-medium mb-1">📞 Contactos:</p>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Chamadas: 83 550 9151</span>
              <span>WhatsApp: 87 326 9520</span>
            </div>
            <p className="text-xs text-center mt-2 text-[#1e3a8a] font-medium">
              www.uanicode.com
            </p>
          </div>
          
          <p className="text-xs text-gray-400 mt-3 text-center border-t pt-2">
            Este aviso reaparecerá a cada 5 minutos até a regularização
          </p>
        </div>

        <div className="bg-gray-50 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#2e4a9a] transition font-medium text-sm"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}