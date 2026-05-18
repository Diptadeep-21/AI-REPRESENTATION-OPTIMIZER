import axios from "axios";

export const getProductAnalysis =
  async (productId: string) => {

    const response =
      await axios.get(
        `http://localhost:5000/api/analysis/${productId}`
      );

    return response.data.data;
  };