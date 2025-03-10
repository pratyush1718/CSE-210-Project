import express from "express";
import { getCurrentUser, registerUser } from "../controllers/UserController";
import { authenticate } from "../auth"; 

const router = express.Router();

// Protect the register route with Firebase authentication
router.post("/register", authenticate, registerUser);
// router.get("/getCurrentUser", authenticate, getCurrentUser);

export default router;
