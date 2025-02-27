// File: stresstoneApp/backend/src/utils/gridfs.ts
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

// This function returns a GridFS bucket instance
export const getGridFSBucket = (): GridFSBucket => {
  const db = mongoose.connection.db;
  return new GridFSBucket(db, { bucketName: 'audio' });
};