import express from "express";
import mongoose from "mongoose";
import { addTagsToUser } from "./controllers/tagController";
import { recommendContent } from "./controllers/recController";

const app = express();

app.use(express.json());

// For now, this is connecting to MongoDB localhost. Replace later!
mongoose.connect("mongodb://localhost:27017/test_database");

// just to quickly test functions out. this isn't the actual server we are using, this is
// to use a local MongoDB database.
app.post("/user/:username/content/:title", addTagsToUser);
app.post("/user/:username/recommendations", recommendContent);

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
})