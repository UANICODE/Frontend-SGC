export interface InventoryProductItem {
  productId: string;
  name: string;
  category: string;
  salePrice: number;              // 🔥 Preço de Venda
  purchasePrice: number;
  controlsStock: boolean;
  stockQuantity: number;
  imageUrl: string | null;
  ingredients?: {
    ingredientId: string;
    ingredientName: string;
    quantityUsedPerProduct: number;
    ingredientStockQuantity: number;
  }[];
}

export interface InventoryReportResponse {
  establishmentId: string;
  establishmentName: string;
  logoUrl: string;
  address: string;
  phone: string;
  generatedAt: string;
  totalProducts: number;
  totalStockControlledProducts: number;
  totalStockQuantity: number;
  products: InventoryProductItem[];
}

export interface PaymentSummary {
  paymentMethodName: string;
  total: number;
}

