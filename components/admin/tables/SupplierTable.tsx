"use client";

import { SupplierItemResponse } from "@/types/admin/supplier";

interface Props {
  data: SupplierItemResponse[];
  onEdit: (supplier: SupplierItemResponse) => void;
  onDelete: (supplier: SupplierItemResponse) => void;
  onChangeStatus: (supplier: SupplierItemResponse) => void;
  changingStatusId?: string | null;
}

export function SupplierTable({ data, onEdit, onDelete, onChangeStatus }: Props) {
  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-4">Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Endereco</th>
            <th>NUIT</th>
            <th>Estado</th>
            <th className="text-right p-4">Ações</th>
          </tr>
        </thead>

        <tbody>
          {data.map((supplier) => {
            // fallback caso statusName seja undefined
            const statusName = supplier.status ?? "inativo";
            const isActive = statusName.toLowerCase() === "ativo";

            return (
              <tr key={supplier.id} className="border-t">
                <td className="p-4 font-medium">{supplier.name}</td>
                <td>{supplier.email ?? "-"}</td>
                <td>{supplier.phone ?? "-"}</td>
                <td>{supplier.address ?? "-"}</td>
                <td>{supplier.nuit ?? "-"}</td>
                <td>
                  <span
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                      isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isActive ? "bg-green-600" : "bg-red-600"
                      }`}
                    ></span>
                    {statusName}
                  </span>
                </td>
                <td className="text-right p-4 space-x-2">
                  <button
                    onClick={() => onEdit(supplier)}
                    className="text-green-600 hover:underline"
                  >
                    Editar
                  </button>
                 <button
                onClick={() => onChangeStatus(supplier)}
                className="text-yellow-600 hover:underline"
              >
                Alterar Status
              </button>
               <button
    onClick={() => onDelete(supplier)} // ✅ chama a função do modal
    className="text-red-600 hover:underline"
  >
    Excluir
  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}