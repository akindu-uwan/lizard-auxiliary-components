import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
    {
        tokenName: { type: String, required: true },
        tokenSymbol: { type: String, required: true },
        chain: { type: String, required: true },
        contractAddress: { type: String, required: true, unique: true },

        tokenType: {
            type: String,
            enum: ["ERC20", "BEP20", "SPL", "Other"],
            default: "ERC20"
        },

        tokenLogoUrl: { type: String, default: null },
        website: { type: String, default: null },
        description: { type: String, default: null },



        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        }
    },
    { timestamps: true }
);

export const Request = mongoose.model("Request", requestSchema);
