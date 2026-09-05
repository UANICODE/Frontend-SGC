// components/admin/dashboard/CostDashboardCards.tsx
"use client";

import { TrendingUp, TrendingDown, DollarSign, Calendar, BarChart3 } from "lucide-react";

interface Props {
    totalExpenses: number;
    monthlyAverage: number;
    monthlyChange: number;
    periodStart: string;
    periodEnd: string;
}

export function CostDashboardCards({ totalExpenses, monthlyAverage, monthlyChange, periodStart, periodEnd }: Props) {
    const formatCurrency = (value: number) => {
        return value.toFixed(2) + " MT";
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("pt-MZ", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const isPositive = monthlyChange >= 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Total de Custos */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total de Custos</p>
                        <p className="text-2xl font-bold text-primary mt-2">{formatCurrency(totalExpenses)}</p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-xl">
                        <DollarSign className="w-6 h-6 text-primary" />
                    </div>
                </div>
                <p className="text-xs text-gray-400 mt-4">
                    Período: {formatDate(periodStart)} - {formatDate(periodEnd)}
                </p>
            </div>

           
            {/* Variação Mensal */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Variação Mensal</p>
                        <p className={`text-2xl font-bold mt-2 flex items-center gap-2 ${isPositive ? 'text-red-500' : 'text-green-500'}`}>
                            {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                            {isPositive ? '+' : ''}{monthlyChange.toFixed(1)}%
                        </p>
                    </div>
                    <div className={`p-3 ${isPositive ? 'bg-red-50' : 'bg-green-50'} rounded-xl`}>
                        {isPositive ? (
                            <TrendingUp className={`w-6 h-6 text-red-500`} />
                        ) : (
                            <TrendingDown className={`w-6 h-6 text-green-500`} />
                        )}
                    </div>
                </div>
                <p className="text-xs text-gray-400 mt-4">
                    {isPositive ? 'Aumento em relação ao mês anterior' : 'Redução em relação ao mês anterior'}
                </p>
            </div>

            {/* Período */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Período Analisado</p>
                        <p className="text-lg font-bold text-gray-800 mt-2">
                            {formatDate(periodStart)} - {formatDate(periodEnd)}
                        </p>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-xl">
                        <BarChart3 className="w-6 h-6 text-gray-600" />
                    </div>
                </div>
                <p className="text-xs text-gray-400 mt-4">Últimos 12 meses</p>
            </div>
        </div>
    );
}