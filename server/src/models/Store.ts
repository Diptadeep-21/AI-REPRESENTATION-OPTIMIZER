import mongoose, { Schema, Document } from "mongoose";

export interface IStore
  extends Document {

  owner:
    mongoose.Types.ObjectId;

  storeName: string;

  shopifyDomain: string;

  accessToken: string;

  isConnected: boolean;

  createdAt: Date;
}

const storeSchema = new Schema<IStore>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    storeName: {
      type: String,
      required: true,
    },

    shopifyDomain: {
      type: String,
      required: true,
      unique: true,
    },

    accessToken: {
      type: String,
      required: true,
    },

    isConnected: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IStore>(
  "Store",
  storeSchema
);