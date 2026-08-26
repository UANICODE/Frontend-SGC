"use client";

import { useCallback, useState } from "react";

import {
  assignEstablishmentAdministrator,
  listAvailableAdministrators,
  listEstablishmentAdministrators,
  removeEstablishmentAdministrator,
} from "@/service/superadmin/establishments/administrators";

import {
  EstablishmentAdministratorResponse,
  ListAvailableAdministratorsResponse,
} from "@/types/superadmin/establishments/administrators";

export function useManageAdministrators() {
  const [linked, setLinked] = useState<
    EstablishmentAdministratorResponse[]
  >([]);

  const [available, setAvailable] =
    useState<ListAvailableAdministratorsResponse | null>(
      null
    );

  const [loadingLinked, setLoadingLinked] =
    useState(false);

  const [loadingAvailable, setLoadingAvailable] =
    useState(false);

  const [processingUid, setProcessingUid] =
    useState<string | null>(null);

  const loadLinked = useCallback(
    async (establishmentId: string) => {
      try {
        setLoadingLinked(true);

        const result =
          await listEstablishmentAdministrators(
            establishmentId
          );

        setLinked(result);
      } finally {
        setLoadingLinked(false);
      }
    },
    []
  );

  const loadAvailable = useCallback(
    async (
      establishmentId: string,
      page: number,
      size: number,
      search?: string
    ) => {
      try {
        setLoadingAvailable(true);

        const result =
          await listAvailableAdministrators(
            establishmentId,
            page,
            size,
            search
          );

        setAvailable(result);
      } finally {
        setLoadingAvailable(false);
      }
    },
    []
  );

  const assign = useCallback(
    async (
      establishmentId: string,
      userUid: string
    ) => {
      try {
        setProcessingUid(userUid);

        await assignEstablishmentAdministrator(
          establishmentId,
          { userUid }
        );
      } finally {
        setProcessingUid(null);
      }
    },
    []
  );

  const remove = useCallback(
    async (
      establishmentId: string,
      userUid: string
    ) => {
      try {
        setProcessingUid(userUid);

        await removeEstablishmentAdministrator(
          establishmentId,
          userUid
        );
      } finally {
        setProcessingUid(null);
      }
    },
    []
  );

  const clear = useCallback(() => {
    setLinked([]);
    setAvailable(null);
    setProcessingUid(null);
  }, []);

  return {
    linked,
    available,
    loadingLinked,
    loadingAvailable,
    processingUid,
    loadLinked,
    loadAvailable,
    assign,
    remove,
    clear,
  };
}