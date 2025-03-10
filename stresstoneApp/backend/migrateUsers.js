// const admin = require("firebase-admin");
// const mongoose = require("mongoose");
// require("dotenv").config();
import admin from "firebase-admin";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import User from "./src/models/User.ts";

import { readFile } from "fs/promises";

// const serviceAccount = JSON.parse(
//     await readFile(new URL("./firebaseServiceAccountKey.json", import.meta.url))
// );

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
// });

// // 🔹 Initialize Firebase Admin SDK
// // admin.initializeApp({
// //     credential: admin.credential.cert(require("./firebaseServiceAccountKey.json")),
// // });

// const auth = admin.auth();

// 🔹 Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// // 🔹 Define MongoDB Schema
// // const userSchema = new mongoose.Schema({
// //     uid: { type: String, unique: true },
// //     email: String,
// //     displayName: String,
// //     phoneNumber: String,
// //     photoURL: String,
// //     emailVerified: Boolean,
// //     createdAt: Date,
// //     lastLoginAt: Date,  // Example of an additional field
// //     newField: String,   // Example: Adding a new field
// // });

// // const User = mongoose.model("User", userSchema);

// // 🔹 Fetch Users from Firebase (Recursively if needed)
// async function fetchFirebaseUsers(nextPageToken) {
//     let users = [];
//     try {
//         const result = await auth.listUsers(1000, nextPageToken);
//         users = result.users;

//         if (result.pageToken) {
//             users = users.concat(await fetchFirebaseUsers(result.pageToken)); // Recursively fetch next batch
//         }
//     } catch (error) {
//         console.error("❌ Error fetching users from Firebase:", error);
//     }
//     return users;
// }

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

// 🔹 Migrate Users to MongoDB
async function migrateUsersToMongoDB() {
    // const firebaseUsers = await fetchFirebaseUsers();
    const firebaseUsers = [
        {
            uid: "vwhMnwTm8ZgAcGYKwLhPedDdaXp1",
            email: "kyrian@kyrian.com"
        }, 
        {
            uid: "jYDrDITPzPT0UnYvPOlA7fQjERr1",
            email: "bella@bella.com"
        }, 
        {
            uid: "SjWgsH8zrudLNg452NoaDvAzjzp1",
            email: "angie@angie.com"
        }, 
        {
            uid: "zg5KqqoGQzak6UQSLEFkFSJaq1B2", 
            email: "simon@simon.com"
        }, 
        {
            uid: "8Np2mUGXFvTs4uxI2sVgprnJ0Oo2",
            email: "brian@brian.com" , 
        }
    ]

    for (const user of firebaseUsers) {
        const updateData = {
            firebaseId: user.uid,
            email: user.email,
            username: capitalize(user.email.split('@')[0]) // new field. extract username from email
        };

        try {
            await User.updateOne(
                { firebaseId: user.uid },  // Find user by UID
                { $set: updateData },  // Update fields
                // { $setOnInsert: { username: capitalize(user.email.split('@')[0]) } },  // Insert createdAt if not exists
                { upsert: true }  // Create new if not exists
            );
            console.log(`✅ Updated user: ${user.uid}`);
        } catch (error) {
            console.error(`❌ Error updating user ${user.uid}:`, error);
        }
    }

    console.log("🚀 User migration completed.");
    mongoose.disconnect();
}

// Run the migration
migrateUsersToMongoDB();
