import { Router, Request, Response } from "express";
import { z } from "zod";

import jwt from "jsonwebtoken";

import { Users } from "../database";

export const routes = Router();

const userSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Name should be at least 3 character" }),
  password: z
    .string()
    .min(6, { message: "Password mhust be at least 6 character" }),
});

//singup Route
routes.post("/signup", async (req: Request, res: Response) => {
  try {
    const result = userSchema.parse(req.body);

    await Users.create({
      username: result.username,
      password: result.password,
    });
    res.json({
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      error: error,
    });
  }
});

//login Route
routes.get("/login", async (req: Request, res: Response) => {
  try {
    const loginData = userSchema.parse(req.body);
    const userCheck = await Users.findOne({ username: loginData.username });

    if (userCheck) {
      const passwordCheck =
        loginData.password == userCheck.password
          ? true
          : res.status(403).json({
              error: "Password Incorrect",
            });

      if (loginData.password == userCheck.password) {
        const token = jwt.sign(loginData.username, "ahiahadojhajokhdlh");
        res.send({
          token: token,
        });
      } else {
        res.status(403).json({
          error: "Password Incorrect",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      error: "Something went Wrong",
    });
  }
});
