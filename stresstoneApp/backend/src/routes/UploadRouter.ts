import express from "express";
import multer, { StorageEngine } from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { UploadController } from "../controllers/UploadController";
import { ObjectId } from "mongodb";

dotenv.config();

const uploadRouter = express.Router();
const MONGO_URI = process.env.MONGO_URI as string;

// Multer GridFS Storage 
const storage = new GridFsStorage({
    url: MONGO_URI,
    file: (req, file) => {
        console.log(`✅ Storing file: ${file.originalname} in bucket: ${file.fieldname}`);
        return {
            filename: `${Date.now()}-${file.originalname}`,
            bucketName: file.fieldname === "audioFile" ? "audio" : "images", // use different collections
        };
    },
}) as unknown as StorageEngine;
  

const upload = multer({ storage });
// const upload = multer({ dest: "uploads/" });

// Upload an Audio File
uploadRouter.post('/', upload.fields([
    { name: "audioFile", maxCount: 1 },
    { name: "imageFile", maxCount: 1 }, // optional imageFile
]), UploadController);

export default uploadRouter;
