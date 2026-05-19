import express from "express";
import {
  protect,
} from "../middleware/authMiddleware";

import {
  getReportsData,
}
from "../controllers/reportController";

const router =
  express.Router();

router.get(
  "/overview", protect,
  getReportsData
);

export default router;