export interface FinancialDashboardData {
    // Cards principais
    monthlyGrossProfit: number;
    previousMonthGrossProfit: number;
    monthlyChange: number; // percentual
    averageMargin: number;
    stockValuePurchase: number;
    stockValueSale: number;
    potentialProfit: number;

    // Rankings
    topProfitable: ProductProfitability[];
    lowestProfitable: ProductProfitability[];
    negativeMarginProducts: ProductProfitability[];

    // Metadados
    periodStart: string;
    periodEnd: string;
    currentMonth: string;
    establishmentName: string;
}

export interface ProductProfitability {
    productId: string;
    productName: string;
    categoryName: string;
    grossProfit: number;
    margin: number;
    salePrice: number;
    purchasePrice: number;
    quantitySold: number;
    totalRevenue: number;
    totalCost: number;
}