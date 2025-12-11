import mongoose from 'mongoose';

const partnerSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
    },

    // Make enum style similar to `serviceSchema` (all lowercase)
    serviceType: {
      type: String,
      enum: ['dex', 'aggregator', 'bridge', 'lending', 'wallet', 'other'],
      required: true,
    },

    primaryChain: {
      type: String,
      required: true,
      trim: true,
    },

    // Like currencies/networks/attributes in serviceSchema → array of strings
    supportedChains: [
      {
        type: String,
        trim: true,
      },
    ],

    website: {
      type: String,
      required: true,
      trim: true,
    },
    apiBaseUrl: {
      type: String,
      trim: true,
    },
    apiDocsUrl: {
      type: String,
      trim: true,
    },

    contactName: {
      type: String,
      required: true,
      trim: true,
    },
    contactEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    telegram: {
      type: String,
      trim: true,
    },
    discord: {
      type: String,
      trim: true,
    },

    estimatedDailyVolume: {
      type: String,
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Match style of `serviceRequest`
export const partnerRequest = mongoose.model('PartnerRequest', partnerSchema);
