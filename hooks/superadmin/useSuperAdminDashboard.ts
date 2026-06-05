"use client";

import { dashboardService } from "@/service/superadmin/dashboard";
import { useEffect, useState } from "react";

export function useSuperAdminDashboard() {
  const [loading, setLoading] = useState(true);

  const [salesToday, setSalesToday] = useState([]);
  const [salesByEstablishment, setSalesByEstablishment] = useState([]);
  const [usersByEstablishment, setUsersByEstablishment] = useState([]);
  const [activeEstablishments, setActiveEstablishments] = useState([]);
  const [inactiveEstablishments, setInactiveEstablishments] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const [
          today,
          sales,
          users,
          active,
          inactive,
        ] = await Promise.all([
          dashboardService.getSalesToday(),
          dashboardService.getSalesByEstablishment(),
          dashboardService.getUsersByEstablishment(),
          dashboardService.getEstablishmentsByStatus(true),
          dashboardService.getEstablishmentsByStatus(false),
        ]);

        setSalesToday(today);
        setSalesByEstablishment(sales);
        setUsersByEstablishment(users);
        setActiveEstablishments(active);
        setInactiveEstablishments(inactive);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return {
    loading,
    salesToday,
    salesByEstablishment,
    usersByEstablishment,
    activeEstablishments,
    inactiveEstablishments,
  };
}