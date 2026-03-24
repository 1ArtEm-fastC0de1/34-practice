import type { User, UserValues } from "#/types/user";
import { persist } from "zustand/middleware";
import { create } from "zustand";

interface userStore {
  user: UserValues;
  setUserStore: (user: UserValues) => void;
  clearUserStore: () => void;
}

const initialValues = {
  username: "",
  email: "",
};

export const useUserStore = create<userStore>()(
  persist(
    (set) => ({
      user: initialValues,
      setUserStore: (user) => set(() => ({ user })),
      clearUserStore: () => set(() => ({ user: initialValues })),
    }),
    {
      name: "user-store",
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
