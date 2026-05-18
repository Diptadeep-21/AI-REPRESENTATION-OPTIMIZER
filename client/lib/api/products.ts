import apiClient from "./client";

export const getProducts =
  async () => {

    const response =
      await apiClient.get(
        "/products"
      );

    return response.data.data;
  };