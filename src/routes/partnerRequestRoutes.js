import express from "express";
import { createPartner, getPartners } from "../controllers/partnerRequestController.js";

const router = express.Router();

router.get("/", getPartners);
router.post("/apply", createPartner);

export default router;
