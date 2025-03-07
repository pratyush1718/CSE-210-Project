import express from 'express';
import { registerUser } from '../controllers/UserController'; 

const router = express.Router();

// POST /api/user/register - User registration endpoint
router.post('/register', registerUser);

export default router;
