"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShareCard = exports.CardLink = exports.Links = exports.Contents = exports.Tags = exports.Users = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
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
    createdDate: {
        type: String,
    },
    tags: [String],
    userId: { type: mongoose_1.default.Types.ObjectId, ref: "users", required: true },
});
const LinkSchema = new Schema({
    token: String,
    userId: { type: mongoose_1.default.Types.ObjectId, ref: "users" },
});
const CardLinkSchema = new Schema({
    token: String,
    userId: { type: mongoose_1.default.Types.ObjectId, ref: "users" },
});
const ShareCards = new Schema({
    id: String,
    link: String,
    type: String,
    title: String,
    describtion: String,
    tags: [String],
    userId: { type: mongoose_1.default.Types.ObjectId, ref: "users" },
});
exports.Users = mongoose_1.default.model("users", UserSchema);
exports.Tags = mongoose_1.default.model("tags", TagsSchema);
exports.Contents = mongoose_1.default.model("contents", ContentSchema);
exports.Links = mongoose_1.default.model("links", LinkSchema);
exports.CardLink = mongoose_1.default.model("cardLinks", CardLinkSchema);
exports.ShareCard = mongoose_1.default.model("shareCards", ShareCards);
