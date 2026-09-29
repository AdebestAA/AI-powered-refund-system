import crypto from "crypto";

export const generateOtp = () => crypto.randomInt(100000, 1000000).toString();

export const generateToken = (bytes = 48) => crypto.randomBytes(bytes).toString("base64url");

export const safeEqual = (expectedSecret: string, receivedSecret: string) => {
  const expected = Buffer.from(expectedSecret);
  const received = Buffer.from(receivedSecret);
  return expected.length === received.length && crypto.timingSafeEqual(expected, received);
};
