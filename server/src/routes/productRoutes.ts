import express from "express";

import {
  getAllProducts,
  createProduct,
} from "../controllers/productController";

const router = express.Router();

router.route("/").get(getAllProducts).post(createProduct);

export default router;