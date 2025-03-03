// File: stresstoneApp/backend/src/utils/gridfs.ts
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

// This function returns a GridFS bucket instance with a configurable bucket name
export const getGridFSBucket = (bucketName: string = 'audio'): GridFSBucket => {
  const db = mongoose.connection.db;
  return new GridFSBucket(db as any, { bucketName });
};