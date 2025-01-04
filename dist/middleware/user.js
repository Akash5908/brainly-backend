"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userStatus = userStatus;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function userStatus(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
    if (token) {
        try {
            const verifyToken = jsonwebtoken_1.default.verify(token, "ahiahadojhajokhdlh");
            if (verifyToken) {
                next();
            }
            else {
                res.status(401).json({
                    error: "Not Authenticated!",
                });
            }
        }
        catch (error) {
            res.status(500).json({
                error: "Something went wrong",
            });
        }
    }
}
