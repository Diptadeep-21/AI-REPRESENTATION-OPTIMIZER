import axios from "axios";

export const getDashboardOverview =
  async () => {
    const response = await axios.get(
      "http://localhost:5000/api/dashboard/overview"
    );

    return response.data.data;
  };