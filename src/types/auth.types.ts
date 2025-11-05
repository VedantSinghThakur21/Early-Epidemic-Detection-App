/**
 * Authentication Types
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  organization: string;
  location: string;
  avatar?: string;
  createdAt: string;
  updatedAt?: string;
  lastLogin?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: string;
  organization: string;
  location: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
