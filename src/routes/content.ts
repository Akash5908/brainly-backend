import { Router, Request, Response } from "express";

import { Contents } from "../database";

export const routes = Router();

// Create the Content
routes.post("/", async (req: Request, res: Response) => {
  const { type, link, title, tags, userId } = req.body;

  try {
    await Contents.create({
      type,
      link,
      title,
      tags,
      userId,
    });
    res.status(200).json({
      message: "Your Content is Created",
    });
  } catch (error) {
    res.status(403).json({
      error: error,
    });
  }
});

// Get the Content

routes.get("/", async (req: Request, res: Response) => {
  const { userId } = req.body;
  try {
    const contentCheck = await Contents.find({ userId });
    if (contentCheck) {
      res.status(200).json({
        content: contentCheck,
      });
    } else {
      res.status(403).json({
        message: "User do not have any Content to see",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
});

// Delete the Content

routes.delete("/", async (req: Request, res: Response) => {
  const { contentId } = req.body;
  try {
    const contentCheck = await Contents.find({ contentId });
    if (contentCheck) {
      await Contents.deleteOne({ _id: contentId });
      res.status(200).json({
        message: "Content Deleted",
      });
    } else {
      res.status(403).json({
        message: "Trying to delete a doc you don’t own",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
});
