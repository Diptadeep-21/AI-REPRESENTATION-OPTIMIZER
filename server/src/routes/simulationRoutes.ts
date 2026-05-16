import express from "express";

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
  "/query",
  simulateQuery
);

export default router;