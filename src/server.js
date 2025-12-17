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

app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser());

const allowlist = [
  "https://lizard-frontend-qo5a.vercel.app",
  "http://localhost:3000",
];

const corsOptions = {
  origin: (origin, cb) => {
    // allow non-browser requests (server-to-server, Postman, etc.)
    if (!origin) return cb(null, true);

    if (allowlist.includes(origin)) return cb(null, true);

    return cb(new Error("CORS blocked for origin: " + origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));


// ✅ Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 8,
    },
  })
);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend is running smoothly",
  });
});

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
