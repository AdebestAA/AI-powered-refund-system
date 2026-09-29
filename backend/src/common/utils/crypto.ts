import crypto from "crypto";
import { ENCRYPTION_KEY } from "../../config/constants";

const ALGORITHM = "aes-256-cbc";

const KEY = crypto.createHash("sha256").update(ENCRYPTION_KEY).digest();

export const encrypt = (text: string) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}`;
};

export const decrypt = (value: string) => {
  const [ivHex, encrypted] = value.split(":");
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, Buffer.from(ivHex, "hex"));

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};
