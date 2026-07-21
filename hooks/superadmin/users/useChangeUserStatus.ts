"use client";

import { useState } from "react";
import { changeUserStatus } from "@/service/superadmin/users/changeUserStatus";

export function useChangeUserStatus() {
  const [loading, setLoading] = useState(false);

  async function execute(userUid: string, active: boolean) {
    try {
      setLoading(true);

      return await changeUserStatus(userUid, {
        active,
      });
    } finally {
      setLoading(false);
    }
  }

  return {
    execute,
    loading,
  };
}