export interface EstablishmentBlockStatusResponse {
  establishmentId: string;
  scheduled: boolean;
  warning: boolean;
  blocked: boolean;
  canUnblock: boolean;
  reason: string | null;
  blockStartTime: string | null;
  blockEffectiveTime: string | null;
  serverTime: string;
  remainingSeconds: number;
}