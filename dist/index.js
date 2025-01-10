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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const users_1 = require("./routes/users");
const content_1 = require("./routes/content");
const cors_1 = __importDefault(require("cors"));
require("dotenv").config();
try {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log("Connected to the database");
    }))();
}
catch (error) {
    console.log("Problem in connecting the database");
}
const app = (0, express_1.default)();
const corsOptions = {
    origin: "http://localhost:3000",
    oriinSuccessStatus: 200,
};
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOptions));
// user api
app.use("/user", users_1.routes);
// content api
app.use("/content", content_1.routes);
app.get("/", (req, res) => {
    res.send("Main Root");
});
app.listen(3001, () => {
    console.log("Connected to backend");
});
