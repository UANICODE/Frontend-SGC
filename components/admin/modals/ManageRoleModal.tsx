"use client";

import { useToast } from "@/ context/ToastContext";
import { manageUserRole } from "@/service/admin/user";


const ROLES = ["ADMIN", "MANAGER", "EMPLOYEE"];

export function ManageRoleModal({
  establishmentId,
  user,
  onClose,
  onSuccess,
}: any) {
  const { showToast } = useToast();

  async function handle(role: string, add: boolean) {
    try {
      await manageUserRole({
        establishmentId,
        userUid: user.userUid,
        roleName: role,
        add,
      });

      showToast("Role atualizada com sucesso!", "success");
      onSuccess();
      onClose();
    } catch {}
  }

  return (
    <div className="modal">
      <div className="modal-card animate-slideUp">
        <h2 className="text-xl font-bold mb-4">
          Gerir Roles
        </h2>

        <div className="space-y-3">
          {ROLES.map((role) => (
            <div
              key={role}
              className="flex justify-between items-center bg-gray-50 p-3 rounded-xl"
            >
              <span>{role}</span>
              <div className="space-x-2">
                <button
                  onClick={() => handle(role, true)}
                  className="text-green-600"
                >
                  Adicionar
                </button>
                <button
                  onClick={() => handle(role, false)}
                  className="text-red-600"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <button onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
}