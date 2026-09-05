// components/admin/tables/CostCategoriesTable.tsx
"use client";

import { Pencil, Trash2, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { CostCategory } from "@/types/admin/cost";

interface Props {
    data: CostCategory[];
    loading: boolean;
    onEdit: (category: CostCategory) => void;
    onDelete: (categoryId: string) => void;
    onActivate?: (categoryId: string) => void;  // 🆕
}

export function CostCategoriesTable({ data, loading, onEdit, onDelete, onActivate }: Props) {
    // ...

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gradient-to-r from-primary to-secondary text-white">
                            <th className="p-4 text-left rounded-tl-2xl">Nome</th>
                            <th className="p-4 text-left">Descrição</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-center rounded-tr-2xl">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((category) => (
                            <tr key={category.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                                <td className="p-4 font-semibold text-gray-800">{category.name}</td>
                                <td className="p-4 text-gray-500">{category.description || "-"}</td>
                                <td className="p-4 text-center">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                        category.active
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}>
                                        {category.active ? (
                                            <CheckCircle className="w-3 h-3" />
                                        ) : (
                                            <XCircle className="w-3 h-3" />
                                        )}
                                        {category.active ? "Ativo" : "Inativo"}
                                    </span>
                                </td>
                                <td className="p-4 text-center">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => onEdit(category)}
                                            className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                                            title="Editar"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        
                                        {/* 🔥 Botão Ativar/Desativar */}
                                        {onActivate && (
                                            <button
                                                onClick={() => onActivate(category.id)}
                                                className={`p-2 rounded-lg transition ${
                                                    category.active
                                                        ? "text-red-400 hover:text-red-600 hover:bg-red-50"
                                                        : "text-green-500 hover:text-green-700 hover:bg-green-50"
                                                }`}
                                                title={category.active ? "Desativar" : "Ativar"}
                                            >
                                                {category.active ? (
                                                    <XCircle className="w-4 h-4" />
                                                ) : (
                                                    <RefreshCw className="w-4 h-4" />
                                                )}
                                            </button>
                                        )}
                                        
                                        <button
                                            onClick={() => onDelete(category.id)}
                                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                            title="Remover"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}