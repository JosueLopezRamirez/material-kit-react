import create from "zustand";
import { persist } from "zustand/middleware";

export const getFromStorage = (key) => {
  if (typeof window !== "undefined") {
    return window?.localstorage?.getItem(key);
  }
};

export const useStore = create(
  persist(
    (set, get) => ({
      usuario: null,
      setUsuario: (usuario) => set(() => ({ usuario })),
    }),
    { name: "store" }
  )
);
