import { Response }
from "express";

import { asyncHandler }
from "../middleware/asyncHandler";

import {
  setupDemoWorkspace,
}
from "../services/demoService";

export const createDemoWorkspace =
  asyncHandler(

    async (
      req: any,
      res: Response
    ) => {

      console.log(
        "DEMO USER:",
        req.user
      );

      const result =
        await setupDemoWorkspace(

          req.user._id
        );

      res.status(200).json({

        success: true,

        message:
          "Demo workspace created",

        data: result,
      });
    }
  );