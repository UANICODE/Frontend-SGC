export interface ReceiptItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Receipt {
  saleNumber: string;
  establishmentName: string;
  establishmentLogoUrl: string;
  establishmentAddress: string;
  establishmentPhone: string;
  paymentMethod: string;
  cashier: string;
  items: ReceiptItem[];
  subtotal: number;
  discount: number;
  total: number;
  date: string;
}