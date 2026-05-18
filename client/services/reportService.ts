import axios from "axios";

export const getReports =
  async () => {

    const response =
      await axios.get(
        "http://localhost:5000/api/reports/overview"
      );

    return response.data.data;
  };