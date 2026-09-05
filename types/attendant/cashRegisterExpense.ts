// types/attendant/cashRegisterExpense.ts

export interface CostCategory {
    id: string;
    name: string;
    description: string;
}

export interface CashRegisterExpense {
    id: string;
    description: string;
    categoryId: string;
    categoryName: string;
    amount: number;
    expenseDate: string;
    registeredByName: string;
    notes: string;
    canEdit: boolean;
}

export interface CashRegisterBalance {
    cashRegisterId: string;
    cashRegisterStatus: string;
    totalSales: number;
    totalExpenses: number;
    remainingBalance: number;
    recentExpenses: CashRegisterExpense[];
}

export interface CreateExpenseRequest {
    cashRegisterId: string;
    costCategoryId: string;
    description: string;
    amount: number;
    notes?: string;
}

export interface UpdateExpenseRequest {
    expenseId: string;
    costCategoryId: string;
    description: string;
    amount: number;
    notes?: string;
}