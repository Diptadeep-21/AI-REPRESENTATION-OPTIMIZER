import apiClient
from "@/lib/api/client";

/*
 =====================================
 GET ALL ANALYSES
 =====================================
*/

export const getAllAnalyses =
  async () => {

    const response =
      await apiClient.get(
        "/analysis"
      );

    return response.data.data;
  };