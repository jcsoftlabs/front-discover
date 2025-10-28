'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

export interface FacebookUser {
  id: string;
  name: string;
  email?: string;
  picture?: {
    data: {
      url: string;
    };
  };
  first_name?: string;
  last_name?: string;
}

export const useFacebookAuth = () => {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Charger le SDK Facebook
    if (typeof window !== 'undefined' && !window.FB) {
      window.fbAsyncInit = function() {
        window.FB.init({
          appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || 'your_facebook_app_id_placeholder',
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        });
        setIsSDKLoaded(true);
      };

      // Charger le script SDK
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/fr_FR/sdk.js';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode?.insertBefore(script, firstScript);
    } else if (window.FB) {
      setIsSDKLoaded(true);
    }
  }, []);

  const loginWithFacebook = async (): Promise<{ success: boolean; user?: FacebookUser; accessToken?: string; error?: string }> => {
    if (!isSDKLoaded || !window.FB) {
      return { success: false, error: 'SDK Facebook non chargé' };
    }

    setIsLoading(true);

    return new Promise((resolve) => {
      window.FB.login((response: any) => {
        if (response.authResponse) {
          const { accessToken } = response.authResponse;

          // Récupérer les informations de l'utilisateur
          window.FB.api('/me', { fields: 'id,name,email,picture,first_name,last_name' }, (userInfo: FacebookUser) => {
            setIsLoading(false);
            resolve({
              success: true,
              user: userInfo,
              accessToken: accessToken,
            });
          });
        } else {
          setIsLoading(false);
          resolve({
            success: false,
            error: 'Connexion annulée ou refusée',
          });
        }
      }, { scope: 'public_profile,email' });
    });
  };

  const logout = () => {
    if (window.FB) {
      window.FB.logout();
    }
  };

  return {
    loginWithFacebook,
    logout,
    isSDKLoaded,
    isLoading,
  };
};
