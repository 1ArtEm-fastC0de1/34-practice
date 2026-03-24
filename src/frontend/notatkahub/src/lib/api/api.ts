import axios from "axios";
import Cookies from "js-cookie";
import { refresh } from "./authApi";

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
