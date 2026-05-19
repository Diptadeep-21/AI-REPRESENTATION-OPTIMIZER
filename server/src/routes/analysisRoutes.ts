import express from "express";

import {

  runProductAnalysis,

  runAllProductAnalyses,

  getProductAnalysis,

  getStoreOverview,

  getAllAnalyses,

} from "../controllers/analysisController";

import {
  protect,
} from "../middleware/authMiddleware";

const router =
  express.Router();

/*
 =====================================
 RUN ALL PRODUCT ANALYSES
 =====================================
*/

router.post(
  "/run-all",

  protect,

  runAllProductAnalyses
);

/*
 =====================================
 STORE OVERVIEW
 =====================================
*/

router.get(
  "/store-overview",

  protect,

  getStoreOverview
);

/*
 =====================================
 ANALYZE SINGLE PRODUCT
 =====================================
*/

router.post(
  "/run/:productId",

  protect,

  runProductAnalysis
);

/*
 =====================================
 GET ALL ANALYSES
 =====================================
*/

router.get(
  "/",

  protect,

  getAllAnalyses
);

/*
 =====================================
 GET SINGLE PRODUCT ANALYSIS
 =====================================
*/

router.get(
  "/:productId",

  protect,

  getProductAnalysis
);

export default router;