import Store
from "../models/Store";

import Product
from "../models/Product";

import Analysis
from "../models/Analysis";

import {
  getCurrentStore,
} from "../utils/getCurrentStore";

export const getDashboardOverviewService =
  async (
    userId: string
  ) => {

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
     STORE PRODUCTS
     =====================================
    */

    const totalProducts =
      await Product.countDocuments({

        storeId:
          store._id,
      });

    /*
     =====================================
     STORE ANALYSES
     =====================================
    */

    const analyses =
      await Analysis.find({

        storeId:
          store._id,
      });

    const totalAnalyses =
      analyses.length;

    /*
     =====================================
     AVERAGE SCORES
     =====================================
    */

    const scores = {

      semanticScore: 0,

      trustScore: 0,

      discoverabilityScore: 0,

      overallScore: 0,
    };

    if (totalAnalyses > 0) {

      scores.semanticScore =
        Math.round(

          analyses.reduce(

            (acc, curr) =>

              acc +

              curr.scores
                .semanticScore,

            0
          ) / totalAnalyses
        );

      scores.trustScore =
        Math.round(

          analyses.reduce(

            (acc, curr) =>

              acc +

              curr.scores
                .trustScore,

            0
          ) / totalAnalyses
        );

      scores.discoverabilityScore =
        Math.round(

          analyses.reduce(

            (acc, curr) =>

              acc +

              curr.scores
                .discoverabilityScore,

            0
          ) / totalAnalyses
        );

      scores.overallScore =
        Math.round(

          analyses.reduce(

            (acc, curr) =>

              acc +

              curr.scores
                .overallScore,

            0
          ) / totalAnalyses
        );
    }

    /*
     =====================================
     FINAL RESPONSE
     =====================================
    */

    return {

      totalStores: 1,

      totalProducts,

      totalAnalyses,

      scores,
    };
  };