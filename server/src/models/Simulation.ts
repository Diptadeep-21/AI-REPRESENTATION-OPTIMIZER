import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface ISimulation
  extends Document {

  storeId:
    mongoose.Types.ObjectId;

  query: string;

  recommendedProducts:
    mongoose.Types.ObjectId[];

  reasoning: string[];

  rankingScore: number;

  createdAt: Date;
}

const simulationSchema =
  new Schema<ISimulation>(

    {
      /*
       =====================================
       STORE OWNERSHIP
       =====================================
      */

      storeId: {

        type:
          Schema.Types.ObjectId,

        ref: "Store",

        required: true,
      },

      /*
       =====================================
       USER QUERY
       =====================================
      */

      query: {

        type: String,

        required: true,
      },

      /*
       =====================================
       AI RECOMMENDED PRODUCTS
       =====================================
      */

      recommendedProducts: [

        {
          type:
            Schema.Types.ObjectId,

          ref: "Product",
        },
      ],

      /*
       =====================================
       AI REASONING
       =====================================
      */

      reasoning: [

        {
          type: String,
        },
      ],

      /*
       =====================================
       AI RANKING SCORE
       =====================================
      */

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