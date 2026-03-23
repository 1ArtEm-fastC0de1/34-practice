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
    params: {
      username,
      email,
      password,
      device,
    },
  });
  return responce;
};

type LoginUserRequest = {
  email: string;
  password: string;
};

export const login = async ({ email, password }: LoginUserRequest) => {
  const responce = await api.post(`/auth/login`, {
    params: {
      email,
      password,
    },
  });
  return responce;
};

export const logout = async () => {};
