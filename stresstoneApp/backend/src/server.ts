import express from "express";
import mongoose from "mongoose";
import { addTagsToUser } from "./controllers/tagController";
import { recommendContent } from "./controllers/recController";
import tagRouter from './routes/TagRouter';
import discoveryRouter from './routes/DiscoveryRouter';

const app = express();

app.use(express.json());

// For now, this is connecting to MongoDB localhost. Replace later!
mongoose.connect("mongodb://localhost:27017/test_database");

// just to quickly test functions out. this isn't the actual server we are using, this is
// to use a local MongoDB database.
app.use("/api/tagRouter", tagRouter);
app.use("/api/discovery", discoveryRouter);
       
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
})