import axios from "axios";

export const getProductsIntelligence =
  async () => {

    const response =
      await axios.get(
        "http://localhost:5000/api/products/intelligence"
      );

    return response.data.data;
  };