import { blockService } from '@/service/payments/blockService';
import { BlockStatusResponse } from '@/types/payments/payments';
import { useState, useEffect } from 'react';


interface UseBlockStatusReturn {
  status: BlockStatusResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  hasBlock: boolean;
  isWarning: boolean;
  isBlocked: boolean;
}

export function useBlockStatus(establishmentId: string): UseBlockStatusReturn {
  const [status, setStatus] = useState<BlockStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    if (!establishmentId) return;
    
    setLoading(true);
    try {
      const data = await blockService.getBlockStatus(establishmentId);
      setStatus(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    
    // Atualizar a cada minuto
    const interval = setInterval(fetchStatus, 60000);
    
    return () => clearInterval(interval);
  }, [establishmentId]);

  return {
    status,
    loading,
    error,
    refetch: fetchStatus,
    hasBlock: status?.warning || status?.blocked || false,
    isWarning: status?.warning || false,
    isBlocked: status?.blocked || false
  };
}