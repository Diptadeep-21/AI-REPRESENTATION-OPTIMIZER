import { Request, Response }
from "express";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import User from "../models/User";

import Store from "../models/Store";

import { asyncHandler }
from "../middleware/asyncHandler";

/*
 =====================================
 GENERATE JWT
 =====================================
*/

const generateToken = (
  userId: string
) => {

  return jwt.sign(

    {
      userId,
    },

    process.env.JWT_SECRET!,

    {
      expiresIn: "7d",
    }
  );
};

/*
 =====================================
 REGISTER
 =====================================
*/

export const registerUser =
  asyncHandler(

    async (
      req: Request,
      res: Response
    ) => {

      const {

        name,

        email,

        password,

      } = req.body;

      /*
       ---------------------------------
       CHECK EXISTING USER
       ---------------------------------
      */

      const existingUser =
        await User.findOne({
          email,
        });

      if (existingUser) {

        return res.status(400)
          .json({

            success: false,

            message:
              "User already exists",
          });
      }

      /*
       ---------------------------------
       HASH PASSWORD
       ---------------------------------
      */

      const hashedPassword =
        await bcrypt.hash(

          password,

          10
        );

      /*
       ---------------------------------
       CREATE USER
       ---------------------------------
      */

      const user =
        await User.create({

          name,

          email,

          password:
            hashedPassword,
        });

      /*
       ---------------------------------
       CREATE MERCHANT STORE
       ---------------------------------
      */

      await Store.create({

        owner:
          user._id,

        storeName:
          `${user.name}'s Store`,

        shopifyDomain:

          `${user.name
            .toLowerCase()
            .replace(/\s+/g, "-")
          }.myshopify.com`,

        accessToken:
          "temp-access-token",

        isConnected: true,
      });

      /*
       ---------------------------------
       GENERATE JWT
       ---------------------------------
      */

      const token =
        generateToken(
          user._id.toString()
        );

      /*
       ---------------------------------
       RESPONSE
       ---------------------------------
      */

      res.status(201).json({

        success: true,

        token,

        user: {

          id:
            user._id,

          name:
            user.name,

          email:
            user.email,

          role:
            user.role,
        },
      });
    }
  );

/*
 =====================================
 LOGIN
 =====================================
*/

export const loginUser =
  asyncHandler(

    async (
      req: Request,
      res: Response
    ) => {

      const {

        email,

        password,

      } = req.body;

      /*
       ---------------------------------
       FIND USER
       ---------------------------------
      */

      const user =
        await User.findOne({
          email,
        });

      if (!user) {

        return res.status(401)
          .json({

            success: false,

            message:
              "Invalid credentials",
          });
      }

      /*
       ---------------------------------
       CHECK PASSWORD
       ---------------------------------
      */

      const isMatch =
        await bcrypt.compare(

          password,

          user.password
        );

      if (!isMatch) {

        return res.status(401)
          .json({

            success: false,

            message:
              "Invalid credentials",
          });
      }

      /*
       ---------------------------------
       GENERATE JWT
       ---------------------------------
      */

      const token =
        generateToken(
          user._id.toString()
        );

      /*
       ---------------------------------
       RESPONSE
       ---------------------------------
      */

      res.status(200).json({

        success: true,

        token,

        user: {

          id:
            user._id,

          name:
            user.name,

          email:
            user.email,

          role:
            user.role,
        },
      });
    }
  );

/*
 =====================================
 CURRENT USER
 =====================================
*/

export const getCurrentUser =
  asyncHandler(

    async (
      req: any,
      res: Response
    ) => {

      res.status(200).json({

        success: true,

        user:
          req.user,
      });
    }
  );