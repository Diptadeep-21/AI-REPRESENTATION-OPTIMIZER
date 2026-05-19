import axios from "axios";

export const analyzeWithAI =
  async (payload: any) => {

    const response =
      await axios.post(
        `${process.env.AI_ENGINE_URL}/analyze`,
        payload
      );

    console.log(
      "AI RESPONSE:",
      response.data
    );

    return response.data;
  };