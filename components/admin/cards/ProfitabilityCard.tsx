"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatCurrency } from "@/lib/format";

interface ProfitabilityCardProps {
    title: string;
    value: number;
    previousValue?: number;
    change?: number;
    icon?: React.ReactNode;
    subtitle?: string;
    color?: "green" | "red" | "blue" | "purple";
}

export function ProfitabilityCard({
    title,
    value,
    previousValue,
    change,
    icon,
    subtitle,
    color = "blue"
}: ProfitabilityCardProps) {
    const isPositive = change !== undefined && change > 0;
    const isNegative = change !== undefined && change < 0;

    const colorClasses = {
        green: "bg-gradient-to-r from-green-500 to-emerald-500",
        red: "bg-gradient-to-r from-red-500 to-rose-500",
        blue: "bg-gradient-to-r from-blue-500 to-indigo-500",
        purple: "bg-gradient-to-r from-purple-500 to-violet-500",
    };

    const lightColorClasses = {
        green: "bg-green-50 text-green-600 border-green-200",
        red: "bg-red-50 text-red-600 border-red-200",
        blue: "bg-blue-50 text-blue-600 border-blue-200",
        purple: "bg-purple-50 text-purple-600 border-purple-200",
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden group">
            <div className="p-5">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">{title}</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {formatCurrency(value)}
                        </p>
                        {subtitle && (
                            <p className="text-xs text-gray-400">{subtitle}</p>
                        )}
                    </div>
                    {icon && (
                        <div className={`p-3 rounded-xl ${lightColorClasses[color]} group-hover:scale-110 transition-transform duration-300`}>
                            {icon}
                        </div>
                    )}
                </div>

                {change !== undefined && previousValue !== undefined && (
                    <div className="mt-3 flex items-center gap-2">
                        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                            isPositive ? "bg-green-100 text-green-700" :
                            isNegative ? "bg-red-100 text-red-700" :
                            "bg-gray-100 text-gray-500"
                        }`}>
                            {isPositive && <TrendingUp className="w-3 h-3" />}
                            {isNegative && <TrendingDown className="w-3 h-3" />}
                            {!isPositive && !isNegative && <Minus className="w-3 h-3" />}
                            {change !== 0 ? `${Math.abs(change).toFixed(1)}%` : "0%"}
                        </div>
                        <span className="text-xs text-gray-400">
                            vs mês anterior ({formatCurrency(previousValue)})
                        </span>
                    </div>
                )}
            </div>

            <div className={`h-1 ${colorClasses[color]} group-hover:h-1.5 transition-all duration-300`} />
        </div>
    );
}