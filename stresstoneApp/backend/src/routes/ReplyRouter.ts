import { Router } from "express";
import { createReply, deleteReply } from "../controllers/ReplyController";

const replyRouter: Router = Router();

replyRouter.post("/", createReply);  // Route to create a reply
replyRouter.delete("/:id", deleteReply); // Route to delete a reply

export default replyRouter;
