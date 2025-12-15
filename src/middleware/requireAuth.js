import { readSession } from "../utils/session.js";

export function requireAuth(req, res, next) {
  try {
    const session = readSession(req);
    if (!session?.uid) return res.status(401).json({ message: "Unauthorized" });
    req.user = { id: session.uid };
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
