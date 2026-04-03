import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/orderModel.js";

// Create Razorpay Order
const createRazorpayOrder = async (req, res) => {
  try {
    console.log("Creating Razorpay order for orderId:", req.params.orderId);

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      console.error("Order not found:", orderId);
      res.status(404);
      throw new Error("Order not found");
    }

    console.log("Order found:", order._id, "totalPrice:", order.totalPrice);

    // Razorpay expects amount in smallest currency unit (paise for INR, cents for USD)
    // Convert dollars to cents: multiply by 100
    const amount = Math.round(Number(order.totalPrice) * 100);

    console.log("Converted amount (paise/cents):", amount);

    const options = {
      amount: amount,
      currency: "USD",
      receipt: orderId,
      notes: {
        orderId: orderId,
        userId: order.user._id ? order.user._id.toString() : order.user.toString(),
      },
    };

    razorpay.orders.create(options, (err, razorpayOrder) => {
      if (err) {
        console.error("Razorpay order creation error:", err);
        res.status(500);
        throw new Error(err.message || "Failed to create Razorpay order");
      }
      console.log("Razorpay order created successfully:", razorpayOrder.id);
      res.status(201).json({
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt,
        key_id: process.env.RAZORPAY_KEY_ID,
      });
    });
  } catch (error) {
    console.error("createRazorpayOrder error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Verify Razorpay Payment
const verifyRazorpayPayment = async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { orderId } = req.params;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Generate signature for verification
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // Compare signatures
    if (generatedSignature !== razorpay_signature) {
      res.status(400);
      throw new Error("Invalid payment signature");
    }

    // Find order and update
    const order = await Order.findById(orderId);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    // Mark order as paid
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    };

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("verifyRazorpayPayment error:", error);
    res.status(500).json({ error: error.message });
  }
};

export { createRazorpayOrder, verifyRazorpayPayment };
