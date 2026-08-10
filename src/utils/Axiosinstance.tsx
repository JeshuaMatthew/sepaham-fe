import axios from "axios";
import { clearToken, getToken } from "./authToken";

/**
 * Instance axios untuk semua panggilan ke backend Axum.
 * - baseURL dari VITE_API_URL (mis. http://localhost:8080/api)
 * - melampirkan JWT (Authorization: Bearer ...) otomatis kalau ada
 * - membersihkan token saat 401 supaya token basi tidak menempel
 */
const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

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
    if (error?.response?.status === 401) {
      clearToken();
    }
    return Promise.reject(error);
  },
);

export default AxiosInstance;
