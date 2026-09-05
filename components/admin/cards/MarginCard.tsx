"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

interface MarginCardProps {
    title: string;
    value: number;
    subtitle?: string;
}

export function MarginCard({ title, value, subtitle }: MarginCardProps) {
    const isGood = value >= 30;
    const isMedium = value >= 15 && value < 30;
    const isLow = value < 15;

    const getColor = () => {
        if (isGood) return "text-green-600 bg-green-50 border-green-200";
        if (isMedium) return "text-yellow-600 bg-yellow-50 border-yellow-200";
        return "text-orange-600 bg-orange-50 border-orange-200";
    };

    const getIcon = () => {
        if (isGood) return <TrendingUp className="w-5 h-5" />;
        if (isMedium) return <TrendingUp className="w-5 h-5" />;
        return <TrendingDown className="w-5 h-5" />;
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 p-5">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <div className="flex items-end gap-2 mt-1">
                        <span className={`text-3xl font-bold ${isGood ? "text-green-600" : isMedium ? "text-yellow-600" : "text-orange-600"}`}>
                            {value.toFixed(1)}%
                        </span>
                    </div>
                    {subtitle && (
                        <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
                    )}
                </div>
                <div className={`p-3 rounded-xl ${getColor()} border`}>
                    {getIcon()}
                </div>
            </div>
        </div>
    );
}