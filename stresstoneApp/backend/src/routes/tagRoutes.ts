import express from "express";
import { addTagsToUser } from "../controllers/tagController";
import { recommendContent } from "../controllers/recController";

const router = express.Router();

// Look into editing this later; what if two titles are the same?
router.post("/user/:username/content/:title", addTagsToUser);
router.post("/user/:username/recommendations", recommendContent);

export default router;