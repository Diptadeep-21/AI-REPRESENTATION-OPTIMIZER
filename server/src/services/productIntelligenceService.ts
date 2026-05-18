import Product from "../models/Product";
import Analysis from "../models/Analysis";

export const getProductsIntelligenceService =
  async () => {

    /*
     =====================================
     FETCH PRODUCTS
     =====================================
    */

    const products =
      await Product.find();

    const intelligenceData =
      [];

    /*
     =====================================
     BUILD PRODUCT INTELLIGENCE
     =====================================
    */

    for (const product of products) {

      /*
       ---------------------------------
       GET LATEST ANALYSIS
       ---------------------------------
      */

      const analysis =
        await Analysis.findOne({
          productId: product._id,
        }).sort({
          createdAt: -1,
        });

      /*
       ---------------------------------
       HANDLE PRODUCTS WITHOUT ANALYSIS
       ---------------------------------
      */

      if (!analysis) {

        intelligenceData.push({
          productId: product._id,

          title: product.title,

          image:
            product.images?.[0] || "",

          overallScore: 0,

          semanticScore: 0,

          discoverabilityScore: 0,

          trustScore: 0,

          issuesCount: 0,

          recommendationCount: 0,

          status: "NOT_ANALYZED",

          improvementPriority:
            "UNKNOWN",
        });

        continue;
      }

      /*
       ---------------------------------
       PRODUCT STATUS
       ---------------------------------
      */

      let status = "POOR";

      if (
        analysis.scores.overallScore >= 85
      ) {
        status = "EXCELLENT";
      }

      else if (
        analysis.scores.overallScore >= 70
      ) {
        status = "GOOD";
      }

      else if (
        analysis.scores.overallScore >= 50
      ) {
        status = "MODERATE";
      }

      /*
       ---------------------------------
       PUSH FINAL OBJECT
       ---------------------------------
      */

      intelligenceData.push({

        productId: product._id,

        title: product.title,

        image:
          product.images?.[0] || "",

        overallScore:
          analysis.scores
            .overallScore,

        semanticScore:
          analysis.scores
            .semanticScore,

        discoverabilityScore:
          analysis.scores
            .discoverabilityScore,

        trustScore:
          analysis.scores
            .trustScore,

        issuesCount:
          analysis.issues.length,

        recommendationCount:
          analysis.recommendations
            .length,

        status,

        improvementPriority:
          analysis.aiInsights
            ?.improvementPriority ||
          "MEDIUM",
      });
    }

    /*
     =====================================
     SORT BEST PRODUCTS FIRST
     =====================================
    */

    intelligenceData.sort(
      (a: any, b: any) =>
        b.overallScore -
        a.overallScore
    );

    return intelligenceData;
  };