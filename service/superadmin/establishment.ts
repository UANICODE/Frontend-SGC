import api from "@/service/api";
import { CreateEstablishmentRequest, CreateEstablishmentResponse, ListEstablishmentsResponse } from "@/types/superadmin/establishment";

export const establishmentService = {
  async list(): Promise<ListEstablishmentsResponse[]> {
    const res = await api.get("/superadmin/establishments");
    return res.data;
  },

  async create(
    payload: CreateEstablishmentRequest
  ): Promise<CreateEstablishmentResponse> {
    const res = await api.post(
      "/superadmin/establishments/create",
      payload
    );
    return res.data;
  },
};