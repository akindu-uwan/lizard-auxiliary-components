import crypto from "crypto";

export function generateLoginKey() {
  
  return crypto.randomBytes(32).toString("base64url");
}

export function hashLoginKey(key) {
  
  return crypto.createHash("sha256").update(key, "utf8").digest("hex");
}
