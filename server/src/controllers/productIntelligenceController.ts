import { Request, Response } from "express";

import { asyncHandler }
from "../middleware/asyncHandler";

import {
  getProductsIntelligenceService,
}
from "../services/productIntelligenceService";

export const getProductsIntelligence =
  asyncHandler(
    async (
      _req: Request,
      res: Response
    ) => {

      const data =
        await getProductsIntelligenceService();

      res.status(200).json({

        success: true,

        data,
      });
    }
  );