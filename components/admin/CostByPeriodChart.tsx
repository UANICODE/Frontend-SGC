// components/admin/dashboard/CostByPeriodChart.tsx
"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface Props {
    data: Record<string, number>;
}

export function CostByPeriodChart({ data }: Props) {
    const periodMap: Record<string, string> = {
        MONTHLY: "Mensal",
        YEARLY: "Anual",
        ONCE: "Único",
    };

    const chartData = Object.entries(data).map(([key, value]) => ({
        name: periodMap[key] || key,
        value,
    }));

    if (chartData.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-400">
                Sem dados para exibir
            </div>
        );
    }

    return (
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => typeof value === 'number' ? value.toFixed(2) + " MT" : ""} />
                    <Bar dataKey="value" fill="#4F46E5" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}