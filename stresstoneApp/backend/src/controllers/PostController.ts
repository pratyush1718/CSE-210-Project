import { Request, Response } from "express";
import { Post, Reply } from "../models/Post"; 

// Create a new post
export const createPost = async (req: Request, res: Response) => {
    try {
        const { user, content } = req.body;
        const newPost = new Post({
            user,
            content,
            time: new Date(),
            likeCount: 0,
            dislikeCount: 0,
            replies: [],
        });
        
        await newPost.save();
        res.status(201).json({ message: "Post created successfully", post: newPost });
    } catch (error) {
        res.status(500).json({ message: "Error creating post", error });
    }
};

// Delete a post
export const deletePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const postId = req.params.id;

        const post = await Post.findById(postId);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return; 
        }

        // Delete all replies related to this post
        await Reply.deleteMany({ postId: post._id });

        // Delete the post itself
        await Post.deleteOne({ _id: postId }); 
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: "Error deleting post", error: error.toString() });
    }
};

// Get all posts
export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        // Retrieve all posts from the database
        const posts = await Post.find()
            .populate('user')
            .populate({
                path: 'replies',
                populate: {
                path: 'user',
                model: 'User' // Make sure this matches your User model name
                }
            });

        // Check if there are no posts
        if (posts.length === 0) {
            res.status(404).json({ message: "No posts found" });
            return; 
        }

        // Return the posts
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving posts", error });
    }
};

export const likePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const postId = req.params.id; 
        const post = await Post.findById(postId); 
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return; 
        }

        post.likeCount ++; 
        await post.save(); 
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json({ message: "Error liking post", error })
    }
}

export const dislikePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const postId = req.params.id; 
        const post = await Post.findById(postId); 
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return; 
        }

        post.dislikeCount ++; 
        await post.save(); 
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json({ message: "Error disliking post", error })
    }
}

export const unlikePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const postId = req.params.id; 
        const post = await Post.findById(postId); 
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return; 
        }

        post.likeCount --; 
        await post.save(); 
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json({ message: "Error unliking post", error })
    }
}

export const undislikePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const postId = req.params.id; 
        const post = await Post.findById(postId); 
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return; 
        }

        post.dislikeCount --; 
        await post.save(); 
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json({ message: "Error undisliking post", error })
    }
}