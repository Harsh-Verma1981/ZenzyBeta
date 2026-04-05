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

const port = process.env.PORT || 5000;

connectDB();

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://zenzloom-shop.vercel.app",
  "https://zenzloom-shop.vercel.app/" // Added with slash just in case
];

// app.use(cors({
//   origin: function (origin, callback) {
//     // 1. Allow internal/mobile/tool requests (no origin)
//     if (!origin) return callback(null, true);
    
//     // 2. Check if the origin matches our list
//     if (allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       // 3. Fallback: If it's a sub-domain of your Vercel site, allow it
//       if (origin.includes("zenzloom-shop.vercel.app")) {
//         callback(null, true);
//       } else {
//         console.log("Blocked by CORS:", origin); // This helps you debug in Render logs
//         callback(new Error('Not allowed by CORS'));
//       }
//     }
//   },
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));

app.use(cors({
  origin: "https://zenzloom-shop.vercel.app", // Your live site
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const _dirname = path.resolve()

// app.use('/uploads', express.static(path.join(_dirname, '/backend/uploads')))
app.use('/uploads', express.static(path.join(__dirname, 'backend', 'uploads')));

app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/razorpay", razorpayRoutes);

app.get("/api/config/razorpay", (req, res) => {
  res.send({ keyId: process.env.RAZORPAY_KEY_ID });
});

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));

app.listen(port, () => console.log(`Server running on port: ${port}`));
