import { z } from "zod";
import { AuthUser } from "../models/authUser.js";
import { generateLoginKey, hashLoginKey } from "../utils/loginKey.js";
import { signSession, clearSession, readSession } from "../utils/session.js";

const RegisterSchema = z.object({
  label: z.string().optional().default(""),
});

const LoginSchema = z.object({
  loginKey: z.string().min(10),
});

export async function registerWithKey(req, res, next) {
  try {
    const { label } = RegisterSchema.parse(req.body || {});

    
    const loginKey = generateLoginKey();
    const loginKeyHash = hashLoginKey(loginKey);

    
    const user = await AuthUser.create({ loginKeyHash, label });

    
    signSession(res, { uid: String(user._id) });

    
    return res.status(201).json({
      user: { id: String(user._id), label: user.label },
      loginKey,
      warning: "Save this login key now. It will not be shown again.",
    });
  } catch (err) {
    next(err);
  }
}

export async function loginWithKey(req, res, next) {
  try {
    const { loginKey } = LoginSchema.parse(req.body || {});
    const loginKeyHash = hashLoginKey(loginKey);

    const user = await AuthUser.findOne({ loginKeyHash });
    if (!user) return res.status(401).json({ message: "Invalid login key" });

    signSession(res, { uid: String(user._id) });
    return res.json({ user: { id: String(user._id), label: user.label } });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    const session = readSession(req);
    if (!session?.uid) return res.status(401).json({ message: "Unauthorized" });

    const user = await AuthUser.findById(session.uid).select("_id label createdAt");
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    return res.json({ user: { id: String(user._id), label: user.label } });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res) {
  clearSession(res);
  return res.json({ ok: true });
}
