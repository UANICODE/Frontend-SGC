// hooks/payments/useBlockWarning.ts
import { useState, useEffect, useCallback } from 'react';
import { useBlockStatus } from './useBlockStatus';

interface UseBlockWarningReturn {
  showWarning: boolean;
  warningData: any;
  closeWarning: () => void;
}

export function useBlockWarning(establishmentId: string): UseBlockWarningReturn {
  const [showWarning, setShowWarning] = useState(false);
  const [warningData, setWarningData] = useState<any>(null);
  const [lastShown, setLastShown] = useState<number>(0);
  const { status } = useBlockStatus(establishmentId);

  const shouldShowPopup = useCallback(() => {
    if (!status?.warning || status.blocked) return false;
    
    // 🔥 Mostra imediatamente na primeira vez
    if (lastShown === 0) return true;
    
    // 🔥 Depois, mostra a cada 5 minutos (300000 ms)
    const now = Date.now();
    return (now - lastShown) >= 300000; // 5 minutos
  }, [status, lastShown]);

  useEffect(() => {
    if (shouldShowPopup()) {
      setWarningData(status);
      setShowWarning(true);
      setLastShown(Date.now());
    }
  }, [status, shouldShowPopup]);

  const closeWarning = useCallback(() => {
    setShowWarning(false);
    // Não reseta lastShown aqui - mantém o tempo para o próximo ciclo
  }, []);

  return { showWarning, warningData, closeWarning };
}