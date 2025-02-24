import express from "express";
import mongoose from "mongoose";
import { addTagsToUser } from "./controllers/tagController";

const app = express();

app.use(express.json());

// For now, this is connecting to MongoDB localhost. Replace later!
mongoose.connect("mongodb://localhost:27017/test_database");

app.post("/user/:username/content/:title", addTagsToUser);

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
})