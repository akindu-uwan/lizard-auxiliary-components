import { Request } from "../models/Request.js";
import { z } from "zod";

const NullableUrl = z
  .string()
  .url()
  .or(z.literal(""))
  .nullable()
  .optional();       

export const requestValidator = z.object({
  tokenName: z.string().min(2),
  tokenSymbol: z.string().min(1).max(10),
  chain: z.string().min(2),
  contractAddress: z.string().min(10),
  tokenType: z.enum(["ERC20", "BEP20", "SPL", "Other"]),
  tokenLogoUrl: NullableUrl,
  website: NullableUrl,
  description: z.string().optional()
});



export async function getRequest(req, res, next) {
  try {
    const { type, maxKyc } = req.query;
    const filter = {};

    if (type) filter.type = type.toLowerCase();
    if (maxKyc !== undefined) {
      const max = Number(maxKyc);
      if (!isNaN(max)) filter.kycLevel = { $lte: max };
    }

    const request = await Request.find(filter).sort({ privacyScore: -1 });
    res.json(request);
  } catch (error) {
    next(error);
  }
}

export async function getRequestById(req, res, next) {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Service not found" });
    res.json(request);
  } catch (error) {
    next(error);
  }
}

export async function createRequest(req, res, next) {
  try {
    requestValidator.parse(req.body);
    const newRequest = await Request.create(req.body);
    res.status(201).json(newRequest);
  } catch (error) {
    next(error);
  }
}

export async function updateRequest(req, res, next) {
  try {
    const updatedRequest = await Request.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedRequest)
      return res.status(404).json({ message: "Request not found" });
    res.json(updatedRequest);
  } catch (error) {
    next(error);
  }
}

export async function deleteRequest(req, res, next) {
  try {
    const deleted = await Request.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Request not found" });

    res.json({ message: "request deleted successfully" });
  } catch (error) {
    next(error);
  }
}
