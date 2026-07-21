"use client";

import { useState } from "react";
import { editUser } from "@/service/superadmin/users/editUser";
import { EditUserRequest } from "@/types/superadmin/users/editUser";

export function useEditUser() {
  const [loading, setLoading] = useState(false);

  async function execute(
    userUid: string,
    payload: EditUserRequest
  ) {
    try {
      setLoading(true);
      return await editUser(userUid, payload);
    } finally {
      setLoading(false);
    }
  }

  return {
    execute,
    loading,
  };
}