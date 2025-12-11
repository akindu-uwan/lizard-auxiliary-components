import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import { connectDB } from "./config/db.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import partnerRoutes from "./routes/partnerRoutes.js";
import serviceRequestRoutes from "./routes/serviceRequestRoutes.js";
import tokenRequestRoutes from "./routes/tokenRequestRoutes.js";
import partnerRequestRoutes from "./routes/partnerRequestRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { notFound } from "./middleware/notFoundMiddleware.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 8 
  }
}));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend is running smoothly"
  });
});

app.use("/api/services", serviceRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/services/request", serviceRequestRoutes);
app.use("/api/tokens/request", tokenRequestRoutes);
app.use("/api/partners/request", partnerRequestRoutes);
app.use('/api/admin/auth', adminRoutes);
// app.use('/api/admin/tokens', adminTokenRoutes);
// app.use('/api/admin/partners', adminPartnerRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
