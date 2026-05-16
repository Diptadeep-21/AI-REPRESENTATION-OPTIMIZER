import Product from "../models/Product";

import Analysis from "../models/Analysis";

import { calculateProductScores } from "./scoringEngine";

import { detectProductIssues } from "./issueDetector";

import { generateRecommendations } from "./recommendationEngine";

export const analyzeProduct =
  async (productId: string) => {
    const product =
      await Product.findById(productId);

    if (!product) {
      throw new Error(
        "Product not found"
      );
    }

    /*
     =========================
     SCORE CALCULATION
     =========================
    */

    const scores =
      calculateProductScores(
        product
      );

    /*
     =========================
     ISSUE DETECTION
     =========================
    */

    const issues =
      detectProductIssues(
        product,
        scores
      );

    /*
     =========================
     RECOMMENDATIONS
     =========================
    */

    const recommendations =
      generateRecommendations(
        issues
      );

    /*
     =========================
     SAVE ANALYSIS
     =========================
    */

    const analysis =
      await Analysis.create({
        productId:
          product._id,

        scores,

        issues,

        recommendations,

        analyzedAt:
          new Date(),
      });

    return analysis;
  };