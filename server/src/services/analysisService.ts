import Product from "../models/Product";

import Analysis from "../models/Analysis";

import { calculateProductScores } from "../analysis/scoringEngine";

import { detectProductIssues } from "../analysis/issueDetector";

import { generateRecommendations } from "../analysis/recommendationEngine";

import { analyzeWithAI } from "../integrations/aiService";

export const analyzeProduct =
    async (productId: string) => {

        /*
         =====================================
         FETCH PRODUCT
         =====================================
        */

        const product =
            await Product.findById(
                productId
            );

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

        console.log(
            "AI INSIGHTS:",
            aiInsights
        );

        const analysis =
            await Analysis.findOneAndUpdate(

                {
                    productId:
                        product._id,
                },

                {
                    productId:
                        product._id,

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