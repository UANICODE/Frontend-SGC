import api from "@/service/api";
import { BlockStatusResponse, ScheduleBlockData } from "@/types/payments/payments";



export class BlockService {
  private baseUrl = "/api";

  // Agendar bloqueio
  async scheduleBlock(data: ScheduleBlockData): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/superadmin/establishments/block/schedule`, data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erro ao agendar bloqueio");
    }
  }

  // Desativar bloqueio
  async deactivateBlock(establishmentId: string): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/superadmin/establishments/block/${establishmentId}/deactivate`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erro ao desativar bloqueio");
    }
  }

  // Verificar status do bloqueio
  async getBlockStatus(establishmentId: string): Promise<BlockStatusResponse> {
    try {
      const response = await api.get(`${this.baseUrl}/public/establishments/${establishmentId}/block-status`);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao verificar bloqueio:", error);
      return {
        establishmentId,
        warning: false,
        blocked: false,
        blockStartTime: null,
        blockEffectiveTime: null,
        reason: null,
        remainingMinutes: null
      };
    }
  }
}

export const blockService = new BlockService();