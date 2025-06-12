import express from "express";
import { createShortUrl, redirectToOriginal, getAllUrls, deleteUrl } from "../controllers/urlController";

const router = express.Router();

router.post("/shorten", createShortUrl);
router.get("/shorten", getAllUrls);
router.delete("/shorten/:id", deleteUrl);
router.get("/:shortId", redirectToOriginal);

export default router;