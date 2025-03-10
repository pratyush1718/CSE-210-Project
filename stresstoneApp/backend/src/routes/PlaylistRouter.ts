import { Router } from 'express';
import { PlaylistController } from '../controllers/PlaylistController';

const PlaylistRouter = Router();
 
PlaylistRouter.post('/liked', PlaylistController); // add router

export default PlaylistRouter;