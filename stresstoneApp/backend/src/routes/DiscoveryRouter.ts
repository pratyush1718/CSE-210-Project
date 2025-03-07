import express from "express";
import { recommendContent } from "../controllers/recController";

const discoveryRouter = express.Router();

discoveryRouter.post("/user/:username/recommendations", recommendContent);

export default discoveryRouter;