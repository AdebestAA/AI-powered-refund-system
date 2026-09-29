import { CookieOptions, Request, Response } from "express";
import {
  IS_PRODUCTION,
  REFRESH_COOKIE,
  REFRESH_TOKEN_TTL_DAYS,
} from "../../config/constants";
import { sendOk } from "../../common/utils/response";
import { authService } from "./auth.service";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: IS_PRODUCTION,
  sameSite: "lax",
  path: "/api/auth",
};

const cookieMaxAge = REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000;

const signup = async (req: Request, res: Response) => {
  const result = await authService.signup(req.body);
  sendOk(
    res,
    result,
    "Account created. We've emailed you a 6-digit code.",
    201,
  );
};

const verifyEmail = async (req: Request, res: Response) => {
  const session = await authService.verifyEmail(req.body);

  res.cookie(REFRESH_COOKIE, session.refreshToken, {
    ...cookieOptions,
    maxAge: cookieMaxAge,
  });
  sendOk(res, { accessToken: session.accessToken, user: session.user });
};

const resendOtp = async (req: Request, res: Response) => {
  await authService.resendOtp(req.body.email);
  sendOk(
    res,
    null,
    "If that account needs verifying, a new code is on its way.",
  );
};

const login = async (req: Request, res: Response) => {
  const session = await authService.login(req.body);

  res.cookie(REFRESH_COOKIE, session.refreshToken, {
    ...cookieOptions,
    maxAge: cookieMaxAge,
  });
  sendOk(res, { accessToken: session.accessToken, user: session.user });
};

const refresh = async (req: Request, res: Response) => {
  try {
    const session = await authService.refresh(req.cookies[REFRESH_COOKIE]);

    res.cookie(REFRESH_COOKIE, session.refreshToken, {
      ...cookieOptions,
      maxAge: cookieMaxAge,
    });
    sendOk(res, { accessToken: session.accessToken, user: session.user });
  } catch (err) {
    res.clearCookie(REFRESH_COOKIE, cookieOptions);
    throw err;
  }
};

const logout = async (req: Request, res: Response) => {
  await authService.logout(req.cookies[REFRESH_COOKIE]);

  res.clearCookie(REFRESH_COOKIE, cookieOptions);
  sendOk(res, null, "Signed out");
};

const me = async (req: Request, res: Response) => {
  sendOk(res, await authService.me(req.user!.id));
};

export const authController = {
  signup,
  verifyEmail,
  resendOtp,
  login,
  refresh,
  logout,
  me,
};
