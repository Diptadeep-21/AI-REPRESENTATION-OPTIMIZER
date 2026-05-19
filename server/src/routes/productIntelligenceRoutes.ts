import express from "express";
import {
  protect,
} from "../middleware/authMiddleware";

import {
  getProductsIntelligence,
}
from "../controllers/productIntelligenceController";

const router = express.Router();

router.get(
  "/intelligence", protect,
  getProductsIntelligence
);

export default router;