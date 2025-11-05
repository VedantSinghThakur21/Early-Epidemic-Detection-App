import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService from '../services/authService.firebase.rest';
import { User, LoginRequest, RegisterRequest, AuthState } from '../types/auth.types';

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<{ success: boolean; message: string }>;
  register: (userData: RegisterRequest) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; message: string }>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: true,
    error: null,
  });

  // Check authentication status on mount
  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await authService.getToken();
        const user = await authService.getUser();

        if (token && user) {
          setState({
            isAuthenticated: true,
            user,
            token,
            loading: false,
            error: null,
          });
        } else {
          setState({
            isAuthenticated: false,
            user: null,
            token: null,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('[AuthContext] Check auth error:', error);
        setState({
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false,
          error: null,
        });
      }
    };

    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await authService.getToken();
      const user = await authService.getUser();

      if (token && user) {
        setState({
          isAuthenticated: true,
          user,
          token,
          loading: false,
          error: null,
        });
      } else {
        setState({
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('[AuthContext] Check auth error:', error);
      setState({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: 'Failed to check authentication status',
      });
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await authService.login(credentials);

      if (response.success && response.user && response.token) {
        setState({
          isAuthenticated: true,
          user: response.user,
          token: response.token,
          loading: false,
          error: null,
        });
        return { success: true, message: response.message };
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.message,
        }));
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { success: false, message: errorMessage };
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await authService.register(userData);

      if (response.success) {
        setState(prev => ({ ...prev, loading: false, error: null }));
        return { success: true, message: response.message };
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.message,
        }));
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { success: false, message: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setState({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('[AuthContext] Logout error:', error);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await authService.updateProfile(updates);

      if (response.success) {
        // Fetch updated user data
        const updatedUser = await authService.getUser();
        setState(prev => ({
          ...prev,
          user: updatedUser,
          loading: false,
          error: null,
        }));
        return { success: true, message: response.message };
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.message,
        }));
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Profile update failed';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { success: false, message: errorMessage };
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateProfile,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
