import express from "express";
import { addTagsToUser } from "../controllers/tagController";

const router = express.Router();

// Look into editing this later; what if two titles are the same?
router.post("/user/:username/content/:title", addTagsToUser);

export default router;