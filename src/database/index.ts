import mongoose from "mongoose";

const Schema = mongoose.Schema;

// const ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const contenTypes = [
  "image",
  "video",
  "article",
  "audio",
  "document",
  "tweet",
  "youtube",
  "link",
];

const TagsSchema = new Schema({
  title: String,
});

const ContentSchema = new Schema({
  link: String,
  type: { type: String, enum: contenTypes, required: true },
  title: { type: String, required: true },
  tags: [{ type: mongoose.Types.ObjectId, ref: "tags" }],
  userId: { type: mongoose.Types.ObjectId, ref: "users", required: true },
});

const LinkSchema = new Schema({
  hash: String,
  userId: { type: mongoose.Types.ObjectId, ref: "users" },
});

export const Users = mongoose.model("users", UserSchema);
export const Tags = mongoose.model("tags", TagsSchema);
export const Contents = mongoose.model("contents", ContentSchema);
export const Links = mongoose.model("links", LinkSchema);
