import { Request, Response }
from "express";

import { asyncHandler }
from "../middleware/asyncHandler";

import {
  getDashboardOverviewService,
} from "../services/dashboardService";

export const getDashboardOverview =
  asyncHandler(

    async (
      req: any,
      res: Response
    ) => {

      const dashboardData =
        await getDashboardOverviewService(

          req.user._id
        );

      res.status(200).json({

        success: true,

        data:
          dashboardData,
      });
    }
  );