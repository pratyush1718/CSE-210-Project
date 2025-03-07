import express from "express";
import { addTagsToUser } from "../controllers/tagController";

const tagRouter = express.Router();

tagRouter.post("/userTag/content", addTagsToUser);

export default tagRouter;