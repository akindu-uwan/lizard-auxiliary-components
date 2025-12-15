import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema(
  {
    projectName: { type: String, required: true, trim: true },
    companyName: { type: String, trim: true },

    serviceType: {
      type: String,
      enum: ["DEX", "Aggregator", "Bridge", "Lending", "Wallet", "Other"],
      required: true,
    },

    primaryChain: { type: String, required: true, trim: true },
    supportedChains: { type: String, trim: true },

    website: { type: String, required: true, trim: true },
    apiBaseUrl: { type: String, trim: true },
    apiDocsUrl: { type: String, trim: true },

    contactName: { type: String, required: true, trim: true },
    contactEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    telegram: { type: String, trim: true },
    discord: { type: String, trim: true },

    estimatedDailyVolume: { type: String, trim: true },
    notes: { type: String, trim: true },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
);

export const Partner = mongoose.model("Partner", partnerSchema);
