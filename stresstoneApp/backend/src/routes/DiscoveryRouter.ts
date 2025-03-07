import express from "express";
import { recommendContent } from "../controllers/recController";

const discoveryRouter = express.Router();

discoveryRouter.post("/recommendations", recommendContent);
  
export default discoveryRouter;