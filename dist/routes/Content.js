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
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const database_1 = require("../database");
exports.routes = (0, express_1.Router)();
// Create the Content
exports.routes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.routes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.routes.delete("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
