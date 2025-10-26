'use client';

import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { loginWithGoogle } from '@/lib/auth';

interface GoogleSignInButtonProps {
  redirectTo?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function GoogleSignInButton({ 
  redirectTo,
  onSuccess, 
  onError 
}: GoogleSignInButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      onError?.('Erreur lors de la connexion avec Google');
      return;
    }

    setLoading(true);

    try {
      const response = await loginWithGoogle(credentialResponse.credential);
      
      // Rediriger selon le rôle ou vers redirectTo
      if (redirectTo) {
        router.push(redirectTo);
      } else if (response.user?.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (response.user?.role === 'PARTNER') {
        router.push('/partner/dashboard');
      } else {
        router.push('/');
      }

      onSuccess?.();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la connexion avec Google';
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    onError?.('Erreur lors de la connexion avec Google');
  };

  return (
    <div className="w-full">
      {loading ? (
        <div className="flex items-center justify-center py-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap
          theme="outline"
          size="large"
          text="continue_with"
          width="100%"
        />
      )}
    </div>
  );
}
