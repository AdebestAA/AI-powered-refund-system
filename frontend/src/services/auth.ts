import api from "@/lib/api";
import type { LoginValues, SignupValues, VerifyOtpValues } from "@/schemas/auth.schema";
import type { Session, typeResponse, User } from "@/utils/types";

const signup = async ({ name, email, password }: SignupValues) => {
  const response = await api.post<typeResponse<{ email: string }>>("/auth/signup", { name, email, password });
  return response.data;
};

const login = async (payload: LoginValues) => {
  const response = await api.post<typeResponse<Session>>("/auth/login", payload);
  return response.data;
};

const verifyOtp = async (payload: VerifyOtpValues) => {
  const response = await api.post<typeResponse<Session>>("/auth/verify-email", payload);
  return response.data;
};

const resendOtp = async (email: string) => {
  const response = await api.post<typeResponse<null>>("/auth/resend-otp", { email });
  return response.data;
};

const logout = async () => {
  const response = await api.post<typeResponse<null>>("/auth/logout");
  return response.data;
};

const me = async () => {
  const response = await api.get<typeResponse<User>>("/auth/me");
  return response.data;
};

export const authService = {
  signup,
  login,
  verifyOtp,
  resendOtp,
  logout,
  me,
};
