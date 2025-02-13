import { Router } from 'express';
import { SearchTracks } from '../controllers/SearchController';

const router = Router();

router.get('/search', SearchTracks);

export default router;