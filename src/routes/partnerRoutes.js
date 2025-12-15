import express from "express";
import { createPartner, getPartners, updatePartner } from "../controllers/partnerController.js";

const router = express.Router();

router.get("/", getPartners);
router.post("/apply", createPartner);
router.put("/:id", updatePartner);


export default router;
