import { create } from 'zustand';

type UserType = 'personal' | 'company' | 'admin' | null;

interface AuthState {
  isAuthenticated: boolean;
  userType: UserType;
  user: any | null; // Holding full user object
  login: (type: UserType, userData?: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userType: null,
  user: null,
  login: (type, userData) => set({ isAuthenticated: true, userType: type, user: userData || null }),
  logout: () => set({ isAuthenticated: false, userType: null, user: null }),
}));
