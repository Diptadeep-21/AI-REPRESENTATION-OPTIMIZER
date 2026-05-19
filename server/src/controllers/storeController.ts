import { Request, Response }
from "express";

import { asyncHandler }
from "../middleware/asyncHandler";

import {

  createStoreService,

  getAllStoresService,

}
from "../services/storeService";

/*
 =====================================
 EXTENDED REQUEST
 =====================================
*/

interface AuthRequest
  extends Request {

  user?: any;
}

/*
 =====================================
 CREATE STORE
 =====================================
*/

export const createStore =
  asyncHandler(

    async (
      req: AuthRequest,
      res: Response
    ) => {

      const store =
        await createStoreService(

          req.user._id,

          req.body
        );

      res.status(201).json({

        success: true,

        data: store,
      });
    }
  );

/*
 =====================================
 GET CURRENT MERCHANT STORES
 =====================================
*/

export const getAllStores =
  asyncHandler(

    async (
      req: AuthRequest,
      res: Response
    ) => {

      const stores =
        await getAllStoresService(

          req.user._id
        );

      res.status(200).json({

        success: true,

        count:
          stores.length,

        data:
          stores,
      });
    }
  );