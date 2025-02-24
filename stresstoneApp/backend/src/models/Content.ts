import mongoose, {Schema, Document} from "mongoose";

interface IContent extends Document {
    title: string;
    tags: string[];
}

const contentSchema: Schema<IContent> = new Schema({
    title: {type: String, required: true},
    tags: {type:[String], required: true},
});

const Content = mongoose.model<IContent>("Content", contentSchema);

export default Content;
