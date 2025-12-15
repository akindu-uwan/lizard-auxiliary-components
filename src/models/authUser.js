import mongoose from "mongoose";

const AuthUserSchema = new mongoose.Schema(
  {
    loginKeyHash: { type: String, required: true, unique: true, index: true },
    
    label: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const AuthUser = mongoose.model("AuthUser", AuthUserSchema);
