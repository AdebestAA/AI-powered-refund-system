import axios from "axios";
import { queryClient } from "@/lib/query-client";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
  timeout: 10000,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token: string | null = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  },
);

const logoutAndRedirect = () => {
  localStorage.clear();
  queryClient.clear();
  sessionStorage.clear();
  if (window.location.pathname !== "/login") window.location.href = "/login";
};

const getNewAccessToken = async () => {
  const { data: body } = await api.post("/auth/refresh");
  localStorage.setItem("token", body.data.accessToken);
  return body.data.accessToken as string;
};

// shared so several 401s at once trigger only ONE refresh (each refresh token works once)
let refreshing: Promise<string> | null = null;

const NO_REFRESH_ROUTES = [
  "/auth/login",
  "/auth/signup",
  "/auth/verify-email",
  "/auth/resend-otp",
  "/auth/refresh",
];

api.interceptors.response.use(
  (response) => response,
  async (err) => {
    const request = err.config;
    const skipRefresh = NO_REFRESH_ROUTES.some((route) =>
      request?.url?.startsWith(route),
    );

    if (
      err.response?.status === 401 &&
      request &&
      !skipRefresh &&
      !request._retry
    ) {
      request._retry = true;

      try {
        if (!refreshing) {
          refreshing = getNewAccessToken();
        }
        const token = await refreshing;
        refreshing = null;

        request.headers.Authorization = `Bearer ${token}`;
        return api(request);
      } catch {
        refreshing = null;
        logoutAndRedirect();
      }
    }

    return Promise.reject(err);
  },
);

export default api;
