import express from "express";
import {
  protect,
} from "../middleware/authMiddleware";

import {
  simulateQuery
}
from "../controllers/simulationController";

const router =
  express.Router();

/*
 =====================================
 AI SHOPPING SIMULATION
 =====================================
*/

router.post(
  "/query", protect,
  simulateQuery
);

export default router;