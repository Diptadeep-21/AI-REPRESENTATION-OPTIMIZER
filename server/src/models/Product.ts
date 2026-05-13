import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  storeId: mongoose.Types.ObjectId;

  title: string;
  description: string;

  price: number;

  images: string[];

  category?: string;

  metadata: {
    material?: string;
    waterproof?: boolean;
    terrain?: string[];
  };

  createdAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    images: [
      {
        type: String,
      },
    ],

    category: {
      type: String,
    },

    metadata: {
      material: String,

      waterproof: Boolean,

      terrain: [String],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IProduct>(
  "Product",
  productSchema
);