import Product from "../models/Product";
import Analysis from "../models/Analysis";
import Store from "../models/Store";

export const getDashboardOverviewService =
  async () => {
    const totalStores = await Store.countDocuments();

    const totalProducts =
      await Product.countDocuments();

    const totalAnalyses =
      await Analysis.countDocuments();

    const analyses = await Analysis.find();

    let averageSemanticScore = 0;

    let averageTrustScore = 0;

    let averageDiscoverabilityScore = 0;

    if (analyses.length > 0) {
      averageSemanticScore =
        analyses.reduce(
          (acc, curr) => acc + curr.semanticScore,
          0
        ) / analyses.length;

      averageTrustScore =
        analyses.reduce(
          (acc, curr) => acc + curr.trustScore,
          0
        ) / analyses.length;

      averageDiscoverabilityScore =
        analyses.reduce(
          (acc, curr) =>
            acc + curr.discoverabilityScore,
          0
        ) / analyses.length;
    }

    return {
      totalStores,
      totalProducts,
      totalAnalyses,

      scores: {
        semanticScore:
          Math.round(averageSemanticScore),

        trustScore:
          Math.round(averageTrustScore),

        discoverabilityScore:
          Math.round(
            averageDiscoverabilityScore
          ),
      },
    };
  };