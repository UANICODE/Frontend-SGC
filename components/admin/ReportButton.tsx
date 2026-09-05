// components/admin/buttons/ReportButton.tsx
"use client";

import { FileText, Loader2 } from "lucide-react";

interface ReportButtonProps {
    onClick: () => void;
    loading?: boolean;
    label?: string;
    variant?: 'primary' | 'secondary' | 'green' | 'orange';
}

export function ReportButton({ 
    onClick, 
    loading, 
    label = "Gerar Relatório",
    variant = 'primary'
}: ReportButtonProps) {
    const colors = {
        primary: 'from-primary to-secondary',
        secondary: 'from-gray-500 to-gray-600',
        green: 'from-green-500 to-emerald-500',
        orange: 'from-orange-500 to-amber-500'
    };

    return (
        <button
            onClick={onClick}
            disabled={loading}
            className={`bg-gradient-to-r ${colors[variant]} text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50`}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <FileText className="w-4 h-4" />
            )}
            {loading ? 'Gerando...' : label}
        </button>
    );
}