// File: stresstoneApp/backend/src/models/Like.ts
import mongoose, { Schema, Document } from 'mongoose';

interface ILike extends Document {
  firebaseId: string; // Use Firebase ID instead of MongoDB ObjectId
  soundtrackId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const likeSchema: Schema<ILike> = new Schema({
  firebaseId: { type: String, required: true },
  soundtrackId: { type: Schema.Types.ObjectId, ref: 'SoundTrack', required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create compound index for uniqueness and efficient queries
likeSchema.index({ firebaseId: 1, soundtrackId: 1 }, { unique: true });

const Like = mongoose.model<ILike>('Like', likeSchema);

export default Like;