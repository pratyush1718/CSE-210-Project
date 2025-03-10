import { Request, Response } from "express";
import { Post, Reply } from "../models/Post";
import User from '../models/User'

// Create a new reply
export const createReply = async (req: Request, res: Response) => {
    try {
        const { postId, userFirebaseId, content } = req.body;
        const user = await User.findOne({ firebaseId: userFirebaseId }); 
        if (!user) {
            res.status(400).json({ message: "User not found." });
            return; 
        }
        const post = await Post.findById(postId);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return; 
        }

        const newReply = new Reply({
            postId,
            user,
            content,
            time: new Date(),
        });

        await newReply.save();

        // Add reply ID to the post's replies array
        post.replies.push(newReply._id);
        await post.save();

        res.status(201).json({ message: "Reply created successfully", reply: newReply });
    } catch (error) {
        res.status(500).json({ message: "Error creating reply", error });
    }
};

// Delete a reply
export const deleteReply = async (req: Request, res: Response) => {
    try {
        const replyId = req.params.id;

        const reply = await Reply.findById(replyId);
        if (!reply) {
            res.status(404).json({ message: "Reply not found" });
            return; 
        }

        const post = await Post.findById(reply.postId);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return; 
        }

        // Remove reply ID from the post's replies array
        post.replies = post.replies.filter((id) => id.toString() !== replyId);
        await post.save();

        // Delete the reply itself
        await Reply.deleteOne({ _id: replyId }); 
        res.status(200).json({ message: "Reply deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting reply", error });
    }
};
