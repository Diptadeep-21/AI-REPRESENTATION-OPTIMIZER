import axios from "axios";

export const getAllAnalyses =
  async () => {

    const response =
      await axios.get(
        "http://localhost:5000/api/analysis"
      );

    return response.data.data;
  };