import { Router } from "express";
import { createPost, deletePost, likePost, dislikePost, unlikePost, undislikePost, getAllPosts } from "../controllers/PostController";

// Create the router
const postRouter = Router();

// Define routes with proper handler function signatures
postRouter.post("/", createPost);
postRouter.delete("/:id", deletePost);
postRouter.put("/like/:id", likePost);
postRouter.put("/unlike/:id", unlikePost);
postRouter.put("/dislike/:id", dislikePost);
postRouter.put("/undislike/:id", undislikePost);
postRouter.get("/", getAllPosts);

export default postRouter;