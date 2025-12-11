import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: ['exchange', 'wallet', 'vpn', 'aggregator', 'hosting', 'other'],
      required: true
    },
    url: { type: String, required: true },
    description: { type: String, default: '' },

    privacyScore: { type: Number, default: 0, min: 0, max: 10 },
    trustScore: { type: Number, default: 0, min: 0, max: 10 },
    kycLevel: { type: Number, default: 0, min: 0, max: 4 },

    verificationStatus: {
      type: String,
      enum: ['verified', 'approved', 'community', 'scam'],
      default: 'community'
    },

    currencies: [{ type: String }],
    networks: [{ type: String }],
    attributes: [{ type: String }]
  },
  {
    timestamps: true
  }
);

export const serviceRequest = mongoose.model('ServiceRequest', serviceSchema);
