import express from "express";
import { registerUser } from "../controllers/UserController";
import { authenticate } from "../auth"; 

const router = express.Router();

// Protect the register route with Firebase authentication
router.post("/register", authenticate, registerUser);

export default router;
