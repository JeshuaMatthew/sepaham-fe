import axios from "axios";
import { clearToken, getToken } from "@/features/auth/utils/authToken";
import { clearAccount } from "@/features/auth/utils/account";
import { emitAuthExpired } from "@/features/auth/utils/authEvents";
import { API_BASE_URL } from "@/constants/api";

/**
 * Instance axios untuk semua panggilan ke backend Axum.
 * - baseURL dari VITE_API_BASE_URL + /api (mis. http://localhost:8080/api)
 * - melampirkan JWT (Authorization: Bearer ...) otomatis kalau ada
 * - saat 401 (token basi): bersihkan sesi lalu picu redirect ke /login
 */
const AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/** Endpoint auth: 401 di sini = kredensial salah, ditangani form — jangan redirect. */
const AUTH_PATHS = ["/auth/login", "/auth/register"];

AxiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url: string = error?.config?.url ?? "";
    const isAuthCall = AUTH_PATHS.some((path) => url.includes(path));
    if (status === 401 && !isAuthCall) {
      // Token basi/dicabut: bersihkan sesi lalu suruh App redirect ke /login.
      clearToken();
      clearAccount();
      emitAuthExpired();
    }
    return Promise.reject(error);
  },
);

export default AxiosInstance;
