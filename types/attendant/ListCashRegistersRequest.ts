export interface ListCashRegistersRequest {
  establishmentId: string;
  date?: string | null;
  today?: boolean | null;
  status?: "ABERTO" | "FECHADO" | null;
}