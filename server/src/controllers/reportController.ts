import { Request, Response }
from "express";

import { asyncHandler }
from "../middleware/asyncHandler";

import Analysis
from "../models/Analysis";

export const getReportsData =
  asyncHandler(
    async (
      _req: Request,
      res: Response
    ) => {

      /*
      =====================================
      FETCH ANALYSES
      =====================================
      */

      const analyses =
        await Analysis.find()
          .populate("productId");

      /*
      =====================================
      EXECUTIVE SUMMARY
      =====================================
      */

      const totalProducts =
        analyses.length;

      const avgScore =
        analyses.reduce(
          (
            acc: number,
            curr: any
          ) =>

            acc +

            (
              curr.scores
                ?.overallScore || 0
            ),

          0
        ) /
        (
          totalProducts || 1
        );

      /*
      =====================================
      HIGH PRIORITY COUNT
      =====================================
      */

      const highPriority =
        analyses.filter(
          (a: any) =>
            (
              a.scores
                ?.overallScore || 0
            ) < 50
        ).length;

      /*
      =====================================
      PRODUCTS NEEDING OPTIMIZATION
      =====================================
      */

      const weakProducts =
        analyses

          .filter(
            (a: any) =>
              (
                a.scores
                  ?.overallScore || 0
              ) < 80
          )

          .sort(
            (
              a: any,
              b: any
            ) =>

              (
                a.scores
                  ?.overallScore || 0
              )

              -

              (
                b.scores
                  ?.overallScore || 0
              )
          );

      /*
      =====================================
      DYNAMIC VISIBILITY METRICS
      =====================================
      */

      const semanticVisibility =
        Math.round(

          analyses.reduce(
            (
              acc: number,
              curr: any
            ) =>

              acc +

              (
                curr.scores
                  ?.semanticScore || 0
              ),

            0
          ) /
          (
            totalProducts || 1
          )
        );

      const llmReadiness =
        Math.round(

          analyses.reduce(
            (
              acc: number,
              curr: any
            ) =>

              acc +

              (
                curr.scores
                  ?.overallScore || 0
              ),

            0
          ) /
          (
            totalProducts || 1
          )
        );

      const discoverability =
        Math.round(

          analyses.reduce(
            (
              acc: number,
              curr: any
            ) =>

              acc +

              (
                curr.scores
                  ?.discoverabilityScore || 0
              ),

            0
          ) /
          (
            totalProducts || 1
          )
        );

      /*
      =====================================
      RESPONSE
      =====================================
      */

      res.status(200).json({

        success: true,

        data: {

          executiveSummary: {

            totalProducts,

            averageAIReadiness:
              Math.round(
                avgScore
              ),

            highPriorityProducts:
              highPriority,
          },

          visibilityMetrics: {

            semanticVisibility,

            llmReadiness,

            discoverability,
          },

          weakProducts:

            weakProducts.map(
              (p: any) => {

                const score =
                  p.scores
                    ?.overallScore || 0;

                let priority =
                  "LOW";

                if (score < 50) {

                  priority =
                    "HIGH";
                }

                else if (
                  score < 70
                ) {

                  priority =
                    "MEDIUM";
                }

                return {

                  productId:
                    p.productId?._id,

                  title:
                    p.productId
                      ?.title ||

                    "Unknown Product",

                  score,

                  priority,

                  issues:
                    p.issues
                      ?.length || 0,
                };
              }
            ),

          weeklyRecommendations: [

            "Improve semantic metadata across low-performing products.",

            "Increase AI visibility by adding richer product descriptions.",

            "Add semantic shopping keywords for better LLM discoverability.",

            "Improve structured metadata consistency.",
          ],
        },
      });
    }
  );