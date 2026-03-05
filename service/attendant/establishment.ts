import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import { AttendantEstablishmentItem } from "@/types/attendant/establishment.types";

export async function listAttendantEstablishments(): Promise<
  AttendantEstablishmentItem[]
> {
  try {
    const { data } = await api.get<
      AttendantEstablishmentItem[]
    >("/api/attendant/establishments");

    return data;
  } catch (error) {
    handleHttpError(error);
    return [];
  }
}