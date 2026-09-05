// types/admin/cost.ts

export interface CostCategory {
    id: string;
    name: string;
    description: string | null;
    active: boolean;
     establishmentId?: string;  
}

export interface CreateCostCategoryRequest {
    establishmentId: string;
    name: string;
    description?: string;
}

export interface UpdateCostCategoryRequest {
    categoryId: string;
    establishmentId: string;
    name: string;
    description?: string;
}

export interface GeneralExpense {
    id: string;
    description: string;
    categoryId: string;
    categoryName: string;
    amount: number;
    period: string;
    referenceDate: string;
    registeredByName: string;
    notes: string | null;
}

export interface CreateGeneralExpenseRequest {
    establishmentId: string;
    costCategoryId: string;
    description: string;
    amount: number;
    period: string;
    referenceDate: string;
    notes?: string;
}

export interface UpdateGeneralExpenseRequest {
    expenseId: string;
    establishmentId: string;
    costCategoryId: string;
    description: string;
    amount: number;
    period: string;
    referenceDate: string;
    notes?: string;
}
// types/admin/cost.ts

export interface GeneralExpenseFilterRequest {
    establishmentId: string;
    categoryId?: string;
    period?: string;
    startDate?: string;
    endDate?: string;
    minAmount?: number;
    maxAmount?: number;
    page?: number;
    size?: number;
}

export interface GeneralExpenseFilterResponse {
    content: GeneralExpense[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    totalAmount: number;
    averageAmount: number;
}

export interface CostDashboardSummary {
    totalExpenses: number;
    monthlyAverage: number;
    monthlyChange: number;
    byCategory: Record<string, number>;
    byPeriod: Record<string, number>;
    monthlyEvolution: MonthlyCost[];
    topCategories: CategoryCost[];
    periodStart: string;
    periodEnd: string;
}

export interface MonthlyCost {
    year: number;
    month: number;
    amount: number;
}

export interface CategoryCost {
    categoryId: string;
    categoryName: string;
    amount: number;
    percentage: number;
}


// types/admin/cost.ts

export interface ExportRequest {
    establishmentId: string;
    startDate?: string;
    endDate?: string;
}

export interface ExportDataResponse {
    groupedExpenses: MonthlyExpenseGroup[];
    grandTotal: number;
    periodStart: string;
    periodEnd: string;
    totalExpenses: number;
}

export interface MonthlyExpenseGroup {
    monthLabel: string;
    year: number;
    month: number;
    expenses: GeneralExpense[];
    subtotal: number;
}