import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface IAnalysis
  extends Document {

  productId:
    mongoose.Types.ObjectId;

  scores: {

    metadataScore: number;

    discoverabilityScore:
      number;

    trustScore: number;

    mediaScore: number;

    semanticScore: number;

    overallScore: number;
  };

  issues: string[];

  recommendations: string[];

  aiInsights: {

    summary: string;

    visibilityPrediction: {
      [key: string]: string;
    };

    optimizedTitle:
      string;

    optimizedDescription:
      string;

    semanticGaps:
      string[];

    improvementPriority:
      string;
  };

  analyzedAt: Date;

  createdAt: Date;
}

/*
 =====================================
 AI INSIGHTS SUBSCHEMA
 =====================================
*/

const aiInsightsSchema =
  new Schema(
    {
      summary: {
        type: String,
      },

      visibilityPrediction: {
        type: Map,
        of: String,
      },

      optimizedTitle: {
        type: String,
      },

      optimizedDescription: {
        type: String,
      },

      semanticGaps: [
        {
          type: String,
        },
      ],

      improvementPriority: {
        type: String,
      },
    },

    {
      _id: false,
    }
  );

/*
 =====================================
 MAIN ANALYSIS SCHEMA
 =====================================
*/

const analysisSchema =
  new Schema<IAnalysis>(
    {
      productId: {
        type:
          Schema.Types.ObjectId,

        ref: "Product",

        required: true,
      },

      /*
       =====================================
       DETERMINISTIC SCORES
       =====================================
      */

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

      /*
       =====================================
       ISSUES
       =====================================
      */

      issues: [
        {
          type: String,
        },
      ],

      /*
       =====================================
       RECOMMENDATIONS
       =====================================
      */

      recommendations: [
        {
          type: String,
        },
      ],

      /*
       =====================================
       AI INSIGHTS
       =====================================
      */

      aiInsights:
        aiInsightsSchema,

      /*
       =====================================
       ANALYSIS TIMESTAMP
       =====================================
      */

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