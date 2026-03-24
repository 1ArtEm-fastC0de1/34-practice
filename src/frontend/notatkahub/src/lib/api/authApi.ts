import axios from "axios";
import { api } from "./api";

type RegisterUserRequest = {
  username?: string;
  email: string;
  password: string;
  device: string;
};

export const register = async ({
  username,
  email,
  password,
  device,
}: RegisterUserRequest) => {
  const responce = await api.post(`/auth/registration`, {
    username,
    email,
    password,
    device,
  });
  return responce.data;
};

type LoginUserRequest = {
  email: string;
  password: string;
  device: string;
};

export const login = async ({ email, password, device }: LoginUserRequest) => {
  const responce = await api.post(`/auth/login`, {
    email,
    password,
    device,
  });
  return responce.data;
};

export const logout = async () => {
  const responce = await api.post(`/auth/logout`);
  return responce.data;
};

export const refresh = async () => {
  const response = await axios.post(
    "https://three4-practice.onrender.com/api/token/refresh",
    {},
    { withCredentials: true },
  );
  return response.data;
};

export const updateUser = async (email?: string, username?: string) => {
  const responce = await api.patch("/user/update", {
    email,
    username,
  });
  return responce.data;
};
