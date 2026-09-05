// app/admin/dashboard/[establishmentId]/inventory-assets/page.tsx
"use client";

import { useParams } from "next/navigation";
import { Package } from "lucide-react";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";
import { UserRole } from "@/enum/enum";
import { useEstablishment } from "@/hooks/admin/useEstablishment";
import { useInventoryAssetDashboard } from "@/hooks/admin/inventory/useInventoryDashboard";
import { InventoryAssetDashboard } from "@/components/admin/InventoryAssetDashboard";


export default function InventoryAssetsPage() {
    useRoleGuard([UserRole.ADMIN]);

    const params = useParams();
    
    // 🔥 GARANTIR QUE establishmentId É UMA STRING
    const establishmentId = Array.isArray(params.establishmentId)
        ? params.establishmentId[0]
        : params.establishmentId || "";

    // 🔥 SÓ EXECUTAR OS HOOKS SE TIVER establishmentId
    const { data: establishment } = useEstablishment(establishmentId);
    const { data, loading } = useInventoryAssetDashboard(establishmentId);

    const primaryColor = establishment?.primaryColor || "#4F46E5";
    const secondaryColor = establishment?.secondaryColor || "#7C3AED";

    // 🔥 VERIFICAR SE establishmentId EXISTE
    if (!establishmentId) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-red-500">ID do estabelecimento não encontrado</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-gray-500">Carregando dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-xl">
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative px-8 py-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                            <Package className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight">
                                Inventários e Ativos do Estabelecimento
                            </h1>
                            <p className="text-white/80 text-sm mt-1">
                                Gestão completa de inventários e patrimônio do estabelecimento
                            </p>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/30 via-white/50 to-white/30" />
            </div>

            {data && (
                <InventoryAssetDashboard
                    data={data}
                    establishmentId={establishmentId}
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                />
            )}
        </div>
    );
}