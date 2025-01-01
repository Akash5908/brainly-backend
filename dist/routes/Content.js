"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const database_1 = require("../database");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_2 = require("../database");
const user_1 = require("../middleware/user");
exports.routes = (0, express_1.Router)();
// Create the Content
exports.routes.post("/", user_1.userStatus, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, link, title, tags, userId } = req.body;
    try {
        yield database_1.Contents.create({
            type,
            link,
            title,
            tags,
            userId,
        });
        res.status(200).json({
            message: "Your Content is Created",
        });
    }
    catch (error) {
        res.status(403).json({
            error: error,
        });
    }
}));
// Get the Content
exports.routes.get("/", user_1.userStatus, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    try {
        const contentCheck = yield database_1.Contents.find({ userId });
        if (contentCheck) {
            res.status(200).json({
                content: contentCheck,
            });
        }
        else {
            res.status(403).json({
                message: "User do not have any Content to see",
            });
        }
    }
    catch (error) {
        res.status(500).json({
            error: error,
        });
    }
}));
// Delete the Content
exports.routes.delete("/", user_1.userStatus, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contentId } = req.body;
    try {
        const contentCheck = yield database_1.Contents.find({ contentId });
        if (contentCheck) {
            yield database_1.Contents.deleteOne({ _id: contentId });
            res.status(200).json({
                message: "Content Deleted",
            });
        }
        else {
            res.status(403).json({
                message: "Trying to delete a doc you don’t own",
            });
        }
    }
    catch (error) {
        res.status(500).json({
            error: error,
        });
    }
}));
//Share Link
function generateToken(id) {
    const token = jsonwebtoken_1.default.sign({ id }, "Secret", { expiresIn: "1h" });
    return token;
}
//Adding the token of the shared Card and send the url for the share
exports.routes.get("/share", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cardToken = yield generateToken(req.body.id);
    const sharedLink = `http://localhost:3000/content/share/${cardToken}`;
    yield database_2.CardLink.create({
        token: cardToken,
        userId: req.body.userId,
    });
    res.status(200).json({
        message: sharedLink,
    });
}));
// Get the card info by the shared Link
exports.routes.get("/share/:id", user_1.userStatus, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const contentId = jsonwebtoken_1.default.verify(id, "Secret");
        if (contentId) {
            const Content = yield database_1.Contents.findById({ _id: contentId });
            if (Content) {
                res.status(200).json({
                    content: Content,
                });
            }
            else {
                res.status(403).json({
                    message: `Content not found`,
                });
            }
        }
        else {
            res.status(403).json({
                message: `Invalid Link`,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            messae: "Somthing went wrong",
            error: error,
        });
    }
}));
