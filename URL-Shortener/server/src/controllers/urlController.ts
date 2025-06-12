import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { Url } from "../models/urlModel";
import { env_vars } from "../config/envVars";

export const createShortUrl = async (req: Request, res: Response) => {
  const { originalUrl } = req.body;
  const shortId = nanoid(7);

  try {
    const newUrl = await Url.create({ shortId, originalUrl });
    res.json({ shortUrl: `${env_vars.BASE_URL}/api/${shortId}` });
  } catch (error) {
    res.status(500).json({ error: "Failed to shorten URL" });
  }
};

export const getAllUrls = async (_req: Request, res: Response) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 }); // optional: latest first
    res.json(urls);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch URLs" });
  }
};

export const deleteUrl = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deleted = await Url.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "URL not found" });
    }
    res.json({ message: "URL deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete URL" });
  }
};

export const redirectToOriginal = async (req: Request, res: Response) => {
  const { shortId } = req.params;

  try {
    const found = await Url.findOne({ shortId });
    if (found) {
      return res.redirect(found.originalUrl);
    }
    res.status(404).send("Short URL not found");
  } catch (error) {
    res.status(500).send("Server error");
  }
};