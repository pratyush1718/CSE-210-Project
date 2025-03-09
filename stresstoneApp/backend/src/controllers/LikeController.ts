// File: stresstoneApp/backend/src/controllers/LikeController.ts
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Like from '../models/Like';
import SoundTrack from '../models/SoundTrack';

// First, define interfaces for type safety
interface SoundTrackObject {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  creator?: { name: string; _id: mongoose.Types.ObjectId };
  audioFileId: mongoose.Types.ObjectId;
  imageFileId?: mongoose.Types.ObjectId;
  createdAt: Date;
  likes: number;
  tags?: string[];
}

interface PopulatedSoundTrack extends mongoose.Document {
  title: string;
  description: string;
  creator: { name: string };
  audioFileId: mongoose.Types.ObjectId;
  imageFileId?: mongoose.Types.ObjectId;
  createdAt: Date;
  likes: number;
  toObject(): SoundTrackObject;
}

interface PopulatedLike extends mongoose.Document {
  firebaseId: string; // Changed from userId to firebaseId
  soundtrackId: PopulatedSoundTrack;
  createdAt: Date;
}

// Toggle like status (like or unlike)
export const toggleLike = async (req: Request, res: Response): Promise<void> => {
  try {
    const { soundtrackId } = req.params;
    const { firebaseId } = req.body; // Get firebaseId from request body
    
    if (!firebaseId) {
      res.status(400).json({ error: 'Firebase ID is required' });
      return;
    }
    
    if (!mongoose.Types.ObjectId.isValid(soundtrackId)) {
      res.status(400).json({ error: 'Valid soundtrack ID is required' });
      return;
    }

    // Check if like already exists using firebaseId
    const existingLike = await Like.findOne({
      firebaseId,
      soundtrackId: new mongoose.Types.ObjectId(soundtrackId)
    });

    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      if (existingLike) {
        // Unlike: remove the like document
        await Like.deleteOne({ _id: existingLike._id }).session(session);
        
        // Decrement like counter
        await SoundTrack.updateOne(
          { _id: new mongoose.Types.ObjectId(soundtrackId) },
          { $inc: { likes: -1 } }
        ).session(session);
        
        await session.commitTransaction();
        res.status(200).json({ liked: false, likes: await getUpdatedLikesCount(soundtrackId) });
      } else {
        // Like: create a new like document
        await Like.create([{
          firebaseId, // Use firebaseId instead of userId
          soundtrackId: new mongoose.Types.ObjectId(soundtrackId)
        }], { session });
        
        // Increment like counter
        await SoundTrack.updateOne(
          { _id: new mongoose.Types.ObjectId(soundtrackId) },
          { $inc: { likes: 1 } }
        ).session(session);
        
        await session.commitTransaction();
        res.status(200).json({ liked: true, likes: await getUpdatedLikesCount(soundtrackId) });
      }
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
};

// Check if user has liked a soundtrack
export const checkLikeStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { soundtrackId } = req.params;
    const firebaseId = req.query.firebaseId as string;
    
    if (!firebaseId) {
      res.status(400).json({ error: 'Firebase ID is required' });
      return;
    }
    
    const like = await Like.findOne({
      firebaseId,
      soundtrackId: new mongoose.Types.ObjectId(soundtrackId)
    });
    
    res.status(200).json({ 
      liked: !!like,
      likes: await getUpdatedLikesCount(soundtrackId)
    });
  } catch (error) {
    console.error('Error checking like status:', error);
    res.status(500).json({ error: 'Failed to check like status' });
  }
};

// Get all tracks liked by a user
export const getUserLikes = async (req: Request, res: Response): Promise<void> => {
  try {
    const firebaseId = req.params.firebaseId;
    
    if (!firebaseId) {
      res.status(400).json({ error: 'Firebase ID is required' });
      return;
    }
    
    const likes = await Like.find({ firebaseId })
      .populate({
        path: 'soundtrackId',
        select: 'title description creator audioFileId imageFileId createdAt likes',
        populate: { path: 'creator', select: 'name' }
      })
      .sort({ createdAt: -1 }) as unknown as PopulatedLike[];
    
    const likedTracks = likes.map(like => ({
      ...like.soundtrackId.toObject(),
      audioUrl: `/api/audio/stream/${like.soundtrackId.audioFileId}`
    }));
    
    res.status(200).json({ likedTracks });
  } catch (error) {
    console.error('Error retrieving user likes:', error);
    res.status(500).json({ error: 'Failed to retrieve user likes' });
  }
};

// Helper function to get updated likes count
async function getUpdatedLikesCount(soundtrackId: string): Promise<number> {
  const track = await SoundTrack.findById(new mongoose.Types.ObjectId(soundtrackId));
  return track?.likes || 0;
}