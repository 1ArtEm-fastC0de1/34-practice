import axios from "axios";

export const api = axios.create({
  baseURL: "https://three4-practice.onrender.com/api",
  withCredentials: true,
});
