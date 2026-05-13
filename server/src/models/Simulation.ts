import mongoose, { Schema, Document } from "mongoose";

export interface ISimulation extends Document {
  query: string;

  recommendedProducts: string[];

  reasoning: string[];

  rankingScore: number;

  createdAt: Date;
}

const simulationSchema = new Schema<ISimulation>(
  {
    query: {
      type: String,
      required: true,
    },

    recommendedProducts: [
      {
        type: String,
      },
    ],

    reasoning: [
      {
        type: String,
      },
    ],

    rankingScore: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISimulation>(
  "Simulation",
  simulationSchema
);