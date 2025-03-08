// File: stresstoneApp/backend/src/models/Like.ts
import { Schema, model } from 'mongoose';

const LikeSchema = new Schema({
  // References
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  soundtrackId: { type: Schema.Types.ObjectId, ref: 'SoundTrack', required: true },
  
  // Metadata
  createdAt: { type: Date, default: Date.now }
});

// Create a compound index for uniqueness and efficient queries
LikeSchema.index({ userId: 1, soundtrackId: 1 }, { unique: true });

export default model('Like', LikeSchema, 'Likes');