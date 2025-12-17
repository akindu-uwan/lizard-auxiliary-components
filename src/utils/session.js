import jwt from "jsonwebtoken";

const COOKIE_NAME = process.env.COOKIE_NAME || "sid";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is missing. Check backend .env and dotenv.config()");
  return secret;
}

export function signSession(res, payload) {
  const token = jwt.sign(payload, getJwtSecret(), { expiresIn: "30d" });

  const isProd = process.env.NODE_ENV === "production";

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax", // ✅ important if cross-site in prod
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
}

export function clearSession(res) {
  const isProd = process.env.NODE_ENV === "production";

  res.clearCookie(COOKIE_NAME, {
    path: "/",
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });
}

export function readSession(req) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return null;
  return jwt.verify(token, getJwtSecret());
}
