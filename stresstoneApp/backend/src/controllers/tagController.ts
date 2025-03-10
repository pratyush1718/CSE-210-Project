import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/User";
import SoundTrack from "../models/SoundTrack";
import Like from "../models/Like";
 
export const addTagsToUser = async(req: Request, res: Response) => {
    const { firebaseId, trackId } = req.body;

    //console.log(firebaseId);
    //console.log(trackId);

    try {
        const content = await SoundTrack.findOne({_id: trackId});

        const existingLike = await Like.findOne({
            firebaseId,
            soundtrackId: new mongoose.Types.ObjectId(trackId)
        });

        // since this script is directly running after the like func
        // if a like doesn't exist, it was literally just unliked

        // if a like does exist, it was literally just liked
        
        //console.log(existingLike);

        if (!content) {
            res.status(404).send("Content not found.");
            return;
        }

        const user = await User.findOne({firebaseId : firebaseId});


        if (!user) {
            res.status(404).send("User not found.");
            return;
        }

        if (!existingLike) {
            // this was literally just unliked
            content.tags.forEach((tag: string) => {
                const tagExists = user.tags.find((userTag) => userTag.tag === tag);
                if (tagExists) {
                    tagExists.count -= 1;
                }
            });
            user.tags = user.tags.filter(tag => tag.count > 0);
            console.log(user);
            await user.save();
            res.status(200).send("User unliked song. Tags updated successfully.");
            return;
        }

        content.tags.forEach((tag: string) => {
            const tagExists = user.tags.find((userTag) => userTag.tag === tag);
            if (tagExists) {
                tagExists.count += 1;
            }
            else {
                user.tags.push({tag, count: 1});
            }
        });

        console.log(user);
        await user.save();
        res.status(200).send("User tags pushed successfully.");
        return;
    }
    catch(error) {
        console.error(error);
    }
    
};
