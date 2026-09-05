"use client";

import { Package, DollarSign, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/format";

interface StockValueCardProps {
    purchaseValue: number;
    saleValue: number;
}

export function StockValueCard({ purchaseValue, saleValue }: StockValueCardProps) {
    const potentialProfit = saleValue - purchaseValue;
    const profitMargin = purchaseValue > 0 ? (potentialProfit / purchaseValue) * 100 : 0;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                        <Package className="w-5 h-5" />
                    </div>
                    <h4 className="font-semibold text-gray-700">Analise do stock atual</h4>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50">
                        <span className="text-sm text-gray-600">Quanto custou para comprar todo o stock atual?</span>
                        <span className="font-bold text-gray-800">{formatCurrency(purchaseValue)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50">
                        <span className="text-sm text-gray-600">Quanto vai faturar quando vender tudo?</span>
                        <span className="font-bold text-gray-800">{formatCurrency(saleValue)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                        <span className="text-sm font-medium text-green-700">Lucro que está esperando no stock atual</span>
                        <div className="text-right">
                            <span className="font-bold text-green-700">{formatCurrency(potentialProfit)}</span>
                            <span className="text-xs text-green-600 ml-2">({profitMargin.toFixed(1)}%)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}