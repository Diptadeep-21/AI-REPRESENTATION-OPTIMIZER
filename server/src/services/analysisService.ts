import Product from "../models/Product";

import Analysis from "../models/Analysis";

import { calculateProductScores }
from "../analysis/scoringEngine";

import { detectProductIssues }
from "../analysis/issueDetector";

import { generateRecommendations }
from "../analysis/recommendationEngine";

import { analyzeWithAI }
from "../integrations/aiService";

import {
  getCurrentStore,
} from "../utils/getCurrentStore";

export const analyzeProduct =
  async (

    userId: string,

    productId: string
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
     FETCH PRODUCT
     =====================================
    */

    const product =
      await Product.findOne({

        _id: productId,

        storeId:
          store._id,
      });

    if (!product) {

      throw new Error(
        "Product not found"
      );
    }

    /*
     =====================================
     DETERMINISTIC SCORING
     =====================================
    */

    const scores =
      calculateProductScores(
        product
      );

    /*
     =====================================
     ISSUE DETECTION
     =====================================
    */

    const issues =
      detectProductIssues(

        product,

        scores
      );

    /*
     =====================================
     RECOMMENDATIONS
     =====================================
    */

    const recommendations =
      generateRecommendations(
        issues
      );

    /*
     =====================================
     AI ANALYSIS
     =====================================
    */

    const aiInsights =
      await analyzeWithAI({

        product,

        scores,

        issues,

        recommendations,
      });

    /*
     =====================================
     SAVE ANALYSIS
     =====================================
    */

    const analysis =
      await Analysis.findOneAndUpdate(

        {
          productId:
            product._id,

          storeId:
            product.storeId,
        },

        {
          productId:
            product._id,

          storeId:
            product.storeId,

          scores,

          issues,

          recommendations,

          aiInsights,

          analyzedAt:
            new Date(),
        },

        {
          upsert: true,

          new: true,
        }
      );

    return analysis;
  };