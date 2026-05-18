import axios from "axios";

import Analysis
from "../models/Analysis";

export const runSimulation =
  async ({
    query,
    product,
    agent,
  }: {
    query: string;

    product: string;

    agent: string;
  }) => {

    /*
     =====================================
     FIND PRODUCT ANALYSIS
     =====================================
    */

    const analysis =
      await Analysis.findOne({

        productId:
          product,
      })

      .populate("productId");

    /*
     =====================================
     FASTAPI CALL
     =====================================
    */

    const response =
      await axios.post(
        "http://localhost:8000/simulate",
        {

          query,

          agent,

          analysis,
        }
      );

    return response.data;
  };