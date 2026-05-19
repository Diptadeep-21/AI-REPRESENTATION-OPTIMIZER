import { Request, Response, NextFunction }
from "express";

import jwt from "jsonwebtoken";

import User from "../models/User";

export const protect =
  async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {

    try {

      const authHeader =
        req.headers.authorization;

      if (
        !authHeader ||
        !authHeader.startsWith("Bearer ")
      ) {

        return res.status(401)
          .json({
            success: false,
            message:
              "Not authorized",
          });
      }

      const token =
        authHeader.split(" ")[1];

      const decoded: any =
        jwt.verify(
          token,
          process.env.JWT_SECRET!
        );

      const user =
        await User.findById(
          decoded.userId
        ).select("-password");

      req.user = user;

      next();

    } catch (error) {

      return res.status(401)
        .json({
          success: false,
          message:
            "Token failed",
        });
    }
  };