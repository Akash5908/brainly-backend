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
  "document",
  "tweet",
  "youtube",
  "link",
];

const TagsSchema = new Schema({
  title: [String],
});

const ContentSchema = new Schema({
  link: String,
  type: { type: String, enum: contenTypes, required: true, default: "youtube" },
  title: { type: String, required: true, default: "Title Test" },
  describtion: {
    type: String,
  },

  tags: [String],
  userId: { type: mongoose.Types.ObjectId, ref: "users", required: true },
});

const LinkSchema = new Schema({
  token: String,
  userId: { type: mongoose.Types.ObjectId, ref: "users" },
});

const CardLinkSchema = new Schema({
  token: String,
  userId: { type: mongoose.Types.ObjectId, ref: "users" },
});

const ShareCards = new Schema({
  link: String,
  type: String,
  title: String,
  describtion: String,
  tags: [String],
  userId: { type: mongoose.Types.ObjectId, ref: "users" },
});

export const Users = mongoose.model("users", UserSchema);
export const Tags = mongoose.model("tags", TagsSchema);
export const Contents = mongoose.model("contents", ContentSchema);
export const Links = mongoose.model("links", LinkSchema);
export const CardLink = mongoose.model("cardLinks", CardLinkSchema);
export const ShareCard = mongoose.model("shareCards", ShareCards);
