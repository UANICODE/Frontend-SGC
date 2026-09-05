// app/admin/dashboard/[establishmentId]/inventory-assets/inventories/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
    ArrowLeft, 
    Package, 
    CheckCircle, 
    AlertCircle, 
    Clock,
    Edit,
    Save,
    Loader2,
    RefreshCw,
    Timer
} from "lucide-react";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";
import { UserRole } from "@/enum/enum";
import { useInventory } from "@/hooks/admin/inventory/useInventory";
import { useCountInventory } from "@/hooks/admin/inventory/useCountInventory";
import { useJustifyInventory } from "@/hooks/admin/inventory/useJustifyInventory";
import { useApproveInventory } from "@/hooks/admin/inventory/useApproveInventory";
import { useToast } from "@/ context/ToastContext";

export default function InventoryDetailPage() {
    useRoleGuard([UserRole.ADMIN]);

    const params = useParams();
    const router = useRouter();
    const { showToast } = useToast();

    const establishmentId = Array.isArray(params.establishmentId)
        ? params.establishmentId[0]
        : params.establishmentId;

    const inventoryId = Array.isArray(params.id)
        ? params.id[0]
        : params.id;

    const { data: inventory, loading, fetch } = useInventory();
    const { execute: countInventory, loading: counting } = useCountInventory();
    const { execute: justifyInventory, loading: justifying } = useJustifyInventory();
    const { execute: approveInventory, loading: approving } = useApproveInventory();

    const [isCounting, setIsCounting] = useState(false);
    const [isJustifying, setIsJustifying] = useState(false);
    const [showApproveAlert, setShowApproveAlert] = useState(false);
    const [localItems, setLocalItems] = useState<any[]>([]);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);

    useEffect(() => {
        if (inventoryId) {
            fetch(inventoryId);
        }
    }, [inventoryId]);

        useEffect(() => {
            if (inventory?.items) {
                // 🔥 Inicializar countedQuantity como null (não contado)
                const itemsWithNull = inventory.items.map(item => ({
                    ...item,
                    countedQuantity: item.countedQuantity ?? null,
                    // 🔥 Se o item não foi contado, manter difference como expected
                    difference: item.difference ?? item.expectedQuantity
                }));
                setLocalItems(itemsWithNull);
            }
        }, [inventory]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isCounting && timerRunning) {
            interval = setInterval(() => {
                setElapsedTime((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isCounting, timerRunning]);

    const startCounting = () => {
        setIsCounting(true);
        setTimerRunning(true);
        setElapsedTime(0);
    };

    const stopCounting = () => {
        setIsCounting(false);
        setTimerRunning(false);
    };

    const refresh = async () => {
        if (!inventoryId) return;
        await fetch(inventoryId);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    // 🔥 HANDLER DE CONTAGEM
   // 🔥 HANDLER DE CONTAGEM - CORRIGIDO
const handleCount = async () => {
    if (!inventory || !inventoryId) {
        showToast("Inventário não encontrado", "error");
        return;
    }

    // 🔥 Verificar itens NÃO CONTADOS (null ou undefined)
    const uncounted = localItems.filter(item => 
        item.countedQuantity === null || 
        item.countedQuantity === undefined
    );
    
    if (uncounted.length > 0) {
        showToast(`Ainda há ${uncounted.length} item(ns) não contados. Preencha todos.`, "error");
        return;
    }

    // 🔥 Enviar 0 para itens que foram contados como zero
    const items = localItems.map(item => ({
        itemId: item.id,
        countedQuantity: item.countedQuantity ?? 0
    }));

    try {
        await countInventory({ inventoryId: inventory.id, items });
        await refresh();
        stopCounting();
        showToast("Contagem salva com sucesso!", "success");
    } catch (error) {
        // Error handled by hook
    }
};
    // 🔥 HANDLER DE JUSTIFICATIVA - CORRIGIDO
    const handleJustify = async () => {
        if (!inventory || !inventoryId) {
            showToast("Inventário não encontrado", "error");
            return;
        }

        // 🔥 Pegar apenas itens com diferença
        const itemsWithDiff = localItems.filter(item => 
            item.difference !== 0 && 
            item.difference !== null &&
            item.difference > 0 // 🔥 Só faltas (diferença positiva)
        );
        
        if (itemsWithDiff.length === 0) {
            showToast("Não há faltas para justificar", "error");
            return;
        }

        // 🔥 Verificar se todos os itens com diferença têm justificativa
        const unJustified = itemsWithDiff.filter(item => !item.lossType || item.lossType === '');
        if (unJustified.length > 0) {
            showToast(`Selecione uma justificativa para ${unJustified.length} item(ns)`, "error");
            return;
        }

        const items = itemsWithDiff.map(item => ({
            itemId: item.id,
            lossType: item.lossType || 'OUTRO',
            justificationNotes: item.justificationNotes || ''
        }));

        try {
            await justifyInventory({ inventoryId: inventory.id, items });
            await refresh();
            setIsJustifying(false);
            showToast("Justificativas salvas com sucesso!", "success");
        } catch (error) {
            // Error handled by hook
        }
    };

    // 🔥 HANDLER DE APROVAÇÃO
    const handleApprove = async () => {
        if (!inventoryId) {
            showToast("Inventário não encontrado", "error");
            return;
        }

        try {
            const result = await approveInventory(inventoryId);
            await refresh();
            setShowApproveAlert(false);
            showToast("Inventário aprovado com sucesso!", "success");

            const adjustments = result.adjustments;
            const lossItems = adjustments.filter(a => a.action === 'LOSS_REGISTERED' || a.action === 'LOSS_REGISTERED_UNJUSTIFIED');
            if (lossItems.length > 0) {
                showToast(`Ajustes realizados: ${lossItems.length} itens com perda registrada`, "success");
            }
        } catch (error) {
            // Error handled by hook
        }
    };
        const updateItemCount = (itemId: string, value: number | null) => {
            setLocalItems(prev =>
                prev.map(item =>
                    item.id === itemId 
                        ? { 
                            ...item, 
                            countedQuantity: value,
                            // 🔥 Se value for null, não calcula diferença
                            difference: value !== null 
                                ? (item.expectedQuantity || 0) - value 
                                : item.expectedQuantity
                        } 
                        : item
                )
            );
        };

    const updateItemJustification = (itemId: string, lossType: string) => {
        setLocalItems(prev =>
            prev.map(item =>
                item.id === itemId 
                    ? { ...item, lossType } 
                    : item
            )
        );
    };

    if (loading || !inventory) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-gray-500">Carregando inventário...</p>
                </div>
            </div>
        );
    }

    const isOpen = inventory.statusName === 'ABERTO';
    const isCountingStatus = inventory.statusName === 'CONTAGEM';
    const isReviewStatus = inventory.statusName === 'REVISAO';
    const isApproved = inventory.statusName === 'APROVADO';

    const itemsWithDiff = localItems.filter(item => item.difference !== 0 && item.difference !== null);
    const itemsWithLoss = localItems.filter(item => item.difference > 0 && item.difference !== null);

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push(`/admin/dashboard/${establishmentId}/inventory-assets/inventories`)}
                        className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Inventário #{inventory.id.slice(0, 8)}
                        </h1>
                        <p className="text-sm text-gray-400 mt-1">
                            {inventory.typeName} • {inventory.establishmentName}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {isCounting && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-200">
                            <Timer className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-mono text-blue-700">
                                {formatTime(elapsedTime)}
                            </span>
                        </div>
                    )}
                    <span className={`text-xs px-3 py-1.5 rounded-full border ${getStatusBadge(inventory.statusName)}`}>
                        {inventory.statusName}
                    </span>
                    {!isApproved && (
                        <button
                            onClick={refresh}
                            className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
                        >
                            <RefreshCw className="w-4 h-4 text-gray-600" />
                        </button>
                    )}
                </div>
            </div>

            {/* 🔥 BOTÕES DE AÇÃO - CORRIGIDOS */}
            {!isApproved && (
                <div className="flex flex-wrap gap-3">
                    {isOpen && (
                        <>
                            <button
                                onClick={startCounting}
                                className={`px-6 py-2.5 rounded-xl text-white font-medium transition flex items-center gap-2 ${
                                    isCounting 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:shadow-lg'
                                }`}
                                disabled={isCounting}
                            >
                                <Edit className="w-4 h-4" />
                                {isCounting ? 'Modo Contagem Ativo' : 'Realizar Contagem'}
                            </button>

                            {isCounting && (
                                <button
                                    onClick={stopCounting}
                                    className="px-6 py-2.5 border-2 border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition"
                                >
                                    Cancelar Contagem
                                </button>
                            )}
                        </>
                    )}

                    {/* 🔥 BOTÃO JUSTIFICAR - APARECE SEMPRE NO STATUS CONTAGEM */}
                    {isCountingStatus && (
                        <button
                            onClick={() => setIsJustifying(!isJustifying)} // 🔥 Alterna o modo
                            className={`px-6 py-2.5 rounded-xl text-white font-medium transition flex items-center gap-2 ${
                                isJustifying 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-lg'
                            }`}
                            disabled={isJustifying}
                        >
                            <AlertCircle className="w-4 h-4" />
                            {isJustifying ? 'Modo Justificativa Ativo' : 'Justificar Diferenças'}
                        </button>
                    )}

                    {isReviewStatus && (
                        <button
                            onClick={() => setShowApproveAlert(true)}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2.5 rounded-xl hover:shadow-lg transition flex items-center gap-2"
                        >
                            <CheckCircle className="w-4 h-4" />
                            Aprovar Inventário
                        </button>
                    )}
                </div>
            )}

            {/* 🔥 INDICADOR DE QUANTOS ITENS PRECISAM DE JUSTIFICATIVA */}
            {isCountingStatus && itemsWithLoss.length > 0 && !isJustifying && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    <p className="text-sm text-orange-700">
                        {itemsWithLoss.length} item(ns) precisam de justificativa. 
                        Clique em "Justificar Diferenças" para continuar.
                    </p>
                </div>
            )}

            {/* ALERTA DE APROVAÇÃO */}
            {showApproveAlert && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                        <AlertCircle className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="text-lg font-bold text-red-700">⚠️ ATENÇÃO!</h3>
                            <p className="text-red-600 mt-1">
                                O stock será ajustado para a quantidade encontrada. 
                                Esta ação é irreversível.
                            </p>
                            {itemsWithDiff.length > 0 && (
                                <p className="text-sm text-red-500 mt-2">
                                    {itemsWithDiff.length} item(ns) com diferença serão ajustados.
                                </p>
                            )}
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={handleApprove}
                                    disabled={approving}
                                    className="bg-red-600 text-white px-6 py-2.5 rounded-xl hover:bg-red-700 transition flex items-center gap-2"
                                >
                                    {approving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Aprovando...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-4 h-4" />
                                            SIM, AJUSTAR
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => setShowApproveAlert(false)}
                                    className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-xl hover:bg-gray-300 transition"
                                >
                                    NÃO, VOLTAR
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* LISTA DE ITENS */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-700">Itens do Inventário</h3>
                    <span className="text-sm text-gray-400">
                        {localItems.length} itens • {itemsWithDiff.length} com diferença
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="p-4 text-left font-semibold text-gray-600">Item</th>
                                <th className="p-4 text-left font-semibold text-gray-600">Tipo</th>
                                <th className="p-4 text-center font-semibold text-gray-600">Esperado</th>
                                <th className="p-4 text-center font-semibold text-gray-600">Encontrado</th>
                                <th className="p-4 text-center font-semibold text-gray-600">Diferença</th>
                                {/* 🔥 COLUNA DE JUSTIFICATIVA - SEMPRE VISÍVEL NO STATUS CONTAGEM OU REVISÃO */}
                                {(isCountingStatus || isReviewStatus) && (
                                    <th className="p-4 text-left font-semibold text-gray-600">Justificativa</th>
                                )}
                                {isApproved && (
                                    <th className="p-4 text-left font-semibold text-gray-600">Ajuste</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {localItems.map((item) => {
                                const hasDiff = item.difference !== 0 && item.difference !== null;
                                const isLoss = item.difference > 0;
                                const needsJustification = isLoss && isCountingStatus;

                                return (
                                    <tr key={item.id} className={`border-b border-gray-100 ${hasDiff ? 'bg-yellow-50/30' : ''}`}>
                                        <td className="p-4 font-medium text-gray-800">{item.itemName}</td>
                                        <td className="p-4">
                                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                                {item.itemType}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center text-gray-600">{item.expectedQuantity}</td>
                                     <td className="p-4 text-center">
                                            {isOpen && isCounting ? (
                                                <input
                                                    type="number"
                                                    step="any"
                                                    // 🔥 Mostrar vazio se for null, senão mostrar o valor
                                                    value={item.countedQuantity !== null ? item.countedQuantity : ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value === '' ? null : parseFloat(e.target.value);
                                                        updateItemCount(item.id, value);
                                                    }}
                                                    className="w-20 text-center border-2 border-blue-300 rounded-lg px-2 py-1 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition bg-blue-50"
                                                    placeholder="?"
                                                />
                                            ) : isOpen && !isCounting ? (
                                                <span className="text-gray-400 italic">Clique em "Realizar Contagem"</span>
                                            ) : (
                                                <span className="font-medium text-gray-800">{item.countedQuantity ?? 0}</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                        {item.countedQuantity !== null && item.difference !== 0 ? (
                                            <span className={`font-bold ${item.difference > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                {item.difference > 0 ? '-' : '+'}{Math.abs(item.difference)}
                                            </span>
                                        ) : item.countedQuantity === null ? (
                                            <span className="text-gray-300 italic">-</span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                        
                                        
                                        {/* 🔥 CAMPOS DE JUSTIFICATIVA - SEMPRE EDITÁVEIS NO STATUS CONTAGEM */}
                                        {(isCountingStatus || isReviewStatus) && (
                                            <td className="p-4">
                                                {needsJustification ? (
                                                    <select
                                                        value={item.lossType || ''}
                                                        onChange={(e) => updateItemJustification(item.id, e.target.value)}
                                                        className="w-full border-2 border-gray-200 rounded-lg px-2 py-1 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                                                        disabled={!isJustifying && isCountingStatus} // 🔥 Só edita se estiver em modo justificativa
                                                    >
                                                        <option value="">Selecione...</option>
                                                        <option value="ROUBO">Roubo</option>
                                                        <option value="QUEBRA">Quebra</option>
                                                        <option value="VALIDADE">Validade</option>
                                                        <option value="DESPERDICIO">Desperdício</option>
                                                        <option value="DANO">Dano</option>
                                                        <option value="EXTRAVIO">Extravio</option>
                                                        <option value="OUTRO">Outro</option>
                                                         <option value="MANTER_STOCK">Não justificado - Manter stock</option>
                                                    </select>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">
                                                        {isLoss ? 'Aguardando justificativa' : 'Sobra (não precisa)'}
                                                    </span>
                                                )}
                                            </td>
                                        )}
                                        
                                       {isApproved && hasDiff && (
                                        <td className="p-4">
                                            {item.lossType === 'MANTER_STOCK' ? (
                                                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600 border border-blue-200">
                                                    🔒 Stock mantido
                                                </span>
                                            ) : (
                                                <span className={`text-xs px-2 py-1 rounded-full ${isLoss ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                    {isLoss ? 'Ajustado' : 'Excesso'}
                                                </span>
                                            )}
                                        </td>
                                    )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 🔥 BOTÕES DE SALVAR CONTAGEM */}
            {isOpen && isCounting && (
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => {
                            if (inventory?.items) {
                                setLocalItems(inventory.items);
                            }
                            stopCounting();
                        }}
                        className="px-6 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleCount}
                        disabled={counting}
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50"
                    >
                        {counting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Salvar Contagem
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* 🔥 BOTÕES DE SALVAR JUSTIFICATIVAS - APARECE QUANDO EM MODO JUSTIFICATIVA */}
            {isCountingStatus && isJustifying && (
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => {
                            if (inventory?.items) {
                                setLocalItems(inventory.items);
                            }
                            setIsJustifying(false);
                        }}
                        className="px-6 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleJustify}
                        disabled={justifying}
                        className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50"
                    >
                        {justifying ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Salvar Justificativas
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}

// Função auxiliar
function getStatusBadge(status: string): string {
    const colors: Record<string, string> = {
        'ABERTO': 'bg-yellow-100 text-yellow-700 border-yellow-200',
        'CONTAGEM': 'bg-blue-100 text-blue-700 border-blue-200',
        'REVISAO': 'bg-orange-100 text-orange-700 border-orange-200',
        'APROVADO': 'bg-green-100 text-green-700 border-green-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
}