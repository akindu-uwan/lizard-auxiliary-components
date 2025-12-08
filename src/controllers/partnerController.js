import Partner from "../models/Partner.js";
import { z } from "zod";

export const partnerSignupSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  companyName: z.string().optional(),

  serviceType: z.enum(["DEX", "Aggregator", "Bridge", "Lending", "Wallet", "Other"], {
    required_error: "Service type is required",
  }),

  primaryChain: z.string().min(1, "Primary chain is required"),
  supportedChains: z.string().optional(),

  website: z
    .string()
    .min(1, "Website is required")
    .regex(/^https?:\/\/.+/i, "Enter a valid URL (including http:// or https://)"),

  apiBaseUrl: z
    .string()
    .regex(/^https?:\/\/.+/i, "Enter a valid URL (including http:// or https://)")
    .optional()
    .or(z.literal("").transform(() => undefined)),

  apiDocsUrl: z
    .string()
    .regex(/^https?:\/\/.+/i, "Enter a valid URL (including http:// or https://)")
    .optional()
    .or(z.literal("").transform(() => undefined)),

  contactName: z.string().min(1, "Contact name is required"),
  contactEmail: z
    .string()
    .min(1, "Contact email is required")
    .email("Enter a valid email address"),

  telegram: z.string().optional(),
  discord: z.string().optional(),
  estimatedDailyVolume: z.string().optional(),
  notes: z.string().optional(),

  acceptTerms: z
    .boolean()
    .refine((val) => val === true, { message: "You must accept to submit" }),
});

/**
 * POST /api/partners/apply
 */
export const createPartner = async (req, res, next) => {
  try {
    // Validate body with Zod
    const parsed = partnerSignupSchema.parse(req.body);

    // Prepare data for DB (remove acceptTerms, trim some fields)
    const {
      acceptTerms, // eslint-disable-line @typescript-eslint/no-unused-vars
      website,
      apiBaseUrl,
      apiDocsUrl,
      ...rest
    } = parsed;

    const payload = {
      ...rest,
      website: website.trim(),
      apiBaseUrl: apiBaseUrl?.trim(),
      apiDocsUrl: apiDocsUrl?.trim(),
      status: "pending", // default when someone applies
    };

    const partner = await Partner.create(payload);

    return res.status(201).json({
      message: "Partner application submitted",
      partner,
    });
  } catch (err) {
    // Handle Zod validation errors -> match frontend error format
    if (err instanceof z.ZodError) {
      const details = err.issues.map((issue) => ({
        path: issue.path, // e.g. ["website"]
        message: issue.message,
      }));

      return res.status(400).json({
        message: "Validation failed",
        details,
      });
    }

    // Pass other errors to global error handler
    return next(err);
  }
};

/**
 * GET /api/partners?status=approved
 * (used by your PartnerSignupPage to show "Live routing partners")
 */
export const getPartners = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    const partners = await Partner.find(filter).sort({ createdAt: -1 });

    return res.json(partners);
  } catch (err) {
    return next(err);
  }
};
