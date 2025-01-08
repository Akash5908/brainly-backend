import express, { Request, Response } from "express";

import mongoose from "mongoose";

import { routes as userRoutes } from "./routes/users";
import { routes as contentRoutes } from "./routes/content";
import cors from "cors";

require("dotenv").config();

try {
  (async () => {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("Connected to the database");
  })();
} catch (error) {
  console.log("Problem in connecting the database");
}
nte;
const app = express();

app.use(express.json());
app.use(cors());
// user api
app.use("/user", userRoutes);

// content api
app.use("/content", contentRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Main Root");
});

app.listen(3001, () => {
  console.log("Connected to backend");
});
