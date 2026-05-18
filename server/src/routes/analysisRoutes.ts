import express from "express";

import {

  runProductAnalysis,

  runAllProductAnalyses,

  getProductAnalysis,

  getStoreOverview,

  getAllAnalyses,

} from "../controllers/analysisController";

const router =
  express.Router();

/*
 =====================================
 RUN ALL PRODUCT ANALYSES
 =====================================
*/

router.post(
  "/run-all",
  runAllProductAnalyses
);

/*
 =====================================
 STORE OVERVIEW
 =====================================
*/

router.get(
  "/store-overview",
  getStoreOverview
);

/*
 =====================================
 ANALYZE SINGLE PRODUCT
 =====================================
*/

router.post(
  "/run/:productId",
  runProductAnalysis
);

/*
 =====================================
 GET ALL ANALYSES
 =====================================
*/

router.get(
  "/",
  getAllAnalyses
);

/*
 =====================================
 GET SINGLE PRODUCT ANALYSIS
 =====================================
*/

router.get(
  "/:productId",
  getProductAnalysis
);

export default router;