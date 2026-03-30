import axios from "axios";
import Cookies from "js-cookie";
import { refresh } from "./authApi";
import { useNavigate } from "@tanstack/react-router";

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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refresh();
        Cookies.set("accessToken", newToken.accessToken);
        originalRequest.headers.Authorization = `Bearer ${newToken.accessToken}`;
        const response = await api(originalRequest); // Дочекатися виконання запиту
        // window.location.reload(); // Перезавантажити сторінку
        return response;
      } catch {
        console.log(error);
        window.location.href = "/signUp";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);
