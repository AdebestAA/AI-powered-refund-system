import bcrypt from "bcrypt";
import crypto from "crypto";
import {
  OTP_MAX_ATTEMPTS,
  OTP_TTL_MINUTES,
  REFRESH_TOKEN_TTL_DAYS,
} from "../../config/constants";
import { pool } from "../../config/db";
import { createError } from "../../common/utils/app-error";
import { decrypt, encrypt } from "../../common/utils/crypto";
import {
  generateOtp,
  generateToken,
  safeEqual,
} from "../../common/utils/generate";
import { signAccessToken, UserRole } from "../../common/lib/jwt";
import { sendVerificationToken } from "../../common/lib/mailer";
import { LoginInput, SignupInput, VerifyEmailInput } from "./auth.schema";

type User = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  email_verified_at: Date | null;
  created_at: Date;
};

const sendOtp = async (user: User) => {
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  await pool.query(
    "DELETE FROM email_otps WHERE user_id = $1 AND used_at IS NULL",
    [user.id],
  );
  await pool.query(
    "INSERT INTO email_otps (user_id, code_encrypted, expires_at) VALUES ($1, $2, $3)",
    [user.id, encrypt(otp), expiresAt],
  );

  await sendVerificationToken(user.email, otp, "signup_verify");
};

const createSession = async (
  user: User,
  familyId: string = crypto.randomUUID(),
) => {
  const tokenId = crypto.randomUUID();
  const secret = generateToken();
  const expiresAt = new Date(
    Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
  );

  await pool.query(
    "INSERT INTO refresh_tokens (id, user_id, family_id, secret_encrypted, expires_at) VALUES ($1, $2, $3, $4, $5)",
    [tokenId, user.id, familyId, encrypt(secret), expiresAt],
  );

  return {
    accessToken: signAccessToken({
      sub: user.id,
      role: user.role,
      email: user.email,
    }),
    refreshToken: `${tokenId}.${secret}`,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: Boolean(user.email_verified_at),
      createdAt: user.created_at,
    },
  };
};

const signup = async ({ name, email, password }: SignupInput) => {
  const { rows } = await pool.query<User>(
    "SELECT * FROM users WHERE email = $1",
    [email],
  );
  const existing = rows[0];

  if (existing?.email_verified_at) {
    throw createError(409, "An account with this email already exists");
  }

  if (existing) {
    await sendOtp(existing);
    return { email: existing.email };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const { rows: created } = await pool.query<User>(
    "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
    [name, email, passwordHash],
  );
  const user = created[0];

  await sendOtp(user);
  return { email: user.email };
};

const verifyEmail = async ({ email, otp }: VerifyEmailInput) => {
  const { rows: users } = await pool.query<User>(
    "SELECT * FROM users WHERE email = $1",
    [email],
  );
  const user = users[0];
  if (!user) throw createError(400, "Invalid or expired code");
  if (user.email_verified_at)
    throw createError(409, "This email is already verified. Please sign in.");

  const { rows: otps } = await pool.query<{
    id: string;
    code_encrypted: string;
    attempts: number;
    expires_at: Date;
  }>(
    `SELECT id, code_encrypted, attempts, expires_at FROM email_otps
     WHERE user_id = $1 AND used_at IS NULL
     ORDER BY created_at DESC LIMIT 1`,
    [user.id],
  );
  const savedOtp = otps[0];

  if (!savedOtp || savedOtp.expires_at < new Date()) {
    throw createError(400, "This code has expired. Request a new one.");
  }
  if (savedOtp.attempts >= OTP_MAX_ATTEMPTS) {
    throw createError(429, "Too many attempts. Request a new code.");
  }

  if (!safeEqual(decrypt(savedOtp.code_encrypted), otp)) {
    await pool.query(
      "UPDATE email_otps SET attempts = attempts + 1 WHERE id = $1",
      [savedOtp.id],
    );
    throw createError(400, "Incorrect code");
  }

  await pool.query("UPDATE email_otps SET used_at = now() WHERE id = $1", [
    savedOtp.id,
  ]);
  await pool.query(
    "UPDATE users SET email_verified_at = now() WHERE id = $1",
    [user.id],
  );

  return createSession({ ...user, email_verified_at: new Date() });
};

const resendOtp = async (email: string) => {
  const { rows } = await pool.query<User>(
    "SELECT * FROM users WHERE email = $1",
    [email],
  );
  const user = rows[0];

  if (user && !user.email_verified_at) {
    await sendOtp(user);
  }
};

const login = async ({ email, password }: LoginInput) => {
  const { rows } = await pool.query<User>(
    "SELECT * FROM users WHERE email = $1",
    [email],
  );
  const user = rows[0];

  const passwordOk = user
    ? await bcrypt.compare(password, user.password_hash)
    : false;
  if (!user || !passwordOk)
    throw createError(401, "Incorrect email or password");

  if (!user.email_verified_at) {
    await sendOtp(user);
    throw createError(
      403,
      "Please verify your email first — we've sent a new code to your inbox.",
    );
  }

  return createSession(user);
};

const refresh = async (refreshToken: string | undefined) => {
  const [tokenId, secret] = refreshToken?.split(".") ?? [];
  if (!tokenId || !secret) throw createError(401, "Please sign in again");

  const { rows } = await pool.query<{
    id: string;
    user_id: string;
    family_id: string;
    secret_encrypted: string;
    expires_at: Date;
    revoked_at: Date | null;
  }>("SELECT * FROM refresh_tokens WHERE id::text = $1", [tokenId]);
  const saved = rows[0];

  if (!saved || !safeEqual(decrypt(saved.secret_encrypted), secret)) {
    throw createError(401, "Please sign in again");
  }

  // already-used token → someone copied it: revoke every token from that login
  if (saved.revoked_at) {
    await pool.query(
      "UPDATE refresh_tokens SET revoked_at = now() WHERE family_id = $1 AND revoked_at IS NULL",
      [saved.family_id],
    );
    throw createError(401, "Please sign in again");
  }

  if (saved.expires_at < new Date())
    throw createError(401, "Session expired. Please sign in again.");

  const { rows: users } = await pool.query<User>(
    "SELECT * FROM users WHERE id = $1",
    [saved.user_id],
  );
  const user = users[0];
  if (!user) throw createError(401, "Please sign in again");

  await pool.query(
    "UPDATE refresh_tokens SET revoked_at = now() WHERE id = $1",
    [saved.id],
  );
  return createSession(user, saved.family_id);
};

const logout = async (refreshToken: string | undefined) => {
  const [tokenId, secret] = refreshToken?.split(".") ?? [];
  if (!tokenId || !secret) return;

  const { rows } = await pool.query<{
    family_id: string;
    secret_encrypted: string;
  }>(
    "SELECT family_id, secret_encrypted FROM refresh_tokens WHERE id::text = $1",
    [tokenId],
  );
  const saved = rows[0];

  if (saved && safeEqual(decrypt(saved.secret_encrypted), secret)) {
    await pool.query(
      "UPDATE refresh_tokens SET revoked_at = now() WHERE family_id = $1 AND revoked_at IS NULL",
      [saved.family_id],
    );
  }
};

const me = async (userId: string) => {
  const { rows } = await pool.query(
    `SELECT id, name, email, role, email_verified_at IS NOT NULL AS "emailVerified", created_at AS "createdAt"
     FROM users WHERE id = $1`,
    [userId],
  );
  if (!rows[0]) throw createError(401, "Please sign in again");
  return rows[0];
};

export const authService = {
  signup,
  verifyEmail,
  resendOtp,
  login,
  refresh,
  logout,
  me,
};
