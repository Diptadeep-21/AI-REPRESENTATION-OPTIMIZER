import { Response }
from "express";

import Analysis
from "../models/Analysis";

import Product
from "../models/Product";

import { asyncHandler }
from "../middleware/asyncHandler";

import {
  analyzeProduct,
}
from "../services/analysisService";

import {
  getCurrentStore,
}
from "../utils/getCurrentStore";

/*
 =====================================
 RUN PRODUCT ANALYSIS
 =====================================
*/

export const runProductAnalysis =
  asyncHandler(

    async (
      req: any,
      res: Response
    ) => {

      const productId =
        req.params.productId;

      const analysis =
        await analyzeProduct(

          req.user._id,

          productId
        );

      res.status(200).json({

        success: true,

        message:
          "Product analyzed successfully",

        data:
          analysis,
      });
    }
  );

/*
 =====================================
 RUN ANALYSIS FOR ALL PRODUCTS
 =====================================
*/

export const runAllProductAnalyses =
  asyncHandler(

    async (
      req: any,
      res: Response
    ) => {

      const store =
        await getCurrentStore(
          req.user._id
        );

      const products =
        await Product.find({

          storeId:
            store._id,
        });

      const results = [];

      for (const product of products) {

        try {

          const analysis =
            await analyzeProduct(

              req.user._id,

              product._id.toString()
            );

          results.push(
            analysis
          );

        } catch (error) {

          console.error(

            `Failed to analyze ${product.title}`,

            error
          );
        }
      }

      res.status(200).json({

        success: true,

        message:
          "All products analyzed successfully",

        total:
          results.length,

        data:
          results,
      });
    }
  );

/*
 =====================================
 GET LATEST PRODUCT ANALYSIS
 =====================================
*/

export const getProductAnalysis =
  asyncHandler(

    async (
      req: any,
      res: Response
    ) => {

      const productId =
        req.params.productId;

      const store =
        await getCurrentStore(
          req.user._id
        );

      const analysis =
        await Analysis.findOne({

          productId,

          storeId:
            store._id,
        })

        .populate("productId")

        .sort({
          createdAt: -1,
        });

      if (!analysis) {

        return res.status(404)
          .json({

            success: false,

            message:
              "Analysis not found",
          });
      }

      res.status(200).json({

        success: true,

        data:
          analysis,
      });
    }
  );

/*
 =====================================
 STORE OVERVIEW ANALYTICS
 =====================================
*/

export const getStoreOverview =
  asyncHandler(

    async (
      req: any,
      res: Response
    ) => {

      const store =
        await getCurrentStore(
          req.user._id
        );

      const totalProducts =
        await Product.countDocuments({

          storeId:
            store._id,
        });

      const analyses =
        await Analysis.find({

          storeId:
            store._id,
        });

      const totalAnalyses =
        analyses.length;

      const averageScore =

        totalAnalyses > 0

          ? analyses.reduce(

              (acc, item) =>

                acc +

                item.scores
                  .overallScore,

              0
            ) / totalAnalyses

          : 0;

      res.status(200).json({

        success: true,

        data: {

          totalProducts,

          totalAnalyses,

          averageScore:
            Math.round(
              averageScore
            ),
        },
      });
    }
  );

/*
 =====================================
 GET ALL ANALYSES
 =====================================
*/

export const getAllAnalyses =
  asyncHandler(

    async (
      req: any,
      res: Response
    ) => {

      const store =
        await getCurrentStore(
          req.user._id
        );

      const analyses =
        await Analysis.find({

          storeId:
            store._id,
        })

        .populate("productId")

        .sort({
          createdAt: -1,
        });

      res.status(200).json({

        success: true,

        data:
          analyses,
      });
    }
  );