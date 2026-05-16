import axios from "axios";

export const runSimulation =
  async (query: string) => {

    /*
     =====================================
     CALL FASTAPI SIMULATION
     =====================================
    */

    const response =
      await axios.post(
        "http://localhost:8000/simulate",
        {
          query,
        }
      );

    return response.data;
  };