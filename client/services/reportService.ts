import apiClient
from "@/lib/api/client";

/*
 =====================================
 GET REPORTS
 =====================================
*/

export const getReports =
  async () => {

    const response =
      await apiClient.get(

        "/reports/overview"
      );

    return response.data.data;
  };