// File: stresstoneApp/backend/src/utils/gridfs.ts
import mongoose from 'mongoose';
import { GridFSBucket, Db } from 'mongodb';

// This function returns a GridFS bucket instance with a configurable bucket name
export const getGridFSBucket = (bucketName = 'audio'): GridFSBucket => {
  if (!mongoose.connection.db) {
    throw new Error('Database connection not established');
  }
  // Use more specific type assertion
  const db = mongoose.connection.db as unknown as Db;
  return new GridFSBucket(db, { bucketName });
};