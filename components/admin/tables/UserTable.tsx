import { ListUsersByEstablishmentResponse } from "@/types/admin/user";

interface Props {
  data: ListUsersByEstablishmentResponse[];
  onToggle: (user: ListUsersByEstablishmentResponse) => void;
  onResetPassword: (user: ListUsersByEstablishmentResponse) => void;
  onManageRole: (user: ListUsersByEstablishmentResponse) => void;
}

export function UserTable({
  data,
  onToggle,
  onResetPassword,
  onManageRole,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left">Nome</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th className="text-right p-4">Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <tr key={user.userUid} className="border-t">
              <td className="p-4 font-medium">{user.nome}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    user.ativo
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.ativo ? "Ativo" : "Inativo"}
                </span>
              </td>
              <td className="text-right p-4 space-x-3">
                <button
                  onClick={() => onToggle(user)}
                  className="text-blue-600"
                >
                  Ativar/Desativar
                </button>

                <button
                  onClick={() => onResetPassword(user)}
                  className="text-yellow-600"
                >
                  Senha
                </button>

                <button
                  onClick={() => onManageRole(user)}
                  className="text-purple-600"
                >
                  Role
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}