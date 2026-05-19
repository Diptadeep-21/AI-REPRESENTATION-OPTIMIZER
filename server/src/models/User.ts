import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface IUser
  extends Document {

  name: string;

  email: string;

  password: string;

  role: string;
}

const userSchema =
  new Schema<IUser>(
    {
      name: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
      },

      password: {
        type: String,
        required: true,
      },

      role: {
        type: String,
        default: "merchant",
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model<IUser>(
  "User",
  userSchema
);