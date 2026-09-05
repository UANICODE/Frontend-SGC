// components/admin/dashboard/CostByCategoryChart.tsx
"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface Props {
    data: Record<string, number>;
}

const COLORS = ["#4F46E5", "#7C3AED", "#EC4899", "#F59E0B", "#10B981", "#3B82F6", "#EF4444", "#8B5CF6"];

export function CostByCategoryChart({ data }: Props) {
    const chartData = Object.entries(data).map(([name, value]) => ({
        name,
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
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ""}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => typeof value === 'number' ? value.toFixed(2) + " MT" : value} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}