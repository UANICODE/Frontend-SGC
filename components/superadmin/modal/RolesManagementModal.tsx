"use client";

import { useState } from "react";
import {
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import { UserManagementModal } from "./UserManagementModal";
import { CreateRoleModal } from "./CreateRoleModal";
import { EditRoleModal } from "./EditRoleModal";
import { DeleteRoleModal } from "./DeleteRoleModal";

import { RoleItemResponse } from "@/types/superadmin/users/listRoles";

interface RolesManagementModalProps {
  open: boolean;
  roles: RoleItemResponse[];
  loading: boolean;
  onClose: () => void;
  onRefresh: () => Promise<void> | void;
}

const protectedRoles = new Set([
  "SUPERADMIN",
  "ADMIN",
  "ATENDENTE",
  "ADMIN_ARMAZEM",
]);

export function RolesManagementModal({
  open,
  roles,
  loading,
  onClose,
  onRefresh,
}: RolesManagementModalProps) {
  const [createOpen, setCreateOpen] = useState(false);

  const [selectedRoleToEdit, setSelectedRoleToEdit] =
    useState<RoleItemResponse | null>(null);

  const [selectedRoleToDelete, setSelectedRoleToDelete] =
    useState<RoleItemResponse | null>(null);

  return (
    <>
      <UserManagementModal
        open={open}
        title="Gestão de roles"
        description="Crie, edite e elimine roles personalizadas."
        onClose={onClose}
        maxWidth="max-w-2xl"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">
              {roles.length} role
              {roles.length === 1 ? "" : "s"} disponível
              {roles.length === 1 ? "" : "is"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Nova role
          </button>
        </div>

        {loading ? (
          <div className="p-10 text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-3 text-sm text-slate-500">
              A carregar roles...
            </p>
          </div>
        ) : roles.length === 0 ? (
          <div className="rounded-xl bg-slate-50 p-10 text-center">
            <ShieldCheck className="mx-auto h-10 w-10 text-slate-400" />

            <p className="mt-3 font-medium text-slate-700">
              Nenhuma role encontrada
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Crie uma nova role para começar.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {roles.map((role) => {
              const protectedRole = protectedRoles.has(
                role.name.toUpperCase()
              );

              return (
                <div
                  key={role.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 hover:border-slate-300 hover:bg-slate-50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`rounded-lg p-2 ${
                        protectedRole
                          ? "bg-slate-100"
                          : "bg-cyan-100"
                      }`}
                    >
                      <ShieldCheck
                        size={18}
                        className={
                          protectedRole
                            ? "text-slate-600"
                            : "text-cyan-700"
                        }
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">
                        {role.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {protectedRole
                          ? "Role interna protegida"
                          : "Role personalizada"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      title={
                        protectedRole
                          ? "Roles internas não podem ser editadas"
                          : "Editar role"
                      }
                      disabled={protectedRole}
                      onClick={() =>
                        setSelectedRoleToEdit(role)
                      }
                      className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      type="button"
                      title={
                        protectedRole
                          ? "Roles internas não podem ser eliminadas"
                          : "Eliminar role"
                      }
                      disabled={protectedRole}
                      onClick={() =>
                        setSelectedRoleToDelete(role)
                      }
                      className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 disabled:opacity-30"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </UserManagementModal>

      <CreateRoleModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={onRefresh}
      />

      <EditRoleModal
        role={selectedRoleToEdit}
        onClose={() => setSelectedRoleToEdit(null)}
        onUpdated={onRefresh}
      />

      <DeleteRoleModal
        role={selectedRoleToDelete}
        onClose={() => setSelectedRoleToDelete(null)}
        onDeleted={onRefresh}
      />
    </>
  );
}