import apiClient from './axios';
import { ApiResponse, User, Partner } from '@/types';

interface LoginResponse {
  user?: User;
  partner?: Partner;
  accessToken: string;
  refreshToken: string;
}

interface AuthData {
  user?: User;
  partner?: Partner;
  userType: 'admin' | 'partner';
}

// Clés de stockage
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_DATA_KEY = 'userData';
const USER_TYPE_KEY = 'userType';

// Gestion du stockage sécurisé
export const storage = {
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  getAccessToken: (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setUserData: (data: User | Partner, userType: 'admin' | 'partner') => {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
    localStorage.setItem(USER_TYPE_KEY, userType);
  },

  getUserData: (): AuthData | null => {
    const userData = localStorage.getItem(USER_DATA_KEY);
    const userType = localStorage.getItem(USER_TYPE_KEY);
    
    if (!userData || !userType) return null;
    
    try {
      const parsedData = JSON.parse(userData);
      return {
        [userType === 'admin' ? 'user' : 'partner']: parsedData,
        userType: userType as 'admin' | 'partner'
      };
    } catch {
      return null;
    }
  },

  clearAll: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    localStorage.removeItem(USER_TYPE_KEY);
  }
};

// Authentification administrateur
export const loginAdmin = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>(
    '/auth/login/admin',
    { email, password }
  );

  if (response.data.success) {
    const { accessToken, refreshToken, user } = response.data.data;
    storage.setTokens(accessToken, refreshToken);
    if (user) {
      storage.setUserData(user, 'admin');
    }
    return response.data.data;
  }

  throw new Error(response.data.message || 'Échec de connexion');
};

// Authentification partenaire
export const loginPartner = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>(
    '/auth/login/partner',
    { email, password }
  );

  if (response.data.success) {
    const { accessToken, refreshToken, partner } = response.data.data;
    storage.setTokens(accessToken, refreshToken);
    if (partner) {
      storage.setUserData(partner, 'partner');
    }
    return response.data.data;
  }

  throw new Error(response.data.message || 'Échec de connexion');
};

// Rafraîchir le token d'accès
export const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = storage.getRefreshToken();
  
  if (!refreshToken) {
    throw new Error('Pas de refresh token disponible');
  }

  const response = await apiClient.post<ApiResponse<{ accessToken: string }>>(
    '/auth/refresh',
    { refreshToken }
  );

  if (response.data.success) {
    const { accessToken } = response.data.data;
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    return accessToken;
  }

  throw new Error('Échec du rafraîchissement du token');
};

// Déconnexion
export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  } finally {
    storage.clearAll();
  }
};

// Vérifier si l'utilisateur est authentifié
export const isAuthenticated = (): boolean => {
  return !!storage.getAccessToken() && !!storage.getUserData();
};

// Récupérer les données utilisateur courantes
export const getCurrentUser = (): AuthData | null => {
  return storage.getUserData();
};

// Vérifier le rôle de l'utilisateur
export const hasRole = (requiredRole: 'admin' | 'partner'): boolean => {
  const userData = storage.getUserData();
  if (!userData) return false;
  
  if (requiredRole === 'admin') {
    return userData.userType === 'admin' && userData.user?.role === 'ADMIN';
  }
  
  if (requiredRole === 'partner') {
    return userData.userType === 'partner';
  }
  
  return false;
};

// Connexion avec Google OAuth
export const loginWithGoogle = async (idToken: string): Promise<LoginResponse> => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>(
    '/auth/google',
    { idToken }
  );

  if (response.data.success) {
    const { accessToken, refreshToken, user } = response.data.data;
    storage.setTokens(accessToken, refreshToken);
    if (user) {
      storage.setUserData(user, 'admin');
    }
    return response.data.data;
  }

  throw new Error(response.data.message || 'Échec de connexion Google');
};

// Inscription utilisateur
export const register = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  country?: string;
}): Promise<LoginResponse> => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>(
    '/auth/register',
    data
  );

  if (response.data.success) {
    const { accessToken, refreshToken, user } = response.data.data;
    storage.setTokens(accessToken, refreshToken);
    if (user) {
      storage.setUserData(user, 'admin');
    }
    return response.data.data;
  }

  throw new Error(response.data.message || 'Échec d\'inscription');
};

// Connexion utilisateur normal
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>(
    '/auth/login',
    { email, password }
  );

  if (response.data.success) {
    const { accessToken, refreshToken, user } = response.data.data;
    storage.setTokens(accessToken, refreshToken);
    if (user) {
      storage.setUserData(user, 'admin');
    }
    return response.data.data;
  }

  throw new Error(response.data.message || 'Échec de connexion');
};

// Dissocier le compte Google
export const unlinkGoogle = async (): Promise<void> => {
  await apiClient.post('/auth/unlink-google');
};

// Récupérer le profil utilisateur
export const getProfile = async (): Promise<User> => {
  const response = await apiClient.get<ApiResponse<User>>('/auth/me');
  return response.data.data;
};

// Changer le mot de passe
export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  await apiClient.put('/auth/change-password', {
    currentPassword,
    newPassword
  });
};

// Demander la réinitialisation du mot de passe
export const requestPasswordReset = async (email: string): Promise<void> => {
  await apiClient.post('/auth/request-reset', { email });
};

// Réinitialiser le mot de passe avec un token
export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  await apiClient.post('/auth/reset-password', {
    token,
    newPassword
  });
};
