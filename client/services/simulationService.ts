import axios from "axios";

interface SimulationPayload {

  query: string;

  product: string;

  agent: string;
}

export const runSimulation =
  async (
    payload: SimulationPayload
  ) => {

    const response =
      await axios.post(

        "http://localhost:5000/api/simulation/query",

        payload
      );

    return response.data.data;
  };