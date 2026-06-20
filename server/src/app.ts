import express from "express";

import cors from "cors";

import dotenv from "dotenv";

import { connectDB }
from "./config/db";

import productRoutes
from "./routes/productRoutes";

import storeRoutes
from "./routes/storeRoutes";

import dashboardRoutes
from "./routes/dashboardRoutes";

import ingestionRoutes
from "./routes/ingestionRoutes";

import analysisRoutes
from "./routes/analysisRoutes";

import simulationRoutes
from "./routes/simulationRoutes";

import reportRoutes
from "./routes/reportRoutes";

import authRoutes
from "./routes/authRoutes";

import demoRoutes
from "./routes/demoRoutes";

import {
  errorHandler,
}
from "./middleware/errorMiddleware";

dotenv.config();

connectDB();

const app =
  express();

/*
 =====================================
 MIDDLEWARE
 =====================================
*/


app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://merchanta-ai-frontend.vercel.app",
    ],
    credentials: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);


// app.use(cors());

// app.use((req, res, next) => {

//   res.header(
//     "Access-Control-Allow-Origin",
//     "https://merchanta-ai-frontend.vercel.app"
//   );

//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );

//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, OPTIONS"
//   );

//   if (req.method === "OPTIONS") {

//     return res.sendStatus(200);
//   }

//   next();
// });

// app.use(express.json());

/*
 =====================================
 HEALTH CHECK
 =====================================
*/

app.get(

  "/health",

  (_req, res) => {

    res.status(200).json({

      success: true,

      message:
        "Server running successfully",
    });
  }
);


/*
 =====================================
 ROUTES
 =====================================
*/

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/stores",
  storeRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/simulation",
  simulationRoutes
);

app.use(
  "/api/ingestion",
  ingestionRoutes
);

app.use(
  "/api/analysis",
  analysisRoutes
);

app.use(
  "/api/reports",
  reportRoutes
);

app.use(
  "/api/demo",
  demoRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

/*
 =====================================
 ERROR HANDLER
 =====================================
*/

app.use(errorHandler);

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );
});