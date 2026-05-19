import apiClient
from "@/lib/api/client";

/*
 =====================================
 CREATE DEMO WORKSPACE
 =====================================
*/

export const setupDemoWorkspace =
  async () => {

    const response =
      await apiClient.post(

        "/demo/setup"
      );

    return response.data;
  };