import express from "express";
import { registerWithKey, loginWithKey, me, logout } from "../controllers/authKeyController.js";

const router = express.Router();

router.post("/key/register", registerWithKey);
router.post("/key/login", loginWithKey);
router.get("/me", me);
router.post("/logout", logout);

export default router;
