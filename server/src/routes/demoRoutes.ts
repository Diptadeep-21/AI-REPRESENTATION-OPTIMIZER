import express from "express";

import {
  protect,
}
from "../middleware/authMiddleware";

import {
  createDemoWorkspace,
}
from "../controllers/demoController";

const router =
  express.Router();

router.post(

  "/setup",

  protect,

  createDemoWorkspace
);

export default router;