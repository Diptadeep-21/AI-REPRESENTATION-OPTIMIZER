import axios from "axios";

import Analysis
from "../models/Analysis";

import {
  getCurrentStore,
} from "../utils/getCurrentStore";

export const runSimulation =
  async ({

    userId,

    query,

    product,

    agent,

  }: {

    userId: string;

    query: string;

    product: string;

    agent: string;
  }) => {

    /*
     =====================================
     CURRENT MERCHANT STORE
     =====================================
    */

    const store =
      await getCurrentStore(
        userId
      );

    /*
     =====================================
     FIND PRODUCT ANALYSIS
     =====================================
    */

    const analysis =
      await Analysis.findOne({

        productId:
          product,

        storeId:
          store._id,

      })

      .populate("productId");

    /*
     =====================================
     ANALYSIS NOT FOUND
     =====================================
    */

    if (!analysis) {

      throw new Error(
        "Analysis not found for merchant product"
      );
    }

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