import api from "@/service/api";
import { CreateEstablishmentRequest, CreateEstablishmentResponse } from "@/types/superadmin/establishments/createEstablishments";
import { ListEstablishmentsResponse } from "@/types/superadmin/establishments/listEstablishments";

export const establishmentService = {
  async list(): Promise<ListEstablishmentsResponse[]> {
    const res = await api.get("/api/superadmin/establishments");
      console.log("dados", res.data)
    return res.data;
  },

  async create(
    payload: CreateEstablishmentRequest
  ): Promise<CreateEstablishmentResponse> {
    const res = await api.post(
      "/api/superadmin/establishments/create",
      payload
    );
  
    return res.data;
  },
};