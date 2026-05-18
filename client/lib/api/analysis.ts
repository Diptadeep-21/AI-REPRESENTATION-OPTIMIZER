import apiClient from "./client";

export const getAllAnalyses =
  async () => {

    const response =
      await apiClient.get(
        "/analysis"
      );

    return response.data.data;
  };