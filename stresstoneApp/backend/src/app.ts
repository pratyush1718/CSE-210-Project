import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();
const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI as string;

app.use(cors({ origin: "http://localhost:5173" }));

// mongoose
//   .connect(MONGO_URI)
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.log(err));

app.get("/", (req: Request, res: Response) => {
res.send("Express + TypeScript Server");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
  });
