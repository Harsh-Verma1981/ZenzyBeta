import express from "express";
const router = express.Router();
import { chatWithAI } from "../controllers/chatController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

// You can add 'authenticate' if you only want logged-in users to use AI
router.post("/", chatWithAI);

export default router;