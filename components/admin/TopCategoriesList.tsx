// components/admin/dashboard/TopCategoriesList.tsx
"use client";

import { CategoryCost } from "@/types/admin/cost";
import { TrendingUp } from "lucide-react";

interface Props {
    categories: CategoryCost[];
    totalExpenses: number;
}

export function TopCategoriesList({ categories, totalExpenses }: Props) {
    const formatCurrency = (value: number) => {
        return value.toFixed(2) + " MT";
    };

    const getColor = (index: number) => {
        const colors = [
            "bg-blue-500",
            "bg-purple-500",
            "bg-pink-500",
            "bg-amber-500",
            "bg-emerald-500",
            "bg-red-500",
        ];
        return colors[index % colors.length];
    };

    if (categories.length === 0) {
        return (
            <div className="text-center py-8 text-gray-400">
                Sem categorias com custos
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {categories.map((category, index) => {
                const percentage = totalExpenses > 0 
                    ? (category.amount / totalExpenses) * 100 
                    : 0;

                return (
                    <div key={category.categoryId} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getColor(index)}`} />
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700 truncate">
                                    {category.categoryName}
                                </span>
                                <span className="text-sm font-semibold text-gray-900">
                                    {formatCurrency(category.amount)}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                <div
                                    className={`h-1.5 rounded-full ${getColor(index)}`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                                <span>{percentage.toFixed(1)}%</span>
                                <span>{category.percentage.toFixed(1)}% do total</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}