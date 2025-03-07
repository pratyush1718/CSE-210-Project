import express from "express";
import { addTagsToUser } from "../controllers/tagController";

const tagRouter = express.Router();

tagRouter.post("/user/:username/content/:title", addTagsToUser);

export default tagRouter;