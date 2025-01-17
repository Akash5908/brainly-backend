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
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../database");
const user_1 = require("../middleware/user");
exports.routes = (0, express_1.Router)();
const userSchema = zod_1.z.object({
    username: zod_1.z
        .string()
        .min(3, { message: "Name should be at least 3 character" }),
    password: zod_1.z
        .string()
        .min(6, { message: "Password mhust be at least 6 character" }),
});
//singup Route
exports.routes.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = userSchema.parse(req.body);
        yield database_1.Users.create({
            username: result.username,
            password: result.password,
        });
        res.json({
            data: result,
        });
    }
    catch (error) {
        console.log(error);
        res.json({
            error: error,
        });
    }
}));
//login Route
exports.routes.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loginData = userSchema.parse(req.body);
        const userCheck = yield database_1.Users.findOne({ username: loginData.username });
        if (userCheck) {
            if (loginData.password == userCheck.password) {
                const token = jsonwebtoken_1.default.sign(loginData.username, "ahiahadojhajokhdlh");
                res.send({
                    token: token,
                    name: userCheck.username,
                    id: userCheck._id,
                });
            }
            else {
                res.status(403).json({
                    error: "Password Incorrect",
                });
            }
        }
    }
    catch (error) {
        res.status(500).json({
            error: "Something went Wrong",
        });
    }
}));
exports.routes.get("/share", user_1.userStatus, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const userShareCards = yield database_1.ShareCard.find({ userId });
    res.status(200).json({
        data: userShareCards,
    });
}));
