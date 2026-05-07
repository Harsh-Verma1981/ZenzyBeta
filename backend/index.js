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

// const app = express();

// ✅ CORS — define once, use twice
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://zenzloom-shop.vercel.app",
      "http://localhost:5173"
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Origin", "X-Requested-With", "Accept"]
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ This is what was missing — preflight handler

// ✅ MIDDLEWARE (must come AFTER cors)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// rest of your routes...

// 3. API ROUTES
// We use an array here to catch both '/api/chat' and '/api/chat/' to prevent 404s
app.post(["/api/chat", "/api/chat/"], async (req, res) => {
  try {
    const { message } = req.body;
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Using gemini-1.5-flash as the stable production model name
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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
