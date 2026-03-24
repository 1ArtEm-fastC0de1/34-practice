import { refresh } from "./authApi";
import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
  baseURL: "https://three4-practice.onrender.com/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Якщо це вже запит на refresh — не йти в петлю
    if (originalRequest.url?.includes("/token/refresh")) {
      Cookies.remove("accessToken");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Окремий axios без interceptors щоб не зациклитись
        const { data } = await axios.post(
          "https://three4-practice.onrender.com/api/token/refresh",
          {},
          { withCredentials: true },
        );
        Cookies.set("accessToken", data.accessToken, {
          secure: true,
          sameSite: "strict",
          expires: 1,
        });
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch {
        Cookies.remove("accessToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);
