// File: stresstoneApp/backend/src/routes/AudioRouter.ts
import { Router } from 'express';
import { streamAudio, streamImage } from '../controllers/AudioController';

const audioRouter = Router();

// Stream audio file by ID
audioRouter.get('/stream/:fileId', streamAudio);

// Stream image file by ID
audioRouter.get('/image/:fileId', streamImage);

export default audioRouter;