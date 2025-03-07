import mongoose, {Schema, Document} from "mongoose"

interface IUser extends Document {
    _id: string;
    username: string;
    tags: { tag: string, count: number }[];
}

const tagSchema = new Schema({
    tag: { type: String, required: true },
    count: { type: Number, default: 1 },
});

const userSchema: Schema<IUser> = new Schema({
    username: {type: String, required: true},
    tags: {type: [tagSchema], default: []},
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;