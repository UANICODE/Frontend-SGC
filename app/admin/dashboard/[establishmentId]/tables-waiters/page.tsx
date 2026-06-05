// app/admin/dashboard/[establishmentId]/tables-waiters/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";
import { UserRole } from "@/enum/enum";
import { PlusIcon, PencilIcon, TrashIcon, TableCellsIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { useTables } from "@/hooks/admin /useTables";
import { useWaiters } from "@/hooks/admin /useWaiters";
import { WaiterModal } from "@/components/admin/modals/WaiterModal";
import { TableModal } from "@/components/admin/modals/TableModal";

export default function TablesWaitersPage() {
  useRoleGuard([UserRole.ADMIN]);
  const params = useParams();
  const establishmentId = params.establishmentId as string;

  const { tables, loading: tablesLoading, addTable, editTable, removeTable } = useTables(establishmentId);
  const { waiters, loading: waitersLoading, addWaiter, editWaiter, removeWaiter } = useWaiters(establishmentId);

  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [waiterModalOpen, setWaiterModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<any>(null);
  const [editingWaiter, setEditingWaiter] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"tables" | "waiters">("tables");

  const handleSaveTable = async (data: any) => {
    if (editingTable) {
      await editTable(editingTable.id, { ...data, establishmentId });
    } else {
      await addTable({ ...data, establishmentId });
    }
    setTableModalOpen(false);
    setEditingTable(null);
  };

  const handleSaveWaiter = async (data: any) => {
    if (editingWaiter) {
      await editWaiter(editingWaiter.id, { ...data, establishmentId });
    } else {
      await addWaiter({ ...data, establishmentId });
    }
    setWaiterModalOpen(false);
    setEditingWaiter(null);
  };

  const handleDeleteTable = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta mesa?")) {
      await removeTable(id);
    }
  };

  const handleDeleteWaiter = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este garçom?")) {
      await removeWaiter(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Mesas e Garçons</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab("tables")}
          className={`flex items-center gap-2 px-4 py-2 font-medium transition ${
            activeTab === "tables"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <TableCellsIcon className="w-5 h-5" />
          Mesas
        </button>
        <button
          onClick={() => setActiveTab("waiters")}
          className={`flex items-center gap-2 px-4 py-2 font-medium transition ${
            activeTab === "waiters"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <UserGroupIcon className="w-5 h-5" />
          Garçons
        </button>
      </div>

      {/* Conteúdo Mesas */}
      {activeTab === "tables" && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setEditingTable(null);
                setTableModalOpen(true);
              }}
              className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:brightness-90 transition"
            >
              <PlusIcon className="w-5 h-5" />
              Nova Mesa
            </button>
          </div>

          {tablesLoading ? (
            <div className="flex justify-center py-10">Carregando...</div>
          ) : tables.length === 0 ? (
            <div className="text-center py-10 text-gray-500">Nenhuma mesa cadastrada</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tables.map((table) => (
                <div key={table.id} className="bg-white rounded-xl shadow p-4 border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold">Mesa {table.number}</h3>
                      {table.capacity && (
                        <p className="text-sm text-gray-500">Capacidade: {table.capacity} pessoas</p>
                      )}
                      {table.location && (
                        <p className="text-sm text-gray-500">Local: {table.location}</p>
                      )}
                      <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                        table.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {table.active ? "Ativa" : "Inativa"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingTable(table);
                          setTableModalOpen(true);
                        }}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTable(table.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Conteúdo Garçons */}
      {activeTab === "waiters" && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setEditingWaiter(null);
                setWaiterModalOpen(true);
              }}
              className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:brightness-90 transition"
            >
              <PlusIcon className="w-5 h-5" />
              Novo Garçom
            </button>
          </div>

          {waitersLoading ? (
            <div className="flex justify-center py-10">Carregando...</div>
          ) : waiters.length === 0 ? (
            <div className="text-center py-10 text-gray-500">Nenhum garçom cadastrado</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {waiters.map((waiter) => (
                <div key={waiter.id} className="bg-white rounded-xl shadow p-4 border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold">{waiter.name}</h3>
                      {waiter.phone && <p className="text-sm text-gray-500">Tel: {waiter.phone}</p>}
                      {waiter.email && <p className="text-sm text-gray-500">Email: {waiter.email}</p>}
                      <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                        waiter.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {waiter.active ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingWaiter(waiter);
                          setWaiterModalOpen(true);
                        }}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteWaiter(waiter.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modais */}
      <TableModal
        open={tableModalOpen}
        onClose={() => {
          setTableModalOpen(false);
          setEditingTable(null);
        }}
        onSave={handleSaveTable}
        initialData={editingTable}
      />

      <WaiterModal
        open={waiterModalOpen}
        onClose={() => {
          setWaiterModalOpen(false);
          setEditingWaiter(null);
        }}
        onSave={handleSaveWaiter}
        initialData={editingWaiter}
      />
    </div>
  );
}
