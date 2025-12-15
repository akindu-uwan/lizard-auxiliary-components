import express from "express";
import {
  getRequest,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest
} from "../controllers/tokenController.js";

const router = express.Router();

router.get("/", getRequest);
router.get("/:id", getRequestById);
router.post("/", createRequest);
router.put("/:id", updateRequest);
router.delete("/:id", deleteRequest);

export default router;
