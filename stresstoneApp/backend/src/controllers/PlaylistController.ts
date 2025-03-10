import { Request, Response } from "express";
import Like from "../models/Like";
import User from "../models/User";
import { Console } from "console";
import SoundTrack from "../models/SoundTrack";
 
export const PlaylistController = async(req: Request, res: Response) : Promise<void> => {
    //console.log("REACHED PLAYLIST CONTROLLER"); 

    const {firebaseId} = req.body;
    const likedSongs = await Like.find({firebaseId : firebaseId});

    //console.log(likedSongs);
    console.log("REACHED PLAYLIST CONTROLLER");

    const results = [];

    for (let i = 0; i < likedSongs.length; i++) {
        const songId = likedSongs[i].soundtrackId;
        const song = await SoundTrack.findOne(songId);

        if (song) {
            /*
            results.push({
                title: song.title,
                description: song.description,
                tags: song.tags,
                creator: song.creator, 
                audioFileId: song.audioFileId,
                audioFileName: song.audioFileName,
                imageFileId: song.imageFileId,
                imageFileName: song.imageFileName,
                likes: song.likes,
                visibility: song.visibility,
                allowDownloads: song.allowDownloads,
                location: song.location,
                createdAt: song.createdAt,
            });*/
            results.push(song);
        }
    }

    console.log(results);
    res.status(200).json(results);
};