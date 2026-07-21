"use client";

import { useState } from "react";
import { Check, Minus, ShieldCheck } from "lucide-react";
import { UserManagementModal } from "./UserManagementModal";
import { useManageUserRole } from "@/hooks/superadmin/users/useManageUserRole";
import { UserItemResponse } from "@/types/superadmin/users/listUsers";
import { RoleItemResponse } from "@/types/superadmin/users/listRoles";
import { useToast } from "@/ context/ToastContext";

interface ManageUserRolesModalProps {
  user: UserItemResponse | null;
  roles: RoleItemResponse[];
  onClose: () => void;
  onChanged: () => Promise<void> | void;
}

export function ManageUserRolesModal({
  user,
  roles,
  onClose,
  onChanged,
}: ManageUserRolesModalProps) {
  const [processingRoleId, setProcessingRoleId] =
    useState<number | null>(null);

  const { execute } = useManageUserRole();
  const { showToast } = useToast();

  if (!user) {
    return null;
  }

  const userId = user.uid;
  const userRoleIds = new Set(user.roles.map((role) => role.id));

  async function handleRole(role: RoleItemResponse) {
    const assigned = userRoleIds.has(role.id);

    try {
      setProcessingRoleId(role.id);

      const result = await execute(userId, {
        roleId: role.id,
        operation: assigned ? "REMOVE" : "ASSIGN",
      });

      showToast(result.message, "success");

      await onChanged();
    } catch (error: any) {
      showToast(
        error?.message || "Não foi possível alterar a role.",
        "error"
      );
    } finally {
      setProcessingRoleId(null);
    }
  }

  return (
    <UserManagementModal
      open
      title="Gerir roles do utilizador"
      description={`Atribua ou remova permissões de ${user.nome}.`}
      onClose={onClose}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-3">
        {roles.length === 0 ? (
          <div className="rounded-xl bg-slate-50 p-8 text-center">
            <ShieldCheck className="mx-auto h-9 w-9 text-slate-400" />
            <p className="mt-3 text-sm text-slate-500">
              Nenhuma role disponível.
            </p>
          </div>
        ) : (
          roles.map((role) => {
            const assigned = userRoleIds.has(role.id);
            const processing = processingRoleId === role.id;

            return (
              <div
                key={role.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {role.name}
                  </p>

                  <p className="text-xs text-slate-500">
                    {assigned
                      ? "Role atribuída ao utilizador"
                      : "Role ainda não atribuída"}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={processing}
                  onClick={() => handleRole(role)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-50 ${
                    assigned
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                  }`}
                >
                  {assigned ? <Minus size={17} /> : <Check size={17} />}

                  {processing
                    ? "A processar..."
                    : assigned
                      ? "Remover"
                      : "Atribuir"}
                </button>
              </div>
            );
          })
        )}
      </div>
    </UserManagementModal>
  );
}