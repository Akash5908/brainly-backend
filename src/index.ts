import express, { Request, Response } from "express";

import mongoose from "mongoose";

import { routes as userRoutes } from "./routes/users";

require("dotenv").config();

try {
  (async () => {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("Connected to the database");
  })();
} catch (error) {
  console.log("Problem in connecting the database");
}
const app = express();

app.use(express.json());

app.use("/user", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Main Root");
});

app.listen(3000, () => {
  console.log("Connected to backend");
});
