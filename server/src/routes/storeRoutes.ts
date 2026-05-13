import express from "express";

import {
  createStore,
  getAllStores,
} from "../controllers/storeController";

const router = express.Router();

router.route("/").get(getAllStores).post(createStore);

export default router;