import express from "express";

import {
  protect,
} from "../middleware/authMiddleware";

import {

  getAllProducts,

  createProduct,

  getSingleProduct,

} from "../controllers/productController";

import {

  getProductsIntelligence,

} from "../controllers/productIntelligenceController";

const router =
  express.Router();

/*
 =====================================
 PRODUCT INTELLIGENCE
 =====================================
*/

router.get(

  "/intelligence",

  protect,

  getProductsIntelligence
);

router.get(

  "/:id",

  protect,

  getSingleProduct
);

/*
 =====================================
 PRODUCTS
 =====================================
*/

router.route("/")

  .get(
    protect,
    getAllProducts
  )

  .post(
    protect,
    createProduct
  );

export default router;


/*import express from "express";
import {
  protect,
} from "../middleware/authMiddleware";

import {
  getProductsIntelligence,
}
from "../controllers/productIntelligenceController";

const router = express.Router();

router.get(
  "/intelligence", protect,
  getProductsIntelligence
);

export default router; */