import express from "express";

import {
  runProductAnalysis,
  getProductAnalysis,
  getStoreOverview,
} from "../controllers/analysisController";

const router = express.Router();

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
 ANALYZE PRODUCT
 =====================================
*/

router.post(
  "/run/:productId",
  runProductAnalysis
);

/*
 =====================================
 GET PRODUCT ANALYSIS
 =====================================
*/

router.get(
  "/:productId",
  getProductAnalysis
);

export default router;