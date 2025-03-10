import mongoose, { Schema, Document, Types } from "mongoose";

interface IReply {
    postId: Types.ObjectId; // Reference to Post
    user: Types.ObjectId; // Reference to User
    content: string;
    time: Date;
}

interface IPost extends Document {
    user: Types.ObjectId; // Reference to User
    content: string;
    time: Date;
    likeCount: number;
    dislikeCount: number;
    replies: IReply[];
}

const replySchema = new Schema<IReply>({
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },  // Reference to Post
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },  // Reference to User
    content: { type: String, required: true },
    time: { type: Date, required: true },
});

const postSchema = new Schema<IPost>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference User model
    content: { type: String, required: true },
    time: { type: Date, required: true },
    likeCount: { type: Number, default: 0 },
    dislikeCount: { type: Number, default: 0 },
    replies: { type: [replySchema], default: [] }, 
});

const Post = mongoose.model<IPost>("Post", postSchema);
const Reply = mongoose.model<IReply>("Reply", replySchema);

export { Post, Reply };
