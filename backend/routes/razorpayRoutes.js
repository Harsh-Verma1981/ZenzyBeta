import express from "express";
const router = express.Router();

import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../controllers/razorpayController.js";

import { authenticate } from "../middlewares/authMiddleware.js";

// Create Razorpay order
router.post("/create-order/:orderId", authenticate, createRazorpayOrder);

// Verify Razorpay payment
router.post("/verify-payment/:orderId", authenticate, verifyRazorpayPayment);

export default router;
