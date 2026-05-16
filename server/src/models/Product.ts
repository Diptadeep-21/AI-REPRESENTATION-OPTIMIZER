import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface IProduct
  extends Document {
  storeId: mongoose.Types.ObjectId;

  title: string;

  description: string;

  price: number;

  images: string[];

  category?: string;

  tags: string[];

  vendor?: string;

  productType?: string;

  status?: string;

  metadata: {
    material?: string;

    waterproof?: boolean;

    terrain?: string[];

    shopifyProductId?: string;
  };

  createdAt: Date;
}

const productSchema =
  new Schema<IProduct>(
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
        default: "",
      },

      price: {
        type: Number,
        default: 0,
      },

      images: [
        {
          type: String,
        },
      ],

      category: {
        type: String,
        default: "",
      },

      tags: [
        {
          type: String,
        },
      ],

      vendor: {
        type: String,
        default: "",
      },

      productType: {
        type: String,
        default: "",
      },

      status: {
        type: String,
        default: "active",
      },

      metadata: {
        material: {
          type: String,
          default: "",
        },

        waterproof: {
          type: Boolean,
          default: false,
        },

        terrain: [
          {
            type: String,
          },
        ],

        shopifyProductId: {
          type: String,
        },
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