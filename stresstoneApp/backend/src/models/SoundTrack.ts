// src/models/SoundTrack.ts
import { Schema, model } from 'mongoose';

const SoundTrackSchema = new Schema({
  title: { type: String, required: true, text: true }, // use text index
  description: { type: String, text: true },
  tags: [{ type: String, text: true }],
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  audioUrl: { type: String, required: true },
  likes: { type: Number, default: 0 }, // <-- add likes
  createdAt: { type: Date, default: Date.now },
});

// create text index for title, description, and tags
SoundTrackSchema.index(
  {
    title: 'text',
    description: 'text',
    tags: 'text',
  },
  {
    weights: {
      // set weights for each field
      title: 3,
      tags: 2,
      description: 1,
    },
    name: 'soundtrack_text_search',
  },
);

// This model serves as the primary interface for
// interacting with soundtrack documents in the database,
// allowing for operations such as creating, reading, updating, and deleting records.
export default model('SoundTrack', SoundTrackSchema);
