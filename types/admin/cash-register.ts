export interface ListOpenCashRegistersRequest {
  establishmentId: string;
}

export interface PaymentMethodTotalResponse {
  paymentMethod: string;
  total: number;
}

export interface OpenCashRegisterResponse {
  cashRegisterId: string;
  userUid: string;
  attendantName: string;
  openedAt: string;
  totalSold: number;
  totalsByPaymentMethod: PaymentMethodTotalResponse[];
}