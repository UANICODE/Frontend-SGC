export interface ProductsPerEstablishment {
  establishmentName: string;
  totalProducts: number;
}

export interface SuperDashboardResponse {
  totalStock: number;
  totalSales: number;
  totalEstablishments: number;
  lowStockProducts: number;
  productsPerEstablishment: ProductsPerEstablishment[];
}