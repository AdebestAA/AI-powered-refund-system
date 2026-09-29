// \p{Cf} = invisible characters (zero-width spaces, text-direction marks)
export const sanitizeMessage = (text: string) =>
  text.replace(/\p{Cf}/gu, "").trim();

export const escapeForPrompt = (text: string) => text.replace(/[<>]/g, "");

const SUSPICIOUS_PHRASES = [
  "ignore previous",
  "ignore all",
  "ignore your",
  "disregard previous",
  "system prompt",
  "you are now",
  "developer mode",
  "i am the admin",
  "i am an admin",
  "set status",
  "status: approved",
  "mark as approved",
  "bypass",
  "regardless of the policy",
  "<system",
  "forget the",
  "act as",
  "decision =",
];

export const looksLikeInjection = (text: string) => {
  const lower = text.toLowerCase();
  return SUSPICIOUS_PHRASES.some((phrase) => lower.includes(phrase));
};
