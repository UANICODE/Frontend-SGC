import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";

import {
  AssignEstablishmentAdministratorRequest,
  EstablishmentAdministratorResponse,
  ListAvailableAdministratorsResponse,
} from "@/types/superadmin/establishments/administrators";

export async function listEstablishmentAdministrators(
  establishmentId: string
): Promise<EstablishmentAdministratorResponse[]> {
  try {
    const response = await api.get<
      EstablishmentAdministratorResponse[]
    >(
      `/api/superadmin/establishments/${establishmentId}/administrators`
    );

    return response.data;
  } catch (error) {
    handleHttpError(error);
    throw error;
  }
}

export async function listAvailableAdministrators(
  establishmentId: string,
  page: number,
  size: number,
  search?: string | null
): Promise<ListAvailableAdministratorsResponse> {
  try {
    const response =
      await api.get<ListAvailableAdministratorsResponse>(
        `/api/superadmin/establishments/${establishmentId}/administrators/available`,
        {
          params: {
            page,
            size,
            search: search || undefined,
          },
        }
      );

    return response.data;
  } catch (error) {
    handleHttpError(error);
    throw error;
  }
}

export async function assignEstablishmentAdministrator(
  establishmentId: string,
  payload: AssignEstablishmentAdministratorRequest
): Promise<EstablishmentAdministratorResponse> {
  try {
    const response =
      await api.post<EstablishmentAdministratorResponse>(
        `/api/superadmin/establishments/${establishmentId}/administrators`,
        payload
      );

    return response.data;
  } catch (error) {
    handleHttpError(error);
    throw error;
  }
}

export async function removeEstablishmentAdministrator(
  establishmentId: string,
  userUid: string
): Promise<void> {
  try {
    await api.delete(
      `/api/superadmin/establishments/${establishmentId}/administrators/${userUid}`
    );
  } catch (error) {
    handleHttpError(error);
    throw error;
  }
}