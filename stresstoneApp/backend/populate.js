import mongoose from "mongoose";
import { Post, Reply } from "./src/models/Post.ts"; 
import dotenv from "dotenv";
dotenv.config();

// Sample userIds (Replace these with actual user ObjectIds)
const userIds = [
    new mongoose.Types.ObjectId('67cccbab7238b219192864da'), // Kyrian
    new mongoose.Types.ObjectId('67ce2b13a18df3b9726c56a5'), // Brian
    new mongoose.Types.ObjectId('67ccccaa7238b219192864dd'), // Bella
    new mongoose.Types.ObjectId('67ccccc17238b219192864e0'), // Angie
];

const postIds = [
    new mongoose.Types.ObjectId('67ce4335491c3ffbcf138f62'), // loving this new track by @bella
    new mongoose.Types.ObjectId('67ce4335491c3ffbcf138f63'), // what should i make for my next track  
    new mongoose.Types.ObjectId('67ce4335491c3ffbcf138f64'), // hey guys, new track is out
    new mongoose.Types.ObjectId('67ce4335491c3ffbcf138f65'), // been looking for some new tracks
]

// Connect to MongoDB and create posts
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true, // Can be removed as it's deprecated in MongoDB 4.x+
})
    .then(async () => {
        console.log("Connected to MongoDB");

        // Now that the connection is established, create posts
        // await createPosts(userIds);
        // console.log("Posts created successfully");

        await createReplies(postIds);
        console.log("Replies created successfully");
        // Disconnect after all operations are done
        mongoose.disconnect();
    })
    .catch((error) => {
        console.error("Error occurred:", error);
    });

// Function to create posts linked to the user ObjectIds
async function createPosts(userIds) {
    const postData = [
        { 
            user: userIds[0], // Kyrian
            content: "Loving this new track by @Bella! It's so chill! Have you guys heard it yet?", 
            time: new Date('2025-02-15'), 
            likeCount: 5, 
            dislikeCount: 1, 
        },
        { 
            user: userIds[1], // Brian
            content: "What should I make for my next track? Trying to decide between Christmas and fall vibes.", 
            time: new Date('2025-02-14'), 
            likeCount: 3, 
            dislikeCount: 2, 
        },
        { 
            user: userIds[2], // Bella
            content: "Hey guys, new track is out! Make sure to check it out!", 
            time: new Date('2025-02-12'), 
            likeCount: 3, 
            dislikeCount: 0,
        },
        { 
            user: userIds[3], // Angie
            content: "Been looking for some new tracks to decompress after work. Any recs?", 
            time: new Date('2025-02-10'), 
            likeCount: 2,
            dislikeCount: 0, 
        },
    ];

    const postPromises = postData.map(async (post) => {
        const createdPost = await Post.create(post);
        console.log(`Created Post: ${createdPost._id}`);
        return createdPost;
    });

    return Promise.all(postPromises);
}

async function createReplies(postIds) {
    const replyData = [
        { 
            postId: postIds[0], // Kyrian's post
            user: userIds[2], // Bella
            content: "Thanks so much! I'm glad you like it!", 
            time: new Date('2025-02-15'),
        }, 
        {
            postId: postIds[0], // Kyrian's post
            user: userIds[0], // Kyrian
            content: "Of course! Keep up the great work!",
            time: new Date('2025-02-16'),
        }, 
        {
            postId: postIds[1], // Brian's post
            user: userIds[3], // Angie
            content: "I think a Christmas track would be really fun!",
            time: new Date('2025-02-15'),
        }, 
        {
            postId: postIds[3], // Angie's post
            user: new mongoose.Types.ObjectId('67ce2a509fde896428fc7eb8'), // Vanessa
            content: "Ohh, I've been cooking something up. Just you wait!",
            time: new Date('2025-02-11'),
        }, 
        {
            postId: postIds[3], // Angie's post
            user: new mongoose.Types.ObjectId('67ce2b13a18df3b9726c56a4'), // Simon
            content: "Try out the Tone Creator! I've been making so many great sounds, I'll never run out things to listen to!",
            time: new Date('2025-02-12'),
        }, 
        {
            postId: postIds[3], // Angie's post
            user: userIds[0], // Kyrian
            content: "I've been listening to @Bella's new track on repeat! It's so calming.", 
            time: new Date('2025-02-13'),
        }
    ]

    // const replyPromises = replyData.map(async (reply) => {
    //     const createdReply = await Post.create(reply);
    //     console.log(`Created Reply: ${createdReply._id}`);
    //     return createdReply;
    // });

    const replyPromises = replyData.map(async (reply) => {
        // Create the reply document
        const createdReply = await Reply.create(reply);
        console.log(`Created Reply: ${createdReply._id}`);

        // After creating the reply, update the post's replies array with the new reply ID
        await Post.findByIdAndUpdate(
            reply.postId, // The post we're updating
            { $push: { replies: createdReply._id } }, // Add the reply ID to the replies array
            { new: true } // Return the updated post document
        );

        return createdReply;
    });

    return Promise.all(replyPromises);
}