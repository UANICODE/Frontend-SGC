"use client";

import { ProductProfitability } from "@/types/admin/financial";
import { formatCurrency } from "@/lib/format";
import { Trophy, TrendingDown, AlertCircle } from "lucide-react";

interface ProductRankingListProps {
    products: ProductProfitability[];
    type: "top" | "lowest" | "negative";
    title: string;
}

export function ProductRankingList({ products, type, title }: ProductRankingListProps) {
    const getIcon = () => {
        if (type === "top") return <Trophy className="w-5 h-5 text-yellow-500" />;
        if (type === "negative") return <AlertCircle className="w-5 h-5 text-red-500" />;
        return <TrendingDown className="w-5 h-5 text-orange-500" />;
    };

    const getItemColor = (margin: number) => {
        if (margin > 30) return "border-green-200 bg-green-50";
        if (margin > 15) return "border-yellow-200 bg-yellow-50";
        if (margin >= 0) return "border-orange-200 bg-orange-50";
        return "border-red-200 bg-red-50";
    };

    const getMarginColor = (margin: number) => {
        if (margin > 30) return "text-green-600";
        if (margin > 15) return "text-yellow-600";
        if (margin >= 0) return "text-orange-600";
        return "text-red-600";
    };

    if (!products || products.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                    {getIcon()}
                    <h4 className="font-semibold text-gray-700">{title}</h4>
                </div>
                <p className="text-sm text-gray-400 text-center py-4">
                    Nenhum produto encontrado neste período
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    {getIcon()}
                    <h4 className="font-semibold text-gray-700">{title}</h4>
                    <span className="ml-auto text-xs text-gray-400">{products.length} produtos</span>
                </div>
            </div>

            <div className="divide-y divide-gray-100">
                {products.map((product, index) => (
                    <div
                        key={product.productId}
                        className={`p-4 hover:bg-gray-50 transition-colors duration-200 border-l-4 ${getItemColor(product.margin)}`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs font-bold text-gray-400 w-6`}>
                                        #{index + 1}
                                    </span>
                                    <p className="font-medium text-gray-800 truncate">
                                        {product.productName}
                                    </p>
                                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full truncate max-w-[100px]">
                                        {product.categoryName}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                    <span>Vendidos: {product.quantitySold}</span>
                                    <span>•</span>
                                    <span>Receita: {formatCurrency(product.totalRevenue)}</span>
                                </div>
                            </div>
                            <div className="text-right ml-4">
                                <p className={`font-bold ${getMarginColor(product.margin)}`}>
                                    {formatCurrency(product.grossProfit)}
                                </p>
                                <p className={`text-xs font-medium ${getMarginColor(product.margin)}`}>
                                    {product.margin.toFixed(1)}%
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}