import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import searchRouter from './routes/SearchRouter';
import mongoose from 'mongoose';
import UploadRouter from './routes/UploadRouter';
import audioRouter from './routes/AudioRouter';
import tagRouter from './routes/TagRouter';
import discoveryRouter from './routes/DiscoveryRouter';

dotenv.config();
const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI as string;

// Uncomment below once MongoDB is set up
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

// Mount search routes under /search
app.use('/api/search', searchRouter);

// Mount upload routes under /upload
app.use("/api/upload", UploadRouter);

// Mount audio routes
app.use('/api/audio', audioRouter);

// Mount discovery routes
app.use('/api/discovery', discoveryRouter);

// Mount tag routes
app.use('/api/tagRouter', tagRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
