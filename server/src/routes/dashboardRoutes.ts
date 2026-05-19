import express from "express";
import {
  protect,
} from "../middleware/authMiddleware";


import {
  getDashboardOverview,
} from "../controllers/dashboardController";

const router = express.Router();

router.get("/overview",  protect, getDashboardOverview);

export default router;