import axios from "axios";

export const analyzeWithAI =
  async (payload: any) => {

    const response =
      await axios.post(
        "http://localhost:8000/analyze",
        payload
      );

    console.log(
      "AI RESPONSE:",
      response.data
    );

    return response.data;
  };