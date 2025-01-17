import { Router, Request, Response } from "express";

import { Contents, Tags } from "../database";
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
    const tagsArray = await Tags.findOne({ _id: "6787a53ba1f9e1c2a8852438" });
    if (tagsArray === null) {
      console.log("creating");
      await Tags.create({ userId, title: tags });
    } else {
      console.log(tagsArray);
      let uniqueTags = [];
      const prevArray = tagsArray.title;
      {
        uniqueTags = tags.filter((tags: string) => !prevArray.includes(tags));
      }
      console.log(uniqueTags);
      prevArray.push(...uniqueTags); //modifing the value
      tagsArray.title = prevArray; // Assigning back the value
      await tagsArray.save();
    }

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

// Get all the tags
routes.get("/tags", async (req: Request, res: Response) => {
  const userId = "6787a53ba1f9e1c2a8852438";
  try {
    const contentCheck = await Tags.find({ _id: userId });

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

// Update the Content

routes.put("/", userStatus, async (req: Request, res: Response) => {
  const id = req.query.id;

  const { type, link, title, describtion, tags } = req.body.CardData;

  if (!type || !link || !title || !describtion || !tags) {
    res.status(400).json({ message: "Invalid payload" });
  }

  try {
    const updatedCard = await Contents.findByIdAndUpdate(
      id,
      { type, link, title, describtion, tags },
      { new: true }
    );

    if (!updatedCard) {
      res.status(404).json({ message: "Card not found" });
      return;
    }

    res.status(200).json(updatedCard);
  } catch (error) {
    res.status(500).json({ message: "Error updating the card", error });
  }
});

// Delete the Content

routes.delete("/", userStatus, async (req: Request, res: Response) => {
  const id = req.query.id;
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
  const id = req.query.id;
  if (!id) {
    res.status(400).json({
      message: "The id is not present",
    });
    return;
  } else {
    const cardToken = await generateToken(id as string);
    const checkCardToken = await CardLink.findOne({ token: cardToken });
    if (checkCardToken) {
      const sharedLink = `http://localhost:3000/content/share?token=${cardToken}`;
      res.status(200).json({
        url: sharedLink,
      });
    } else {
      const sharedLink = `http://localhost:3000/content/share?token=${cardToken}`;
      await CardLink.create({
        token: cardToken,
        userId: req.body.userId,
      });

      res.status(200).json({
        url: sharedLink,
      });
    }
  }
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
