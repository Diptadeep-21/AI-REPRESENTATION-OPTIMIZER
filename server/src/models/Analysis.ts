import mongoose, { Schema, Document } from "mongoose";

export interface IAnalysis extends Document {
  productId: mongoose.Types.ObjectId;

  semanticScore: number;
  discoverabilityScore: number;
  trustScore: number;

  issues: string[];

  recommendations: string[];

  createdAt: Date;
}

const analysisSchema = new Schema<IAnalysis>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    semanticScore: {
      type: Number,
      required: true,
    },

    discoverabilityScore: {
      type: Number,
      required: true,
    },

    trustScore: {
      type: Number,
      required: true,
    },

    issues: [
      {
        type: String,
      },
    ],

    recommendations: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAnalysis>(
  "Analysis",
  analysisSchema
);