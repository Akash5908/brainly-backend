import mongoose from "mongoose";
import { string } from "zod";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  password: String,
});

export const User = mongoose.model("users", UserSchema);
