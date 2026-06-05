import api from "@/service/api";

export const dashboardService = {
  async getSalesToday() {
    const res = await api.get(
      "/superadmin/dashboard/sales-today"
    );
    return res.data;
  },

  async getSalesByEstablishment() {
    const res = await api.get(
      "/superadmin/dashboard/sales-by-establishment"
    );
    return res.data;
  },

  async getUsersByEstablishment() {
    const res = await api.get(
      "/superadmin/dashboard/users-by-establishment"
    );
    return res.data;
  },

  async getEstablishmentsByStatus(active: boolean) {
    const res = await api.get(
      "/superadmin/dashboard/establishments-by-status",
      { params: { active } }
    );
    return res.data;
  },
};