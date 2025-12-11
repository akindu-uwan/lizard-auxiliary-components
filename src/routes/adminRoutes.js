import express from "express";
import { adminLogin, adminLogout, adminStatus } from "../controllers/adminController.js";

const router = express.Router();

router.post("/login", adminLogin);

router.post("/logout", adminLogout);

router.get("/status", adminStatus);

export default router;
