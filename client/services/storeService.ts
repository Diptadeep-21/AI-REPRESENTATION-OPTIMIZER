import apiClient
from "@/lib/api/client";

interface StorePayload {

  storeName: string;

  shopifyDomain: string;

  accessToken: string;
}

/*
 =====================================
 CONNECT SHOPIFY STORE
 =====================================
*/

export const connectStore =
  async (
    payload: StorePayload
  ) => {

    const response =
      await apiClient.post(

        "/stores",

        payload
      );

    return response.data;
  };