// components/admin/dashboard/MonthlyEvolutionChart.tsx
"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { MonthlyCost } from "@/types/admin/cost";

interface Props {
    data: MonthlyCost[];
}

export function MonthlyEvolutionChart({ data }: Props) {
    const chartData = data.map((item) => ({
        name: `${item.month}/${item.year}`,
        value: item.amount,
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
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                        formatter={(value) => {
                            if (typeof value !== "number") return "";
                            return value.toFixed(2) + " MT";
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#4F46E5"
                        strokeWidth={3}
                        dot={{ fill: "#4F46E5", r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}