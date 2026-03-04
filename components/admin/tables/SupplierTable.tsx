import { SupplierItemResponse } from "@/types/admin/supplier";

interface Props {
  data: SupplierItemResponse[];
  onEdit: (supplier: SupplierItemResponse) => void;
  onDelete: (supplier: SupplierItemResponse) => void;
  onChangeStatus: (supplier: SupplierItemResponse) => void;
}

export function SupplierTable({
  data,
  onEdit,
  onDelete,
  onChangeStatus,
}: Props) {
  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-4">Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Status</th>
            <th className="text-right p-4">Ações</th>
          </tr>
        </thead>

        <tbody>
          {data.map((supplier) => (
            <tr key={supplier.supplierId} className="border-t">
              <td className="p-4 font-medium">
                {supplier.name}
              </td>
              <td>{supplier.email}</td>
              <td>{supplier.phone}</td>
              <td>
                <span className="px-3 py-1 bg-gray-200 rounded-full text-xs">
                  {supplier.statusName}
                </span>
              </td>
              <td className="text-right p-4 space-x-2">
                <button
                  onClick={() => onEdit(supplier)}
                  className="text-blue-600"
                >
                  Editar
                </button>

                <button
                  onClick={() => onChangeStatus(supplier)}
                  className="text-yellow-600"
                >
                  Status
                </button>

                <button
                  onClick={() => onDelete(supplier)}
                  className="text-red-600"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}