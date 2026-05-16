import Product from "../models/Product";

import Analysis from "../models/Analysis";

import Store from "../models/Store";

export const getDashboardOverviewService =
  async () => {

    /*
     =====================================
     BASIC COUNTS
     =====================================
    */

    const totalStores =
      await Store.countDocuments();

    const totalProducts =
      await Product.countDocuments();

    const totalAnalyses =
      await Analysis.countDocuments();

    /*
     =====================================
     FETCH ANALYSES
     =====================================
    */

    const analyses =
      await Analysis.find();

    /*
     =====================================
     SCORE AGGREGATION
     =====================================
    */

    let averageSemanticScore = 0;

    let averageTrustScore = 0;

    let averageDiscoverabilityScore = 0;

    let averageOverallScore = 0;

    if (analyses.length > 0) {

      averageSemanticScore =
        analyses.reduce(
          (acc, curr) =>
            acc +
            curr.scores
              .semanticScore,
          0
        ) / analyses.length;

      averageTrustScore =
        analyses.reduce(
          (acc, curr) =>
            acc +
            curr.scores
              .trustScore,
          0
        ) / analyses.length;

      averageDiscoverabilityScore =
        analyses.reduce(
          (acc, curr) =>
            acc +
            curr.scores
              .discoverabilityScore,
          0
        ) / analyses.length;

      averageOverallScore =
        analyses.reduce(
          (acc, curr) =>
            acc +
            curr.scores
              .overallScore,
          0
        ) / analyses.length;
    }

    /*
     =====================================
     FINAL RESPONSE
     =====================================
    */

    return {

      totalStores,

      totalProducts,

      totalAnalyses,

      scores: {

        semanticScore:
          Math.round(
            averageSemanticScore
          ),

        trustScore:
          Math.round(
            averageTrustScore
          ),

        discoverabilityScore:
          Math.round(
            averageDiscoverabilityScore
          ),

        overallScore:
          Math.round(
            averageOverallScore
          ),
      },
    };
  };