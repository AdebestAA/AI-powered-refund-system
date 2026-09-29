import { BREVO_API_KEY, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME, OTP_TTL_MINUTES } from "../../config/constants";
import { createError } from "../utils/app-error";

export type OtpPurpose = "signup_verify" | "password_reset";

export const sendVerificationToken = async (email: string, otp: string, type: OtpPurpose = "signup_verify") => {
  const subject = type === "signup_verify" ? "Verify your email" : "Reset your password";

  if (!BREVO_API_KEY) {
    console.log(`\n✉  [dev mail] ${subject} → ${email}\n   OTP: ${otp} (expires in ${OTP_TTL_MINUTES} min)\n`);
    return;
  }

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:420px;margin:0 auto;padding:24px;color:#18181b">
      <h2 style="margin:0 0 8px">${subject}</h2>
      <p style="margin:0 0 20px;color:#52525b">Enter this code to continue. It expires in ${OTP_TTL_MINUTES} minutes.</p>
      <h1 style="letter-spacing:8px;font-size:32px;margin:0">${otp}</h1>
      <p style="margin:24px 0 0;font-size:12px;color:#a1a1aa">If you didn't request this, you can ignore this email.</p>
    </div>
  `;

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: { email: BREVO_SENDER_EMAIL, name: BREVO_SENDER_NAME },
        to: [{ email }],
        subject,
        htmlContent: html,
      }),
    });

    if (!response.ok) {
      console.error("[brevo]", response.status, await response.text().catch(() => ""));
      throw new Error(`Brevo responded ${response.status}`);
    }
  } catch (error) {
    console.error("[mailer]", error);
    throw createError(500, "Failed to send email");
  }
};
