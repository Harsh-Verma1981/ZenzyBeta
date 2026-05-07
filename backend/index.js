// packages
import dotenv from "dotenv";
dotenv.config();

import path from "path";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Utiles
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import razorpayRoutes from "./routes/razorpayRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

const port = process.env.PORT || 5000;

connectDB();

const app = express();

// 1. SECURITY & CORS (Must be at the very top)
// app.use(cors({
//   origin: "https://zenzloom-shop.vercel.app", 
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));

// REPLACE your current CORS block with this:
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://zenzloom-shop.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  // Handle the Preflight (OPTIONS) request immediately
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// This line handles the 'Preflight' handshake that is currently failing
app.options("*", cors()); 

// 2. MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 3. API ROUTES
// We use an array here to catch both '/api/chat' and '/api/chat/' to prevent 404s
app.post(["/api/chat", "/api/chat/"], async (req, res) => {
  try {
    const { message } = req.body;
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Using gemini-1.5-flash as the stable production model name
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(message);
    const response = await result.response;
    res.json({ reply: response.text() });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/razorpay", razorpayRoutes);

app.get("/api/config/razorpay", (req, res) => {
  res.send({ keyId: process.env.RAZORPAY_KEY_ID });
});

// 4. STATIC FILES (Moved to the bottom to avoid interfering with API routes)
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/backend/uploads')));
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.listen(port, () => console.log(`Server running on port: ${port}`));
