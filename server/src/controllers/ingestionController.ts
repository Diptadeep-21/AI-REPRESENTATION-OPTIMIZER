import { Request, Response } from "express";

import { asyncHandler } from "../middleware/asyncHandler";

import {
  syncShopifyProductsService,
} from "../services/ingestionService";

export const syncProducts =
  asyncHandler(
    async (_req: Request, res: Response) => {
      const result =
        await syncShopifyProductsService();

      res.status(200).json({
        success: true,
        message:
          "Products synced successfully",

        data: result,
      });
    }
  );