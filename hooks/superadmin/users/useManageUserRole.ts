"use client";

import { useState } from "react";
import { manageUserRole } from "@/service/superadmin/users/manageUserRole";
import { ManageUserRoleRequest } from "@/types/superadmin/users/manageUserRole";

export function useManageUserRole() {
  const [loading, setLoading] = useState(false);

  async function execute(
    userUid: string,
    payload: ManageUserRoleRequest
  ) {
    try {
      setLoading(true);
      return await manageUserRole(userUid, payload);
    } finally {
      setLoading(false);
    }
  }

  return {
    execute,
    loading,
  };
}