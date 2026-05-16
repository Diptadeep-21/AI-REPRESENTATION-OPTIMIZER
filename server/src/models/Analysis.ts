import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface IAnalysis
  extends Document {
  productId: mongoose.Types.ObjectId;

  scores: {
    metadataScore: number;

    discoverabilityScore: number;

    trustScore: number;

    mediaScore: number;

    semanticScore: number;

    overallScore: number;
  };

  issues: string[];

  recommendations: string[];

  analyzedAt: Date;

  createdAt: Date;
}

const analysisSchema =
  new Schema<IAnalysis>(
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },

      scores: {
        metadataScore: {
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

        mediaScore: {
          type: Number,
          required: true,
        },

        semanticScore: {
          type: Number,
          required: true,
        },

        overallScore: {
          type: Number,
          required: true,
        },
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

      analyzedAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model<IAnalysis>(
  "Analysis",
  analysisSchema
);