import { Request, Response } from "express";

import { asyncHandler } from "../middleware/asyncHandler";

import {
  createStoreService,
  getAllStoresService,
} from "../services/storeService";

export const createStore = asyncHandler(
  async (req: Request, res: Response) => {
    const store = await createStoreService(req.body);

    res.status(201).json({
      success: true,
      data: store,
    });
  }
);

export const getAllStores = asyncHandler(
  async (_req: Request, res: Response) => {
    const stores = await getAllStoresService();

    res.status(200).json({
      success: true,
      count: stores.length,
      data: stores,
    });
  }
);