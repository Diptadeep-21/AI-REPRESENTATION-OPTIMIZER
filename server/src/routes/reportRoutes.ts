import express from "express";

import {
  getReportsData,
}
from "../controllers/reportController";

const router =
  express.Router();

router.get(
  "/overview",
  getReportsData
);

export default router;