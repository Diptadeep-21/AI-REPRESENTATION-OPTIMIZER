import { Request, Response } from "express";

import { asyncHandler } from "../middleware/asyncHandler";

import {
  getAllProductsService,
  createProductService,
} from "../services/productService";

export const getAllProducts = asyncHandler(
  async (_req: Request, res: Response) => {
    const products = await getAllProductsService();

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  }
);

export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await createProductService(req.body);

    res.status(201).json({
      success: true,
      data: product,
    });
  }
);