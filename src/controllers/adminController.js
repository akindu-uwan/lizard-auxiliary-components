import jwt from "jsonwebtoken";

const COOKIE_NAME = "admin_token";

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return res.status(500).json({ message: "Admin credentials not configured" });
  }

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const secret = process.env.JWT_SECRET || process.env.SESSION_SECRET;
  if (!secret) {
    return res.status(500).json({ message: "JWT secret not configured" });
  }

  const token = jwt.sign(
    { isAdmin: true, email },
    secret,
    { expiresIn: "8h" }
  );

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 8,
    path: "/",
  });

  return res.json({ ok: true, message: "Login successful" });
};

export const adminLogout = async (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });

  return res.json({ ok: true, message: "Logout successful" });
};

export const adminStatus = async (req, res) => {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) return res.json({ isAuthenticated: false });

    const secret = process.env.JWT_SECRET || process.env.SESSION_SECRET;
    const decoded = jwt.verify(token, secret);

    if (decoded?.isAdmin) {
      return res.json({ isAuthenticated: true, email: decoded.email });
    }

    return res.json({ isAuthenticated: false });
  } catch {
    return res.json({ isAuthenticated: false });
  }
};
