import express from "express";
import { adminLogin, adminLogout, adminStatus } from "../controllers/adminController.js";

const router = express.Router();

router.get("/login", adminLogin);
router.post("/logout", adminLogout);
router.post("/status", adminStatus);

export default router;
