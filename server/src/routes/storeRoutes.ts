import express from "express";

import {
  protect,
} from "../middleware/authMiddleware";

import {

  createStore,

  getAllStores,

} from "../controllers/storeController";

const router =
  express.Router();

/*
 =====================================
 STORES
 =====================================
*/

router.route("/")

  .get(
    protect,
    getAllStores
  )

  .post(
    protect,
    createStore
  );

export default router;