import apiClient
from "@/lib/api/client";

/*
 =====================================
 PAYLOAD
 =====================================
*/

interface SimulationPayload {

  query: string;

  product: string;

  agent: string;
}

/*
 =====================================
 RUN SIMULATION
 =====================================
*/

export const runSimulation =
  async (
    payload: SimulationPayload
  ) => {

    const response =
      await apiClient.post(

        "/simulation/query",

        payload
      );

    return response.data.data;
  };