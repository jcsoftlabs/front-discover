'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isAuthenticated, logout as authLogout, hasRole } from '@/lib/auth';
import type { User, Partner } from '@/types';

type UserRole = 'ADMIN' | 'PARTNER';

interface UseAuthReturn {
  user: User | Partner | null;
  loading: boolean;
  logout: () => Promise<void>;
}

export function useAuth(requiredRole?: UserRole): UseAuthReturn {
  const router = useRouter();
  const [user, setUser] = useState<User | Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const hasChecked = useRef(false);

  useEffect(() => {
    // Éviter les vérifications multiples
    if (hasChecked.current) return;
    hasChecked.current = true;

    const checkAuth = () => {
      if (!isAuthenticated()) {
        const loginPath = requiredRole === 'PARTNER' ? '/partner/login' : '/admin/login';
        setLoading(false);
        router.push(loginPath);
        return;
      }

      const userData = getCurrentUser();
      
      if (!userData) {
        const loginPath = requiredRole === 'PARTNER' ? '/partner/login' : '/admin/login';
        setLoading(false);
        router.push(loginPath);
        return;
      }

      // Vérifier le rôle si requis
      if (requiredRole) {
        const roleCheck = requiredRole === 'ADMIN' ? hasRole('admin') : hasRole('partner');
        
        if (!roleCheck) {
          // Rediriger vers le bon portail
          const correctPath = userData.userType === 'partner' ? '/partner/dashboard' : '/admin';
          setLoading(false);
          router.push(correctPath);
          return;
        }
      }

      // Définir l'utilisateur correct
      const currentUser = userData.userType === 'admin' ? userData.user : userData.partner;
      setUser(currentUser || null);
      setLoading(false);
    };

    checkAuth();
  }, [requiredRole, router]);

  const logout = useCallback(async () => {
    await authLogout();
    const loginPath = requiredRole === 'PARTNER' ? '/partner/login' : '/admin/login';
    router.push(loginPath);
  }, [requiredRole, router]);

  return {
    user,
    loading,
    logout
  };
}
