// hooks/payments/useBlockSchedule.ts
import { useState } from 'react';
import { blockService } from '@/service/payments/blockService';
import { ScheduleBlockData } from '@/types/payments/payments';

interface UseBlockScheduleReturn {
  loading: boolean;
  error: string | null;
  scheduleBlock: (data: ScheduleBlockData) => Promise<boolean>;
  deactivateBlock: (establishmentId: string) => Promise<boolean>;
}

export function useBlockSchedule(): UseBlockScheduleReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scheduleBlock = async (data: ScheduleBlockData): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await blockService.scheduleBlock(data);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deactivateBlock = async (establishmentId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await blockService.deactivateBlock(establishmentId);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, scheduleBlock, deactivateBlock };
}