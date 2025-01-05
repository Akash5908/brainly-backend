import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function userStatus(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];

  const token = authHeader?.split(" ")[1];
  if (token) {
    try {
      const verifyToken = jwt.verify(token, "ahiahadojhajokhdlh");
      if (verifyToken) {
        next();
      } else {
        res.status(401).json({
          error: "Not Authenticated!",
        });
      }
    } catch (error) {
      res.status(500).json({
        error: "Something went wrong",
      });
    }
  }
}
