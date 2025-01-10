import { Router, Request, Response } from "express";

import { Contents } from "../database";
import jwt from "jsonwebtoken";

import { CardLink } from "../database";
import { userStatus } from "../middleware/user";

export const routes = Router();

// Create the Content
routes.post("/", userStatus, async (req: Request, res: Response) => {
  console.log("REQUEST BODY ADD CONTENT", req.body);
  const { type, link, title, describtion, tags } = req.body.Carddata;
  const { userId } = req.body;
  try {
    await Contents.create({
      type,
      link,
      title,
      describtion,
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

routes.get("/", userStatus, async (req: Request, res: Response) => {
  const userId = req.query.id as string;

  try {
    const contentCheck = await Contents.find({ userId });

    if (contentCheck.length > 0) {
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

routes.delete("/", userStatus, async (req: Request, res: Response) => {
  const id = req.body.id;
  console.log("Id insde the delete", id);
  try {
    const contentCheck = await Contents.find({ id });
    if (contentCheck) {
      await Contents.deleteOne({ _id: id });
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

//Share Link

function generateToken(id: string) {
  const token = jwt.sign({ id }, "Secret", { expiresIn: "1h" });
  return token;
}
//Adding the token of the shared Card and send the url for the share
routes.get("/share", async (req: Request, res: Response) => {
  const cardToken = await generateToken(req.body.id);

  const sharedLink = `http://localhost:3000/content/share/${cardToken}`;

  await CardLink.create({
    token: cardToken,
    userId: req.body.userId,
  });

  res.status(200).json({
    message: sharedLink,
  });
});

// Get the card info by the shared Link
routes.get("/share/:id", userStatus, async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const contentId = jwt.verify(id, "Secret");
    if (contentId) {
      const Content = await Contents.findById({ _id: contentId });

      if (Content) {
        res.status(200).json({
          content: Content,
        });
      } else {
        res.status(403).json({
          message: `Content not found`,
        });
      }
    } else {
      res.status(403).json({
        message: `Invalid Link`,
      });
    }
  } catch (error) {
    res.status(500).json({
      messae: "Somthing went wrong",
      error: error,
    });
  }
});
