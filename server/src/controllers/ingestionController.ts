import { Response }
from "express";

import { asyncHandler }
from "../middleware/asyncHandler";

import {
  syncShopifyProductsService,
}
from "../services/ingestionService";

/*
 =====================================
 SYNC SHOPIFY PRODUCTS
 =====================================
*/

export const syncProducts =
  asyncHandler(

    async (
      req: any,
      res: Response
    ) => {

      /*
       =====================================
       SYNC MERCHANT PRODUCTS
       =====================================
      */

      const result =
        await syncShopifyProductsService(

          req.user._id
        );

      /*
       =====================================
       RESPONSE
       =====================================
      */

      res.status(200).json({

        success: true,

        message:
          "Products synced successfully",

        data: result,
      });
    }
  );