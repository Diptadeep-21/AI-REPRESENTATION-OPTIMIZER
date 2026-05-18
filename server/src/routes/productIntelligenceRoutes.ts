import express from "express";

import {
  getProductsIntelligence,
}
from "../controllers/productIntelligenceController";

const router = express.Router();

router.get(
  "/intelligence",
  getProductsIntelligence
);

export default router;