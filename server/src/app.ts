import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/db";

import productRoutes from "./routes/productRoutes";

import { errorHandler } from "./middleware/errorMiddleware";

import storeRoutes from "./routes/storeRoutes";

import dashboardRoutes from "./routes/dashboardRoutes";

import ingestionRoutes from "./routes/ingestionRoutes";

import analysisRoutes from "./routes/analysisRoutes";

import simulationRoutes from "./routes/simulationRoutes";

dotenv.config();

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server running successfully",
  });
});

app.use("/api/products", productRoutes);

app.use("/api/stores", storeRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/simulation", simulationRoutes);

app.use(errorHandler);

app.use("/api/ingestion", ingestionRoutes);

app.use(
  "/api/analysis",
  analysisRoutes
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});