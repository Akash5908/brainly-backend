import { Router, Request, Response } from "express";

import { Contents, Tags, ShareCard } from "../database";

import jwt from "jsonwebtoken";

import { CardLink } from "../database";
import { userStatus } from "../middleware/user";

export const routes = Router();

// Create the Content
routes.post("/", userStatus, async (req: Request, res: Response) => {
  console.log("REQUEST BODY ADD CONTENT", req.body);
  const { type, link, title, describtion, tags } = req.body.Carddata;
  const createdDate = new Date().toISOString().split("T")[0];
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
      createdDate,
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
  const Cardtoken = jwt.sign(id, "Secret");
  return Cardtoken;
}
//Adding the Cardtoken of the shared Card and send the url for the share
routes.post("/share", userStatus, async (req: Request, res: Response) => {
  const { cardData } = req.body;
  console.log("🚀 ~ routes.post ~ cardData:", cardData);
  const cardId = cardData.id;
  if (!cardData) {
    res.status(400).json({
      message: "The id is not present",
    });
    return;
  } else {
    const cardToken = await generateToken(cardId as string);
    const { id, type, link, title, describtion, tags, userId } = cardData;
    const cardCheck = await ShareCard.findById(id);
    if (!cardCheck) {
      await ShareCard.create({
        id,
        type,
        link,
        title,
        describtion,
        tags,
        userId,
      });
    }
    const sharedLink = `http://localhost:3000/content/share?Cardtoken=${cardToken}`;

    res.status(200).json({
      url: sharedLink,
    });
  }
});

// Get the card info by the shared Link
routes.get("/share", async (req: Request, res: Response) => {
  const { Cardtoken } = req.query;

  if (Cardtoken) {
    try {
      const decodedToken = jwt.verify(Cardtoken as string, "Secret");
      const contentId =
        typeof decodedToken === "string"
          ? { id: decodedToken }
          : (decodedToken as { id: string });
      const cardId = contentId.id;
      if (cardId) {
        const Content = await Contents.findById({ _id: cardId });
        if (Content) {
          res.status(200).json({
            shareCardData: Content,
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
  } else {
    res.status(400).json({
      error: "Invalid Url",
    });
  }
});

routes.get("/search", userStatus, async (req: Request, res: Response) => {
  const { search, userId } = req.query;

  try {
    const searchCards = await Contents.find({
      userId,
      $or: [
        { title: { $regex: search, $options: "i" } },
        { describtion: { $regex: search, $options: "i" } },
        {
          tags: { $regex: search, $options: "i" },
        },
      ],
    });
    res.status(200).json({
      searchResult: searchCards,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error while searching the data",
    });
  }
});

routes.delete("/share", userStatus, async (req: Request, res: Response) => {
  const { id, userId } = req.body;
  try {
    await ShareCard.deleteOne({ _id: id, userId });
    res.status(200).json({
      message: "Card delete form Share Successfull",
    });
  } catch (error) {
    res.status(500).json({
      error: "Error in updating the Delete",
    });
  }
});
