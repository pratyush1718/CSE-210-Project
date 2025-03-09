import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import SoundTrack from "../models/SoundTrack";
import { RequestHandler } from "express";

/**
 * Uploads a file to MongoDB GridFS
 */


interface GridFile extends Express.Multer.File {
    id: ObjectId;
    filename: string;
}

interface RequestBodyType {
    title: string;
    description: string;
    tags?: string[];
    visibility: "public" | "private";
    allowDownloads: boolean;
    location?: string;
    creator: string;
}

type UploadFilesType = {
    audioFile: GridFile[]; // Required
    imageFile?: GridFile[]; // Optional
};

export const UploadController: RequestHandler = async (req, res, next) => {
  try {
    const files = req.files as UploadFilesType;
    const audioFile = files.audioFile[0]; 
    const imageFile = files.imageFile?.[0] || null;

    const form = <RequestBodyType>req.body;
    
    // Parse tags if they're a JSON string
    let tags = form.tags;
    if (typeof form.tags === 'string') {
      try {
        tags = JSON.parse(form.tags);
      } catch (error) {
        tags = undefined;
      }
    }
    
    const { title, description, location, visibility, allowDownloads, creator } = form;

    const newSoundTrack = new SoundTrack({
        title,
        description,
        tags,  // Use the parsed tags
        creator: creator, // search only works with undefined creator for now, or existing creator
        audioFileId: audioFile.id,
        audioFileName: audioFile.filename,
        imageFileId: imageFile?.id || null, 
        imageFileName: imageFile?.filename || null, 
        visibility,
        allowDownloads,
        location: location,
    });

    await newSoundTrack.save();
// console.log('soundtrack uploaded: ', newSoundTrack);
    
    res.status(200).json({
      success: true,
      message: "File uploaded successfully!",
      soundTrackId: newSoundTrack._id,
      audioFileId: newSoundTrack.audioFileId,
      creator: newSoundTrack.creator, 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload file" });
  }
};
