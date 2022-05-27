import{ model, Schema } from "mongoose";

interface IUser {
  name: string;
  email: string;
  password: string;
}

const kittySchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

export const User = model<IUser>("User", kittySchema)

