import { Request, Response } from "express";
import User from "../models/User";
import SoundTrack from "../models/SoundTrack";
import { Console } from "console";
 
export const recommendContent = async(req: Request, res: Response) : Promise<void> => {
    console.log(req.body);
    const {firebaseId} = req.body;

    console.log("I am in recommendContent ");

    console.log(firebaseId);

    try {
        const user = await User.findOne({ firebaseId });
        if (!user) {
            res.status(404).json({message: "User does not exist."});
            return;
        }

        const contents = await SoundTrack.find();

        console.log(contents);
        console.log(user);

        const scoredContent = contents.map((content) => {
            // uses cosine similarity
            let score = 0;

            let dotproduct = 0;
            let magVectorA = 0;
            let magVectorB = 0;

            // I made a mistake in my initial design.
            // User's definition of tags is an array of objects of Type Tag while Content's definition of tags is a string array.
            
            // This is a workaround for now, but this problem needs refactoring of code.
            const userTagsAsStr = user.tags.map(obj => obj.tag);

            // Make a new string Set by combining unique strings in userTagsAsStr and content.tags
            const allTags = [...new Set([...userTagsAsStr, ...content.tags])];
            
            // Create vectors from this enlargened set by frequency. Result is a Vector where we have 0 in a field
            // if tag in corresponding list doesn't exist.
            const vectorA = allTags.map(tag => userTagsAsStr.filter(item => item === tag).length);
            const vectorB = allTags.map(tag => content.tags.filter(item => item === tag).length);

            // Accumulate in acc, val is the iterator and i is the index.
            // Iterate over Vector A and multiply by the matching index in B then add to acc.
            // Result is dot product.
            dotproduct = vectorA.reduce((acc, val, i) => acc + (val * vectorB[i]), 0);
            // Accumulate in acc, val is the iterator.
            // Square each val. Do the same thing for Vector A and B.
            magVectorA = Math.sqrt(vectorA.reduce((acc, val) => acc + val * val, 0));
            magVectorB = Math.sqrt(vectorB.reduce((acc, val) => acc + val * val, 0));

            // Check and account for divide by 0 error.
            if (magVectorA != 0 && magVectorB != 0) {
                score = dotproduct / (magVectorA * magVectorB);
            }

            // Simple log to show cosine similarity result.
            console.log("Content: " + content.title + " Score: " + score + "\n");

            return { content, score };
        });

        // Sort in descending order.
        scoredContent.sort((a, b) => b.score - a.score);

        // Slice top 10 results.
        const top10results = scoredContent.slice(0,10).map((item) => item.content);

        console.log(top10results);

        // Respond with top 10 results.
        //res.status(200).json({message: 'buttpoop'});
        res.status(200).json({recommendations: top10results});
        return;
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({message: "An error ocurred", error});
        return;
    }
};