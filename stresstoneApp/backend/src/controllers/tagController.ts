import { Request, Response } from "express";
import User from "../models/User";
import Content from "../models/Content";

export const addTagsToUser = async(req: Request, res: Response) => {
    const { username, title } = req.params;
    
    try {
        const content = await Content.findOne({title: title});
        if (!content) {
            res.status(404).send("Content not found.");
            return;
        }
        const user = await User.findOne({username : username});
        if (!user) {
            res.status(404).send("User not found.");
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
        await user.save();
    }
    catch(error) {
        console.error(error);
    }
    
};
