'use client';

import { useEffect } from 'react';

/**
 * Hook to auto-detect user's locale based on browser settings
 * and set it if not already set
 */
export function useAutoDetectLocale() {
  useEffect(() => {
    // Check if locale is already set
    const existingLocale = document.cookie
      .split('; ')
      .find((row) => row.startsWith('NEXT_LOCALE='));

    if (!existingLocale) {
      // Get browser language
      const browserLang = navigator.language.split('-')[0]; // e.g., 'en-US' -> 'en'
      
      // Map browser language to supported locales
      const supportedLocales = ['fr', 'en', 'es'];
      const locale = supportedLocales.includes(browserLang) ? browserLang : 'fr';
      
      // Set cookie
      document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`;
      
      // Reload to apply locale
      if (locale !== 'fr') {
        window.location.reload();
      }
    }
  }, []);
}
