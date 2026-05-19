import { Response }
from "express";

import { asyncHandler }
from "../middleware/asyncHandler";

import {

  getAllProductsService,

  createProductService,

  getSingleProductService,

} from "../services/productService";

/*
 =====================================
 GET ALL PRODUCTS
 =====================================
*/

export const getAllProducts =
  asyncHandler(

    async (
      req: any,
      res: Response
    ) => {

      const products =
        await getAllProductsService(

          req.user._id
        );

      res.status(200).json({

        success: true,

        count:
          products.length,

        data:
          products,
      });
    }
  );

/*
 =====================================
 CREATE PRODUCT
 =====================================
*/

export const createProduct =
  asyncHandler(

    async (
      req: any,
      res: Response
    ) => {

      const product =
        await createProductService(

          req.user._id,

          req.body
        );

      res.status(201).json({

        success: true,

        data:
          product,
      });
    }
  );

  /*
 =====================================
 GET SINGLE PRODUCT
 =====================================
*/

export const getSingleProduct =
  asyncHandler(

    async (
      req: any,
      res: Response
    ) => {

      const product =
        await getSingleProductService(

          req.user._id,

          req.params.id
        );

      res.status(200).json({

        success: true,

        data:
          product,
      });
    }
  );

  