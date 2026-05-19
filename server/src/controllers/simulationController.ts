import { Response }
from "express";

import { asyncHandler }
from "../middleware/asyncHandler";

import {
  runSimulation
}
from "../services/simulationService";

/*
 =====================================
 RUN AI SHOPPING SIMULATION
 =====================================
*/

export const simulateQuery =
  asyncHandler(

    async (
      req: any,
      res: Response
    ) => {

      const {

        query,

        product,

        agent,

      } = req.body;

      /*
       ---------------------------------
       VALIDATION
       ---------------------------------
      */

      if (!query) {

        return res.status(400)
          .json({

            success: false,

            message:
              "Query is required",
          });
      }

      /*
       ---------------------------------
       RUN SIMULATION
       ---------------------------------
      */

      const result =
        await runSimulation({

          userId:
            req.user._id,

          query,

          product,

          agent,
        });

      res.status(200).json({

        success: true,

        message:
          "Simulation completed",

        data:
          result,
      });
    }
  );