// File: stresstoneApp/backend/src/routes/LikeRouter.ts
import { Router } from 'express';
import { toggleLike, checkLikeStatus, getUserLikes } from '../controllers/LikeController';

const likeRouter = Router();

// Toggle like status (POST to like/unlike)
likeRouter.post('/:soundtrackId', toggleLike);

// Check if user has liked a track
likeRouter.get('/:soundtrackId/status', checkLikeStatus);

// Get all tracks liked by a user
likeRouter.get('/user/:userId', getUserLikes);

export default likeRouter;