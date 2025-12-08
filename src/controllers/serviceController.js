import { Service } from "../models/Service.js";
import { z } from "zod";

const ServiceValidator = z.object({
  name: z.string(),
  slug: z.string(),
  type: z.enum(["exchange", "wallet", "vpn", "hosting", "other"]),
  url: z.string().url(),
  kycLevel: z.number().min(0).max(4)
});


export async function getServices(req, res, next) {
  try {
    const { type, maxKyc } = req.query;
    const filter = {};

    if (type) filter.type = type.toLowerCase();
    if (maxKyc !== undefined) {
      const max = Number(maxKyc);
      if (!isNaN(max)) filter.kycLevel = { $lte: max };
    }

    const services = await Service.find(filter).sort({ privacyScore: -1 });
    res.json(services);
  } catch (error) {
    next(error);
  }
}

export async function getServiceById(req, res, next) {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (error) {
    next(error);
  }
}

export async function createService(req, res, next) {
  try {
    ServiceValidator.parse(req.body);
    const newService = await Service.create(req.body);
    res.status(201).json(newService);
  } catch (error) {
    next(error);
  }
}

export async function updateService(req, res, next) {
  try {
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedService)
      return res.status(404).json({ message: "Service not found" });

    res.json(updatedService);
  } catch (error) {
    next(error);
  }
}

export async function deleteService(req, res, next) {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Service not found" });

    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    next(error);
  }
}
