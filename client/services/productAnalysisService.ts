import apiClient
from "@/lib/api/client";

/*
 =====================================
 GET PRODUCT ANALYSIS
 =====================================
*/

export const getProductAnalysis =
  async (
    productId: string
  ) => {

    const response =
      await apiClient.get(

        `/analysis/${productId}`
      );

    return response.data.data;
  };