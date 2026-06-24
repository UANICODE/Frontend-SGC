// src/hooks/payments/useBlockStatus.ts
"use client";

import { useState, useEffect } from 'react';
import { blockService } from '@/service/payments/blockService';
import { BlockStatusResponse } from '@/types/payments/payments';

interface UseBlockStatusReturn {
  status: BlockStatusResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  hasBlock: boolean;
  isWarning: boolean;
  isBlocked: boolean;
  canUnblock: boolean;
}

export function useBlockStatus(establishmentId: string): UseBlockStatusReturn {
  const [status, setStatus] = useState<BlockStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    if (!establishmentId) {
      console.log("❌ Sem establishmentId");
      return;
    }
    
    console.log("🔍 Buscando status para:", establishmentId);
    setLoading(true);
    
    try {
      // ✅ Usando blockService que já existe
      const data = await blockService.getBlockStatus(establishmentId);
      console.log("✅ Status recebido:", data);
      
      // Adiciona canUnblock baseado no blocked
      const statusWithCanUnblock = {
        ...data,
        canUnblock: data.blocked || false
      };
      
      setStatus(statusWithCanUnblock);
      setError(null);
    } catch (err: any) {
      console.error("❌ Erro ao buscar status:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchStatus, 30000);
    
    return () => clearInterval(interval);
  }, [establishmentId]);

  return {
    status,
    loading,
    error,
    refetch: fetchStatus,
    hasBlock: status?.warning || status?.blocked || false,
    isWarning: status?.warning || false,
    isBlocked: status?.blocked || false,
    canUnblock: status?.blocked || false,
  };
}