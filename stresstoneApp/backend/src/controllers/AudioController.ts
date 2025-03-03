// File: stresstoneApp/backend/src/controllers/AudioController.ts
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ObjectId } from 'bson'; // Use bson directly for consistent typing

// Controller for streaming audio files
export const streamAudio = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!mongoose.connection.db) {
      res.status(500).json({ error: 'Database connection not established' });
      return;
    }
    
    const fileId = new ObjectId(req.params.fileId);
    
    // Use type assertion to resolve MongoDB/Mongoose type conflicts
    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'audio' });
    
    // Use type assertion for the query
    const files = await bucket.find({ _id: fileId as any }).toArray();
    
    if (!files || files.length === 0) {
      res.status(404).json({ error: 'Audio file not found' });
      return;
    }
    
    res.set('Content-Type', files[0].contentType);
    const downloadStream = bucket.openDownloadStream(fileId as any);
    downloadStream.pipe(res);
  } catch (error) {
    console.error('Error streaming audio:', error);
    res.status(500).json({ error: 'Failed to stream audio file' });
  }
};

// Controller for streaming image files
export const streamImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!mongoose.connection.db) {
      res.status(500).json({ error: 'Database connection not established' });
      return;
    }
    
    const fileId = new ObjectId(req.params.fileId);
    
    // Use type assertion to resolve MongoDB/Mongoose type conflicts
    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'images' });
    
    // Use type assertion for the query
    const files = await bucket.find({ _id: fileId as any }).toArray();
    
    if (!files || files.length === 0) {
      res.status(404).json({ error: 'Image file not found' });
      return;
    }
    
    res.set('Content-Type', files[0].contentType);
    const downloadStream = bucket.openDownloadStream(fileId as any);
    downloadStream.pipe(res);
  } catch (error) {
    console.error('Error streaming image:', error);
    res.status(500).json({ error: 'Failed to stream image file' });
  }
};