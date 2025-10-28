'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import apiClient from './axios';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  loginWithFacebook: (accessToken: string, facebookId: string, email: string, firstName: string, lastName: string, profilePicture?: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'USER' | 'PARTNER';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshUser = async () => {
    try {
      const response = await apiClient.get('/auth/me');
      if (response.data.success) {
        const updatedUser = response.data.data;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement de l\'utilisateur:', error);
      logout();
    }
  };

  // Charger l'utilisateur depuis le localStorage au montage
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
          // Vérifier le token avec le backend
          await refreshUser();
        } catch (error) {
          console.error('Erreur lors du chargement de l\'utilisateur:', error);
          logout();
        }
      }
      setIsLoading(false);
    };

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const { token, user: userData } = response.data.data;
        localStorage.setItem('accessToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur de connexion');
    }
  };

  const loginWithGoogle = async (idToken: string) => {
    try {
      const response = await apiClient.post('/auth/google', { idToken });
      
      if (response.data.success) {
        const { token, user: userData } = response.data;
        localStorage.setItem('accessToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur de connexion Google');
    }
  };

  const loginWithFacebook = async (
    accessToken: string,
    facebookId: string,
    email: string,
    firstName: string,
    lastName: string,
    profilePicture?: string
  ) => {
    try {
      const response = await apiClient.post('/auth/facebook', {
        accessToken,
        facebookId,
        email,
        firstName,
        lastName,
        profilePicture,
      });
      
      if (response.data.success) {
        const { token, user: userData } = response.data;
        localStorage.setItem('accessToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur de connexion Facebook');
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await apiClient.post('/auth/register', data);
      
      if (response.data.success) {
        const { token, user: userData } = response.data.data;
        localStorage.setItem('accessToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Erreur d\'inscription');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        loginWithGoogle,
        loginWithFacebook,
        register,
        logout,
        refreshUser,
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
