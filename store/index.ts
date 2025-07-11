import { create } from "zustand";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  latitude: string;
  longitude: string;
};

type UserStore = {
  users: User[];
  setUsers: (users: User[]) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
}));
