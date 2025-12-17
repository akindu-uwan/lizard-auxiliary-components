import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";

import { connectDB } from "./config/db.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import partnerRoutes from "./routes/partnerRoutes.js";
import tokenRoutes from "./routes/tokenRoutes.js";
import authKeyRoutes from "./routes/authKeyRoutes.js";
import serviceRequestRoutes from "./routes/serviceRequestRoutes.js";
import tokenRequestRoutes from "./routes/tokenRequestRoutes.js";
import partnerRequestRoutes from "./routes/partnerRequestRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { notFound } from "./middleware/notFoundMiddleware.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
console.log("JWT_SECRET loaded?", !!process.env.JWT_SECRET);

connectDB();

const app = express();

/**
 * ✅ Needed on Vercel/proxy for secure cookies
 */
app.set("trust proxy", 1);

/**
 * ✅ Body + cookies
 */
app.use(express.json());
app.use(cookieParser());

/**
 * ✅ CORS (safe: allow all origins but still supports credentials)
 * This avoids blocking /api/health and other routes.
 */
const corsConfig = cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
app.use(corsConfig);
app.options("*", corsConfig);

/**
 * ✅ Session MUST be enabled (your admin login uses req.session)
 * NOTE: Vercel serverless memory sessions are not reliable long-term,
 * but this will at least stop req.session being undefined.
 */
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true on https
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 8,
    },
  })
);

/**
 * Health
 */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running smoothly" });
});

/**
 * Routes
 */
app.use("/api/auth", authKeyRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/tokens", tokenRoutes);
app.use("/api/servicerequests", serviceRequestRoutes);
app.use("/api/tokenrequests", tokenRequestRoutes);
app.use("/api/partnerrequests", partnerRequestRoutes);
app.use("/api/admin/auth", adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
