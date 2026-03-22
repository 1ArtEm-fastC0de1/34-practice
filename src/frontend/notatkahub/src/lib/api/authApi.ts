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
