import { Partner } from "../models/Partner.js";
import { z } from "zod";

const NullableUrl = z
  .string()
  .url()
  .or(z.literal(""))
  .optional()
  .transform((v) => (v === "" ? undefined : v));

export const partnerRequestValidator = z.object({
  projectName: z.string().min(2),
  companyName: z.string().optional(),

  serviceType: z.enum([
    "DEX",
    "Aggregator",
    "Bridge",
    "Lending",
    "Wallet",
    "Other",
  ]),

  primaryChain: z.string().min(2),
  supportedChains: z.string().optional(),

  website: z.string().url(),

  apiBaseUrl: NullableUrl,
  apiDocsUrl: NullableUrl,

  contactName: z.string().min(2),
  contactEmail: z.string().email(),

  telegram: z.string().optional(),
  discord: z.string().optional(),
  estimatedDailyVolume: z.string().optional(),
  notes: z.string().optional(),

  // ✅ add this because frontend sends it
  acceptTerms: z.boolean().optional(),
});

// Only for status updates (admin)
export const partnerStatusValidator = z.object({
  status: z.enum(["pending", "approved", "rejected"]),
});

/**
 * POST /api/partners/apply
 */
export const createPartner = async (req, res, next) => {
  try {
    const parsed = partnerRequestValidator.parse(req.body);

    const { acceptTerms, website, apiBaseUrl, apiDocsUrl, ...rest } = parsed;

    const payload = {
      ...rest,
      website: website.trim(),
      apiBaseUrl: apiBaseUrl?.trim(),
      apiDocsUrl: apiDocsUrl?.trim(),
      status: "pending",
    };

    const partner = await Partner.create(payload);

    return res.status(201).json({
      message: "Partner application submitted",
      partner,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      const details = err.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
      }));

      return res.status(400).json({
        message: "Validation failed",
        details,
      });
    }

    return next(err);
  }
};

/**
 * GET /api/partners?status=approved
 */
export const getPartners = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status) filter.status = status;

    const partners = await Partner.find(filter).sort({ createdAt: -1 });
    return res.json(partners);
  } catch (err) {
    return next(err);
  }
};

/**
 * PUT /api/partners/:id
 * Admin: update status (pending/approved/rejected)
 * This supports your admin UI approve/reject.
 */
export const updatePartner = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate status
    const parsed = partnerStatusValidator.parse(req.body);

    const updated = await Partner.findByIdAndUpdate(
      id,
      { status: parsed.status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Partner not found" });
    }

    return res.json({
      message: "Partner updated",
      partner: updated,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      const details = err.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
      }));

      return res.status(400).json({
        message: "Validation failed",
        details,
      });
    }

    return next(err);
  }
};
