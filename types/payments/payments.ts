export interface ScheduleBlockData {
  establishmentId: string;
  reason: string;
  warningHours: number
}

export interface BlockStatusResponse {
  establishmentId: string;
  warning: boolean;
  blocked: boolean;
  blockStartTime: string | null;
  blockEffectiveTime: string | null;
  reason: string | null;
  remainingMinutes: number | null;
}