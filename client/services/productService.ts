import apiClient
from "@/lib/api/client";

/*
 =====================================
 PRODUCT INTELLIGENCE
 =====================================
*/

export const getProductsIntelligence =
  async () => {

    const response =
      await apiClient.get(

        "/products/intelligence"
      );

    return response.data.data;
  };