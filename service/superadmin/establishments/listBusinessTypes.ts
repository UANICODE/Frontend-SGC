import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import { BusinessTypeItemResponse } from "@/types/superadmin/establishments/listBusinessTypes";

export async function listBusinessTypes(
  active = true
): Promise<BusinessTypeItemResponse[]> {
  try {
    const response = await api.get<BusinessTypeItemResponse[]>(
      "/api/superadmin/business-types",
      {
        params: {
          active,
        },
      }
    );

    return response.data;
  } catch (error) {
    handleHttpError(error);
    throw error;
  }
}