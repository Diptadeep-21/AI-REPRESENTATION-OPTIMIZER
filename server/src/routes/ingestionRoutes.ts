import express from "express";

import {
  syncProducts,
} from "../controllers/ingestionController";

const router = express.Router();

router.post("/sync", syncProducts);

export default router;