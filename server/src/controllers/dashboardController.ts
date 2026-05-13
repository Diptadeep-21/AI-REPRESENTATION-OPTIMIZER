import { Request, Response } from "express";

import { asyncHandler } from "../middleware/asyncHandler";

import {
  getDashboardOverviewService,
} from "../services/dashboardService";

export const getDashboardOverview =
  asyncHandler(
    async (_req: Request, res: Response) => {
      const dashboardData =
        await getDashboardOverviewService();

      res.status(200).json({
        success: true,
        data: dashboardData,
      });
    }
  );